import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { HF, useTheme } from './theme.jsx';

/* ───────────────────────────────────────────────────────────────────────────
 * Layout / chrome
 * ─────────────────────────────────────────────────────────────────────────── */

export function TitleBlock({ greeting, title, subtitle, style }) {
  return (
    <div style={{ padding: '4px 24px 0', ...style }}>
      {greeting && <div style={{ fontSize: 13, color: HF.text50, marginBottom: 4, fontWeight: 500 }}>{greeting}</div>}
      <div style={{ fontSize: 26, fontWeight: 700, lineHeight: 1.2, letterSpacing: -0.5, whiteSpace: 'pre-line' }}>{title}</div>
      {subtitle && <div style={{ fontSize: 14, color: HF.text50, marginTop: 4 }}>{subtitle}</div>}
    </div>
  );
}

export function TopBar({ left, right }) {
  return (
    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '20px 20px 4px' }}>
      {left ?? (
        <div className="hf-avatarpill">
          <div className="dots">···</div>
          <div className="avatar">김</div>
        </div>
      )}
      <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
        {right}
        <ThemeToggle />
      </div>
    </div>
  );
}

export function BackBar({ label, sub, action }) {
  const navigate = useNavigate();
  return (
    <div style={{ padding: '20px 20px 0', display: 'flex', alignItems: 'center', gap: 12 }}>
      <button className="hf-pill" style={{ padding: '10px 14px' }} onClick={() => navigate(-1)}>‹</button>
      <div style={{ flex: 1 }}>
        {sub && <div style={{ fontSize: 11, color: HF.text40 }}>{sub}</div>}
        <div style={{ fontSize: 17, fontWeight: 700 }}>{label}</div>
      </div>
      {action}
      <ThemeToggle />
    </div>
  );
}

export function ThemeToggle() {
  const { theme, toggle } = useTheme();
  return (
    <button className="hf-themetoggle" onClick={toggle} title="라이트/다크 모드 전환" aria-label="theme">
      {theme === 'dark' ? (
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round">
          <circle cx="12" cy="12" r="4"/>
          <path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M4.93 19.07l1.41-1.41M17.66 6.34l1.41-1.41"/>
        </svg>
      ) : (
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
          <path d="M21 12.8A9 9 0 1 1 11.2 3a7 7 0 0 0 9.8 9.8z"/>
        </svg>
      )}
    </button>
  );
}

export function Section({ title, action, onAction, children, style }) {
  return (
    <div style={{ padding: '0 24px', marginTop: 18, ...style }}>
      {title && (
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: 10 }}>
          <span style={{ fontSize: 13, fontWeight: 600, color: HF.text70, letterSpacing: -0.2 }}>{title}</span>
          {action && <span style={{ fontSize: 12, color: HF.green, cursor: 'pointer' }} onClick={onAction}>{action}</span>}
        </div>
      )}
      {children}
    </div>
  );
}

export function EquipBar({ name = 'HD HX300L', id = '#2018', status = '운행중' }) {
  return (
    <div style={{ padding: '0 24px', marginTop: 6 }}>
      <div className="hf-glass-soft" style={{ borderRadius: 999, padding: '8px 12px 8px 8px', display: 'flex', alignItems: 'center', gap: 10 }}>
        <div style={{
          width: 36, height: 36, borderRadius: 99,
          background: HF.greenDim,
          border: `1px solid ${HF.greenBd}`,
          display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 18,
        }}>🚜</div>
        <div style={{ flex: 1 }}>
          <div style={{ fontSize: 13, fontWeight: 600 }}>{name} · <span style={{ color: HF.text50 }}>{id}</span></div>
          <div style={{ display: 'flex', gap: 6, alignItems: 'center', marginTop: 2 }}>
            <span style={{ width: 6, height: 6, borderRadius: 99, background: HF.green, boxShadow: `0 0 8px ${HF.green}` }}></span>
            <span style={{ fontSize: 11, color: HF.text50 }}>현장 A · {status}</span>
          </div>
        </div>
        <span style={{ fontSize: 14, color: HF.text40 }}>⇄</span>
      </div>
    </div>
  );
}

export function Segmented({ options, value, onChange, style }) {
  return (
    <div style={{ display: 'flex', gap: 8, alignItems: 'center', flexWrap: 'wrap', ...style }}>
      {options.map(o => (
        <div key={o} className={`hf-pill ${o === value ? 'hf-pill-on' : ''}`} onClick={() => onChange && onChange(o)}>{o}</div>
      ))}
      <div className="hf-pill" style={{ padding: '8px 12px' }}>···</div>
    </div>
  );
}

const TAB_ICONS = {
  home:  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><path d="M3 10l9-7 9 7v10a2 2 0 01-2 2h-4v-7H9v7H5a2 2 0 01-2-2V10z"/></svg>,
  diag:  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><path d="M3 12h4l3-9 4 18 3-9h4"/></svg>,
  parts: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.7 1.7 0 00.3 1.8l.1.1a2 2 0 11-2.8 2.8l-.1-.1a1.7 1.7 0 00-1.8-.3 1.7 1.7 0 00-1 1.5V21a2 2 0 11-4 0v-.1a1.7 1.7 0 00-1.1-1.5 1.7 1.7 0 00-1.8.3l-.1.1a2 2 0 11-2.8-2.8l.1-.1a1.7 1.7 0 00.3-1.8 1.7 1.7 0 00-1.5-1H3a2 2 0 110-4h.1a1.7 1.7 0 001.5-1.1 1.7 1.7 0 00-.3-1.8l-.1-.1a2 2 0 112.8-2.8l.1.1a1.7 1.7 0 001.8.3H9a1.7 1.7 0 001-1.5V3a2 2 0 114 0v.1a1.7 1.7 0 001 1.5 1.7 1.7 0 001.8-.3l.1-.1a2 2 0 112.8 2.8l-.1.1a1.7 1.7 0 00-.3 1.8V9a1.7 1.7 0 001.5 1H21a2 2 0 110 4h-.1a1.7 1.7 0 00-1.5 1z"/></svg>,
  recov: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><path d="M21 12a9 9 0 11-3-6.7M21 4v5h-5"/></svg>,
  me:    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><circle cx="12" cy="8" r="4"/><path d="M4 21v-1a7 7 0 0114 0v1"/></svg>,
};

export function TabBar() {
  const navigate = useNavigate();
  const { pathname } = useLocation();
  const tabs = [
    { id: 'home',  to: '/dashboard', label: '홈',    match: ['/dashboard'] },
    { id: 'diag',  to: '/rul',       label: '진단',  match: ['/rul', '/sensor'] },
    { id: 'parts', to: '/twin',      label: '부품',  match: ['/twin'] },
    { id: 'recov', to: '/recovery',  label: '회수',  match: ['/recovery', '/credit'] },
    { id: 'me',    to: '/profile',   label: '내정보', match: ['/profile'] },
  ];
  return (
    <div className="hf-tabbar-wrap">
      <div className="hf-tabbar">
        {tabs.map(t => {
          const active = t.match.includes(pathname);
          return (
            <button key={t.id} className={`hf-tab ${active ? 'on' : ''}`} onClick={() => navigate(t.to)}>
              <span style={{ width: 22, height: 22, display: 'block' }}>
                {React.cloneElement(TAB_ICONS[t.id], { width: 22, height: 22 })}
              </span>
              <span>{t.label}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
}

export function OrbAI({ onTap }) {
  return <div className="hf-orb" onClick={onTap} role="button" aria-label="AI assistant"></div>;
}

/* ───────────────────────────────────────────────────────────────────────────
 * Charts / visuals
 * ─────────────────────────────────────────────────────────────────────────── */

export function Gauge({ value = 82, max = 100, size = 180, label = 'HI Score' }) {
  const r = (size - 24) / 2;
  const cx = size / 2, cy = size / 2;
  const c = 2 * Math.PI * r;
  const dash = (value / max) * c * 0.78;
  const arcLen = c * 0.78;
  const id = React.useId();
  return (
    <div style={{ position: 'relative', width: size, height: size }}>
      <svg width={size} height={size} style={{ overflow: 'visible', transform: 'rotate(126deg)' }}>
        <defs>
          <linearGradient id={`g${id}`} x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%"   stopColor="#66ff66" />
            <stop offset="55%"  stopColor="#00E600" />
            <stop offset="100%" stopColor="#00a800" />
          </linearGradient>
          <filter id={`gl${id}`} x="-30%" y="-30%" width="160%" height="160%">
            <feGaussianBlur stdDeviation="6" result="b" />
            <feMerge><feMergeNode in="b"/><feMergeNode in="SourceGraphic"/></feMerge>
          </filter>
        </defs>
        <circle cx={cx} cy={cy} r={r} stroke="var(--hf-text-10)" strokeWidth="10" fill="none"
          strokeDasharray={`${arcLen} ${c}`} strokeLinecap="round" />
        <circle cx={cx} cy={cy} r={r} stroke={`url(#g${id})`} strokeWidth="10" fill="none"
          strokeDasharray={`${dash} ${c}`} strokeLinecap="round" filter={`url(#gl${id})`} />
        {[0, 0.25, 0.5, 0.75, 1].map((p, i) => {
          const ang = p * 0.78;
          return (
            <circle key={i}
              cx={cx + Math.cos(ang * 2 * Math.PI) * (r + 12)}
              cy={cy + Math.sin(ang * 2 * Math.PI) * (r + 12)}
              r="1.4" fill="var(--hf-text-40)" />
          );
        })}
      </svg>
      <div style={{ position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
        <div style={{ display: 'flex', alignItems: 'baseline' }}>
          <span style={{ fontSize: size * 0.42, fontWeight: 700, lineHeight: 1, letterSpacing: -2, color: HF.text }}>{value}</span>
          <span style={{ fontSize: size * 0.15, fontWeight: 500, color: HF.text40, marginLeft: 4 }}>/{max}</span>
        </div>
        <div style={{ fontSize: 12, color: HF.text50, marginTop: 4, fontWeight: 500, letterSpacing: 1 }}>{label}</div>
      </div>
    </div>
  );
}

export function Waveform({ width = 280, height = 60, bars = 48, seed = 1, peak = 0.7 }) {
  const id = React.useId();
  const data = React.useMemo(() => Array.from({ length: bars }, (_, i) => {
    const t = i / (bars - 1);
    const env = Math.sin(t * Math.PI);
    const noise = Math.abs(Math.sin(seed * (i + 1) * 1.7) + Math.cos(seed * i * 0.9)) * 0.5;
    return Math.max(0.06, env * peak * noise + 0.08);
  }), [bars, seed, peak]);
  const bw = width / bars - 1;
  return (
    <svg width={width} height={height} style={{ overflow: 'visible' }}>
      <defs>
        <linearGradient id={`wf${id}`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%"   stopColor="#66ff66" />
          <stop offset="100%" stopColor="#00a800" />
        </linearGradient>
      </defs>
      {data.map((v, i) => {
        const h = v * height;
        return (
          <rect key={i} x={i * (width / bars)} y={height - h} width={bw} height={h} rx={bw/2}
            fill={`url(#wf${id})`} opacity={0.7 + v * 0.3} />
        );
      })}
    </svg>
  );
}

export function LineChart({ data, width = 280, height = 100, color = '#00E600', fill = true, dashedAfter = null, threshold = null }) {
  const id = React.useId();
  const pad = 6;
  const max = Math.max(...data), min = Math.min(...data);
  const range = max - min || 1;
  const w = width - pad * 2;
  const h = height - pad * 2;
  const pts = data.map((v, i) => [
    pad + (i / (data.length - 1)) * w,
    pad + h - ((v - min) / range) * h,
  ]);
  const buildPath = (arr) => {
    if (arr.length < 2) return '';
    const cmds = ['M ' + arr[0].join(' ')];
    for (let i = 1; i < arr.length; i++) {
      const [x0, y0] = arr[i-1];
      const [x1, y1] = arr[i];
      const cx0 = x0 + (x1 - x0) / 2;
      cmds.push(`C ${cx0} ${y0} ${cx0} ${y1} ${x1} ${y1}`);
    }
    return cmds.join(' ');
  };
  const splitIdx = dashedAfter != null ? Math.floor(data.length * dashedAfter) : data.length;
  const solid = pts.slice(0, splitIdx + 1);
  const dashed = pts.slice(splitIdx);

  return (
    <svg width={width} height={height} style={{ overflow: 'visible' }}>
      <defs>
        <linearGradient id={`lc${id}`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%"   stopColor={color} stopOpacity="0.4"/>
          <stop offset="100%" stopColor={color} stopOpacity="0"/>
        </linearGradient>
      </defs>
      {fill && (
        <path d={`${buildPath(solid)} L ${solid[solid.length-1][0]} ${height-pad} L ${pad} ${height-pad} Z`}
              fill={`url(#lc${id})`} />
      )}
      {threshold != null && (
        <line x1={pad} y1={pad + h - threshold * h} x2={pad + w} y2={pad + h - threshold * h}
              stroke={HF.bad} strokeOpacity="0.5" strokeWidth="1.2" strokeDasharray="4 4" />
      )}
      <path d={buildPath(solid)} stroke={color} strokeWidth="2.2" fill="none" strokeLinecap="round" strokeLinejoin="round"
            style={{ filter: `drop-shadow(0 0 4px ${color}aa)` }} />
      {dashed.length > 1 && (
        <path d={buildPath(dashed)} stroke={color} strokeWidth="2.2" fill="none" strokeLinecap="round"
              strokeDasharray="5 5" opacity="0.65" />
      )}
      {dashedAfter != null && (
        <circle cx={pts[splitIdx][0]} cy={pts[splitIdx][1]} r="5" fill="var(--hf-bg-deep)" stroke={color} strokeWidth="2" />
      )}
    </svg>
  );
}

export function Grade({ grade = 'A', size = 36 }) {
  const map = {
    A: { fg: '#001500', bg: HF.gradGreen, sh: 'rgba(0,230,0,0.5)' },
    B: { fg: '#000',    bg: 'linear-gradient(135deg, #f5f5f5, #c8c8c8)', sh: 'rgba(0,0,0,0.18)' },
    C: { fg: '#1a1100', bg: 'linear-gradient(135deg, #ffd166, #ff8800)', sh: 'rgba(255,136,0,0.35)' },
    D: { fg: '#fff',    bg: 'linear-gradient(135deg, #ff7070, #cc2222)', sh: 'rgba(255,51,51,0.4)' },
  };
  const m = map[grade];
  return (
    <div style={{
      width: size, height: size, borderRadius: 12,
      background: m.bg,
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      color: m.fg, fontWeight: 700, fontSize: size * 0.5, letterSpacing: -1,
      boxShadow: `0 4px 16px ${m.sh}, inset 0 1px 0 rgba(255,255,255,0.4)`,
      border: '1px solid rgba(255,255,255,0.2)',
      flexShrink: 0,
    }}>{grade}</div>
  );
}

export function ProgressBar({ value = 50, max = 100, height = 12, color, label, valueLabel }) {
  const pct = (value / max) * 100;
  return (
    <div>
      {(label || valueLabel) && (
        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 12, color: HF.text50, marginBottom: 6 }}>
          <span>{label}</span>
          <span className="mono" style={{ color: HF.text, fontWeight: 600 }}>{valueLabel ?? `${value}%`}</span>
        </div>
      )}
      <div style={{ height, borderRadius: 99, background: HF.text10, position: 'relative', overflow: 'hidden', border: `1px solid ${HF.softBd}` }}>
        <div style={{
          position: 'absolute', left: 0, top: 0, bottom: 0,
          width: pct + '%', borderRadius: 99,
          background: color || HF.gradGreen,
          boxShadow: `0 0 12px ${color ? color : 'rgba(0,230,0,0.6)'}`,
        }}>
          <div style={{ position: 'absolute', right: 1, top: 1, bottom: 1, width: 6, borderRadius: 99, background: '#fff', opacity: 0.85 }}></div>
        </div>
      </div>
    </div>
  );
}

export function SensorTile({ label, value, unit, trend = 'flat', alert }) {
  const trendIcon = { up: '↗', down: '↘', flat: '→' }[trend];
  const c = alert ? HF.bad : trend === 'up' ? HF.green : HF.text70;
  return (
    <div className="hf-glass-soft" style={{ borderRadius: 18, padding: 12 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <span style={{ fontSize: 11, color: HF.text50, fontWeight: 500 }}>{label}</span>
        <span style={{ fontSize: 13, color: c }}>{trendIcon}</span>
      </div>
      <div style={{ display: 'flex', alignItems: 'baseline', gap: 3, marginTop: 6 }}>
        <span style={{ fontSize: 22, fontWeight: 700, color: HF.text, letterSpacing: -1, lineHeight: 1 }}>{value}</span>
        <span className="mono" style={{ fontSize: 11, color: HF.text40 }}>{unit}</span>
      </div>
    </div>
  );
}

export function Hotspot({ top, left, color, label, active, onClick }) {
  return (
    <div onClick={onClick} style={{ position: 'absolute', top, left, transform: 'translate(-50%, -50%)', cursor: 'pointer' }}>
      <div style={{
        width: active ? 20 : 16, height: active ? 20 : 16, borderRadius: 99, background: color,
        boxShadow: `0 0 0 ${active ? 6 : 4}px ${color}33, 0 0 20px ${color}, 0 0 40px ${color}88`,
        border: '2px solid #fff',
        transition: 'all .2s',
      }}></div>
      <div className="hf-pill" style={{ position: 'absolute', top: -10, left: 22, padding: '4px 8px', fontSize: 10, whiteSpace: 'nowrap', color: '#fff', borderColor: color }}>{label}</div>
    </div>
  );
}
