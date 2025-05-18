import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import Layout from '../../Layout/Layout';

const EditBooking = () => {
  const { id } = useParams();
  const [formData, setFormData] = useState({});
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchBooking = async () => {
      try {
        const response = await fetch(`http://localhost:8000/api/bookings/${id}`, {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`,
            'Accept': 'application/json',
          },
        });
        if (!response.ok) throw new Error('Failed to fetch booking');
        const data = await response.json();
        setFormData(data.data);
      } catch (error) {
        console.error('Error fetching booking:', error);
        setError('Failed to load booking');
      }
    };
    fetchBooking();
  }, [id]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch(`http://localhost:8000/api/bookings/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
          'Accept': 'application/json',
        },
        body: JSON.stringify(formData),
      });
      if (!response.ok) throw new Error('Failed to update booking');
      navigate('/admin/bookings');
    } catch (error) {
      console.error('Error updating booking:', error);
      setError('Failed to update booking');
    }
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  if (error) return <div className="text-red-500 text-center py-10">{error}</div>;
  if (!formData.id) return <div className="text-center py-10">Loading...</div>;

  return (
    <Layout>
      <div className="container mx-auto p-6">
        <h2 className="text-2xl font-bold mb-6">Edit Booking</h2>
        {error && <div className="text-red-500 mb-4">{error}</div>}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block">Room ID</label>
            <input
              type="number"
              name="room_id"
              value={formData.room_id || ''}
              onChange={handleChange}
              className="w-full border p-2 rounded"
            />
          </div>
          <div>
            <label className="block">Check-In</label>
            <input
              type="date"
              name="check_in"
              value={formData.check_in || ''}
              onChange={handleChange}
              className="w-full border p-2 rounded"
            />
          </div>
          <div>
            <label className="block">Check-Out</label>
            <input
              type="date"
              name="check_out"
              value={formData.check_out || ''}
              onChange={handleChange}
              className="w-full border p-2 rounded"
            />
          </div>
          <div>
            <label className="block">Phone Number</label>
            <input
              type="text"
              name="phone_number"
              value={formData.phone_number || ''}
              onChange={handleChange}
              className="w-full border p-2 rounded"
            />
          </div>
          <div>
            <label className="block">Guests</label>
            <input
              type="number"
              name="guests"
              value={formData.guests || ''}
              onChange={handleChange}
              className="w-full border p-2 rounded"
            />
          </div>
          <div>
            <label className="block">Full Name</label>
            <input
              type="text"
              name="full_name"
              value={formData.full_name || ''}
              onChange={handleChange}
              className="w-full border p-2 rounded"
            />
          </div>
          <div>
            <label className="block">Email</label>
            <input
              type="email"
              name="email"
              value={formData.email || ''}
              onChange={handleChange}
              className="w-full border p-2 rounded"
            />
          </div>
          <div>
            <label className="block">Payment Method</label>
            <select
              name="payment_method"
              value={formData.payment_method || ''}
              onChange={handleChange}
              className="w-full border p-2 rounded"
            >
              <option value="online">Online</option>
              <option value="on_arrival">On Arrival</option>
            </select>
          </div>
          <div>
            <label className="block">Status</label>
            <select
              name="status"
              value={formData.status || ''}
              onChange={handleChange}
              className="w-full border p-2 rounded"
            >
              <option value="pending">Pending</option>
              <option value="confirmed">Confirmed</option>
              <option value="cancelled">Cancelled</option>
            </select>
          </div>
          <div>
            <label className="block">Additional Notes</label>
            <textarea
              name="additional_notes"
              value={formData.additional_notes || ''}
              onChange={handleChange}
              className="w-full border p-2 rounded"
            ></textarea>
          </div>
          <button
            type="submit"
            className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
          >
            Update Booking
          </button>
        </form>
      </div>
    </Layout>
  );
};

export default EditBooking;