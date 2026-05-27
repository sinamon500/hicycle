import React from 'react';
import { useNavigate } from 'react-router-dom';
import { HF } from '../theme.jsx';

export default function Login() {
  const navigate = useNavigate();
  return (
    <div style={{ padding: '60px 28px 80px', display: 'flex', flexDirection: 'column', minHeight: '100dvh' }}>
      <div style={{ fontSize: 32, fontWeight: 700, letterSpacing: -1 }}>안녕하세요 👋</div>
      <div style={{ fontSize: 15, color: HF.text50, marginTop: 6 }}>장비 ID로 로그인하세요</div>

      <div style={{ marginTop: 36, display: 'flex', flexDirection: 'column', gap: 14 }}>
        <div className="hf-glass-soft" style={{ borderRadius: 18, padding: '14px 16px' }}>
          <div style={{ fontSize: 11, color: HF.text40, fontWeight: 500 }}>장비 ID / 사번</div>
          <div style={{ fontSize: 16, fontWeight: 600, marginTop: 2 }}>HD-EX-2018</div>
        </div>
        <div className="hf-glass-soft" style={{ borderRadius: 18, padding: '14px 16px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <div style={{ fontSize: 11, color: HF.text40, fontWeight: 500 }}>비밀번호</div>
            <div style={{ fontSize: 16, marginTop: 2, letterSpacing: 4 }}>••••••••</div>
          </div>
          <span style={{ fontSize: 18, color: HF.text40 }}>👁</span>
        </div>

        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 4 }}>
          <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
            <div className="hf-switch on" style={{ width: 36, height: 22 }}></div>
            <span style={{ fontSize: 13, color: HF.text70 }}>자동 로그인</span>
          </div>
          <span style={{ fontSize: 13, color: HF.green, cursor: 'pointer' }}>비밀번호 찾기</span>
        </div>

        <button className="hf-btn hf-btn-primary" style={{ marginTop: 12 }} onClick={() => navigate('/dashboard')}>로그인</button>

        <div style={{ display: 'flex', alignItems: 'center', gap: 12, margin: '14px 0' }}>
          <div style={{ flex: 1, height: 1, background: HF.text10 }}></div>
          <span style={{ fontSize: 11, color: HF.text40 }}>또는</span>
          <div style={{ flex: 1, height: 1, background: HF.text10 }}></div>
        </div>
        <button className="hf-btn" style={{ width: '100%' }} onClick={() => navigate('/dashboard')}>SSO 사내 계정으로 계속</button>
      </div>

      <div style={{ marginTop: 'auto', textAlign: 'center', paddingTop: 24 }}>
        <span style={{ fontSize: 13, color: HF.text50 }}>계정이 없으신가요? </span>
        <span style={{ fontSize: 13, color: HF.green, fontWeight: 600, cursor: 'pointer' }}>회원가입</span>
      </div>
    </div>
  );
}
