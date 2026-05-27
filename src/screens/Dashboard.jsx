import React, { useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { HF } from '../theme.jsx';
import { TopBar, TitleBlock, EquipBar, Section, TabBar, Grade, Gauge, SensorTile, LineChart } from '../components.jsx';
import { useHICycleData } from '../hooks/useHICycleData';

export default function Dashboard() {
  const navigate = useNavigate();
  const { current, loading, error, sensorSeries, gradeDStartIndex, data } = useHICycleData();

  // HI 점수 (하강 방향 = 100에서 시작해서 낮아짐)
  const hiScoreArr = useMemo(() => sensorSeries.HI.map(r => r.value * 100), [sensorSeries]);
  const hiScore    = current ? Math.round(current.HI * 100) : 0;
  const grade      = current?.stableGrade ?? 'A';

  const gradeColor = { A: HF.green, B: HF.warn, C: HF.warn, D: HF.bad };
  const gradeLabel = { A: '정상', B: '경미', C: '주의', D: '위험' };

  if (loading) return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '100vh', background: HF.bg }}>
      <div style={{ width: 36, height: 36, border: `3px solid ${HF.text10}`, borderTop: `3px solid ${HF.green}`, borderRadius: '50%', animation: 'spin 0.8s linear infinite' }} />
      <div style={{ color: HF.text50, marginTop: 12, fontSize: 14 }}>센서 데이터 로딩 중...</div>
    </div>
  );

  if (error) return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '100vh', background: HF.bg, padding: 24 }}>
      <div style={{ color: HF.bad, fontWeight: 700, marginBottom: 8 }}>데이터 오류</div>
      <div style={{ color: HF.text50, fontSize: 13, textAlign: 'center' }}>{error}</div>
    </div>
  );

  function trend(key) {
    if (data.length < 2) return 'flat';
    const last = data[data.length - 1][key];
    const prev = data[Math.max(0, data.length - 10)][key];
    if (last > prev * 1.01) return 'up';
    if (last < prev * 0.99) return 'down';
    return 'flat';
  }

  return (
    <>
      <TopBar />
      <TitleBlock
        greeting={`등급 ${grade} · ${gradeLabel[grade]}`}
        title="대시보드"
        subtitle={`마지막 측정 ${current?.time ?? 0}h · ${data.length}개 샘플`}
      />

      <EquipBar name="HD HX300L" id="#2018" status="운행중" />

      {/* HI 게이지 + 등급 */}
      <Section>
        <div className="hf-glass" style={{ borderRadius: 28, padding: 20 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
            <Gauge value={hiScore} max={100} size={160} label="HI Score" />
            <div style={{ flex: 1 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 12 }}>
                <Grade grade={grade} size={48} />
                <div>
                  <div style={{ fontSize: 22, fontWeight: 700, color: gradeColor[grade], letterSpacing: -0.5 }}>등급 {grade}</div>
                  <div style={{ fontSize: 12, color: HF.text50, marginTop: 2 }}>{gradeLabel[grade]}</div>
                </div>
              </div>
              {/* 마지막 측정 (단위 h) */}
              <div className="hf-glass-soft" style={{ borderRadius: 14, padding: '8px 12px' }}>
                <div style={{ fontSize: 10, color: HF.text50 }}>마지막 측정</div>
                <div style={{ fontSize: 20, fontWeight: 700, letterSpacing: -0.5, marginTop: 2 }}>
                  {current?.time ?? 0}<span style={{ fontSize: 12, color: HF.text40, fontWeight: 400 }}>h</span>
                </div>
              </div>
            </div>
          </div>

          {/* HI 점수 트렌드 (하강 그래프) */}
          <div style={{ marginTop: 16 }}>
            <div style={{ fontSize: 11, color: HF.text50, marginBottom: 6 }}>HI 점수 추이 (전체 구간)</div>
            <LineChart
              data={hiScoreArr}
              width={290} height={70}
              color={gradeColor[grade]}
              fill
              dashedAfter={gradeDStartIndex > 0 ? gradeDStartIndex / hiScoreArr.length : null}
              threshold={25}
            />
            <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 4 }}>
              <span style={{ fontSize: 10, color: HF.text40 }}>t=0</span>
              <span style={{ fontSize: 10, color: HF.bad }}>── 등급D 임계</span>
              <span style={{ fontSize: 10, color: HF.text40 }}>t={data[data.length - 1]?.time}h</span>
            </div>
          </div>
        </div>
      </Section>

      {/* 센서 현황 */}
      <Section title="센서 현황" action="상세 보기" onAction={() => navigate('/sensor', { state: { sensor: 'pressure' } })}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
          <SensorTile label="압력"
            onClick={() => navigate('/sensor', { state: { sensor: 'pressure' } })}
            value={current?.pressure?.toFixed(1) ?? '--'} unit="bar" trend={trend('pressure')} />
          <SensorTile label="오염도 (ISO)"
            onClick={() => navigate('/sensor', { state: { sensor: 'iso6' } })}
            value={current?.iso6?.toFixed(2) ?? '--'} unit="ISO" trend={trend('iso6')} alert={current?.iso6 > 16} />
          <SensorTile label="드레인 유량"
            onClick={() => navigate('/sensor', { state: { sensor: 'drain' } })}
            value={current?.drain?.toFixed(3) ?? '--'} unit="L/m" trend={trend('drain')} alert={current?.drain > 3.5} />
          <SensorTile label="온도"
            onClick={() => navigate('/sensor', { state: { sensor: 'temp' } })}
            value={current?.temp?.toFixed(1) ?? '--'} unit="°C" trend={trend('temp')} alert={current?.temp > 100} />
          <SensorTile label="진동"
            onClick={() => navigate('/sensor', { state: { sensor: 'vibration' } })}
            value={current?.vibration?.toFixed(2) ?? '--'} unit="mm/s" trend={trend('vibration')} alert={current?.vibration > 7} />
          <div className="hf-glass-soft" style={{ borderRadius: 18, padding: 12, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
               onClick={() => navigate('/sensor', { state: { sensor: 'HI' } })}>
            <div style={{ textAlign: 'center' }}>
              <div style={{ fontSize: 10, color: HF.text50 }}>FI 분석</div>
              <div style={{ fontSize: 13, fontWeight: 600, color: HF.green, marginTop: 4 }}>상세 →</div>
            </div>
          </div>
        </div>
      </Section>

      {/* 빠른 액션 */}
      <Section>
        <div style={{ display: 'flex', gap: 10 }}>
          <button className="hf-btn" style={{ flex: 1 }} onClick={() => navigate('/sensor')}>센서 진단</button>
          <button className="hf-btn" style={{ flex: 1 }} onClick={() => navigate('/twin')}>실시간 3D</button>
          <button className="hf-btn hf-btn-primary" style={{ flex: 1 }} onClick={() => navigate('/recovery')}>회수 요청</button>
        </div>
      </Section>

      <TabBar />
    </>
  );
}
