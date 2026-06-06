import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import Splash              from './screens/Splash.jsx';
import Onboard             from './screens/Onboard.jsx';
import Login               from './screens/Login.jsx';
import Register            from './screens/Register.jsx';
import Dashboard           from './screens/Dashboard.jsx';
import SensorDetail        from './screens/SensorDetail.jsx';
import RUL                 from './screens/RUL.jsx';
import DigitalTwin         from './screens/DigitalTwin.jsx';
import Recovery            from './screens/Recovery.jsx';
import Credit              from './screens/Credit.jsx';
import Profile             from './screens/Profile.jsx';
import FleetDashboard      from './screens/FleetDashboard.jsx';
import HIReport            from './screens/HIReport.jsx';
import NotificationPanel   from './screens/NotificationPanel.jsx';
import KonectIntegration   from './screens/KonectIntegration.jsx';
import Community           from './screens/Ranking.jsx'; // 👈 기존 커뮤니티 화면을 랭킹 화면으로 활용

export default function App() {
  return (
    <div className="app-root">
      <div className="app-screen">
        <div className="app-content">
          <Routes>
            <Route path="/"              element={<Navigate to="/login" replace />} />
            <Route path="/splash"        element={<Splash />} />
            <Route path="/onboard"       element={<Onboard />} />
            <Route path="/login"         element={<Login />} />
            <Route path="/register"      element={<Register />} />
            <Route path="/dashboard"     element={<Dashboard />} />
            <Route path="/sensor"        element={<SensorDetail />} />
            <Route path="/rul"           element={<RUL />} />
            <Route path="/twin"          element={<DigitalTwin />} />
            <Route path="/recovery"      element={<Recovery />} />
            <Route path="/credit"        element={<Credit />} />
            <Route path="/profile"       element={<Profile />} />
            <Route path="/fleet"         element={<FleetDashboard />} />
            <Route path="/report"        element={<HIReport />} />
            <Route path="/notifications" element={<NotificationPanel />} />
            <Route path="/konect"        element={<KonectIntegration />} />
            
            {/* 💡 [주소 업데이트] /market으로 오면 대시보드로 튕기고, 탭바에서 누른 /ranking은 정상 연결 */}
            <Route path="/market"        element={<Navigate to="/dashboard" replace />} />
            <Route path="/ranking"       element={<Community />} />
            <Route path="/community"     element={<Navigate to="/ranking" replace />} />
            
            <Route path="*"              element={<Navigate to="/login" replace />} />
          </Routes>
        </div>
      </div>
    </div>
  );
}