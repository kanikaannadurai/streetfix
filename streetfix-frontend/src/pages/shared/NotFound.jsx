import React from 'react';
import { useNavigate } from 'react-router-dom';
import { FileQuestion, Home } from 'lucide-react';
import './Shared.css';

const NotFound = () => {
  const navigate = useNavigate();

  return (
    <div className="dashboard-container" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '80vh', textAlign: 'center' }}>
      <FileQuestion size={64} color="var(--primary)" style={{ marginBottom: '20px' }} />
      <h1 className="gradient-text" style={{ fontSize: '3rem', marginBottom: '10px' }}>404</h1>
      <h2>Page Not Found</h2>
      <p style={{ color: 'var(--text-light)', maxWidth: '400px', margin: '15px auto 30px' }}>
        The page you are looking for doesn't exist or has been moved.
      </p>
      <button className="btn-primary" onClick={() => navigate('/')} style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
        <Home size={18} /> Return Home
      </button>
    </div>
  );
};

export default NotFound;
