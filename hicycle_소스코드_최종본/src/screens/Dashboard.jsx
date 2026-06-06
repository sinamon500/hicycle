import React, { useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { HF } from '../theme.jsx';
import { TopBar, TitleBlock, EquipBar, Section, TabBar, Grade, Gauge, SensorTile, LineChart, DriverScore } from '../components.jsx';
import { useHICycleData } from '../hooks/useHICycleData';
import { OrbAI } from '../components/OrbAI.jsx';

export default function Dashboard() {
  const navigate = useNavigate();
  const { current, loading, error, sensorSeries, gradeDStartIndex, data } = useHICycleData();
  const [showFormula, setShowFormula] = useState(false);
  const [showOrb, setShowOrb] = useState(false);

  // 💡 [실시간 연동 핵심 State] 현재 활성화(선택)된 부품의 이름을 관리 (기본값: '유압 실린더')
  const [selectedComponent, setSelectedComponent] = useState('유압 실린더');

  // 차트용 라인 데이터
  const hiScoreArr = useMemo(() => {
    if (!sensorSeries?.HI) return [];
    return sensorSeries.HI.map(r => r.value * 100);
  }, [sensorSeries]);

  // 💡 부품별 점수 및 등급 데이터 정의
  const componentScores = [
    { name: '유압 펌프', status: '실시간 분석', score: 4, grade: 'D', color: HF.bad, label: '위험' },
    { name: '유압 실린더', status: '회수 관찰', score: 78, grade: 'B', color: '#F2994A', label: '주의' }, 
    { name: '주행 모터', status: '재사용 가능', score: 86, grade: 'A', color: HF.green, label: '정상' }
  ];

  // 💡 [동적 매핑 핵심] 전체 componentScores 배열 중 사용자가 현재 탭(클릭)한 부품 Object를 실시간으로 추출!
  const currentActiveComp = useMemo(() => {
    return componentScores.find(c => c.name === selectedComponent) || componentScores[1];
  }, [selectedComponent]);

  // 💡 하단 게이지와 등급 뱃지가 선택한 부품의 스펙을 그대로 추종하도록 연동 바인딩
  const totalHiScore = currentActiveComp.score; 
  const totalGrade = currentActiveComp.grade;
  const totalLabel = currentActiveComp.label;

  const gradeColor = { A: HF.green, B: HF.warn, C: HF.warn, D: HF.bad };

  if (loading) return (
    <div className="flex-col-center full-screen">
      <div className="loading-spinner" />
      <div style={{ color: HF.text50, marginTop: 12, fontSize: 14 }}>센서 데이터 로딩 중...</div>
    </div>
  );

  if (error) return (
    <div className="flex-col-center full-screen" style={{ padding: 24 }}>
      <div style={{ color: HF.bad, fontWeight: 700, marginBottom: 8 }}>데이터 오류</div>
      <div style={{ color: HF.text50, fontSize: 13, textAlign: 'center' }}>{error}</div>
    </div>
  );

  function trend(key) {
    const d = data;
    if (!d || d.length < 2) return 'flat';
    const last = d[d.length - 1][key];
    const prev = d[Math.max(0, d.length - 10)][key];
    if (last > prev * 1.01) return 'up';
    if (last < prev * 0.99) return 'down';
    return 'flat';
  }

  return (
    <>
      <TopBar right={
        <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
          <button className="hf-pill" style={{ padding: '8px 10px', fontSize: 13 }}
            onClick={() => setShowFormula(true)} aria-label="산출 수식 정보">
            📐 수식
          </button>
          <button className="hf-pill" style={{ padding: '8px 10px', fontSize: 14 }}
            onClick={() => setShowOrb(true)} aria-label="AI 정비 어시스턴트">
            🤖 AI
          </button>
          <button className="hf-pill" style={{ padding: '8px 10px', position: 'relative' }}
            onClick={() => navigate('/notifications')} aria-label="알림">
            🔔
            <span className="notification-dot" />
          </button>
        </div>
      } />
      
      <TitleBlock title="대시보드" subtitle="HI-CYCLE 통합 상태 모니터링" />

      <EquipBar name="HD HX300L" id="#2018" status="운행중" />

      <div style={{ padding: '4px 24px 0' }}>
        <div className="hf-pill" style={{ padding: '4px 10px', fontSize: 10, background: 'rgba(0,102,51,0.08)', color: HF.green, width: 'fit-content' }}>
          <span style={{ width: 6, height: 6, borderRadius: 99, background: HF.green, display: 'inline-block', marginRight: 4, boxShadow: `0 0 6px ${HF.green}` }} />
          KONECT 원격 관리 인프라 연동됨
        </div>
      </div>

      <div style={{ padding: '12px 24px 0' }}>
        <div className="hf-glass-soft" style={{ padding: '16px', borderRadius: 20 }}>
          <DriverScore score={72.5} />
        </div>
      </div>

      {/* 부품별 HI Score 목록 */}
      <Section title="부품별 HI Score" action="전체 부품 보기" onAction={() => navigate('/sensor')}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          {componentScores.map((comp, idx) => {
            const isSelected = selectedComponent === comp.name;
            
            return (
              <div 
                key={idx} 
                className={isSelected ? "" : "hf-glass"}
                onClick={() => setSelectedComponent(comp.name)} // 💡 클릭 시 선택된 부품 State 업데이트!
                style={{
                  display: 'flex', 
                  alignItems: 'center', 
                  justifyContent: 'space-between', 
                  padding: '16px 20px', 
                  borderRadius: 24,
                  background: 'var(--hf-bg)',
                  cursor: 'pointer',
                  border: isSelected ? `2px solid ${comp.color}` : '1px solid var(--hf-text-10)',
                  boxShadow: isSelected ? `0 4px 12px ${comp.color}22` : 'none',
                  transition: 'all 0.2s ease-out'
                }}
              >
                <div>
                  <div style={{ fontSize: 18, fontWeight: 800, color: HF.text }}>{comp.name}</div>
                  <div style={{ fontSize: 13, color: HF.text40, marginTop: 4 }}>{comp.status}</div>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
                  <div style={{ textAlign: 'right' }}>
                    <div style={{ fontSize: 28, fontWeight: 800, color: comp.color, lineHeight: 1 }}>
                      {comp.score}
                    </div>
                    <div style={{ fontSize: 11, color: HF.text40, marginTop: 4 }}>Health Score</div>
                  </div>
                  <Grade grade={comp.grade} size={46} />
                </div>
              </div>
            );
          })}
        </div>
      </Section>

      {/* 종합 분석 추이 카드 (클릭한 부품에 반응하여 완전 동적 변환됨!) */}
      <Section title="종합 분석 추이">
        <div className="hf-glass" style={{ borderRadius: 28, padding: 20, display: 'flex', flexDirection: 'column', gap: 20 }}>
          
          <div style={{ display: 'flex', alignItems: 'center', gap: 20 }}>
            {/* 💡 사용자가 탭한 부품의 실시간 점수(4, 78, 86)에 맞춰 도넛 차트 동적 갱신 */}
            <Gauge value={totalHiScore} max={100} size={110} label={`${selectedComponent} 지수`} color={gradeColor[totalGrade]} />
            
            <div style={{ flex: 1 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 6 }}>
                <Grade grade={totalGrade} size={36} />
                <div>
                  {/* 부품별 상태 텍스트 실시간 반영 */}
                  <div style={{ fontSize: 18, fontWeight: 700, color: gradeColor[totalGrade], letterSpacing: -0.5 }}>{selectedComponent} {totalGrade}등급</div>
                  <div style={{ fontSize: 12, color: HF.text50 }}>상태 요약: {totalLabel}</div>
                </div>
              </div>
              <div className="hf-glass-soft" style={{ borderRadius: 12, padding: '6px 12px', display: 'flex', justifyContent: 'space-between', fontSize: 11 }}>
                <span style={{ color: HF.text50 }}>현재 누적 가동 시간</span>
                <span style={{ fontWeight: 700 }}>20000h</span>
              </div>
            </div>
          </div>

          <div style={{ borderTop: `1px solid ${HF.divider}`, paddingTop: 16 }}>
            <div style={{ fontSize: 11, color: HF.text50, marginBottom: 8 }}>장비 건전성 추이 (실시간 인터랙티브 변동 이력)</div>
            <LineChart
              data={hiScoreArr}
              width={290} height={75}
              color={gradeColor[totalGrade]}
              fill
              dashedAfter={gradeDStartIndex > 0 ? gradeDStartIndex / hiScoreArr.length : null}
              threshold={25}
            />
          </div>
        </div>
      </Section>

      {/* 실시간 센서 현황 */}
      <Section title="실시간 센서 현황" action="상세 분석" onAction={() => navigate('/sensor', { state: { sensor: 'pressure' } })}>
        <div className="sensor-grid">
          <SensorTile label="유압 압력" onClick={() => navigate('/sensor', { state: { sensor: 'pressure' } })} value={current?.pressure?.toFixed(1) ?? '27.0'} unit="bar" trend={trend('pressure')} />
          <SensorTile label="오염도 (ISO 4406)" onClick={() => navigate('/sensor', { state: { sensor: 'iso6' } })} value={current?.iso6?.toFixed(2) ?? '17.00'} unit="ISO" trend={trend('iso6')} alert={true} />
          <SensorTile label="드레인 유량" onClick={() => navigate('/sensor', { state: { sensor: 'drain' } })} value={current?.drain?.toFixed(3) ?? '3.402'} unit="L/m" trend={trend('drain')} />
          <SensorTile label="작동유 온도" onClick={() => navigate('/sensor', { state: { sensor: 'temp' } })} value={current?.temp?.toFixed(1) ?? '102.0'} unit="°C" trend={trend('temp')} alert={true} />
          <SensorTile label="펌프 진동" onClick={() => navigate('/sensor', { state: { sensor: 'vibration' } })} value={current?.vibration?.toFixed(2) ?? '7.10'} unit="mm/s" trend={trend('vibration')} alert={true} />
        </div>
      </Section>

      {/* 원격 제어 명령 */}
      <Section title="원격 제어 명령" style={{ marginBottom: 50 }}>
        <div style={{ display: 'flex', gap: 10 }}>
          <button className="hf-btn" style={{ flex: 1 }} onClick={() => navigate('/sensor')}>정밀 진단</button>
          <button className="hf-btn" style={{ flex: 1, padding: '10px 4px', fontSize: 13 }} onClick={() => navigate('/twin')}>
            {selectedComponent} 3D
          </button>
          <button className="hf-btn hf-btn-primary" style={{ flex: 1 }} onClick={() => navigate('/recovery')}>회수 요청</button>
        </div>
      </Section>

      <TabBar />

      {showOrb && <OrbAI onClose={() => setShowOrb(false)} />}
    </>
  );
}