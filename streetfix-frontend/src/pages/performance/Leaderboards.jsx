import React, { useState, useEffect } from 'react';
import { Trophy, Star, Map, Zap, Target } from 'lucide-react';
import api from '../../services/api';
import '../citizen/Citizen.css';

const Leaderboards = () => {
  const [data, setData] = useState({ topOfficers: [], activeWards: [] });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    try {
      const res = await api.get('/performance/leaderboards');
      setData(res.data);
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
            <Trophy size={24} /> Performance Leaderboards
          </h2>
          <p>Recognizing top performers and active communities.</p>
        </div>
      </div>

      <div className="content-grid">
        {/* Top Officers */}
        <div className="glass-panel section-card">
          <div className="section-header" style={{ marginBottom: '20px' }}>
            <div className="section-title"><Star size={16} color="#fbbf24" /> Best Officers</div>
          </div>
          {loading ? (
            <div className="loading-state" style={{ padding: '20px', textAlign: 'center' }}><div className="spinner" /></div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              {(data.topOfficers || []).map((o, i) => (
                <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '16px', padding: '12px', background: i === 0 ? 'rgba(251, 191, 36, 0.1)' : 'rgba(255,255,255,0.03)', borderRadius: '8px', border: i === 0 ? '1px solid rgba(251, 191, 36, 0.3)' : '1px solid var(--glass-border-bright)' }}>
                  <div style={{ width: '32px', height: '32px', borderRadius: '50%', background: i === 0 ? '#fbbf24' : i === 1 ? '#94a3b8' : i === 2 ? '#b45309' : 'var(--glass-bg)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 800, color: i < 3 ? '#fff' : 'var(--text-muted)' }}>
                    {i + 1}
                  </div>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontWeight: 700 }}>{o.name}</div>
                    <div className="text-xs text-muted">{o.department || 'N/A'}</div>
                  </div>
                  <div style={{ textAlign: 'right' }}>
                    <div style={{ color: 'var(--success)', fontWeight: 800, fontSize: '18px' }}>{o.score}%</div>
                    <div className="text-xs text-muted">Performance</div>
                  </div>
                </div>
              ))}
              {(!data.topOfficers || data.topOfficers.length === 0) && <div className="text-muted text-center">No officer data available.</div>}
            </div>
          )}
        </div>

        {/* Most Active Wards */}
        <div className="glass-panel section-card">
          <div className="section-header" style={{ marginBottom: '20px' }}>
            <div className="section-title"><Map size={16} color="#60a5fa" /> Most Active Wards</div>
          </div>
          {loading ? (
             <div className="loading-state" style={{ padding: '20px', textAlign: 'center' }}><div className="spinner" /></div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              {(data.activeWards || []).map((w, i) => (
                <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '16px', padding: '12px', background: 'rgba(255,255,255,0.03)', borderRadius: '8px', border: '1px solid var(--glass-border-bright)' }}>
                  <div style={{ width: '32px', height: '32px', borderRadius: '50%', background: 'var(--glass-bg)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 800, color: 'var(--text-muted)' }}>
                    {i + 1}
                  </div>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontWeight: 700, color: 'var(--primary-color)' }}>{w.name}</div>
                    <div className="progress-bar-wrap" style={{ marginTop: '6px', height: '6px' }}>
                      <div className="progress-bar blue" style={{ width: `${w.activityScore}%`, height: '6px' }} />
                    </div>
                  </div>
                  <div style={{ textAlign: 'right', minWidth: '60px' }}>
                    <div style={{ fontWeight: 800, fontSize: '16px' }}>{w.activityScore}</div>
                    <div className="text-xs text-muted">Score</div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Leaderboards;
