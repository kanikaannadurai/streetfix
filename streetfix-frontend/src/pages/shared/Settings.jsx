import React, { useState, useEffect } from 'react';
import { Settings as SettingsIcon, Bell, Smartphone, Shield, Check, Save } from 'lucide-react';
import './Shared.css';

const Settings = () => {
  const [settings, setSettings] = useState({
    notificationsEnabled: true,
    emailAlert: true,
    smsNotif: false,
    darkMode: true,
    twoFactor: false
  });

  useEffect(() => {
    const darkMode = localStorage.getItem('darkMode');
    const smsNotif = localStorage.getItem('smsNotif');
    const emailAlert = localStorage.getItem('emailAlert');
    const inApp = localStorage.getItem('notificationsEnabled');

    setSettings(prev => ({
      ...prev,
      darkMode: darkMode === null ? true : darkMode === 'true',
      smsNotif: smsNotif === 'true',
      emailAlert: emailAlert === null ? true : emailAlert === 'true',
      notificationsEnabled: inApp === null ? true : inApp === 'true'
    }));

    if (darkMode === 'true') {
      document.body.classList.add('light-mode');
    } else {
      document.body.classList.remove('light-mode');
    }
  }, []);

  const handleChange = (key) => {
    if (key === 'twoFactor') {
      alert('Coming Soon');
      return;
    }
    setSettings(prev => {
      const updated = { ...prev, [key]: !prev[key] };
      
      if (key === 'darkMode') {
        if (updated.darkMode) {
          document.body.classList.add('light-mode');
        } else {
          document.body.classList.remove('light-mode');
        }
        localStorage.setItem('darkMode', updated.darkMode.toString());
      } else if (key === 'smsNotif') {
        localStorage.setItem('smsNotif', updated.smsNotif.toString());
      } else if (key === 'emailAlert') {
        localStorage.setItem('emailAlert', updated.emailAlert.toString());
      } else if (key === 'notificationsEnabled') {
        localStorage.setItem('notificationsEnabled', updated.notificationsEnabled.toString());
      }
      
      return updated;
    });
  };

  const handleSave = (e) => {
    e.preventDefault();
    localStorage.setItem('darkMode', settings.darkMode.toString());
    localStorage.setItem('smsNotif', settings.smsNotif.toString());
    localStorage.setItem('emailAlert', settings.emailAlert.toString());
    localStorage.setItem('notificationsEnabled', settings.notificationsEnabled.toString());
    
    alert("Settings saved successfully!");
  };

  const ToggleSwitch = ({ label, desc, checked, onChange }) => (
    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '16px 0', borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
      <div>
        <div style={{ fontWeight: 600, fontSize: '15px' }}>{label}</div>
        <div style={{ fontSize: '13px', color: 'var(--text-muted)', marginTop: '4px' }}>{desc}</div>
      </div>
      <div 
        onClick={onChange}
        style={{
          width: '44px', height: '24px', borderRadius: '12px',
          background: checked ? '#3b82f6' : 'rgba(255,255,255,0.1)',
          position: 'relative', cursor: 'pointer', transition: 'background 0.3s'
        }}
      >
        <div style={{
          width: '20px', height: '20px', borderRadius: '50%', background: '#fff',
          position: 'absolute', top: '2px', left: checked ? '22px' : '2px',
          transition: 'left 0.3s', boxShadow: '0 2px 4px rgba(0,0,0,0.2)'
        }} />
      </div>
    </div>
  );

  return (
    <div className="dashboard-container" style={{ maxWidth: '800px', margin: '0 auto', paddingTop: '40px' }}>
      <div className="page-header glass-panel">
        <div className="page-header-left">
          <h2 className="gradient-text" style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <SettingsIcon size={24} /> Preferences
          </h2>
          <p>Customize your experience and manage alerts.</p>
        </div>
      </div>

      <form onSubmit={handleSave} style={{ display: 'flex', flexDirection: 'column', gap: '24px', marginTop: '24px' }}>
        
        {/* Notifications Section */}
        <div className="glass-panel section-card">
          <div className="section-header" style={{ marginBottom: '16px' }}>
            <div className="section-title">
              <div className="section-title-icon"><Bell size={16} color="#fbbf24" /></div>
              Notification Preferences
            </div>
          </div>
          <ToggleSwitch 
            label="In-App Notifications" 
            desc="Receive alerts within the dashboard when your complaint status changes."
            checked={settings.notificationsEnabled} 
            onChange={() => handleChange('notificationsEnabled')} 
          />
          <ToggleSwitch 
            label="Email Alerts" 
            desc="Get detailed updates sent directly to your email inbox."
            checked={settings.emailAlert} 
            onChange={() => handleChange('emailAlert')} 
          />
          <ToggleSwitch 
            label="SMS Notifications" 
            desc="Receive quick text messages for critical updates."
            checked={settings.smsNotif} 
            onChange={() => handleChange('smsNotif')} 
          />
        </div>

        {/* Security Section */}
        <div className="glass-panel section-card">
          <div className="section-header" style={{ marginBottom: '16px' }}>
            <div className="section-title">
              <div className="section-title-icon"><Shield size={16} color="#34d399" /></div>
              Account Security
            </div>
          </div>
          <ToggleSwitch 
            label="Two-Factor Authentication" 
            desc="Add an extra layer of security to your account."
            checked={settings.twoFactor} 
            onChange={() => handleChange('twoFactor')} 
          />
        </div>

        {/* Appearance Section */}
        <div className="glass-panel section-card">
          <div className="section-header" style={{ marginBottom: '16px' }}>
            <div className="section-title">
              <div className="section-title-icon"><Smartphone size={16} color="#a78bfa" /></div>
              Appearance
            </div>
          </div>
          <ToggleSwitch 
            label="Dark Mode" 
            desc="Use a dark theme for lower eye strain and better battery life."
            checked={settings.darkMode} 
            onChange={() => handleChange('darkMode')} 
          />
        </div>

        {/* Actions */}
        <div style={{ display: 'flex', justifyContent: 'flex-end', alignItems: 'center', gap: '16px' }}>
          <button type="submit" className="btn-primary" style={{ padding: '10px 24px', fontSize: '15px' }}>
            <Save size={18} /> Save Settings
          </button>
        </div>
      </form>
    </div>
  );
};

export default Settings;
