import React, { useState } from 'react';
import { Settings as SettingsIcon, Bell, Shield, Smartphone } from 'lucide-react';
import './Shared.css'; 

const Settings = () => {
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);
  const [emailAlerts, setEmailAlerts] = useState(true);
  const [darkMode, setDarkMode] = useState(true);

  const handleSave = (e) => {
    e.preventDefault();
    alert('Settings saved successfully!');
  };

  return (
    <div className="dashboard-container" style={{ maxWidth: '800px', margin: '0 auto', paddingTop: '40px' }}>
      <div className="page-header glass-panel">
        <div className="page-header-left">
          <h2 className="gradient-text" style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <SettingsIcon size={24} /> Settings
          </h2>
          <p>Manage your account preferences and settings.</p>
        </div>
      </div>

      <div className="glass-panel section-card mt-4">
        <form onSubmit={handleSave}>
          <div className="form-group mb-4">
            <label style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '16px', fontWeight: 600 }}>
              <Bell size={18} color="#60a5fa" /> Notifications
            </label>
            <div style={{ marginTop: '12px', display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <label style={{ display: 'flex', alignItems: 'center', gap: '10px', cursor: 'pointer' }}>
                <input type="checkbox" checked={notificationsEnabled} onChange={e => setNotificationsEnabled(e.target.checked)} />
                Enable In-App Notifications
              </label>
              <label style={{ display: 'flex', alignItems: 'center', gap: '10px', cursor: 'pointer' }}>
                <input type="checkbox" checked={emailAlerts} onChange={e => setEmailAlerts(e.target.checked)} />
                Enable Email Alerts
              </label>
            </div>
          </div>

          <hr style={{ borderColor: 'rgba(255,255,255,0.1)', margin: '24px 0' }} />

          <div className="form-group mb-4">
            <label style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '16px', fontWeight: 600 }}>
              <Smartphone size={18} color="#a78bfa" /> Appearance
            </label>
            <div style={{ marginTop: '12px', display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <label style={{ display: 'flex', alignItems: 'center', gap: '10px', cursor: 'pointer' }}>
                <input type="checkbox" checked={darkMode} onChange={e => setDarkMode(e.target.checked)} />
                Dark Mode
              </label>
            </div>
          </div>

          <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '30px' }}>
            <button type="submit" className="btn-primary">Save Changes</button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Settings;
