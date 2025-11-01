import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import './Notifications.css';

const Notifications = () => {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');
  const [page, setPage] = useState(1);
  const [pagination, setPagination] = useState(null);
  const navigate = useNavigate();

  const API_BASE_URL = 'http://localhost:3000/api/v1';

  useEffect(() => {
    fetchNotifications();
  }, [page, filter]);

  const fetchNotifications = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('arthive_token') || localStorage.getItem('token');
      if (!token) {
        navigate('/login');
        return;
      }

      const typeParam = filter !== 'all' ? `&type=${filter}` : '';
      const response = await axios.get(
        `${API_BASE_URL}/notifications?page=${page}&limit=20${typeParam}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      if (response.data.success) {
        setNotifications(response.data.notifications);
        setPagination(response.data.pagination);
      }
    } catch (error) {
      console.error('Error fetching notifications:', error);
      if (error.response?.status === 401) {
        navigate('/login');
      }
    } finally {
      setLoading(false);
    }
  };

  const markAsRead = async (notificationId) => {
    try {
      const token = localStorage.getItem('arthive_token') || localStorage.getItem('token');
      await axios.put(
        `${API_BASE_URL}/notifications/${notificationId}/read`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setNotifications(prev =>
        prev.map(notif =>
          notif._id === notificationId ? { ...notif, isRead: true } : notif
        )
      );
    } catch (error) {
      console.error('Error marking as read:', error);
    }
  };

  const markAllAsRead = async () => {
    try {
      const token = localStorage.getItem('arthive_token') || localStorage.getItem('token');
      await axios.put(
        `${API_BASE_URL}/notifications/read-all`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setNotifications(prev =>
        prev.map(notif => ({ ...notif, isRead: true }))
      );
    } catch (error) {
      console.error('Error marking all as read:', error);
    }
  };

  const deleteNotification = async (notificationId) => {
    try {
      const token = localStorage.getItem('arthive_token') || localStorage.getItem('token');
      await axios.delete(`${API_BASE_URL}/notifications/${notificationId}`, {
        headers: { Authorization: `Bearer ${token}` }
      });

      setNotifications(prev => prev.filter(notif => notif._id !== notificationId));
    } catch (error) {
      console.error('Error deleting notification:', error);
    }
  };

  const getNotificationIcon = (type) => {
    const icons = {
      artwork_approved: '✅',
      artwork_rejected: '❌',
      artwork_purchased: '💰',
      new_follower: '👤',
      artwork_liked: '❤️',
      order_placed: '🛍️',
      price_drop: '📉',
      new_upload: '🎨'
    };
    return icons[type] || '🔔';
  };

  const timeAgo = (date) => {
    const seconds = Math.floor((new Date() - new Date(date)) / 1000);
    
    if (seconds < 60) return 'Just now';
    if (seconds < 3600) return `${Math.floor(seconds / 60)}m ago`;
    if (seconds < 86400) return `${Math.floor(seconds / 3600)}h ago`;
    if (seconds < 604800) return `${Math.floor(seconds / 86400)}d ago`;
    return new Date(date).toLocaleDateString();
  };

  const unreadCount = notifications.filter(n => !n.isRead).length;

  return (
    <div className="notifications-page">
      <div className="notifications-container">
        <div className="notifications-header">
          <div>
            <h1>Notifications</h1>
            <p className="notifications-subtitle">
              {unreadCount > 0 ? `${unreadCount} unread notification${unreadCount > 1 ? 's' : ''}` : 'All caught up!'}
            </p>
          </div>
          {unreadCount > 0 && (
            <button className="mark-all-btn" onClick={markAllAsRead}>
              Mark all as read
            </button>
          )}
        </div>

        <div className="notifications-filters">
          <button
            className={`filter-btn ${filter === 'all' ? 'active' : ''}`}
            onClick={() => { setFilter('all'); setPage(1); }}
          >
            All
          </button>
          <button
            className={`filter-btn ${filter === 'artwork_approved' ? 'active' : ''}`}
            onClick={() => { setFilter('artwork_approved'); setPage(1); }}
          >
            Approved
          </button>
          <button
            className={`filter-btn ${filter === 'artwork_purchased' ? 'active' : ''}`}
            onClick={() => { setFilter('artwork_purchased'); setPage(1); }}
          >
            Sales
          </button>
          <button
            className={`filter-btn ${filter === 'new_follower' ? 'active' : ''}`}
            onClick={() => { setFilter('new_follower'); setPage(1); }}
          >
            Followers
          </button>
          <button
            className={`filter-btn ${filter === 'artwork_liked' ? 'active' : ''}`}
            onClick={() => { setFilter('artwork_liked'); setPage(1); }}
          >
            Likes
          </button>
        </div>

        <div className="notifications-list">
          {loading ? (
            <div className="notifications-loading">Loading notifications...</div>
          ) : notifications.length === 0 ? (
            <div className="no-notifications">
              <span className="empty-icon">🔔</span>
              <h3>No notifications yet</h3>
              <p>When you get notifications, they'll show up here.</p>
            </div>
          ) : (
            notifications.map((notification) => (
              <div
                key={notification._id}
                className={`notification-card ${!notification.isRead ? 'unread' : ''}`}
                onClick={() => !notification.isRead && markAsRead(notification._id)}
              >
                <div className="notification-icon-circle">
                  {getNotificationIcon(notification.type)}
                </div>
                <div className="notification-content">
                  <h3 className="notification-title">{notification.title}</h3>
                  <p className="notification-message">{notification.message}</p>
                  <span className="notification-time">{timeAgo(notification.createdAt)}</span>
                </div>
                {!notification.isRead && <div className="unread-dot" />}
                <button
                  className="notification-delete"
                  onClick={(e) => {
                    e.stopPropagation();
                    deleteNotification(notification._id);
                  }}
                >
                  ×
                </button>
              </div>
            ))
          )}
        </div>

        {pagination && pagination.pages > 1 && (
          <div className="notifications-pagination">
            <button
              className="pagination-btn"
              onClick={() => setPage(page - 1)}
              disabled={page === 1}
            >
              ← Previous
            </button>
            <span className="pagination-info">
              Page {page} of {pagination.pages}
            </span>
            <button
              className="pagination-btn"
              onClick={() => setPage(page + 1)}
              disabled={page === pagination.pages}
            >
              Next →
            </button>
          </div>
        )}

        <div className="back-to-home">
          <button onClick={() => navigate('/')}>← Back to Home</button>
        </div>
      </div>
    </div>
  );
};

export default Notifications;
