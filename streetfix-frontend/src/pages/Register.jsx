import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';
import './Auth.css';

const Register = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    phone: '',
    address: '',
    role: 'CITIZEN'
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({...formData, [e.target.name]: e.target.value});
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    
    try {
      await api.post('/auth/register', formData);
      navigate('/login', { replace: true });
    } catch (err) {
      console.error('Register error:', err.response || err);
      setError(err.response?.data?.message || err.response?.data || 'Registration failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-box glass-panel">
        <h2 className="gradient-text">Join StreetFix</h2>
        <p className="auth-subtitle">Create your citizen account</p>
        
        {error && <div className="auth-error">{error}</div>}
        
        <form onSubmit={handleRegister}>
          <div className="form-group">
            <label>Full Name</label>
            <input name="name" type="text" className="input-field" value={formData.name} onChange={handleChange} required />
          </div>
          <div className="form-group">
            <label>Email</label>
            <input name="email" type="email" className="input-field" value={formData.email} onChange={handleChange} required />
          </div>
          <div className="form-group">
            <label>Password</label>
            <input name="password" type="password" className="input-field" value={formData.password} onChange={handleChange} required minLength="6" />
          </div>
          <div className="form-group">
            <label>Phone Number (Optional)</label>
            <input name="phone" type="text" className="input-field" value={formData.phone} onChange={handleChange} />
          </div>
          <div className="form-group">
            <label>Address (Optional)</label>
            <textarea name="address" className="input-field" value={formData.address} onChange={handleChange} rows="2" />
          </div>
          <div className="form-group">
            <label>Account Role</label>
            <select name="role" className="input-field" value={formData.role} onChange={handleChange}>
              <option value="CITIZEN">Citizen</option>
              <option value="OFFICER">Municipal Officer</option>
              <option value="WARD_SUPERVISOR">Ward Supervisor</option>
              <option value="WORKER">Worker</option>
              <option value="ADMIN">Admin</option>
            </select>
          </div>
          
          <button type="submit" className="btn-primary w-full" disabled={loading}>
            {loading ? 'Registering...' : 'Sign Up'}
          </button>
        </form>
        
        <div className="auth-footer">
          Already have an account? <span onClick={() => navigate('/login')}>Login</span>
        </div>
      </div>
    </div>
  );
};

export default Register;
