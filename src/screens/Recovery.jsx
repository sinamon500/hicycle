import React from 'react';
import { useNavigate } from 'react-router-dom';
import { HF } from '../theme.jsx';
import { TopBar, TitleBlock, Section, TabBar } from '../components.jsx';

export default function Recovery() {
  const navigate = useNavigate();

  const steps = [
    { t: '신청 접수',         s: 'done',   d: '05/26 14:22' },
    { t: '수거 배정',         s: 'done',   d: '기사 박ㅇㅇ' },
    { t: '수거 완료',         s: 'active', d: '예정 05/27 10:00' },
    { t: '검수 / 등급 확정',  s: 'wait',   d: '+2일' },
    { t: '재제조 입고',       s: 'wait',   d: '+5일' },
    { t: '크레딧 정산',       s: 'wait',   d: '+7일' },
  ];

  return (
    <>
      <TopBar right={<div className="hf-pill" style={{ padding: '10px 12px' }}>+ 새 요청</div>} />
      <TitleBlock title="회수 현황" subtitle="진행 중 1건 · 완료 6건" />

      <Section title="진행 중">
        <div className="hf-glass" style={{ borderRadius: 28, padding: 20 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 6 }}>
            <div>
              <div className="mono" style={{ fontSize: 11, color: HF.green }}>REQ-0418</div>
              <div style={{ fontSize: 17, fontWeight: 700, marginTop: 2 }}>주행 모터 외 1건</div>
            </div>
            <div style={{ textAlign: 'right' }}>
              <div style={{ fontSize: 11, color: HF.text50 }}>예상 크레딧</div>
              <div style={{ fontSize: 20, fontWeight: 700, color: HF.green, letterSpacing: -0.5 }}>₩ 97,000</div>
            </div>
          </div>

          <div style={{ marginTop: 16 }}>
            <div style={{ position: 'relative', height: 30 }}>
              <div style={{ position: 'absolute', top: 14, left: 4, right: 4, height: 2, background: HF.text10, borderRadius: 99 }}></div>
              <div style={{ position: 'absolute', top: 14, left: 4, width: `calc(${(2/(steps.length-1))*100}% - 8px)`, height: 2, background: HF.gradGreen, borderRadius: 99, boxShadow: `0 0 8px ${HF.green}` }}></div>
              {steps.map((st, i) => {
                const x = (i / (steps.length - 1)) * 100;
                return (
                  <div key={i} style={{ position: 'absolute', left: `${x}%`, top: 0, transform: 'translateX(-50%)' }}>
                    <div style={{ width: st.s === 'active' ? 18 : 14, height: st.s === 'active' ? 18 : 14, borderRadius: 99,
                      background: st.s === 'wait' ? HF.text10 : st.s === 'active' ? HF.text : HF.green,
                      border: st.s === 'active' ? `3px solid ${HF.green}` : `1px solid ${HF.text25}`,
                      marginTop: st.s === 'active' ? 6 : 8,
                      boxShadow: st.s === 'active' ? `0 0 16px ${HF.green}` : 'none',
                    }}></div>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="hf-glass-soft" style={{ borderRadius: 18, padding: 14, marginTop: 16, display: 'flex', alignItems: 'center', gap: 12 }}>
            <div style={{ width: 36, height: 36, borderRadius: 12, background: HF.gradGreen,
                          display: 'flex', alignItems: 'center', justifyContent: 'center',
                          boxShadow: `0 4px 16px ${HF.green}80` }}>🚛</div>
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: 13, fontWeight: 600 }}>수거 완료 (진행 중)</div>
              <div style={{ fontSize: 11, color: HF.text50, marginTop: 2 }}>예정 05/27 10:00 · 기사 박ㅇㅇ 010-XXXX</div>
            </div>
            <button className="hf-pill" style={{ padding: '8px 10px' }}>💬</button>
          </div>

          <div style={{ display: 'flex', gap: 10, marginTop: 14 }}>
            <button className="hf-btn" style={{ flex: 1, fontSize: 13, padding: '12px' }}>일정 변경</button>
            <button className="hf-btn hf-btn-primary" style={{ flex: 1, fontSize: 13, padding: '12px' }} onClick={() => navigate('/credit')}>크레딧 보기</button>
          </div>
        </div>
      </Section>

      <Section title="최근 완료" action="전체 보기" onAction={() => navigate('/credit')}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          {[
            { id: 'REQ-0417', t: '유압 호스', v: '+18,000', d: '5/24' },
            { id: 'REQ-0416', t: '필터 6EA', v: '+12,000', d: '5/18' },
          ].map(x => (
            <div key={x.id} className="hf-glass-soft"
                 style={{ borderRadius: 18, padding: '12px 14px', display: 'flex', alignItems: 'center', gap: 12, cursor: 'pointer' }}
                 onClick={() => navigate('/credit')}>
              <div style={{ width: 6, height: 6, borderRadius: 99, background: HF.green, boxShadow: `0 0 8px ${HF.green}` }}></div>
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: 13, fontWeight: 600 }}>{x.t}</div>
                <div className="mono" style={{ fontSize: 10, color: HF.text40, marginTop: 2 }}>{x.id} · {x.d}</div>
              </div>
              <div style={{ fontSize: 14, fontWeight: 600, color: HF.green }}>{x.v}</div>
            </div>
          ))}
        </div>
      </Section>

      <TabBar />
    </>
  );
}
