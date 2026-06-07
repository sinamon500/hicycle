import React, { useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { HF, useTheme } from '../theme.jsx';
import { TopBar, EquipBar, Section, TabBar, Grade, Gauge, SensorTile, LineChart } from '../components.jsx';
import { Icon } from '../components/Icon.jsx';
import { useHICycleData } from '../hooks/useHICycleData';
import { OrbAI } from '../components/OrbAI.jsx';

/* ─── HI 수식 모달 ────────────────────────────────────────────────────── */
function HIFormulaModal({ info, onClose }) {
  return (
    <div className="info-modal-overlay" onClick={onClose} role="dialog" aria-label="HI 수식 정보">
      <div className="info-modal" onClick={e => e.stopPropagation()}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 18, fontWeight: 700 }}><Icon name="formula" size={20} /> HI 산출 수식</div>
          <button className="hf-pill" style={{ padding: '6px 10px' }} onClick={onClose} aria-label="닫기"><Icon name="close" size={14} /></button>
        </div>

        {/* 기본 수식 */}
        <div style={{ background: 'var(--hf-soft-bg)', borderRadius: 16, padding: 14, marginBottom: 12 }}>
          <div style={{ fontSize: 11, color: HF.text50, marginBottom: 6 }}>기본 HI 수식</div>
          <div className="mono" style={{ fontSize: 16, fontWeight: 700, color: HF.green, letterSpacing: -0.5 }}>
            {info.base}
          </div>
        </div>

        {/* DS 반영 수식 */}
        <div style={{ background: 'var(--hf-soft-bg)', borderRadius: 16, padding: 14, marginBottom: 12 }}>
          <div style={{ fontSize: 11, color: HF.text50, marginBottom: 6 }}>운전점수(DS) 반영</div>
          <div className="mono" style={{ fontSize: 14, fontWeight: 700, color: HF.text, letterSpacing: -0.5 }}>
            {info.withDS}
          </div>
          <div style={{ fontSize: 11, color: HF.text50, marginTop: 6 }}>
            DS=0.2 숙련 → HI ×1.06 | DS=0.8 비숙련 → HI ×1.24
          </div>
        </div>

        {/* 가중치 */}
        <div style={{ fontSize: 13, fontWeight: 600, marginBottom: 8 }}>FI 가중치 (FMEA RPN 기반)</div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 6, marginBottom: 12 }}>
          {Object.entries(info.weights).map(([key, w]) => {
            const labels = {
              FI_contam: '오염도', FI_drain: '드레인', FI_pressure: '압력',
              FI_temp: '온도', FI_vibration: '진동',
            };
            return (
              <div key={key} style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <div style={{ flex: 1, fontSize: 12, color: HF.text70 }}>{labels[key] ?? key}</div>
                <div className="mono" style={{ fontSize: 13, fontWeight: 600, width: 45, textAlign: 'right' }}>
                  {(w * 100).toFixed(1)}%
                </div>
                <div style={{ flex: 2, height: 6, borderRadius: 99, background: 'var(--hf-text-10)', overflow: 'hidden' }}>
                  <div style={{ width: `${w * 100 / 0.33 * 100}%`, maxWidth: '100%', height: '100%', borderRadius: 99, background: HF.gradGreen }} />
                </div>
              </div>
            );
          })}
        </div>

        {/* 등급 기준 */}
        <div style={{ fontSize: 13, fontWeight: 600, marginBottom: 8 }}>등급 기준</div>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 6 }}>
          {Object.entries(info.gradeThresholds).map(([g, t]) => (
            <div key={g} style={{ background: 'var(--hf-soft-bg)', borderRadius: 12, padding: '8px 10px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                <Grade grade={g} size={22} />
                <div>
                  <div style={{ fontSize: 12, fontWeight: 600 }}>{t.label}</div>
                  <div className="mono" style={{ fontSize: 10, color: HF.text40 }}>{t.range}</div>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div style={{ fontSize: 11, color: HF.text50, marginTop: 14, lineHeight: 1.6 }}>
          {info.description}
        </div>
      </div>
    </div>
  );
}

export default function Dashboard() {
  const navigate = useNavigate();
  const { current, loading, error, sensorSeries, gradeDStartIndex, data, HI_FORMULA_INFO } = useHICycleData();
  const [showFormula, setShowFormula] = useState(false);

  // ── 다크모드 (전역 테마 · 다른 화면/탭바까지 함께 전환) ──────────────────
  const { theme, toggle } = useTheme();
  const dark = theme === 'dark';

  const activeData = data;
  const activeCurrent = current;

  // HI 점수
  const hiScoreArr = useMemo(() => {
    return sensorSeries.HI.map(r => r.value * 100);
  }, [sensorSeries]);

  const hiScore    = activeCurrent ? Math.round(activeCurrent.HI * 100) : 0;
  const grade      = activeCurrent?.stableGrade ?? 'A';

  const gradeColor = { A: HF.green, B: HF.warn, C: HF.warn, D: HF.bad };
  const gradeLabel = { A: '정상', B: '경미', C: '주의', D: '위험' };

  const [showOrb, setShowOrb] = useState(false);

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
    const d = activeData;
    if (d.length < 2) return 'flat';
    const last = d[d.length - 1][key];
    const prev = d[Math.max(0, d.length - 10)][key];
    if (last > prev * 1.01) return 'up';
    if (last < prev * 0.99) return 'down';
    return 'flat';
  }

  return (
    <>
      {showFormula && <HIFormulaModal info={HI_FORMULA_INFO} onClose={() => setShowFormula(false)} />}

      <TopBar right={
        <div style={{ display: 'flex', gap: 6, alignItems: 'center' }}>
          {/* 다크모드 토글 */}
          <button className="hf-pill" style={{ padding: '10px 12px' }}
            onClick={toggle} aria-label="다크모드 전환">
            <Icon name={dark ? 'sun' : 'moon'} size={16} />
          </button>
          {/* 알림 배지 */}
          <button className="hf-pill" style={{ padding: '10px 12px', position: 'relative' }}
            onClick={() => navigate('/notifications')} aria-label="알림">
            <Icon name="bell" size={16} />
            <span className="notification-dot" />
          </button>
        </div>
      } />

      <EquipBar name="HD HX300L" id="#2018" status="운행중" />

      {/* 실시간 디지털 트윈 진입 (장비 바로 아래) */}
      <div style={{ padding: '0 24px', marginTop: 14, marginBottom: 8 }}>
        <div
          onClick={() => navigate('/twin')}
          role="button"
          aria-label="실시간 3D 디지털 트윈 열기"
          style={{
            position: 'relative', overflow: 'hidden', cursor: 'pointer',
            borderRadius: 24, padding: 18,
            background: HF.gradGreen,
            display: 'flex', alignItems: 'center', gap: 16,
            boxShadow: '0 10px 30px rgba(0,102,51,0.28)',
          }}
        >
          {/* 배경 장식 */}
          <div style={{ position: 'absolute', right: -30, top: -30, width: 140, height: 140, borderRadius: '50%', background: 'rgba(255,255,255,0.08)' }} />
          <div style={{ position: 'absolute', right: 20, bottom: -40, width: 90, height: 90, borderRadius: '50%', background: 'rgba(255,255,255,0.06)' }} />

          <div style={{
            width: 52, height: 52, borderRadius: 16, flexShrink: 0, color: '#fff',
            background: 'rgba(255,255,255,0.15)', backdropFilter: 'blur(4px)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}>
            <Icon name="cube" size={28} strokeWidth={1.6} />
          </div>
          <div style={{ flex: 1, zIndex: 1 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <span style={{ fontSize: 16, fontWeight: 800, color: '#fff', letterSpacing: -0.3 }}>실시간 디지털 트윈</span>
              <span style={{
                fontSize: 9, fontWeight: 800, color: HF.green, background: '#fff',
                padding: '2px 6px', borderRadius: 99, letterSpacing: 0.5,
              }}>3D</span>
            </div>
            <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.85)', marginTop: 3, lineHeight: 1.35 }}>
              유압실린더 상태를 3D 모델로 바로 확인하기
            </div>
          </div>
          <div style={{ fontSize: 22, color: '#fff', zIndex: 1, fontWeight: 300 }}>›</div>
        </div>
      </div>

      {/* 주변 기사님께 긴급 SOS 치기: 디지털 트윈과 스코어 사이 */}
      <div style={{ padding: '8px 24px 0' }}>
        <button
          className="hf-btn"
          style={{
            width: '100%',
            background: 'rgba(235,87,87,0.14)',
            color: HF.bad,
            border: '1px solid rgba(235,87,87,0.35)',
            padding: '14px',
            fontSize: 15,
            borderRadius: 18,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: 8,
          }}
          onClick={() => alert('반경 5km 내 기사님 3명에게 긴급 SOS 호출을 보냈습니다. ')}
        >
          <Icon name="alert" size={16} />
          주변 기사님께 긴급 SOS 치기
        </button>
      </div>

      {/* HI 게이지 + 등급 */}
      <Section>
        <div className="hf-glass" style={{ borderRadius: 28, padding: 20 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
            <Gauge value={hiScore} max={100} size={160} label="HI Score" color={HF.bad} />
            <div style={{ flex: 1 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 12 }}>
                <Grade grade={grade} size={48} />
                <div>
                  <div style={{ fontSize: 22, fontWeight: 700, color: gradeColor[grade], letterSpacing: -0.5 }}>등급 </div>
                  <div style={{ fontSize: 12, color: HF.text50, marginTop: 2 }}>{gradeLabel[grade]}</div>
                </div>
              </div>
              <div className="hf-glass-soft" style={{ borderRadius: 14, padding: '8px 12px' }}>
                <div style={{ fontSize: 10, color: HF.text50 }}>마지막 측정</div>
                <div style={{ fontSize: 20, fontWeight: 700, letterSpacing: -0.5, marginTop: 2 }}>
                  {activeCurrent?.time ?? 0}<span style={{ fontSize: 12, color: HF.text40, fontWeight: 400 }}>h</span>
                </div>
              </div>
            </div>
          </div>

          {/* HI 수식 보기 버튼 */}
          <button className="hf-pill" style={{ marginTop: 10, padding: '6px 12px', fontSize: 11, width: '100%', justifyContent: 'center' }}
            onClick={() => setShowFormula(true)} aria-label="HI 수식 보기">
            <Icon name="formula" size={13} /><span>HI 산출 수식 보기</span>
          </button>

          {/* HI 점수 트렌드 */}
          <div style={{ marginTop: 12 }}>
            <div style={{ fontSize: 11, color: HF.text50, marginBottom: 6 }}>HI 점수 추이 (전체)</div>
            <LineChart
              data={hiScoreArr}
              width={290} height={70}
              color={gradeColor[grade]}
              fill
              dashedAfter={gradeDStartIndex > 0 ? gradeDStartIndex / hiScoreArr.length : null}
              threshold={25}
            />
            <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 4 }}>
              <span style={{ fontSize: 10, color: HF.text40 }}>0</span>
              <span style={{ fontSize: 10, color: HF.bad }}>── 등급D 임계</span>
              <span style={{ fontSize: 10, color: HF.text40 }}>{activeData[activeData.length - 1]?.time}h</span>
            </div>
          </div>
        </div>
      </Section>

      {/* 센서 현황 */}
      <Section title="센서 현황" action="상세 보기" onAction={() => navigate('/sensor', { state: { sensor: 'pressure' } })}>
        <div className="sensor-grid">
          <SensorTile label="압력"
            onClick={() => navigate('/sensor', { state: { sensor: 'pressure' } })}
            value={activeCurrent?.pressure?.toFixed(1) ?? '--'} unit="bar" trend={trend('pressure')} />
          <SensorTile label="오염도 (ISO)"
            onClick={() => navigate('/sensor', { state: { sensor: 'iso6' } })}
            value={activeCurrent?.iso6?.toFixed(2) ?? '--'} unit="ISO" trend={trend('iso6')} alert={activeCurrent?.iso6 > 16} />
          <SensorTile label="드레인 유량"
            onClick={() => navigate('/sensor', { state: { sensor: 'drain' } })}
            value={activeCurrent?.drain?.toFixed(3) ?? '--'} unit="L/m" trend={trend('drain')} alert={activeCurrent?.drain > 3.5} />
          <SensorTile label="온도"
            onClick={() => navigate('/sensor', { state: { sensor: 'temp' } })}
            value={activeCurrent?.temp?.toFixed(1) ?? '--'} unit="°C" trend={trend('temp')} alert={activeCurrent?.temp > 100} />
          <SensorTile label="진동"
            onClick={() => navigate('/sensor', { state: { sensor: 'vibration' } })}
            value={activeCurrent?.vibration?.toFixed(2) ?? '--'} unit="mm/s" trend={trend('vibration')} alert={activeCurrent?.vibration > 7} />
          <div className="hf-glass-soft" style={{ borderRadius: 18, padding: 12, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
               onClick={() => navigate('/sensor', { state: { sensor: 'HI' } })} role="button" aria-label="FI 분석">
            <div style={{ textAlign: 'center' }}>
              <div style={{ fontSize: 10, color: HF.text50 }}>FI 분석</div>
              <div style={{ fontSize: 13, fontWeight: 600, color: HF.green, marginTop: 4 }}>상세 →</div>
            </div>
          </div>
        </div>
      </Section>

      <div className="bottom-safe-spacer" />
      <TabBar />

      {/* 플로팅 AI 버튼 */}
      <div 
        onClick={() => setShowOrb(true)}
        style={{
          position: 'fixed', bottom: 90, right: 24, zIndex: 50,
          width: 56, height: 56, borderRadius: '50%', cursor: 'pointer',
          background: 'linear-gradient(135deg, #00FF44, #006633)',
          boxShadow: '0 8px 24px rgba(0,230,0,0.4)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          color: '#fff', transition: 'transform 0.2s'
        }}
        onMouseEnter={e => e.currentTarget.style.transform = 'scale(1.1)'}
        onMouseLeave={e => e.currentTarget.style.transform = 'scale(1)'}
        aria-label="AI 정비 어시스턴트 열기"
      >
        <Icon name="bot" size={28} />
      </div>

      {showOrb && <OrbAI onClose={() => setShowOrb(false)} />}
    </>
  );
}