import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../../services/api';
import './Citizen.css';
import { Search, Filter, AlertCircle, MapPin } from 'lucide-react';

const ComplaintHistory = () => {
  const [complaints, setComplaints] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    fetchComplaints();
  }, []);

  const fetchComplaints = async () => {
    try {
      const res = await api.get('/complaints/my');
      setComplaints(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  const filteredComplaints = complaints.filter(c => {
    const matchesSearch = c.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          c.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === '' || c.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="dashboard-container">
      <div className="dashboard-header glass-panel">
        <div>
          <h2 className="gradient-text">Complaint History</h2>
          <p>Track all your reported issues.</p>
        </div>
      </div>

      <div className="glass-panel p-6">
        <div style={{ display: 'flex', gap: '16px', marginBottom: '24px' }}>
          <div className="input-field" style={{ display: 'flex', alignItems: 'center', gap: '8px', flex: 2, padding: '8px 16px' }}>
            <Search size={18} color="var(--text-muted)" />
            <input 
              type="text" 
              placeholder="Search complaints..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              style={{ background: 'transparent', border: 'none', color: 'var(--text-light)', outline: 'none', width: '100%' }}
            />
          </div>
          <div className="input-field" style={{ display: 'flex', alignItems: 'center', gap: '8px', flex: 1, padding: '8px 16px' }}>
            <Filter size={18} color="var(--text-muted)" />
            <select 
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              style={{ background: 'transparent', border: 'none', color: 'var(--text-light)', outline: 'none', width: '100%' }}
            >
              <option value="" style={{ color: 'black' }}>All Statuses</option>
              <option value="PENDING" style={{ color: 'black' }}>Pending</option>
              <option value="ASSIGNED" style={{ color: 'black' }}>Assigned</option>
              <option value="IN_PROGRESS" style={{ color: 'black' }}>In Progress</option>
              <option value="RESOLVED" style={{ color: 'black' }}>Resolved</option>
              <option value="CLOSED" style={{ color: 'black' }}>Closed</option>
            </select>
          </div>
        </div>

        <div className="complaint-list" style={{ maxHeight: 'none', display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '20px' }}>
          {filteredComplaints.length === 0 ? (
            <p className="text-muted">No complaints found.</p>
          ) : (
            filteredComplaints.map(c => (
              <div key={c.id} className="complaint-card" onClick={() => navigate(`/citizen/complaints/${c.id}`)} style={{ cursor: 'pointer' }}>
                <div className="complaint-header">
                  <span className="font-semibold">{c.title}</span>
                  <span className={`status-badge status-${c.status.toLowerCase()}`}>{c.status}</span>
                </div>
                <p className="text-muted" style={{ fontSize: '13px', margin: '8px 0', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                  {c.description}
                </p>
                <div className="complaint-meta">
                  <span><AlertCircle size={14}/> {c.category || 'N/A'}</span>
                  <span><MapPin size={14}/> Loc</span>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default ComplaintHistory;
