import React from 'react';
import { useNavigate } from 'react-router-dom';
import { HF } from '../theme.jsx';
import { TopBar, TitleBlock, Section, TabBar, LineChart } from '../components.jsx';

export default function Credit() {
  const navigate = useNavigate();
  const txs = [
    { d: '5/24', t: '주행 모터 회수', v: '+85,000',  c: HF.green, icon: '♻' },
    { d: '5/18', t: '필터 6EA 회수',  v: '+18,000',  c: HF.green, icon: '♻' },
    { d: '5/12', t: '정비비 차감',    v: '-42,000',  c: HF.bad,   icon: '🔧' },
    { d: '5/02', t: '유압펌프 회수',  v: '+160,000', c: HF.green, icon: '♻' },
  ];

  return (
    <>
      <TopBar right={<div className="hf-pill" style={{ padding: '10px 12px' }}>···</div>} />
      <TitleBlock title="바이백 크레딧" subtitle="이번 달 적립 +103,000원" />

      <div style={{ padding: '14px 24px 0' }}>
        <div className="hf-glass-hi" style={{ borderRadius: 32, padding: 24, position: 'relative', overflow: 'hidden' }}>
          <div style={{ position: 'absolute', top: -40, right: -40, width: 200, height: 200, borderRadius: 99,
                        background: `radial-gradient(circle, ${HF.green}50, transparent 70%)`, filter: 'blur(20px)' }}></div>
          <div style={{ position: 'relative', zIndex: 1 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ fontSize: 12, color: HF.text70, fontWeight: 500 }}>가용 크레딧</span>
              <div className="hf-pill" style={{ padding: '4px 10px', fontSize: 10, color: HF.green, borderColor: HF.greenBd, background: HF.greenDim }}>↑ +103K</div>
            </div>
            <div style={{ display: 'flex', alignItems: 'baseline', gap: 4, marginTop: 8 }}>
              <span style={{ fontSize: 14, color: HF.text70 }}>₩</span>
              <span style={{ fontSize: 52, fontWeight: 700, letterSpacing: -2.5, lineHeight: 1, color: HF.text, textShadow: HF.heroShadow }}>142,000</span>
            </div>
            <div style={{ fontSize: 11, color: HF.text50, marginTop: 6 }}>누계 ₩1,820,000</div>

            <div style={{ display: 'flex', gap: 10, marginTop: 18 }}>
              <button className="hf-btn" style={{ flex: 1, fontSize: 13, padding: '12px' }} onClick={() => alert('출금 기능은 준비 중입니다')}>출금</button>
              <button className="hf-btn hf-btn-primary" style={{ flex: 1, fontSize: 13, padding: '12px' }} onClick={() => navigate('/recovery')}>부품 구매</button>
            </div>
          </div>
        </div>
      </div>

      <Section title="ESG 임팩트 · 누적">
        <div className="hf-glass" style={{ borderRadius: 24, padding: 18 }}>
          <div style={{ display: 'flex', gap: 12 }}>
            {[
              { n: 'CO₂ 저감',     v: '312', u: 'kg' },
              { n: '재제조',        v: '8',   u: 'EA' },
              { n: '자원 순환율',   v: '74',  u: '%'  },
            ].map(x => (
              <div key={x.n} style={{ flex: 1, textAlign: 'center' }}>
                <div style={{ fontSize: 10, color: HF.text50 }}>{x.n}</div>
                <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'center', gap: 2, marginTop: 4 }}>
                  <span style={{ fontSize: 26, fontWeight: 700, color: HF.green, letterSpacing: -1, textShadow: `0 0 10px ${HF.green}60` }}>{x.v}</span>
                  <span className="mono" style={{ fontSize: 10, color: HF.text40 }}>{x.u}</span>
                </div>
              </div>
            ))}
          </div>
          <div style={{ marginTop: 14 }}>
            <LineChart data={[20,28,36,40,52,58,70,85,100,120,135,150,180,210,250,290,312]} width={290} height={50} color={HF.green} fill />
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 4 }}>
            <span className="mono" style={{ fontSize: 10, color: HF.text40 }}>1월</span>
            <span className="mono" style={{ fontSize: 10, color: HF.text40 }}>지금</span>
          </div>
        </div>
      </Section>

      <Section title="거래 내역" action="전체 보기" onAction={() => {}}>
        <div className="hf-glass-soft" style={{ borderRadius: 22, padding: 6 }}>
          {txs.map((tx, i) => (
            <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '12px 14px', cursor: 'pointer',
                                  borderBottom: i < txs.length - 1 ? `1px solid ${HF.divider}` : 'none' }}>
              <div style={{ width: 36, height: 36, borderRadius: 12,
                            background: tx.c === HF.green ? HF.greenDim : 'rgba(255,77,77,0.15)',
                            color: tx.c, display: 'flex', alignItems: 'center', justifyContent: 'center',
                            fontSize: 16, border: `1px solid ${tx.c}44` }}>{tx.icon}</div>
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: 13, fontWeight: 600 }}>{tx.t}</div>
                <div className="mono" style={{ fontSize: 10, color: HF.text40, marginTop: 2 }}>{tx.d}</div>
              </div>
              <div style={{ fontSize: 14, fontWeight: 700, color: tx.c, letterSpacing: -0.3 }}>{tx.v}</div>
            </div>
          ))}
        </div>
      </Section>

      <TabBar />
    </>
  );
}
