import React, { useState, useEffect } from 'react';
import { Routes, Route, useNavigate } from 'react-router-dom';
import { ClipboardList, CheckCircle, Upload, Play, Check } from 'lucide-react';
import api from '../../services/api';
import '../citizen/Citizen.css'; // Reusing styling

const WorkerHome = () => {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const name = localStorage.getItem('name') || 'Worker';

  useEffect(() => {
    fetchTasks();
  }, []);

  const fetchTasks = async () => {
    try {
      const res = await api.get('/worker/tasks');
      setTasks(res.data || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleAccept = async (id) => {
    try {
      await api.put(`/worker/tasks/${id}/accept`);
      fetchTasks();
    } catch (e) {
      alert('Failed to accept task');
    }
  };

  const handleUpdate = async (id) => {
    const note = prompt("Enter progress note:");
    if (!note) return;
    try {
      await api.put(`/worker/tasks/${id}/progress?note=${encodeURIComponent(note)}`);
      fetchTasks();
    } catch (e) {
      alert('Failed to update progress');
    }
  };

  const handleComplete = async (id) => {
    const note = prompt("Enter completion note:");
    if (!note) return;
    try {
      await api.put(`/worker/tasks/${id}/complete?note=${encodeURIComponent(note)}`);
      fetchTasks();
    } catch (e) {
      alert('Failed to mark complete');
    }
  };

  const handleUpload = async (id, isBefore) => {
    const file = prompt(`Enter ${isBefore ? 'before' : 'after'} image URL (mock upload):`);
    if (!file) return;
    try {
      // For real implementation this would use FormData. Using mock alert for simplicity.
      alert(`Mock uploaded ${isBefore ? 'before' : 'after'} image for task ${id}`);
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <div className="dashboard-container">
      <div className="page-header glass-panel">
        <div className="page-header-left">
          <h2 className="gradient-text">Welcome, {name} (Worker)</h2>
          <p>Here are your assigned field tasks.</p>
        </div>
      </div>

      <div className="stats-grid">
        <div className="stat-card glass-panel">
          <div className="stat-icon blue"><ClipboardList size={22} /></div>
          <div className="stat-info">
            <div className="stat-value">{tasks.length}</div>
            <div className="stat-label">Total Assigned</div>
          </div>
        </div>
        <div className="stat-card glass-panel">
          <div className="stat-icon amber"><Play size={22} /></div>
          <div className="stat-info">
            <div className="stat-value">{tasks.filter(t => t.complaint.status === 'ASSIGNED_TO_WORKER').length}</div>
            <div className="stat-label">In Progress</div>
          </div>
        </div>
        <div className="stat-card glass-panel">
          <div className="stat-icon green"><CheckCircle size={22} /></div>
          <div className="stat-info">
            <div className="stat-value">{tasks.filter(t => t.complaint.status === 'WORK_COMPLETED').length}</div>
            <div className="stat-label">Completed</div>
          </div>
        </div>
      </div>

      <div className="glass-panel section-card mt-4">
        <div className="section-header">
          <div className="section-title">
            <ClipboardList size={16} color="#60a5fa" className="me-2" />
            My Assigned Tasks
          </div>
        </div>
        
        {loading ? (
          <p>Loading tasks...</p>
        ) : tasks.length === 0 ? (
          <p className="empty-state">No tasks assigned to you right now.</p>
        ) : (
          <div className="complaint-list">
            {tasks.map(task => {
              const c = task.complaint;
              return (
                <div key={task.id} className="complaint-card">
                  <div className="complaint-card-header">
                    <span className="complaint-card-title">{c.title}</span>
                    <span className={`status-badge status-${(c.status || '').toLowerCase()}`}>
                      {c.status}
                    </span>
                  </div>
                  <p className="complaint-card-desc">{c.description}</p>
                  
                  <div style={{ marginTop: '16px', display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                    {c.status === 'ASSIGNED_TO_WORKER' && (
                      <>
                        <button className="btn-secondary" style={{ padding: '6px 12px', fontSize: '13px' }} onClick={() => handleUpdate(task.id)}>
                          Update Progress
                        </button>
                        <button className="btn-secondary" style={{ padding: '6px 12px', fontSize: '13px' }} onClick={() => handleUpload(task.id, true)}>
                          <Upload size={14} className="me-1" /> Before Image
                        </button>
                        <button className="btn-primary" style={{ padding: '6px 12px', fontSize: '13px', background: '#34d399' }} onClick={() => handleComplete(task.id)}>
                          <Check size={14} className="me-1" /> Mark Complete
                        </button>
                      </>
                    )}
                    
                    {c.status === 'WORK_COMPLETED' && (
                      <button className="btn-secondary" style={{ padding: '6px 12px', fontSize: '13px' }} onClick={() => handleUpload(task.id, false)}>
                        <Upload size={14} className="me-1" /> After Image
                      </button>
                    )}
                    
                    {c.status === 'PENDING' || c.status === 'ASSIGNED_TO_WARD_SUPERVISOR' || c.status === 'ASSIGNED_TO_ASSISTANT_COMMISSIONER' || c.status === 'ASSIGNED_TO_ZONAL_OFFICER' ? (
                        <button className="btn-primary" style={{ padding: '6px 12px', fontSize: '13px' }} onClick={() => handleAccept(task.id)}>
                          Accept Task
                        </button>
                    ) : null}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

const WorkerDashboard = () => {
  return (
    <Routes>
      <Route index element={<WorkerHome />} />
      <Route path="tasks" element={<WorkerHome />} />
    </Routes>
  );
};

export default WorkerDashboard;
