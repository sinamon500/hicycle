import React, { useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { HF } from '../theme.jsx';
import { TopBar, TitleBlock, EquipBar, Section, TabBar, Grade, Gauge, SensorTile, LineChart, DriverScore } from '../components.jsx';
import { useHICycleData } from '../hooks/useHICycleData';
import { useStreamingDemo } from '../hooks/useStreamingDemo';
import { OrbAI } from '../components/OrbAI.jsx';

/* ─── HI 수식 모달 ────────────────────────────────────────────────────── */
function HIFormulaModal({ info, onClose }) {
  return (
    <div className="info-modal-overlay" onClick={onClose} role="dialog" aria-label="HI 수식 정보">
      <div className="info-modal" onClick={e => e.stopPropagation()}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
          <div style={{ fontSize: 18, fontWeight: 700 }}>📐 HI 산출 수식</div>
          <button className="hf-pill" style={{ padding: '6px 10px' }} onClick={onClose} aria-label="닫기">✕</button>
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

  // 스트리밍 데모 모드
  const streaming = useStreamingDemo(data, { initialSpeed: 100 });
  const [demoMode, setDemoMode] = useState(false);

  // 데모 모드일 때는 스트리밍 데이터 사용
  const activeData    = demoMode ? streaming.streamData : data;
  const activeCurrent = demoMode ? streaming.streamCurrent : current;

  // HI 점수
  const hiScoreArr = useMemo(() => {
    if (demoMode) {
      const step = Math.max(1, Math.floor(streaming.streamData.length / 200));
      return streaming.streamData.filter((_, i) => i % step === 0).map(r => r.HI * 100);
    }
    return sensorSeries.HI.map(r => r.value * 100);
  }, [sensorSeries, demoMode, streaming.streamData]);

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
          {/* 알림 배지 */}
          <button className="hf-pill" style={{ padding: '10px 12px', position: 'relative' }}
            onClick={() => navigate('/notifications')} aria-label="알림">
            🔔
            <span className="notification-dot" />
          </button>
        </div>
      } />
      <TitleBlock title="대시보드" subtitle="HI-CYCLE 통합 모니터링" />

      {/* 날씨 맞춤형 장비 관리 알림 */}
      <div style={{ padding: '0 24px 12px' }}>
        <div className="hf-glass-soft" style={{ borderRadius: 16, padding: '12px 16px', display: 'flex', alignItems: 'center', gap: 12, background: 'rgba(33, 150, 243, 0.08)', border: '1px solid rgba(33, 150, 243, 0.2)' }}>
          <div style={{ fontSize: 20 }}>❄️</div>
          <div style={{ flex: 1 }}>
            <div style={{ fontSize: 13, fontWeight: 700, color: '#1976D2' }}>내일 영하 10도 한파 특보</div>
            <div style={{ fontSize: 11, color: HF.text50, marginTop: 4, lineHeight: 1.3 }}>아침 시동 시 유압유 예열을 평소보다 5분 더 해주세요.</div>
          </div>
        </div>
      </div>

      <EquipBar name="HD HX300L" id="#2018" status="운행중" />

      {/* 운전 마스터 온도 */}
      <div style={{ padding: '4px 24px 0' }}>
        <div className="hf-glass-soft" style={{ padding: '16px', borderRadius: 20 }}>
          <DriverScore score={72.5} />
        </div>
      </div>

      {/* 내 장비 가계부 & ESG 리포트 */}
      <div style={{ padding: '12px 24px 0', display: 'flex', gap: 12 }}>
        {/* 가계부 (ROI) */}
        <div className="hf-glass-soft" style={{ flex: 1, borderRadius: 16, padding: '14px', display: 'flex', flexDirection: 'column', border: `1px solid var(--hf-divider)` }}>
          <div style={{ fontSize: 11, color: HF.text50, fontWeight: 600, marginBottom: 6 }}>이번 달 아낀 유지비</div>
          <div style={{ fontSize: 18, fontWeight: 800, color: HF.green, letterSpacing: -0.5 }}>₩350,000</div>
        </div>
        {/* ESG 탄소 저감 리포트 */}
        <div className="hf-glass-soft" style={{ flex: 1, borderRadius: 16, padding: '14px', display: 'flex', flexDirection: 'column', border: `1px solid var(--hf-divider)` }}>
          <div style={{ fontSize: 11, color: HF.text50, fontWeight: 600, marginBottom: 6 }}>ESG 탄소 저감량</div>
          <div style={{ display: 'flex', alignItems: 'baseline', gap: 4 }}>
            <div style={{ fontSize: 18, fontWeight: 800, color: '#27AE60', letterSpacing: -0.5 }}>152<span style={{ fontSize: 12, fontWeight: 600 }}>kg</span></div>
            <div style={{ fontSize: 11, color: '#27AE60', fontWeight: 700 }}>(🌲 12그루)</div>
          </div>
        </div>
      </div>

      {/* KONECT 연동 상태 + 데모 모드 */}
      <div style={{ padding: '8px 24px 0', display: 'flex', gap: 8, alignItems: 'center' }}>
        <div className="hf-pill" style={{ padding: '4px 10px', fontSize: 10, background: 'rgba(0,102,51,0.08)', color: HF.green, cursor: 'pointer' }}
          onClick={() => navigate('/konect')} aria-label="KONECT 연동 상태">
          <span style={{ width: 6, height: 6, borderRadius: 99, background: HF.green, display: 'inline-block', marginRight: 4, boxShadow: `0 0 6px ${HF.green}` }} />
          KONECT 연동
        </div>
        <div
          className={`hf-pill ${demoMode ? 'hf-pill-on' : ''}`}
          style={{ padding: '4px 10px', fontSize: 10, cursor: 'pointer' }}
          onClick={() => {
            if (!demoMode) { setDemoMode(true); streaming.start(); }
            else { setDemoMode(false); streaming.stop(); }
          }}
          aria-label="라이브 데모 토글"
        >
          {demoMode ? `▶ LIVE ${Math.round(streaming.progress * 100)}%` : '🎬 데모'}
        </div>
        {demoMode && (
          <div className="hf-pill" style={{ padding: '4px 8px', fontSize: 10 }}
            onClick={() => streaming.setSpeed(streaming.speed === 100 ? 300 : streaming.speed === 300 ? 50 : 100)}>
            ×{streaming.speed === 100 ? '1' : streaming.speed === 300 ? '3' : '0.5'}
          </div>
        )}
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
                  <div style={{ fontSize: 22, fontWeight: 700, color: gradeColor[grade], letterSpacing: -0.5 }}>등급 {grade}</div>
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
            📐 HI 산출 수식 보기
          </button>

          {/* HI 점수 트렌드 */}
          <div style={{ marginTop: 12 }}>
            <div style={{ fontSize: 11, color: HF.text50, marginBottom: 6 }}>HI 점수 추이 {demoMode ? '(라이브)' : '(전체 구간)'}</div>
            <LineChart
              data={hiScoreArr}
              width={290} height={70}
              color={gradeColor[grade]}
              fill
              dashedAfter={!demoMode && gradeDStartIndex > 0 ? gradeDStartIndex / hiScoreArr.length : null}
              threshold={25}
            />
            <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 4 }}>
              <span style={{ fontSize: 10, color: HF.text40 }}>t=0</span>
              <span style={{ fontSize: 10, color: HF.bad }}>── 등급D 임계</span>
              <span style={{ fontSize: 10, color: HF.text40 }}>t={activeData[activeData.length - 1]?.time}h</span>
            </div>
          </div>
        </div>
      </Section>

      {/* AI 핫딜 매칭 알림 (위험 상태 시) */}
      {grade === 'D' && (
        <div style={{ padding: '0 24px', marginBottom: 20 }}>
          <div style={{ 
            background: '#ffebee', border: '1px solid rgba(229,57,53,0.3)', 
            borderRadius: 20, padding: 16, display: 'flex', gap: 12, alignItems: 'flex-start' 
          }}>
            <div style={{ fontSize: 24, marginTop: 2 }}>🤖</div>
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: 13, fontWeight: 700, color: HF.bad, marginBottom: 4 }}>AI 핫딜 자동 매칭</div>
              <div style={{ fontSize: 13, color: HF.text, lineHeight: 1.4, marginBottom: 12 }}>
                유압실린더 교체가 시급합니다.<br/>
                마침 근처 마켓에 <b>A급 중고(Reman)</b>가<br/>
                특가로 올라왔어요!
              </div>
              <button className="hf-btn hf-btn-primary" style={{ width: '100%', background: HF.bad, boxShadow: 'none' }} onClick={() => navigate('/market')}>
                판매자와 채팅하기 (₩1,200,000)
              </button>
            </div>
          </div>
        </div>
      )}

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

      {/* 빠른 액션 */}
      <Section title="빠른 액션">
        <div style={{ display: 'flex', gap: 10, marginBottom: 12 }}>
          <button className="hf-btn" style={{ flex: 1 }} onClick={() => navigate('/sensor')} aria-label="센서 진단">센서 진단</button>
          <button className="hf-btn" style={{ flex: 1 }} onClick={() => navigate('/twin')} aria-label="실시간 3D">실시간 3D</button>
          <button className="hf-btn hf-btn-primary" style={{ flex: 1 }} onClick={() => navigate('/recovery')} aria-label="회수 요청">회수 요청</button>
        </div>
        <button className="hf-btn" style={{ width: '100%', background: '#ffebee', color: HF.bad, border: '1px solid rgba(229,57,53,0.2)', padding: '14px', fontSize: 15 }}
          onClick={() => alert('반경 5km 내 기사님 3명에게 긴급 SOS 호출을 보냈습니다. 🚑')}>
          🚨 주변 기사님께 긴급 SOS 치기
        </button>
      </Section>

      {/* AI 정비 캘린더 */}
      <Section title="AI 정비 캘린더" action="전체 보기" onAction={() => navigate('/rul')}>
        <div className="hf-glass-soft" style={{ borderRadius: 20, padding: 16 }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            {/* 1st Schedule */}
            <div style={{ display: 'flex', gap: 12, position: 'relative' }}>
              <div style={{ position: 'absolute', left: 15, top: 28, bottom: -20, width: 2, background: 'var(--hf-text-10)' }}></div>
              <div style={{ width: 32, height: 32, borderRadius: '50%', background: '#ffebee', color: HF.bad, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 14, zIndex: 1, fontWeight: 700 }}>
                14
              </div>
              <div style={{ flex: 1, paddingTop: 6 }}>
                <div style={{ fontSize: 11, color: HF.bad, fontWeight: 700 }}>이번 주 금요일 (수명 임박)</div>
                <div style={{ fontSize: 14, fontWeight: 700, marginTop: 4 }}>유압실린더 교체 필요</div>
                <button className="hf-pill" style={{ marginTop: 10, fontSize: 12, padding: '6px 12px', color: HF.bad, borderColor: 'rgba(229,57,53,0.3)', background: '#fff' }} onClick={() => navigate('/market')}>
                  미리 핫딜로 구매하기
                </button>
              </div>
            </div>
            {/* 2nd Schedule */}
            <div style={{ display: 'flex', gap: 12, position: 'relative' }}>
              <div style={{ width: 32, height: 32, borderRadius: '50%', background: 'var(--hf-bg-deep)', color: HF.text50, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 14, zIndex: 1, fontWeight: 700 }}>
                29
              </div>
              <div style={{ flex: 1, paddingTop: 6 }}>
                <div style={{ fontSize: 11, color: HF.text50, fontWeight: 700 }}>다음 주 금요일</div>
                <div style={{ fontSize: 14, fontWeight: 700, marginTop: 4 }}>엔진오일 교환 (500h)</div>
                <button className="hf-pill" style={{ marginTop: 10, fontSize: 12, padding: '6px 12px' }} onClick={() => navigate('/market')}>
                  공동구매 참여하기
                </button>
              </div>
            </div>
          </div>
        </div>
      </Section>

      {/* AI 자동 운행(작업) 일지 */}
      <Section title="AI 자동 운행 일지" action="내역 보기" onAction={() => alert('지난 일지 내역을 봅니다.')}>
        <div className="hf-glass-soft" style={{ borderRadius: 20, padding: 20 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <span style={{ fontSize: 20 }}>📝</span>
              <span style={{ fontSize: 15, fontWeight: 700 }}>오늘의 작업 요약</span>
            </div>
            <span style={{ fontSize: 11, color: HF.text50 }}>6월 1일 (수)</span>
          </div>
          
          <div style={{ background: 'var(--hf-bg-deep)', borderRadius: 12, padding: 14, marginBottom: 16 }}>
            <ul style={{ margin: 0, paddingLeft: 16, fontSize: 13, color: HF.text70, lineHeight: 1.6 }}>
              <li><b>작업 현장</b>: 파주 출판단지 3공구</li>
              <li><b>가동 시간</b>: 8시간 15분 (엔진 가동)</li>
              <li><b>주요 작업</b>: 덤프 상차 (70%), 평탄화 (30%)</li>
              <li><b>이동 거리</b>: 2.3km</li>
            </ul>
          </div>
          
          <button className="hf-btn" style={{ width: '100%', background: '#FEE500', color: '#000000', border: 'none', padding: '14px', fontSize: 14, fontWeight: 700, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8 }}
            onClick={() => alert('카카오톡으로 현장 소장님께 작업 일지가 전송되었습니다.')}>
            <svg viewBox="0 0 24 24" width="18" height="18"><path fill="currentColor" d="M12 4c-4.97 0-9 3.185-9 7.111 0 2.557 1.707 4.8 4.27 5.964-.136.47-.442 1.547-.508 1.794-.084.316.115.313.243.226.101-.069 1.62-1.077 2.277-1.523.863.246 1.776.38 2.718.38 4.97 0 9-3.184 9-7.111S16.97 4 12 4z"/></svg>
            카카오톡으로 소장님께 일지 전송
          </button>
        </div>
      </Section>

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
          fontSize: 28, transition: 'transform 0.2s'
        }}
        onMouseEnter={e => e.currentTarget.style.transform = 'scale(1.1)'}
        onMouseLeave={e => e.currentTarget.style.transform = 'scale(1)'}
        aria-label="AI 정비 어시스턴트 열기"
      >
        🤖
      </div>

      {showOrb && <OrbAI onClose={() => setShowOrb(false)} />}
    </>
  );
}
