import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { HF } from '../theme.jsx';
import { BackBar, Section, TabBar, Grade, ProgressBar, LineChart } from '../components.jsx';
import { useHICycleData } from '../hooks/useHICycleData';

// HI 0~1 배열을 역방향 RUL(1→0)로 변환
function toRulCurve(hiArr) {
  return hiArr.map(v => +(1 - v).toFixed(3));
}

export default function RUL() {
  const navigate = useNavigate();
  const [part, setPart] = useState('유압실린더');
  const { data, loading, error, rul, current } = useHICycleData();

  const grade    = current?.stableGrade ?? 'A';
  const gradeColor = { A: HF.green, B: HF.warn, C: HF.warn, D: HF.bad };

  // RUL 곡선 (HI 역방향) — 다운샘플해서 LineChart에
  const rulCurve = React.useMemo(() => {
    if (!data.length) return [1];
    const step = Math.max(1, Math.floor(data.length / 30));
    return toRulCurve(data.filter((_, i) => i % step === 0).map(r => r.HI));
  }, [data]);

  // 신뢰구간 ±10%
  const rulH   = rul?.remainingHours ?? 0;
  const rulLow = Math.round(rulH * 0.9);
  const rulHigh= Math.round(rulH * 1.1);

  // 열화 기여도 (마지막 행 FI값 × 가중치)
  const contribs = React.useMemo(() => {
    if (!data.length) return [];
    const last = data[data.length - 1];
    return [
      { f: '오염도 (FI_contam)',   v: Math.round((last.FI_contam   ?? 0) * 0.330 * 100) },
      { f: '드레인 (FI_drain)',    v: Math.round((last.FI_drain    ?? 0) * 0.275 * 100) },
      { f: '압력 (FI_pressure)',   v: Math.round((last.FI_pressure ?? 0) * 0.165 * 100) },
      { f: '온도 (FI_temp)',       v: Math.round((last.FI_temp     ?? 0) * 0.161 * 100) },
      { f: '진동 (FI_vibration)',  v: Math.round((last.FI_vibration?? 0) * 0.069 * 100) },
    ].sort((a, b) => b.v - a.v);
  }, [data]);

  if (loading) return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100vh', background: HF.bg }}>
      <div style={{ width: 32, height: 32, border: `3px solid ${HF.text10}`, borderTop: `3px solid ${HF.green}`, borderRadius: '50%', animation: 'spin 0.8s linear infinite' }} />
    </div>
  );
  if (error) return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100vh', background: HF.bg }}>
      <div style={{ color: HF.bad }}>{error}</div>
    </div>
  );

  return (
    <>
      <BackBar sub="잔여 수명" label="RUL · Remaining Useful Life" />

      {/* 부품 탭 */}
      <div style={{ padding: '14px 20px 0' }}>
        <div style={{ display: 'flex', gap: 8, overflowX: 'auto' }}>
          {['유압실린더', '유압펌프', '엔진', '주행모터', '필터'].map(p => (
            <div key={p}
              className={`hf-pill ${p === part ? 'hf-pill-on' : ''}`}
              style={{ whiteSpace: 'nowrap' }}
              onClick={() => setPart(p)}>
              {p}
            </div>
          ))}
        </div>
      </div>

      {/* RUL 메인 카드 */}
      <div style={{ padding: '16px 20px 0' }}>
        <div className="hf-glass" style={{ borderRadius: 28, padding: 20 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
            <div>
              <div style={{ fontSize: 11, color: HF.text50 }}>예측 잔여수명 · {part}</div>
              <div style={{ display: 'flex', alignItems: 'baseline', gap: 4, marginTop: 2 }}>
                <span style={{ fontSize: 64, fontWeight: 700, letterSpacing: -2.5, lineHeight: 1, color: gradeColor[grade] }}>
                  {Math.round(rulH)}
                </span>
                <span style={{ fontSize: 18, color: HF.text40 }}>h</span>
              </div>
              <div style={{ fontSize: 12, color: HF.text50, marginTop: 4 }}>
                ≈ 약 {Math.round(rulH / 24)}일 (현재 HI 추세)
              </div>
            </div>
            <div style={{ textAlign: 'right' }}>
              <div style={{ fontSize: 10, color: HF.text40 }}>신뢰구간 90%</div>
              <div style={{ fontSize: 13, color: HF.text70, marginTop: 2 }}>{rulLow} – {rulHigh}h</div>
              <div style={{ marginTop: 8, display: 'flex', justifyContent: 'flex-end' }}>
                <Grade grade={grade} size={32} />
              </div>
            </div>
          </div>

          {/* RUL 곡선 */}
          <div style={{ marginTop: 18 }}>
            <LineChart
              data={rulCurve}
              width={280} height={120}
              color={gradeColor[grade]}
              fill
              dashedAfter={0.85}
              threshold={0.3}
            />
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 6 }}>
            <span style={{ fontSize: 10, color: HF.text40 }}>0h</span>
            <span style={{ fontSize: 10, color: HF.text50 }}>RUL 추세</span>
            <span style={{ fontSize: 10, color: HF.text40 }}>→ 예측</span>
          </div>
        </div>
      </div>

      {/* HI 수치 현황 */}
      <Section title="현재 HI 상태">
        <div className="hf-glass-soft" style={{ borderRadius: 22, padding: 16 }}>
          <div style={{ display: 'flex', gap: 12 }}>
            {[
              { l: 'HI 현재값', v: ((current?.HI ?? 0) * 100).toFixed(1), u: '%', c: gradeColor[grade] },
              { l: '등급',      v: grade,                                  u: '',  c: gradeColor[grade] },
              { l: '측정 시각', v: `${current?.time ?? 0}`,               u: 's', c: HF.text },
            ].map(x => (
              <div key={x.l} style={{ flex: 1, textAlign: 'center' }}>
                <div style={{ fontSize: 10, color: HF.text50 }}>{x.l}</div>
                <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'center', gap: 2, marginTop: 4 }}>
                  <span style={{ fontSize: 22, fontWeight: 700, color: x.c, letterSpacing: -1 }}>{x.v}</span>
                  <span style={{ fontSize: 10, color: HF.text40 }}>{x.u}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </Section>

      {/* 열화 기여도 */}
      <Section title="열화 요인 · FMEA RPN">
        <div className="hf-glass-soft" style={{ borderRadius: 22, padding: 16, display: 'flex', flexDirection: 'column', gap: 12 }}>
          {contribs.map(x => (
            <ProgressBar key={x.f} value={x.v} max={100}
              label={x.f}
              valueLabel={`${x.v}%`}
            />
          ))}
        </div>
      </Section>

      <div style={{ padding: '18px 24px 0', display: 'flex', gap: 10 }}>
        <button className="hf-btn" style={{ flex: 1 }} onClick={() => navigate('/sensor', { state: { sensor: 'HI' } })}>센서 보기</button>
        <button className="hf-btn hf-btn-primary" style={{ flex: 1 }} onClick={() => navigate('/recovery')}>회수 요청</button>
      </div>

      <TabBar />
    </>
  );
}
