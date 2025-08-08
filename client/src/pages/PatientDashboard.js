import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import apiService from '../services/api';
import './Dashboard.css';

const PatientDashboard = () => {
  const { user, logout } = useAuth();
  const [slots, setSlots] = useState([]);
  const [myBookings, setMyBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [bookingLoading, setBookingLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [activeTab, setActiveTab] = useState('slots');

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [slotsData, bookingsData] = await Promise.all([
        apiService.getSlots(),
        apiService.getMyBookings()
      ]);
      setSlots(slotsData);
      setMyBookings(bookingsData);
    } catch (error) {
      setError('Failed to fetch data');
    } finally {
      setLoading(false);
    }
  };

  const handleBookSlot = async (slotId) => {
    try {
      setBookingLoading(true);
      setError('');
      setSuccess('');
      
      await apiService.bookSlot(slotId);
      setSuccess('Slot booked successfully!');
      
      // Refresh data
      await fetchData();
    } catch (error) {
      setError(error.message || 'Failed to book slot');
    } finally {
      setBookingLoading(false);
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
          <h1>Patient Dashboard</h1>
          <div className="user-info">
            <span>Welcome, {user.name}!</span>
            <button onClick={logout} className="logout-button">
              Logout
            </button>
          </div>
        </div>
      </header>

      <div className="dashboard-content">
        <div className="tab-navigation">
          <button
            className={`tab-button ${activeTab === 'slots' ? 'active' : ''}`}
            onClick={() => setActiveTab('slots')}
          >
            Available Slots
          </button>
          <button
            className={`tab-button ${activeTab === 'bookings' ? 'active' : ''}`}
            onClick={() => setActiveTab('bookings')}
          >
            My Bookings ({myBookings.length})
          </button>
        </div>

        {error && <div className="error-message">{error}</div>}
        {success && <div className="success-message">{success}</div>}

        {activeTab === 'slots' && (
          <div className="slots-container">
            <h2>Available Slots (Next 7 Days)</h2>
            <div className="slots-grid">
              {slots
                .filter(slot => !slot.isBooked)
                .map(slot => (
                  <div key={slot.id} className="slot-card available">
                    <div className="slot-time">
                      <strong>{formatDateTime(slot.startAt)}</strong>
                    </div>
                    <div className="slot-duration">
                      {formatTime(slot.startAt)} - {formatTime(slot.endAt)}
                    </div>
                    <button
                      onClick={() => handleBookSlot(slot.id)}
                      disabled={bookingLoading}
                      className="book-button"
                    >
                      {bookingLoading ? 'Booking...' : 'Book Slot'}
                    </button>
                  </div>
                ))}
            </div>
            {slots.filter(slot => !slot.isBooked).length === 0 && (
              <div className="no-slots">
                <p>No available slots for the next 7 days.</p>
              </div>
            )}
          </div>
        )}

        {activeTab === 'bookings' && (
          <div className="bookings-container">
            <h2>My Bookings</h2>
            <div className="bookings-list">
              {myBookings.map(booking => (
                <div key={booking.id} className="booking-card">
                  <div className="booking-time">
                    <strong>{formatDateTime(booking.slot.startAt)}</strong>
                  </div>
                  <div className="booking-duration">
                    {formatTime(booking.slot.startAt)} - {formatTime(booking.slot.endAt)}
                  </div>
                  <div className="booking-date">
                    Booked on: {new Date(booking.createdAt).toLocaleDateString()}
                  </div>
                </div>
              ))}
            </div>
            {myBookings.length === 0 && (
              <div className="no-bookings">
                <p>You haven't booked any appointments yet.</p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default PatientDashboard;
