import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';

import Splash       from './screens/Splash.jsx';
import Onboard      from './screens/Onboard.jsx';
import Login        from './screens/Login.jsx';
import Register     from './screens/Register.jsx';
import Dashboard    from './screens/Dashboard.jsx';
import SensorDetail from './screens/SensorDetail.jsx';
import RUL          from './screens/RUL.jsx';
import DigitalTwin  from './screens/DigitalTwin.jsx';
import Recovery     from './screens/Recovery.jsx';
import Credit       from './screens/Credit.jsx';
import Profile      from './screens/Profile.jsx';

export default function App() {
  return (
    <div className="app-root">
      <div className="app-screen">
        <div className="app-content">
          <Routes>
            <Route path="/"          element={<Navigate to="/login" replace />} />
            <Route path="/splash"    element={<Splash />} />
            <Route path="/onboard"   element={<Onboard />} />
            <Route path="/login"     element={<Login />} />
            <Route path="/register"  element={<Register />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/sensor"    element={<SensorDetail />} />
            <Route path="/rul"       element={<RUL />} />
            <Route path="/twin"      element={<DigitalTwin />} />
            <Route path="/recovery"  element={<Recovery />} />
            <Route path="/credit"    element={<Credit />} />
            <Route path="/profile"   element={<Profile />} />
            <Route path="*"          element={<Navigate to="/login" replace />} />
          </Routes>
        </div>
      </div>
    </div>
  );
}
