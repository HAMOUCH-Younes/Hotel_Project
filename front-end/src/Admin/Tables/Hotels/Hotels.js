import React, { useState, useEffect } from 'react';
import Layout from '../../Layout/Layout';
import axios from 'axios';
import 'bootstrap/dist/css/bootstrap.min.css';

const Hotels = () => {
  const [hotels, setHotels] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selected, setSelected] = useState(null);
  const [editing, setEditing] = useState(null);
  const [adding, setAdding] = useState(false);
  const [form, setForm] = useState({
    name: '',
    description: '',
    address: '',
    city: '',
    country: '',
    rating: '',
    is_best_seller: false,
    image: '', // Changed from image_urls (array) to image (string)
  });

  useEffect(() => {
    const fetchHotels = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await axios.get('http://localhost:8000/api/hotels', {
          headers: { 'Authorization': `Bearer ${token}` },
        });
        setHotels(response.data || []);
        setLoading(false);
      } catch (err) {
        setError('Failed to load hotels. Please try again.');
        console.error('Error fetching hotels:', err);
        setLoading(false);
      }
    };
    fetchHotels();
  }, []);

  const handleAddHotel = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.post('http://localhost:8000/api/hotels', form, {
        headers: { 'Authorization': `Bearer ${token}` },
      });
      setHotels([...hotels, response.data]);
      setAdding(false);
      resetForm();
    } catch (err) {
      setError('Failed to add hotel.');
      console.error('Error adding hotel:', err);
    }
  };

  const startEdit = (hotel) => {
    setEditing(hotel.id);
    setForm({
      ...hotel,
      is_best_seller: !!hotel.is_best_seller,
      image: hotel.image || '', // Ensure image is a string
    });
  };

  const saveEdit = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.put(`http://localhost:8000/api/hotels/${editing}`, form, {
        headers: { 'Authorization': `Bearer ${token}` },
      });
      setHotels(hotels.map(h => (h.id === editing ? response.data : h)));
      setEditing(null);
    } catch (err) {
      setError('Failed to save hotel changes.');
      console.error('Error saving edit:', err);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this hotel?')) {
      try {
        const token = localStorage.getItem('token');
        await axios.delete(`http://localhost:8000/api/hotels/${id}`, {
          headers: { 'Authorization': `Bearer ${token}` },
        });
        setHotels(hotels.filter(h => h.id !== id));
      } catch (err) {
        setError('Failed to delete hotel.');
        console.error('Error deleting hotel:', err);
      }
    }
  };

  const resetForm = () => {
    setForm({
      name: '',
      description: '',
      address: '',
      city: '',
      country: '',
      rating: '',
      is_best_seller: false,
      image: '', // Changed from image_urls to image
    });
  };

  if (loading) return <div className="text-center mt-5">Loading...</div>;
  if (error) return <div className="alert alert-danger mt-5">{error}</div>;

  return (
    <Layout>
      <div className="container mt-5" >
        <div className="bg-white shadow-sm  px-4 py-3 border d-flex justify-content-between align-items-center" style={{ borderTopLeftRadius: '15px', borderTopRightRadius: '15px' }}>
          <h5 className="mb-0 fw-bold">Hotels List</h5>
          <button className="btn btn-primary" onClick={() => setAdding(true)}>
            Add Hotel
          </button>
        </div>

        <div className="table-responsive">
          <table className="table align-middle table-hover shadow-sm rounded-bottom">
            <thead className="bg-light">
              <tr>
                <th>Name</th>
                <th>Location</th>
                <th>Rating</th>
                <th>Best Seller</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {hotels.map((hotel) => (
                <tr key={hotel.id} onClick={() => setSelected(hotel)} style={{ cursor: 'pointer' }}>
                  <td>{hotel.name || 'N/A'}</td>
                  <td>{hotel.city}, {hotel.country}</td>
                  <td>{hotel.rating || 'N/A'}</td>
                  <td>{hotel.is_best_seller ? 'Yes' : 'No'}</td>
                  <td>
                    <button
                      className="btn btn-sm btn-outline-primary me-2"
                      onClick={(e) => {
                        e.stopPropagation();
                        startEdit(hotel);
                      }}
                    >
                      Edit
                    </button>
                    <button
                      className="btn btn-sm btn-outline-danger"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDelete(hotel.id);
                      }}
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {selected && !editing && !adding && (
          <div className="position-fixed top-0 start-0 w-100 h-100 d-flex align-items-center justify-content-center bg-dark bg-opacity-50">
            <div className="bg-white p-4 rounded shadow" style={{ maxWidth: '600px', width: '100%' }}>
              <h5 className="mb-3">Hotel Details</h5>
              <div style={{ maxHeight: '70vh', overflowY: 'auto' }}>
                <div className="card mb-3">
                  <div className="card-header">Hotel Details</div>
                  <div className="card-body">
                    <p className="card-text"><strong>Name:</strong> {selected.name || 'N/A'}</p>
                    <p className="card-text"><strong>Description:</strong> {selected.description || 'N/A'}</p>
                    <p className="card-text"><strong>Address:</strong> {selected.address}, {selected.city}, {selected.country}</p>
                    <p className="card-text"><strong>Rating:</strong> {selected.rating || 'N/A'}</p>
                    <p className="card-text"><strong>Best Seller:</strong> {selected.is_best_seller ? 'Yes' : 'No'}</p>
                  </div>
                </div>

                <div className="card mb-3">
                  <div className="card-header">Image</div>
                  <div className="card-body">
                    {selected.image ? (
                      <img
                        src={selected.image}
                        alt="Hotel Image"
                        style={{ maxWidth: '100px', maxHeight: '100px', objectFit: 'cover' }}
                      />
                    ) : (
                      <p className="card-text">No image available.</p>
                    )}
                  </div>
                </div>

                <div className="card">
                  <div className="card-header">Rooms</div>
                  <div className="card-body">
                    {selected.rooms && selected.rooms.length > 0 ? (
                      <ul>
                        {selected.rooms.map((room) => (
                          <li key={room.id}>{room.name} - ${room.price_per_night}/night</li>
                        ))}
                      </ul>
                    ) : (
                      <p className="card-text">No rooms available.</p>
                    )}
                  </div>
                </div>
              </div>

              <div className="d-flex justify-content-end gap-2 mt-3">
                <button className="btn btn-secondary" onClick={() => setSelected(null)}>Close</button>
              </div>
            </div>
          </div>
        )}

        {(editing || adding) && (
          <div className="position-fixed top-0 start-0 w-100 h-100 d-flex align-items-center justify-content-center bg-dark bg-opacity-50">
            <div className="bg-white p-4 rounded shadow" style={{ maxWidth: '600px', width: '100%' }}>
              <h5 className="mb-3">{editing ? 'Edit Hotel' : 'Add Hotel'}</h5>
              <div style={{ maxHeight: '70vh', overflowY: 'auto' }}>
                <div className="card mb-3">
                  <div className="card-header">Hotel Details</div>
                  <div className="card-body">
                    <div className="mb-2">
                      <label className="form-label">Name</label>
                      <input
                        className="form-control"
                        value={form.name || ''}
                        onChange={(e) => setForm({ ...form, name: e.target.value })}
                      />
                    </div>
                    <div className="mb-2">
                      <label className="form-label">Description</label>
                      <textarea
                        className="form-control"
                        value={form.description || ''}
                        onChange={(e) => setForm({ ...form, description: e.target.value })}
                      />
                    </div>
                    <div className="mb-2">
                      <label className="form-label">Address</label>
                      <input
                        className="form-control"
                        value={form.address || ''}
                        onChange={(e) => setForm({ ...form, address: e.target.value })}
                      />
                    </div>
                    <div className="mb-2">
                      <label className="form-label">City</label>
                      <input
                        className="form-control"
                        value={form.city || ''}
                        onChange={(e) => setForm({ ...form, city: e.target.value })}
                      />
                    </div>
                    <div className="mb-2">
                      <label className="form-label">Country</label>
                      <input
                        className="form-control"
                        value={form.country || ''}
                        onChange={(e) => setForm({ ...form, country: e.target.value })}
                      />
                    </div>
                    <div className="mb-2">
                      <label className="form-label">Rating (0-5)</label>
                      <input
                        type="number"
                        className="form-control"
                        value={form.rating || ''}
                        onChange={(e) => setForm({ ...form, rating: parseFloat(e.target.value) })}
                        min="0"
                        max="5"
                        step="0.1"
                      />
                    </div>
                    <div className="form-check mb-2">
                      <input
                        type="checkbox"
                        className="form-check-input"
                        checked={form.is_best_seller}
                        onChange={(e) => setForm({ ...form, is_best_seller: e.target.checked })}
                      />
                      <label className="form-check-label">Best Seller</label>
                    </div>
                  </div>
                </div>

                <div className="card mb-3">
                  <div className="card-header">Image</div>
                  <div className="card-body">
                    <div className="mb-2">
                      <label className="form-label">Image URL</label>
                      <input
                        type="url"
                        className="form-control"
                        value={form.image || ''}
                        onChange={(e) => setForm({ ...form, image: e.target.value })}
                        placeholder="Enter image URL"
                      />
                    </div>
                  </div>
                </div>
              </div>

              <div className="d-flex justify-content-end gap-2 mt-3">
                <button
                  className="btn btn-primary"
                  onClick={editing ? saveEdit : handleAddHotel}
                >
                  {editing ? 'Save' : 'Add'}
                </button>
                <button
                  className="btn btn-secondary"
                  onClick={() => {
                    setEditing(null);
                    setAdding(false);
                    resetForm();
                  }}
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </Layout>
  );
};

export default Hotels;