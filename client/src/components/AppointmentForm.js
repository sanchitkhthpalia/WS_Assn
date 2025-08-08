import React, { useState } from 'react';

const AppointmentForm = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    date: '',
    time: ''
  });

  const handleChange = (e) => {
    setFormData({...formData, [e.target.name]: e.target.value});
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      // First create patient
      const patientRes = await fetch('http://localhost:5000/api/patients', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: formData.name,
          email: formData.email,
          phone: formData.phone
        })
      });

      const patientData = await patientRes.json();
      const patientId = patientData.id;

      // Then book appointment
      const appointmentRes = await fetch('http://localhost:5000/api/appointments', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          date: formData.date,
          time: formData.time,
          patientId
        })
      });

      const appointmentData = await appointmentRes.json();
      alert('Appointment booked successfully!');
    } catch (error) {
      console.error('Error booking appointment:', error);
      alert('Failed to book appointment');
    }
  };

  return (
    <form onSubmit={handleSubmit} style={{ maxWidth: '400px', margin: 'auto' }}>
      <h2>Book Appointment</h2>
      <input type="text" name="name" placeholder="Full Name" value={formData.name} onChange={handleChange} required /><br />
      <input type="email" name="email" placeholder="Email" value={formData.email} onChange={handleChange} required /><br />
      <input type="text" name="phone" placeholder="Phone" value={formData.phone} onChange={handleChange} required /><br />
      <input type="date" name="date" value={formData.date} onChange={handleChange} required /><br />
      <input type="time" name="time" value={formData.time} onChange={handleChange} required /><br />
      <button type="submit">Book Appointment</button>
    </form>
  );
};

export default AppointmentForm;
