import React, { useState, useEffect } from 'react';
import { Map, Building, Activity, Shield, Users } from 'lucide-react';
import api from '../../services/api';
import '../citizen/Citizen.css';

const WardDepartmentPerformance = () => {
  const [activeTab, setActiveTab] = useState('ward');
  const [wards, setWards] = useState([]);
  const [depts, setDepts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    try {
      const [wardRes, deptRes] = await Promise.all([
        api.get('/performance/ward'),
        api.get('/performance/department')
      ]);
      setWards(wardRes.data?.wards || []);
      setDepts(deptRes.data?.departments || []);
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
            <Activity size={24} /> Ward & Department Performance
          </h2>
          <p>Monitor geographic and departmental efficiencies across the platform.</p>
        </div>
        <div className="page-header-actions" style={{ display: 'flex', gap: '10px' }}>
          <button className={`btn-${activeTab === 'ward' ? 'primary' : 'secondary'}`} onClick={() => setActiveTab('ward')}>
            <Map size={16} /> Ward View
          </button>
          <button className={`btn-${activeTab === 'dept' ? 'primary' : 'secondary'}`} onClick={() => setActiveTab('dept')}>
            <Building size={16} /> Department View
          </button>
        </div>
      </div>

      <div className="glass-panel section-card">
        {loading ? (
          <div className="loading-state" style={{ padding: '40px', textAlign: 'center' }}><div className="spinner" /></div>
        ) : activeTab === 'ward' ? (
          <div className="data-table-wrapper">
            <table className="data-table" style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr style={{ borderBottom: '1px solid var(--glass-border)', textAlign: 'left' }}>
                  <th style={{ padding: '12px' }}>Rank</th>
                  <th style={{ padding: '12px' }}>Ward Name</th>
                  <th style={{ padding: '12px', textAlign: 'center' }}>Satisfaction</th>
                  <th style={{ padding: '12px', textAlign: 'center' }}>Density</th>
                  <th style={{ padding: '12px', textAlign: 'center' }}>Avg Resol. Days</th>
                  <th style={{ padding: '12px', textAlign: 'center' }}>Pending</th>
                </tr>
              </thead>
              <tbody>
                {wards.sort((a,b) => a.rank - b.rank).map((w, i) => (
                  <tr key={i} style={{ borderBottom: '1px solid var(--glass-border)' }}>
                    <td style={{ padding: '12px', fontWeight: 700 }}>#{w.rank}</td>
                    <td style={{ padding: '12px', fontWeight: 600, color: 'var(--primary-color)' }}>{w.name}</td>
                    <td style={{ padding: '12px', textAlign: 'center' }}>
                      <span style={{ color: w.satisfaction > 90 ? 'var(--success)' : 'var(--warning)' }}>{w.satisfaction}%</span>
                    </td>
                    <td style={{ padding: '12px', textAlign: 'center' }}>{w.complaintDensity}</td>
                    <td style={{ padding: '12px', textAlign: 'center' }}>{w.avgResolutionDays}</td>
                    <td style={{ padding: '12px', textAlign: 'center' }}>{w.pending}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="data-table-wrapper">
            <table className="data-table" style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr style={{ borderBottom: '1px solid var(--glass-border)', textAlign: 'left' }}>
                  <th style={{ padding: '12px' }}>Department</th>
                  <th style={{ padding: '12px', textAlign: 'center' }}>Avg Score</th>
                  <th style={{ padding: '12px', textAlign: 'center' }}>Total Officers</th>
                  <th style={{ padding: '12px', textAlign: 'center' }}>Escalations</th>
                </tr>
              </thead>
              <tbody>
                {depts.map((d, i) => (
                  <tr key={i} style={{ borderBottom: '1px solid var(--glass-border)' }}>
                    <td style={{ padding: '12px', fontWeight: 600 }}>{d.department}</td>
                    <td style={{ padding: '12px', textAlign: 'center' }}>
                      <span style={{ color: d.avgPerformanceScore >= 80 ? 'var(--success)' : 'var(--warning)', fontWeight: 700 }}>
                        {d.avgPerformanceScore.toFixed(1)}%
                      </span>
                    </td>
                    <td style={{ padding: '12px', textAlign: 'center' }}>{d.totalOfficers}</td>
                    <td style={{ padding: '12px', textAlign: 'center', color: d.totalEscalations > 0 ? 'var(--danger)' : 'var(--success)' }}>
                      {d.totalEscalations}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default WardDepartmentPerformance;
