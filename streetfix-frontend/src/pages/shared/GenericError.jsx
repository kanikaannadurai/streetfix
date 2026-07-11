import React from 'react';
import { useNavigate } from 'react-router-dom';
import { AlertOctagon, RefreshCw } from 'lucide-react';
import './Shared.css';

const GenericError = ({ error, resetErrorBoundary }) => {
  const navigate = useNavigate();

  return (
    <div className="dashboard-container" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '80vh', textAlign: 'center' }}>
      <AlertOctagon size={64} color="var(--danger)" style={{ marginBottom: '20px' }} />
      <h1 style={{ fontSize: '2rem', marginBottom: '10px' }}>Something went wrong</h1>
      <p style={{ color: 'var(--text-light)', maxWidth: '400px', margin: '15px auto 30px' }}>
        {error?.message || "An unexpected error occurred while processing your request. Please try again later."}
      </p>
      <div style={{ display: 'flex', gap: '15px' }}>
        <button className="btn-secondary" onClick={() => navigate('/')}>
          Go to Dashboard
        </button>
        {resetErrorBoundary && (
          <button className="btn-primary" onClick={resetErrorBoundary} style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <RefreshCw size={18} /> Try Again
          </button>
        )}
      </div>
    </div>
  );
};

export default GenericError;
