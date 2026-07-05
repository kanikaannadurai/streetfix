import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Settings, Save, RotateCcw, Clock, AlertTriangle, CheckCircle, Loader, Plus, Trash2 } from 'lucide-react';
import api from '../../services/api';
import '../citizen/Citizen.css';

const DEFAULT_CONFIGS = [
  { category: 'Road Damage',          priorityHours: { HIGH: 24, MEDIUM: 72,  LOW: 168  } },
  { category: 'Pothole',              priorityHours: { HIGH: 24, MEDIUM: 48,  LOW: 120  } },
  { category: 'Garbage / Waste',      priorityHours: { HIGH: 12, MEDIUM: 48,  LOW: 96   } },
  { category: 'Street Light',         priorityHours: { HIGH: 48, MEDIUM: 120, LOW: 240  } },
  { category: 'Water Leak / Sewage',  priorityHours: { HIGH: 12, MEDIUM: 24,  LOW: 72   } },
  { category: 'Encroachment',         priorityHours: { HIGH: 48, MEDIUM: 96,  LOW: 168  } },
  { category: 'Drainage Issue',       priorityHours: { HIGH: 24, MEDIUM: 72,  LOW: 168  } },
  { category: 'Other',                priorityHours: { HIGH: 48, MEDIUM: 120, LOW: 240  } },
];

const SLAConfig = () => {
  const navigate = useNavigate();
  const [configs, setConfigs] = useState(DEFAULT_CONFIGS);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving]   = useState(false);
  const [success, setSuccess] = useState('');
  const [error, setError]     = useState('');
  const [globalSla, setGlobalSla] = useState({ escalationHours: 72, autoCloseHours: 720 });

  useEffect(() => { fetchConfig(); }, []);

  const fetchConfig = async () => {
    setLoading(true);
    try {
      const res = await api.get('/sla/config').catch(() => ({ data: null }));
      if (res.data && Array.isArray(res.data)) {
        setConfigs(res.data);
      } else if (res.data && res.data.categories) {
        setConfigs(res.data.categories);
        if (res.data.global) setGlobalSla(res.data.global);
      }
    } catch (err) { /* use defaults */ }
    finally { setLoading(false); }
  };

  const updateHours = (idx, priority, value) => {
    setConfigs(prev => prev.map((c, i) =>
      i === idx ? { ...c, priorityHours: { ...c.priorityHours, [priority]: parseInt(value) || 0 } } : c
    ));
  };

  const handleSave = async () => {
    setSaving(true);
    setError('');
    setSuccess('');
    try {
      await api.post('/sla/config', { global: globalSla, categories: configs })
        .catch(() => api.put('/sla/config', { global: globalSla, categories: configs }));
      setSuccess('SLA configuration saved successfully!');
    } catch (err) {
      setError('Failed to save SLA configuration. Your backend may require a different endpoint format.');
    } finally {
      setSaving(false);
    }
  };

  const addCategory = () => {
    setConfigs(prev => [...prev, { category: 'New Category', priorityHours: { HIGH: 24, MEDIUM: 72, LOW: 168 } }]);
  };

  const removeCategory = (idx) => {
    setConfigs(prev => prev.filter((_, i) => i !== idx));
  };

  const updateCategoryName = (idx, name) => {
    setConfigs(prev => prev.map((c, i) => i === idx ? { ...c, category: name } : c));
  };

  const HoursDisplay = ({ hours }) => {
    const days = Math.floor(hours / 24);
    const hrs  = hours % 24;
    return (
      <span className="text-xs text-muted">
        {days > 0 ? `${days}d ` : ''}{hrs > 0 ? `${hrs}h` : ''}
      </span>
    );
  };

  if (loading) return <div className="dashboard-container"><div className="loading-state"><div className="spinner" /></div></div>;

  return (
    <div className="dashboard-container">
      <div className="page-header glass-panel">
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          <button className="btn-icon" onClick={() => navigate('/admin')}><ArrowLeft size={18} /></button>
          <div className="page-header-left">
            <h2 className="gradient-text">SLA Configuration</h2>
            <p>Configure resolution time limits per category and priority level.</p>
          </div>
        </div>
        <div className="page-header-actions">
          <button className="btn-icon" onClick={fetchConfig}><RotateCcw size={16} /></button>
          <button className="btn-primary" onClick={handleSave} disabled={saving}>
            {saving ? <><Loader size={14} /> Saving...</> : <><Save size={14} /> Save Config</>}
          </button>
        </div>
      </div>

      {error   && <div className="alert alert-error"  ><AlertTriangle size={16} />{error}</div>}
      {success && <div className="alert alert-success"><CheckCircle   size={16} />{success}</div>}

      {/* Global Settings */}
      <div className="glass-panel section-card" style={{ marginBottom: '24px' }}>
        <div className="section-header">
          <div className="section-title">
            <div className="section-title-icon"><Clock size={14} color="#60a5fa" /></div>
            Global SLA Settings
          </div>
          <span className="text-xs text-muted">Applied system-wide</span>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '16px' }}>
          <div className="form-group">
            <label>Auto-Escalation Threshold (hours)</label>
            <p className="text-xs text-muted" style={{ marginBottom: '6px' }}>
              Complaints inactive beyond this duration are auto-escalated.
            </p>
            <input
              type="number"
              className="input-field"
              min="1"
              value={globalSla.escalationHours}
              onChange={e => setGlobalSla(g => ({ ...g, escalationHours: parseInt(e.target.value) || 0 }))}
            />
            <HoursDisplay hours={globalSla.escalationHours} />
          </div>
          <div className="form-group">
            <label>Auto-Close After Resolution (hours)</label>
            <p className="text-xs text-muted" style={{ marginBottom: '6px' }}>
              Resolved complaints auto-close after this period if no feedback.
            </p>
            <input
              type="number"
              className="input-field"
              min="1"
              value={globalSla.autoCloseHours}
              onChange={e => setGlobalSla(g => ({ ...g, autoCloseHours: parseInt(e.target.value) || 0 }))}
            />
            <HoursDisplay hours={globalSla.autoCloseHours} />
          </div>
        </div>
      </div>

      {/* Category SLA Table */}
      <div className="glass-panel section-card">
        <div className="section-header">
          <div className="section-title">
            <div className="section-title-icon"><Settings size={14} color="#60a5fa" /></div>
            Category-wise SLA Limits
            <span style={{ background: 'rgba(59,130,246,0.15)', color: '#60a5fa', padding: '2px 8px', borderRadius: '99px', fontSize: '12px', marginLeft: '4px' }}>
              {configs.length} categories
            </span>
          </div>
          <button className="btn-secondary" style={{ padding: '7px 14px', fontSize: '13px' }} onClick={addCategory}>
            <Plus size={14} /> Add Category
          </button>
        </div>

        <div style={{ marginBottom: '16px', display: 'flex', gap: '24px', justifyContent: 'flex-end' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '12px' }}>
            <div style={{ width: 12, height: 12, borderRadius: '2px', background: 'rgba(239,68,68,0.4)' }} />
            <span className="text-muted">HIGH</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '12px' }}>
            <div style={{ width: 12, height: 12, borderRadius: '2px', background: 'rgba(245,158,11,0.4)' }} />
            <span className="text-muted">MEDIUM</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '12px' }}>
            <div style={{ width: 12, height: 12, borderRadius: '2px', background: 'rgba(16,185,129,0.4)' }} />
            <span className="text-muted">LOW</span>
          </div>
        </div>

        <div className="data-table-wrapper">
          <table className="data-table">
            <thead>
              <tr>
                <th style={{ minWidth: '200px' }}>Category</th>
                <th style={{ minWidth: '160px' }}>
                  <span style={{ color: '#f87171' }}>⬤</span> HIGH Priority (hours)
                </th>
                <th style={{ minWidth: '160px' }}>
                  <span style={{ color: '#fbbf24' }}>⬤</span> MEDIUM Priority (hours)
                </th>
                <th style={{ minWidth: '160px' }}>
                  <span style={{ color: '#34d399' }}>⬤</span> LOW Priority (hours)
                </th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {configs.map((cfg, idx) => (
                <tr key={idx}>
                  <td>
                    <input
                      type="text"
                      className="input-field"
                      value={cfg.category}
                      onChange={e => updateCategoryName(idx, e.target.value)}
                      style={{ padding: '7px 12px' }}
                    />
                  </td>
                  {['HIGH', 'MEDIUM', 'LOW'].map(p => (
                    <td key={p}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <input
                          type="number"
                          className="input-field"
                          min="1"
                          value={cfg.priorityHours[p] || ''}
                          onChange={e => updateHours(idx, p, e.target.value)}
                          style={{
                            padding: '7px 12px',
                            borderColor: p === 'HIGH' ? 'rgba(239,68,68,0.4)' : p === 'MEDIUM' ? 'rgba(245,158,11,0.4)' : 'rgba(16,185,129,0.4)',
                          }}
                        />
                        <HoursDisplay hours={cfg.priorityHours[p] || 0} />
                      </div>
                    </td>
                  ))}
                  <td>
                    <button
                      className="btn-icon"
                      style={{ color: 'var(--danger)' }}
                      onClick={() => removeCategory(idx)}
                      title="Remove"
                    >
                      <Trash2 size={14} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div style={{ marginTop: '24px', paddingTop: '20px', borderTop: '1px solid var(--glass-border)', display: 'flex', justifyContent: 'flex-end', gap: '12px' }}>
          <button className="btn-secondary" onClick={fetchConfig}>Discard Changes</button>
          <button className="btn-primary" onClick={handleSave} disabled={saving}>
            {saving ? <><Loader size={14} /> Saving...</> : <><Save size={14} /> Save All Changes</>}
          </button>
        </div>
      </div>
    </div>
  );
};

export default SLAConfig;
