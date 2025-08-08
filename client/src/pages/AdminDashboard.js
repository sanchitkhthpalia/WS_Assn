import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import apiService from '../services/api';
import './Dashboard.css';

const AdminDashboard = () => {
  const { user, logout } = useAuth();
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchBookings();
  }, []);

  const fetchBookings = async () => {
    try {
      setLoading(true);
      const data = await apiService.getAllBookings();
      setBookings(data);
    } catch (error) {
      setError('Failed to fetch bookings');
    } finally {
      setLoading(false);
    }
  };

  const formatDateTime = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleString('en-US', {
      weekday: 'short',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const formatTime = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (loading) {
    return (
      <div className="dashboard-container">
        <div className="loading">Loading...</div>
      </div>
    );
  }

  return (
    <div className="dashboard-container">
      <header className="dashboard-header">
        <div className="header-content">
          <h1>Admin Dashboard</h1>
          <div className="user-info">
            <span>Welcome, {user.name}!</span>
            <button onClick={logout} className="logout-button">
              Logout
            </button>
          </div>
        </div>
      </header>

      <div className="dashboard-content">
        <div className="admin-stats">
          <div className="stat-card">
            <h3>Total Bookings</h3>
            <p className="stat-number">{bookings.length}</p>
          </div>
          <div className="stat-card">
            <h3>Today's Bookings</h3>
            <p className="stat-number">
              {bookings.filter(booking => {
                const today = new Date().toDateString();
                const bookingDate = new Date(booking.slot.startAt).toDateString();
                return today === bookingDate;
              }).length}
            </p>
          </div>
        </div>

        {error && <div className="error-message">{error}</div>}

        <div className="bookings-table-container">
          <h2>All Bookings</h2>
          {bookings.length > 0 ? (
            <div className="bookings-table">
              <table>
                <thead>
                  <tr>
                    <th>Patient</th>
                    <th>Email</th>
                    <th>Date & Time</th>
                    <th>Duration</th>
                    <th>Booked On</th>
                  </tr>
                </thead>
                <tbody>
                  {bookings.map(booking => (
                    <tr key={booking.id}>
                      <td>{booking.user.name}</td>
                      <td>{booking.user.email}</td>
                      <td>
                        <strong>{formatDateTime(booking.slot.startAt)}</strong>
                      </td>
                      <td>
                        {formatTime(booking.slot.startAt)} - {formatTime(booking.slot.endAt)}
                      </td>
                      <td>
                        {new Date(booking.createdAt).toLocaleDateString()}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="no-bookings">
              <p>No bookings found.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
