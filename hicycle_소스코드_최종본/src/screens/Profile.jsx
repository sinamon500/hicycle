import React, { useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { HF, useTheme } from '../theme.jsx';
import { TopBar, TitleBlock, Section, TabBar } from '../components.jsx';
import { useHICycleData } from '../hooks/useHICycleData';

export default function Profile() {
  const navigate = useNavigate();
  const { theme, toggle } = useTheme();
  const isDark = theme === 'dark';

  const { data, current, rul, loading } = useHICycleData();

  // 실데이터 기반 통계
  const stats = useMemo(() => {
    if (!data.length) return { opHours: '--', avgHI: '--', recovCount: 14 };
    const lastTime   = data[data.length - 1]?.time ?? 0;
    const opHours    = Math.round(lastTime / 3600 * 10) / 10;   // 초 → 시간
    const avgHI      = Math.round((data.reduce((s, r) => s + (r.HI ?? 0), 0) / data.length) * 100);
    return { opHours, avgHI, recovCount: 14 };
  }, [data]);

  return (
    <>
      <TopBar right={<div className="hf-pill" style={{ padding: '10px 12px' }}>⚙</div>} />
      <TitleBlock title="내 정보" />

      {/* 프로필 카드 */}
      <div style={{ padding: '14px 24px 0' }}>
        <div className="hf-glass" style={{ borderRadius: 28, padding: 20, display: 'flex', alignItems: 'center', gap: 14 }}>
          <div style={{
            width: 64, height: 64, borderRadius: 99,
            background: HF.gradGreen,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: 22, fontWeight: 700, color: '#001500',
            border: `2px solid ${HF.text25}`,
            boxShadow: `0 8px 24px ${HF.green}66`,
            flexShrink: 0,
          }}>김</div>
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ fontSize: 18, fontWeight: 700 }}>김기사</div>
            <div style={{ fontSize: 12, color: HF.text50, marginTop: 2 }}>현장 A · 운전기사 · 5년차</div>
            <div style={{ display: 'flex', gap: 6, marginTop: 8, flexWrap: 'wrap' }}>
              <span className="hf-pill" style={{ padding: '4px 8px', fontSize: 10, background: HF.greenDim, color: HF.green, borderColor: HF.greenBd }}>HD-EX-2018</span>
              <span className="hf-pill" style={{ padding: '4px 8px', fontSize: 10, background: HF.text10, color: HF.text, borderColor: HF.text25 }}>ESG 우수</span>
            </div>
          </div>
          <span style={{ color: HF.text40, fontSize: 18 }}>›</span>
        </div>
      </div>

      {/* 실데이터 통계 */}
      <Section>
        <div style={{ display: 'flex', gap: 10 }}>
          {[
            { l: '운행 시간',  v: loading ? '--' : stats.opHours,   u: 'h' },
            { l: '평균 HI',    v: loading ? '--' : stats.avgHI,     u: '',  c: HF.green },
            { l: '회수 누계',  v: stats.recovCount,                  u: 'EA', c: HF.green },
          ].map(x => (
            <div key={x.l} className="hf-glass-soft" style={{ flex: 1, borderRadius: 20, padding: 14, textAlign: 'center' }}>
              <div style={{ fontSize: 10, color: HF.text50 }}>{x.l}</div>
              <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'center', gap: 2, marginTop: 4 }}>
                <span style={{ fontSize: 24, fontWeight: 700, letterSpacing: -0.8, color: x.c || HF.text }}>{x.v}</span>
                <span className="mono" style={{ fontSize: 10, color: HF.text40 }}>{x.u}</span>
              </div>
            </div>
          ))}
        </div>
      </Section>

      {/* 현재 장비 상태 요약 */}
      {current && (
        <Section title="현재 장비 상태">
          <div className="hf-glass-soft" style={{ borderRadius: 22, padding: 14 }}>
            <div style={{ display: 'flex', gap: 10 }}>
              {[
                { l: 'HI 등급',  v: current.stableGrade, c: { A: HF.green, B: HF.warn, C: HF.warn, D: HF.bad }[current.stableGrade] },
                { l: 'HI 점수',  v: (current.HI * 100).toFixed(1), u: '' },
                { l: 'RUL',      v: rul?.remainingHours ?? '--', u: 'h' },
              ].map(x => (
                <div key={x.l} style={{ flex: 1, textAlign: 'center' }}>
                  <div style={{ fontSize: 10, color: HF.text50 }}>{x.l}</div>
                  <div style={{ fontSize: 18, fontWeight: 700, color: x.c ?? HF.text, marginTop: 4 }}>
                    {x.v}<span style={{ fontSize: 10, color: HF.text40, marginLeft: 2 }}>{x.u}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </Section>
      )}

      {/* 설정 목록 */}
      <Section title="설정">
        <div className="hf-glass-soft" style={{ borderRadius: 22, padding: 0 }}>
          {[
            { i: '🚜', t: '장비 관리',  s: '12대',          toggle: false },
            { i: '🔔', t: '알림 설정',  s: '이상/RUL/회수', toggle: false },
            { i: '🌐', t: '언어',       s: '한국어',         toggle: false },
            { i: '📏', t: '단위',       s: 'bar / °C',       toggle: false },
            { i: '🌙', t: '다크 모드',  s: isDark ? '켜짐' : '꺼짐', toggle: true, on: isDark },
          ].map((r, i, arr) => (
            <div key={r.t} style={{
              display: 'flex', alignItems: 'center', padding: '14px 16px', gap: 12,
              borderBottom: i < arr.length - 1 ? `1px solid ${HF.divider}` : 'none',
              cursor: r.toggle ? 'default' : 'pointer',
            }}>
              <div style={{ width: 34, height: 34, borderRadius: 10, background: HF.text10,
                display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 15 }}>{r.i}</div>
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: 14, fontWeight: 600 }}>{r.t}</div>
                <div style={{ fontSize: 11, color: HF.text40, marginTop: 1 }}>{r.s}</div>
              </div>
              {r.toggle
                ? <div className={`hf-switch ${r.on ? 'on' : ''}`} onClick={toggle}></div>
                : <span style={{ color: HF.text40 }}>›</span>}
            </div>
          ))}
        </div>
      </Section>

      {/* 기타 메뉴 */}
      <Section>
        <div className="hf-glass-soft" style={{ borderRadius: 22, padding: 0 }}>
          {[
            { t: '고객 지원' },
            { t: '앱 정보',  sub: 'v1.0.0 · HI-CYCLE' },
            { t: '로그아웃', a: '/login', danger: true },
          ].map((r, i, arr) => (
            <div key={r.t}
                 onClick={() => r.a && navigate(r.a)}
                 style={{ display: 'flex', alignItems: 'center', padding: '14px 18px',
                          borderBottom: i < arr.length - 1 ? `1px solid ${HF.divider}` : 'none', cursor: 'pointer' }}>
              <div style={{ flex: 1 }}>
                <span style={{ fontSize: 14, color: r.danger ? HF.bad : HF.text }}>{r.t}</span>
                {r.sub && <div style={{ fontSize: 11, color: HF.text40, marginTop: 2 }}>{r.sub}</div>}
              </div>
              <span style={{ color: HF.text40 }}>›</span>
            </div>
          ))}
        </div>
      </Section>

      <TabBar />
    </>
  );
}
