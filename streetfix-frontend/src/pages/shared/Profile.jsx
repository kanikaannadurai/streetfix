import React, { useState, useEffect } from 'react';
import { User, Mail, Shield, Building, Phone, MapPin } from 'lucide-react';
import './Shared.css'; // Will create if needed, or inline styles

const Profile = () => {
  const [profile, setProfile] = useState({
    name: localStorage.getItem('name') || 'User',
    role: (localStorage.getItem('role') || 'CITIZEN').replace('_', ' '),
    userId: localStorage.getItem('userId') || 'N/A',
  });

  return (
    <div className="dashboard-container" style={{ maxWidth: '800px', margin: '0 auto', paddingTop: '40px' }}>
      <div className="page-header glass-panel text-center" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
        <div style={{
          width: '80px',
          height: '80px',
          borderRadius: '50%',
          background: 'linear-gradient(135deg, #3b82f6, #8b5cf6)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontSize: '32px',
          fontWeight: 700,
          color: '#fff',
          marginBottom: '16px'
        }}>
          {profile.name[0].toUpperCase()}
        </div>
        <h2 className="gradient-text">{profile.name}</h2>
        <span className={`status-badge status-${profile.role.toLowerCase().replace(' ', '-')}`} style={{ marginTop: '8px' }}>
          {profile.role}
        </span>
      </div>

      <div className="glass-panel section-card mt-4">
        <div className="section-header">
          <div className="section-title">
            <User size={16} color="#60a5fa" className="me-2" />
            Profile Details
          </div>
        </div>
        
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          <div className="info-row" style={{ display: 'flex', padding: '12px', background: 'rgba(0,0,0,0.1)', borderRadius: '8px' }}>
            <div style={{ width: '40px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Shield size={20} color="#a78bfa" />
            </div>
            <div>
              <div style={{ fontSize: '12px', color: 'var(--text-muted)' }}>Account ID</div>
              <div style={{ fontWeight: 600 }}>#{profile.userId}</div>
            </div>
          </div>
          
          <div className="info-row" style={{ display: 'flex', padding: '12px', background: 'rgba(0,0,0,0.1)', borderRadius: '8px' }}>
            <div style={{ width: '40px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <User size={20} color="#34d399" />
            </div>
            <div>
              <div style={{ fontSize: '12px', color: 'var(--text-muted)' }}>Full Name</div>
              <div style={{ fontWeight: 600 }}>{profile.name}</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
