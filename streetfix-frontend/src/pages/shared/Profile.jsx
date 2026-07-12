import React, { useState, useEffect } from 'react';
import { User, Mail, Shield, Phone, MapPin, Loader } from 'lucide-react';
import api from '../../services/api';
import './Shared.css'; 

const Profile = () => {
  const [profile, setProfile] = useState({
    name: localStorage.getItem('name') || 'User',
    role: (localStorage.getItem('role') || 'CITIZEN').replace('_', ' '),
    userId: localStorage.getItem('userId') || 'N/A',
    email: '',
    phone: '',
    address: ''
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await api.get('/auth/me');
        setProfile({
          name: res.data.name || localStorage.getItem('name') || 'User',
          role: (res.data.role || localStorage.getItem('role') || 'CITIZEN').replace('_', ' '),
          userId: res.data.id || localStorage.getItem('userId') || 'N/A',
          email: res.data.email || 'Not provided',
          phone: res.data.phone || 'Not provided',
          address: res.data.address || 'Not provided'
        });
      } catch (err) {
        console.error('Failed to fetch profile', err);
      } finally {
        setLoading(false);
      }
    };
    fetchProfile();
  }, []);

  if (loading) {
    return <div className="dashboard-container" style={{ display: 'flex', justifyContent: 'center', paddingTop: '100px' }}><Loader className="spin-icon" size={32} color="#60a5fa" /></div>;
  }

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
          {profile.name[0]?.toUpperCase()}
        </div>
        <h2 className="gradient-text">{profile.name}</h2>
        <span className={`status-badge status-${profile.role.toLowerCase().replace(' ', '-')}`} style={{ marginTop: '8px' }}>
          {profile.role.replace('ROLE', '')}
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

          <div className="info-row" style={{ display: 'flex', padding: '12px', background: 'rgba(0,0,0,0.1)', borderRadius: '8px' }}>
            <div style={{ width: '40px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Mail size={20} color="#fbbf24" />
            </div>
            <div>
              <div style={{ fontSize: '12px', color: 'var(--text-muted)' }}>Email Address</div>
              <div style={{ fontWeight: 600 }}>{profile.email}</div>
            </div>
          </div>

          <div className="info-row" style={{ display: 'flex', padding: '12px', background: 'rgba(0,0,0,0.1)', borderRadius: '8px' }}>
            <div style={{ width: '40px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Phone size={20} color="#f87171" />
            </div>
            <div>
              <div style={{ fontSize: '12px', color: 'var(--text-muted)' }}>Phone Number</div>
              <div style={{ fontWeight: 600 }}>{profile.phone}</div>
            </div>
          </div>

          <div className="info-row" style={{ display: 'flex', padding: '12px', background: 'rgba(0,0,0,0.1)', borderRadius: '8px' }}>
            <div style={{ width: '40px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <MapPin size={20} color="#60a5fa" />
            </div>
            <div>
              <div style={{ fontSize: '12px', color: 'var(--text-muted)' }}>Address</div>
              <div style={{ fontWeight: 600 }}>{profile.address}</div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};

export default Profile;
