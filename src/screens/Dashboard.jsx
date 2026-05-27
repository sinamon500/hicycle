import React, { useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { HF } from '../theme.jsx';
import { TopBar, TitleBlock, EquipBar, Section, TabBar, Grade, Gauge, SensorTile, LineChart } from '../components.jsx';
import { useHICycleData } from '../hooks/useHICycleData';

export default function Dashboard() {
  const navigate = useNavigate();
  const { current, loading, error, rul, sensorSeries, gradeDStartIndex, data } = useHICycleData();

  // HI 트렌드용 숫자 배열 (components.jsx LineChart용)
  const hiArr = useMemo(() => sensorSeries.HI.map(r => r.value), [sensorSeries]);
  // 현재 HI 0~100 스케일
  const hiScore = current ? Math.round(current.HI * 100) : 0;
  const grade   = current?.stableGrade ?? 'A';

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
      <div style={{ color: HF.text50, fontSize: 13, textAlign: 'center' }}>{error}<br />public/simulation_f.csv 경로를 확인하세요</div>
    </div>
  );

  // 센서 트렌드 방향 (직전 10개 평균 vs 마지막값)
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
        title={`HI ${hiScore}`}
        subtitle={`잔여수명 ${rul?.remainingHours ?? '--'}h · ${data.length}개 샘플`}
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
              <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                <div className="hf-glass-soft" style={{ borderRadius: 14, padding: '8px 12px' }}>
                  <div style={{ fontSize: 10, color: HF.text50 }}>잔여 수명 RUL</div>
                  <div style={{ fontSize: 20, fontWeight: 700, color: gradeColor[grade], letterSpacing: -0.5, marginTop: 2 }}>
                    {rul?.remainingHours ?? '--'}<span style={{ fontSize: 12, color: HF.text40, fontWeight: 400 }}>h</span>
                  </div>
                </div>
                <div className="hf-glass-soft" style={{ borderRadius: 14, padding: '8px 12px' }}>
                  <div style={{ fontSize: 10, color: HF.text50 }}>마지막 측정</div>
                  <div style={{ fontSize: 13, fontWeight: 600, marginTop: 2 }}>t = {current?.time ?? 0}s</div>
                </div>
              </div>
            </div>
          </div>

          {/* HI 트렌드 미니차트 */}
          <div style={{ marginTop: 16 }}>
            <div style={{ fontSize: 11, color: HF.text50, marginBottom: 6 }}>HI 트렌드 (전체 구간)</div>
            <LineChart
              data={hiArr}
              width={290} height={70}
              color={gradeColor[grade]}
              fill
              dashedAfter={gradeDStartIndex > 0 ? gradeDStartIndex / hiArr.length : null}
              threshold={0.75}
            />
            <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 4 }}>
              <span style={{ fontSize: 10, color: HF.text40 }}>t=0</span>
              <span style={{ fontSize: 10, color: HF.bad, fontSize: 10 }}>── 등급D 임계 0.75</span>
              <span style={{ fontSize: 10, color: HF.text40 }}>t={data[data.length - 1]?.time}s</span>
            </div>
          </div>
        </div>
      </Section>

      {/* 센서 현황 */}
      <Section title="센서 현황" action="상세 보기" onAction={() => navigate('/sensor')}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
          <SensorTile label="압력" value={current?.pressure?.toFixed(1) ?? '--'} unit="bar"
            trend={trend('pressure')} />
          <SensorTile label="오염도 (ISO)" value={current?.iso6?.toFixed(2) ?? '--'} unit="ISO"
            trend={trend('iso6')} alert={current?.iso6 > 16} />
          <SensorTile label="드레인 유량" value={current?.drain?.toFixed(3) ?? '--'} unit="L/m"
            trend={trend('drain')} alert={current?.drain > 3.5} />
          <SensorTile label="온도" value={current?.temp?.toFixed(1) ?? '--'} unit="°C"
            trend={trend('temp')} alert={current?.temp > 100} />
          <SensorTile label="진동" value={current?.vibration?.toFixed(2) ?? '--'} unit="mm/s"
            trend={trend('vibration')} alert={current?.vibration > 7} />
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
          <button className="hf-btn" style={{ flex: 1 }} onClick={() => navigate('/rul')}>RUL 예측</button>
          <button className="hf-btn" style={{ flex: 1 }} onClick={() => navigate('/twin')}>디지털 트윈</button>
          <button className="hf-btn hf-btn-primary" style={{ flex: 1 }} onClick={() => navigate('/recovery')}>회수 요청</button>
        </div>
      </Section>

      <TabBar />
    </>
  );
}
