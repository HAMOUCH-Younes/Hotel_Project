import React, { useState, useEffect } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import Layout from '../../Layout/Layout';
import axios from 'axios';

const Bookings = () => {
  const [bookings, setBookings] = useState([]);
  const [selected, setSelected] = useState(null);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [timers, setTimers] = useState({});

  useEffect(() => {
    const fetchBookings = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await axios.get('http://127.0.0.1:8000/api/admin/bookings', {
          headers: {
            'Authorization': `Bearer ${token}`,
          },
        });
        setBookings(response.data.data || []);
      } catch (err) {
        setError('Failed to load bookings. Please try again.');
        console.error('Error fetching bookings:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchBookings();
  }, []);

  const toggleStatus = async (id) => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.put(`http://127.0.0.1:8000/api/bookings/${id}/toggle-status`, {}, {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });
      const updatedBooking = response.data.data;
      setBookings(bookings.map(b => b.id === id ? updatedBooking : b));

      if (updatedBooking.status === 'cancelled') {
        setTimers(prev => ({
          ...prev,
          [id]: 30, // Start 30-second timer
        }));
      } else {
        setTimers(prev => {
          const newTimers = { ...prev };
          delete newTimers[id];
          return newTimers;
        });
      }
    } catch (err) {
      setError('Failed to update booking status.');
      console.error('Error toggling status:', err);
    }
  };

  useEffect(() => {
    const timerIds = Object.keys(timers).map(id => {
      if (timers[id] > 0) {
        const timer = setInterval(() => {
          setTimers(prev => {
            const newTimers = { ...prev, [id]: prev[id] - 1 };
            if (newTimers[id] === 0) {
              const deleteBooking = async () => {
                try {
                  const token = localStorage.getItem('token');
                  await axios.delete(`http://127.0.0.1:8000/api/bookings/${id}`, {
                    headers: {
                      'Authorization': `Bearer ${token}`,
                    },
                  });
                  setBookings(prevBookings => prevBookings.filter(b => b.id !== parseInt(id)));
                } catch (err) {
                  if (err.response?.status === 404) {
                    // Booking already deleted or not found, remove from UI anyway
                    setBookings(prevBookings => prevBookings.filter(b => b.id !== parseInt(id)));
                  } else {
                    setError('Failed to delete booking after timer expired.');
                    console.error('Error deleting booking:', err);
                  }
                }
              };
              deleteBooking();
              clearInterval(timer);
              const updatedTimers = { ...prev };
              delete updatedTimers[id];
              return updatedTimers;
            }
            return newTimers;
          });
        }, 1000);
        return timer;
      }
      return null;
    }).filter(timer => timer !== null);

    return () => timerIds.forEach(timer => clearInterval(timer));
  }, [timers]);

  const startEdit = (booking) => {
    setEditing(booking.id);
    setForm({ ...booking });
  };

  const saveEdit = async () => {
    try {
      const token = localStorage.getItem('token');
      await axios.put(`http://127.0.0.1:8000/api/admin/bookings/${editing}`, form, {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });
      setBookings(bookings.map(b => b.id === editing ? form : b));
      setEditing(null);
    } catch (err) {
      setError('Failed to save booking changes.');
      console.error('Error saving edit:', err);
    }
  };

  if (loading) return <div className="text-center mt-5">Loading...</div>;
  if (error) return <div className="alert alert-danger mt-5">{error}</div>;

  return (
    <Layout>
      <div className="container mt-5">
        <div className="bg-white shadow-sm px-4 py-3 border" style={{ borderTopLeftRadius: '15px', borderTopRightRadius: '15px' }}>

          <h5 className="mb-0 fw-bold">Booking</h5>
        </div>

        <div className="table-responsive">
          <table className="table align-middle table-hover shadow-sm rounded-bottom">
            <thead className="bg-light">
              <tr>
                <th>Author</th>
                <th>Room</th>
                <th>Total Price</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {bookings.map((booking) => (
                <tr key={booking.id} onClick={() => setSelected(booking)} style={{ cursor: 'pointer' }}>
                  <td className="d-flex align-items-center gap-3">
                    <img
                      src={booking.user?.avatar || 'https://i.pravatar.cc/40?img=1'}
                      alt="Avatar"
                      className="rounded-circle"
                      width="45"
                      height="45"
                    />
                    <div>
                      <h6 className="mb-0">{booking.user?.full_name || booking.user?.name || 'Unknown'}</h6>
                      <small className="text-muted">{booking.user?.email || 'No email'}</small>
                    </div>
                  </td>
                  <td>{booking.room?.name || booking.room || 'N/A'}</td>
                  <td>{booking.total_price ? `$${booking.total_price}` : 'N/A'}</td>
                  <td>
                    <div>
                      <button
                        className={`btn btn-sm ${
                          booking.status.toLowerCase() === 'pending' ? 'btn-warning' :
                          booking.status.toLowerCase() === 'confirmed' ? 'btn-success' :
                          booking.status.toLowerCase() === 'cancelled' ? 'btn-danger' : 'btn-secondary'
                        }`}
                        onClick={(e) => {
                          e.stopPropagation();
                          toggleStatus(booking.id);
                        }}
                      >
                        {booking.status.toUpperCase() || 'N/A'}
                      </button>
                      {booking.status.toLowerCase() === 'cancelled' && timers[booking.id] > 0 && (
                        <i className="text-muted ms-2">
                          Delete in {timers[booking.id]}s
                        </i>
                      )}
                    </div>
                  </td>
                  <td>
                    <button
                      className="btn btn-sm btn-outline-primary"
                      onClick={(e) => {
                        e.stopPropagation();
                        startEdit(booking);
                      }}
                    >
                      Edit
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {selected && !editing && (
          <div className="position-fixed top-0 start-0 w-100 h-100 d-flex align-items-center justify-content-center bg-dark bg-opacity-50">
            <div className="bg-white p-4 rounded shadow" style={{ maxWidth: '600px', width: '100%' }}>
              <h5 className="mb-3">Booking Details</h5>
              <div style={{ maxHeight: '70vh', overflowY: 'auto' }}>
                <div className="card mb-3">
                  <div className="card-header">Detail User</div>
                  <div className="card-body">
                    <p className="card-text"><strong>Name:</strong> {selected.user?.full_name || selected.user?.name || 'Unknown'}</p>
                    <p className="card-text"><strong>Email:</strong> {selected.user?.email || 'No email'}</p>
                    <p className="card-text"><strong>First Name:</strong> {selected.user?.user_detail?.first_name || 'N/A'}</p>
                    <p className="card-text"><strong>Middle Name:</strong> {selected.user?.user_detail?.middle_name || 'N/A'}</p>
                    <p className="card-text"><strong>Bio:</strong> {selected.user?.user_detail?.bio || 'N/A'}</p>
                    <p className="card-text"><strong>Date of Birth:</strong> {selected.user?.user_detail?.date_of_birth || 'N/A'}</p>
                    <p className="card-text"><strong>Sex:</strong> {selected.user?.user_detail?.sex || 'N/A'}</p>
                    <p className="card-text"><strong>Accessibility Needs:</strong> {selected.user?.user_detail?.accessibility_needs || 'N/A'}</p>
                    <p className="card-text"><strong>Phone Number:</strong> {selected.user?.user_detail?.phone_number || 'N/A'}</p>
                    <p className="card-text"><strong>Emergency Contact:</strong> {selected.user?.user_detail?.emergency_contact || 'N/A'}</p>
                    <p className="card-text"><strong>Address:</strong> {selected.user?.user_detail?.address || 'N/A'}</p>
                    <p className="card-text"><strong>CIN:</strong> {selected.user?.user_detail?.cin || 'N/A'}</p>
                  </div>
                </div>

                <div className="card mb-3">
                  <div className="card-header">Detail Booking</div>
                  <div className="card-body">
                    <div className="row">
                      <div className="col-md-6">
                        <p className="card-text"><strong>Check-in:</strong> {selected.check_in || 'N/A'}</p>
                      </div>
                      <div className="col-md-6">
                        <p className="card-text"><strong>Check-out:</strong> {selected.check_out || 'N/A'}</p>
                      </div>
                    </div>
                    <p className="card-text"><strong>Guests:</strong> {selected.guests || 'N/A'}</p>
                    <p className="card-text"><strong>Number of Nights:</strong> {selected.number_of_nights || 'N/A'}</p>
                    <p className="card-text"><strong>Total Price:</strong> {selected.total_price ? `$${selected.total_price}` : 'N/A'}</p>
                    <p className="card-text"><strong>Additional Notes:</strong> {selected.additional_notes || 'N/A'}</p>
                  </div>
                </div>

                <div className="card">
                  <div className="card-header">Payment</div>
                  <div className="card-body">
                    <p className="card-text"><strong>Payment Method:</strong> {selected.payment_method || 'N/A'}</p>
                  </div>
                </div>
              </div>

              <div className="d-flex justify-content-end gap-2 mt-3">
                <button className="btn btn-danger" onClick={() => alert('Booking cancelled')}>Cancel Booking</button>
                <button className="btn btn-secondary" onClick={() => setSelected(null)}>Close</button>
              </div>
            </div>
          </div>
        )}

        {editing && (
          <div className="position-fixed top-0 start-0 w-100 h-100 d-flex align-items-center justify-content-center bg-dark bg-opacity-50">
            <div className="bg-white p-4 rounded shadow" style={{ maxWidth: '600px', width: '100%' }}>
              <h5 className="mb-3">Edit Booking</h5>
              <div style={{ maxHeight: '70vh', overflowY: 'auto' }}>
                <div className="card mb-3">
                  <div className="card-header">Detail User</div>
                  <div className="card-body">
                    <div className="mb-2">
                      <label className="form-label">Name</label>
                      <input
                        className="form-control"
                        value={form.user?.full_name || form.user?.name || ''}
                        disabled
                      />
                    </div>
                    <div className="mb-2">
                      <label className="form-label">Email</label>
                      <input
                        className="form-control"
                        value={form.user?.email || ''}
                        disabled
                      />
                    </div>
                    <div className="mb-2">
                      <label className="form-label">Phone Number</label>
                      <input
                        className="form-control"
                        value={form.phone_number || form.user?.user_detail?.phone_number || ''}
                        disabled
                      />
                    </div>
                  </div>
                </div>

                <div className="card mb-3">
                  <div className="card-header">Detail Booking</div>
                  <div className="card-body">
                    <div className="row">
                      <div className="col-md-6 mb-2">
                        <label className="form-label">Check-in</label>
                        <input
                          type="date"
                          className="form-control"
                          value={form.check_in || ''}
                          onChange={(e) => setForm({ ...form, check_in: e.target.value })}
                        />
                      </div>
                      <div className="col-md-6 mb-2">
                        <label className="form-label">Check-out</label>
                        <input
                          type="date"
                          className="form-control"
                          value={form.check_out || ''}
                          onChange={(e) => setForm({ ...form, check_out: e.target.value })}
                        />
                      </div>
                    </div>
                    <div className="mb-2">
                      <label className="form-label">Guests</label>
                      <input
                        type="number"
                        className="form-control"
                        value={form.guests || ''}
                        onChange={(e) => setForm({ ...form, guests: parseInt(e.target.value) })}
                      />
                    </div>
                    <div className="mb-2">
                      <label className="form-label">Number of Nights</label>
                      <input
                        type="number"
                        className="form-control"
                        value={form.number_of_nights || ''}
                        onChange={(e) => setForm({ ...form, number_of_nights: parseInt(e.target.value) })}
                      />
                    </div>
                    <div className="mb-2">
                      <label className="form-label">Total Price</label>
                      <input
                        type="number"
                        className="form-control"
                        value={form.total_price || ''}
                        onChange={(e) => setForm({ ...form, total_price: parseFloat(e.target.value) })}
                      />
                    </div>
                    <div className="mb-2">
                      <label className="form-label">Additional Notes</label>
                      <textarea
                        className="form-control"
                        value={form.additional_notes || ''}
                        onChange={(e) => setForm({ ...form, additional_notes: e.target.value })}
                      />
                    </div>
                  </div>
                </div>

                <div className="card">
                  <div className="card-header">Payment</div>
                  <div className="card-body">
                    <div className="mb-2">
                      <label className="form-label">Payment Method</label>
                      <input
                        className="form-control"
                        value={form.payment_method || ''}
                        disabled
                      />
                    </div>
                  </div>
                </div>
              </div>

              <div className="d-flex justify-content-end gap-2 mt-3">
                <button className="btn btn-primary" onClick={saveEdit}>Save</button>
                <button className="btn btn-secondary" onClick={() => setEditing(null)}>Cancel</button>
              </div>
            </div>
          </div>
        )}
      </div>
    </Layout>
  );
};

export default Bookings;