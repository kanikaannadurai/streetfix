import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';
import './Auth.css';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    
    try {
      const res = await api.post('/auth/login', { email, password });
      const { token, role, name, id } = res.data;
      // Strip Spring Security ROLE_ prefix (backend Role enum uses ROLE_CITIZEN, etc.)
      const cleanRole = (role || '').replace('ROLE_', '').toUpperCase();

      localStorage.setItem('token', token);
      localStorage.setItem('role', cleanRole);
      localStorage.setItem('name', name || '');
      localStorage.setItem('userId', id || '');

      if (cleanRole === 'CITIZEN') {
        navigate('/citizen', { replace: true });
      } else if (cleanRole === 'ADMIN') {
        navigate('/admin', { replace: true });
      } else if (cleanRole === 'WARD_SUPERVISOR') {
        navigate('/ward-supervisor', { replace: true });
      } else if (cleanRole === 'OFFICER') {
        navigate('/officer', { replace: true });
      } else if (cleanRole === 'WORKER') {
        navigate('/worker', { replace: true });
      } else {
        navigate('/', { replace: true });
      }
    } catch (err) {
      console.error('Login error:', err.response || err);
      setError(err.response?.data?.message || err.response?.data || 'Invalid credentials. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-box glass-panel">
        <h2 className="gradient-text">Welcome Back</h2>
        <p className="auth-subtitle">Login to StreetFix</p>
        
        {error && <div className="auth-error">{error}</div>}
        
        <form onSubmit={handleLogin}>
          <div className="form-group">
            <label>Email</label>
            <input 
              type="email" 
              className="input-field" 
              value={email} 
              onChange={(e) => setEmail(e.target.value)} 
              required 
              placeholder="Enter your email"
            />
          </div>
          <div className="form-group">
            <label>Password</label>
            <input 
              type="password" 
              className="input-field" 
              value={password} 
              onChange={(e) => setPassword(e.target.value)} 
              required 
              placeholder="Enter your password"
            />
          </div>
          
          <button type="submit" className="btn-primary w-full" disabled={loading}>
            {loading ? 'Authenticating...' : 'Sign In'}
          </button>
        </form>
        
        <div className="auth-footer">
          Don't have an account? <span onClick={() => navigate('/register')}>Register</span>
        </div>
      </div>
    </div>
  );
};

export default Login;
