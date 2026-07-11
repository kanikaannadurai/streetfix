import React, { useState, useEffect, useRef } from 'react';
import { Badge } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';
import './NotificationBell.css';

const NotificationBell = () => {
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);
  const navigate = useNavigate();

  const fetchNotifications = async () => {
    try {
      const res = await api.get('/notifications');
      setNotifications(res.data);
      const unread = res.data.filter(n => !n.isRead).length;
      setUnreadCount(unread);
    } catch (err) {
      console.error('Failed to fetch notifications', err);
    }
  };

  useEffect(() => {
    fetchNotifications();
    
    // Add event listener for auto-refresh
    window.addEventListener('refreshNotifications', fetchNotifications);
    
    // Poll every 30s
    const interval = setInterval(fetchNotifications, 30000);
    return () => {
      window.removeEventListener('refreshNotifications', fetchNotifications);
      clearInterval(interval);
    };
  }, []);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleMarkAsRead = async (id, complaintId) => {
    try {
      await api.put(`/notifications/${id}/read`);
      fetchNotifications();
      if (complaintId) {
        setIsOpen(false);
        navigate(`/complaint/${complaintId}`); // Default redirect assuming complaint details
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleMarkAllAsRead = async () => {
    try {
      await api.put('/notifications/read-all');
      fetchNotifications();
    } catch (err) {
      console.error(err);
    }
  };

  const toggleDropdown = () => setIsOpen(!isOpen);

  return (
    <div className="notification-bell-container" ref={dropdownRef}>
      <div className="notification-bell-icon" onClick={toggleDropdown}>
        🔔
        {unreadCount > 0 && (
          <Badge 
            bg="danger" 
            pill 
            className="position-absolute top-0 start-100 translate-middle"
            style={{ fontSize: '0.6rem', transform: 'translate(-30%, -30%)' }}
          >
            {unreadCount}
          </Badge>
        )}
      </div>

      <div className={`notification-dropdown ${isOpen ? 'show' : ''}`}>
        <div className="notification-header">
          <h4 className="notification-title">Notifications</h4>
          {unreadCount > 0 && (
            <button className="mark-all-read" onClick={handleMarkAllAsRead}>
              Mark all read
            </button>
          )}
        </div>
        
        {notifications.length === 0 ? (
          <div className="empty-notifications">
            <div className="empty-icon">🔕</div>
            <div className="empty-title">No notifications</div>
            <div className="empty-subtitle">You're all caught up!</div>
          </div>
        ) : (
          <ul className="notification-list">
            {notifications.map(notification => (
              <li 
                key={notification.id}
                className={`notification-item ${!notification.isRead ? 'unread' : ''}`}
                onClick={() => handleMarkAsRead(notification.id, notification.complaintId)}
              >
                <div style={{ fontWeight: '600', fontSize: '13px', marginBottom: '2px', color: '#1f2937' }}>
                  {notification.title}
                </div>
                <span className="notification-message" style={{ whiteSpace: 'pre-wrap' }}>{notification.message}</span>
                <span className="notification-time">
                  {new Date(notification.createdAt).toLocaleString()}
                </span>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
};

export default NotificationBell;
