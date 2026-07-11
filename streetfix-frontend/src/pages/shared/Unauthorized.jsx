import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ShieldAlert, ArrowLeft } from 'lucide-react';
import './Shared.css';

const Unauthorized = () => {
  const navigate = useNavigate();

  return (
    <div className="dashboard-container" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '80vh', textAlign: 'center' }}>
      <ShieldAlert size={64} color="var(--danger)" style={{ marginBottom: '20px' }} />
      <h1 className="gradient-text" style={{ fontSize: '3rem', marginBottom: '10px' }}>403</h1>
      <h2>Access Denied</h2>
      <p style={{ color: 'var(--text-light)', maxWidth: '400px', margin: '15px auto 30px' }}>
        You do not have the required permissions to view this page. If you believe this is a mistake, contact your administrator.
      </p>
      <button className="btn-primary" onClick={() => navigate(-1)} style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
        <ArrowLeft size={18} /> Go Back
      </button>
    </div>
  );
};

export default Unauthorized;
