import React, { useState, useEffect } from 'react';
import { Shield, TrendingUp, AlertTriangle, CheckCircle, Clock } from 'lucide-react';
import api from '../../services/api';
import '../citizen/Citizen.css';

const OfficerPerformance = () => {
  const [officers, setOfficers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    try {
      const res = await api.get('/performance/officer');
      setOfficers(Array.isArray(res.data) ? res.data : []);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="dashboard-container">
      <div className="page-header glass-panel">
        <div className="page-header-left">
          <h2 className="gradient-text" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Shield size={24} /> Officer Performance
          </h2>
          <p>Track metrics, resolution rates, and SLA compliance for all officers.</p>
        </div>
      </div>

      <div className="glass-panel section-card">
        <div className="data-table-wrapper">
          <table className="data-table" style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ borderBottom: '1px solid var(--glass-border)', textAlign: 'left' }}>
                <th style={{ padding: '12px' }}>Officer</th>
                <th style={{ padding: '12px' }}>Department</th>
                <th style={{ padding: '12px', textAlign: 'center' }}>Score</th>
                <th style={{ padding: '12px', textAlign: 'center' }}>Assigned</th>
                <th style={{ padding: '12px', textAlign: 'center' }}>Warnings/Strikes</th>
                <th style={{ padding: '12px', textAlign: 'center' }}>Escalations</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr><td colSpan="6" style={{ textAlign: 'center', padding: '24px' }}>Loading...</td></tr>
              ) : officers.length === 0 ? (
                <tr><td colSpan="6" style={{ textAlign: 'center', padding: '24px' }}>No officer data found.</td></tr>
              ) : (
                officers.map(o => (
                  <tr key={o.id} style={{ borderBottom: '1px solid var(--glass-border)' }}>
                    <td style={{ padding: '12px' }}>
                      <div style={{ fontWeight: 600 }}>{o.name}</div>
                      <div className="text-xs text-muted">{o.email}</div>
                    </td>
                    <td style={{ padding: '12px' }}>{o.department || 'N/A'}</td>
                    <td style={{ padding: '12px', textAlign: 'center' }}>
                      <span style={{ color: o.performanceScore >= 80 ? 'var(--success)' : o.performanceScore >= 50 ? 'var(--warning)' : 'var(--danger)', fontWeight: 700, fontSize: '16px' }}>
                        {o.performanceScore}%
                      </span>
                    </td>
                    <td style={{ padding: '12px', textAlign: 'center' }}>{o.totalAssigned}</td>
                    <td style={{ padding: '12px', textAlign: 'center' }}>
                      <span className="text-warning">{o.warningCount}</span> / <span className="text-danger">{o.strikes}</span>
                    </td>
                    <td style={{ padding: '12px', textAlign: 'center', color: o.escalationCount > 0 ? 'var(--danger)' : 'var(--success)' }}>
                      {o.escalationCount}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default OfficerPerformance;
