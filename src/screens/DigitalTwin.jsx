import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { HF } from '../theme.jsx';
import { BackBar, Section, TabBar, OrbAI, Grade, Hotspot, LineChart } from '../components.jsx';

export default function DigitalTwin() {
  const navigate = useNavigate();
  const [selected, setSelected] = useState('P-03');

  const parts = {
    'P-03': { name: '주행 모터', grade: 'C', rul: '312h',   state: '회수 권장',
              data: [0.95,0.9,0.85,0.78,0.7,0.62,0.55,0.48,0.42,0.36,0.3,0.25,0.21,0.18], color: HF.bad },
    'P-06': { name: '버킷 핀',  grade: 'B', rul: '1,200h', state: '모니터링',
              data: [0.95,0.93,0.9,0.87,0.84,0.81,0.78,0.75,0.72,0.69,0.66,0.63,0.6,0.57], color: HF.warn },
    'OK':   { name: '엔진 모듈', grade: 'B', rul: '2,200h', state: '양호',
              data: [0.98,0.97,0.96,0.95,0.94,0.93,0.92,0.91,0.9,0.89,0.88,0.87,0.86,0.85], color: HF.green },
  };
  const s = parts[selected];

  return (
    <>
      <BackBar sub="HD HX300L #2018" label="디지털 트윈"
               action={<button className="hf-pill" style={{ padding: '10px 12px' }}>↻</button>} />

      <div style={{ padding: '14px 16px 0' }}>
        <div className="hf-glass" style={{ borderRadius: 28, height: 320, position: 'relative', overflow: 'hidden',
              background: `radial-gradient(120% 80% at 50% 30%, rgba(0,230,0,0.1), transparent 70%), rgba(0,0,0,0.5)` }}>
          <svg width="100%" height="100%" style={{ position: 'absolute', inset: 0 }}>
            <defs>
              <pattern id="hfgrid" width="22" height="22" patternUnits="userSpaceOnUse" patternTransform="skewX(-20) skewY(8)">
                <circle cx="2" cy="2" r="0.8" fill="rgba(0,230,0,0.18)" />
              </pattern>
            </defs>
            <rect x="0" y="160" width="100%" height="180" fill="url(#hfgrid)" opacity="0.7" />
          </svg>
          <svg width="280" height="220" viewBox="0 0 280 220"
               style={{ position: 'absolute', left: '50%', top: '50%', transform: 'translate(-50%, -45%)',
                        filter: 'drop-shadow(0 20px 30px rgba(0,0,0,0.6))' }}>
            <defs>
              <linearGradient id="hxb" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor="#3a4458" /><stop offset="100%" stopColor="#1a2030" /></linearGradient>
              <linearGradient id="hxc" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor="#5a6578" /><stop offset="100%" stopColor="#2a3548" /></linearGradient>
              <linearGradient id="hxa" x1="0" y1="0" x2="1" y2="0"><stop offset="0%" stopColor="#6a7588" /><stop offset="100%" stopColor="#3a4558" /></linearGradient>
            </defs>
            <ellipse cx="100" cy="180" rx="90" ry="16" fill="#0d1220" stroke="rgba(0,230,0,0.3)" strokeWidth="1" />
            <ellipse cx="100" cy="178" rx="80" ry="10" fill="none" stroke="rgba(0,230,0,0.18)" strokeWidth="1" strokeDasharray="3 3" />
            <path d="M 20 140 L 180 140 L 195 115 L 35 115 Z" fill="url(#hxb)" stroke="rgba(255,255,255,0.25)" strokeWidth="1.2" />
            <path d="M 60 115 L 140 115 L 150 70 L 90 60 L 55 90 Z" fill="url(#hxc)" stroke="rgba(255,255,255,0.3)" strokeWidth="1.2" />
            <path d="M 73 110 L 138 110 L 142 78 L 95 70 L 70 92 Z" fill="rgba(0,230,0,0.25)" stroke="rgba(0,230,0,0.5)" strokeWidth="1" />
            <path d="M 150 90 L 230 30 L 240 42 L 165 105 Z" fill="url(#hxa)" stroke="rgba(255,255,255,0.3)" strokeWidth="1.2" />
            <path d="M 235 36 L 268 80 L 258 90 L 225 50 Z" fill="url(#hxa)" stroke="rgba(255,255,255,0.3)" strokeWidth="1.2" />
            <path d="M 255 80 L 268 80 L 272 100 L 252 102 Z" fill="#1a2030" stroke="rgba(255,255,255,0.4)" strokeWidth="1.2" />
          </svg>

          {[
            { top: 170, left: '38%', color: HF.bad,   label: 'P-03', id: 'P-03' },
            { top: 100, left: '68%', color: HF.warn,  label: 'P-06', id: 'P-06' },
            { top: 130, left: '50%', color: HF.green, label: 'OK',   id: 'OK' },
          ].map(h => (
            <Hotspot key={h.id} {...h} active={selected === h.id} onClick={() => setSelected(h.id)} />
          ))}

          <div className="hf-pill" style={{ position: 'absolute', top: 14, left: 14, padding: '6px 10px', fontSize: 10 }}>
            <span style={{ width: 6, height: 6, borderRadius: 99, background: HF.green, boxShadow: `0 0 6px ${HF.green}`, display: 'inline-block' }}></span>
            3D · LIVE
          </div>
          <div style={{ position: 'absolute', bottom: 14, right: 14, display: 'flex', flexDirection: 'column', gap: 6 }}>
            <button className="hf-pill" style={{ padding: '6px 10px', minWidth: 32 }}>+</button>
            <button className="hf-pill" style={{ padding: '6px 10px', minWidth: 32 }}>−</button>
          </div>
        </div>
      </div>

      <Section title="선택된 부품">
        <div className="hf-glass-hi" style={{ borderRadius: 24, padding: 16 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
            <Grade grade={s.grade} size={48} />
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: 14, fontWeight: 700 }}>{selected} · {s.name}</div>
              <div style={{ fontSize: 11, color: HF.text70, marginTop: 2 }}>
                RUL <span className="mono" style={{ color: HF.text, fontWeight: 600 }}>{s.rul}</span> · {s.state}
              </div>
            </div>
            <button className="hf-btn hf-btn-primary" style={{ padding: '10px 16px', fontSize: 13 }} onClick={() => navigate('/recovery')}>회수</button>
          </div>
          <div style={{ marginTop: 14 }}>
            <LineChart data={s.data} width={290} height={50} color={s.color} fill />
          </div>
        </div>
      </Section>

      <div style={{ padding: '14px 24px 0', display: 'flex', justifyContent: 'center', gap: 18 }}>
        {[['양호', HF.green], ['주의', HF.warn], ['회수', HF.bad]].map(([n, c]) => (
          <span key={n} style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 11, color: HF.text50 }}>
            <span style={{ width: 8, height: 8, borderRadius: 99, background: c, boxShadow: `0 0 10px ${c}` }}></span>{n}
          </span>
        ))}
      </div>

      <OrbAI />
      <TabBar />
    </>
  );
}
