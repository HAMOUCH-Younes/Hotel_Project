import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Layout from '../Layout/Layout';
import 'bootstrap/dist/css/bootstrap.min.css';
import '@fortawesome/fontawesome-free/css/all.min.css';
import fallbackImage from '../../assets/b.jpg';

function ListOffers() {
  const [offers, setOffers] = useState([]);
  const [hotels, setHotels] = useState([]); // New state for hotels
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selected, setSelected] = useState(null);
  const [editing, setEditing] = useState(null);
  const [adding, setAdding] = useState(false);
  const [form, setForm] = useState({
    title: '',
    description: '',
    discount_percentage: '',
    expires_at: '',
    image: '',
    hotel_id: '',
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = localStorage.getItem('token');
        setLoading(true);

        // Fetch hotels
        const hotelsResponse = await axios.get('http://127.0.0.1:8000/api/hotels', {
          headers: { 'Authorization': `Bearer ${token}` },
        });
        setHotels(hotelsResponse.data || []);

        // Fetch offers
        const offersResponse = await axios.get('http://127.0.0.1:8000/api/offers', {
          headers: { 'Authorization': `Bearer ${token}` },
        });
        setOffers(offersResponse.data || []);
      } catch (err) {
        setError('Failed to load data. Please try again.');
        console.error('Error fetching data:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const handleAddOffer = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.post('http://127.0.0.1:8000/api/offers', form, {
        headers: { 'Authorization': `Bearer ${token}` },
      });
      setOffers([...offers, response.data]);
      setAdding(false);
      resetForm();
    } catch (err) {
      setError('Failed to add offer.');
      console.error('Error adding offer:', err);
    }
  };

  const startEdit = (offer) => {
    setEditing(offer.id);
    setForm({
      ...offer,
      expires_at: offer.expires_at ? new Date(offer.expires_at).toISOString().split('T')[0] : '',
      hotel_id: offer.hotel_id || '',
    });
  };

  const saveEdit = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.put(`http://127.0.0.1:8000/api/offers/${editing}`, form, {
        headers: { 'Authorization': `Bearer ${token}` },
      });
      setOffers(offers.map((o) => (o.id === editing ? response.data : o)));
      setEditing(null);
    } catch (err) {
      setError('Failed to save offer changes.');
      console.error('Error saving edit:', err);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this offer?')) {
      try {
        const token = localStorage.getItem('token');
        await axios.delete(`http://127.0.0.1:8000/api/offers/${id}`, {
          headers: { 'Authorization': `Bearer ${token}` },
        });
        setOffers(offers.filter((o) => o.id !== id));
      } catch (err) {
        setError('Failed to delete offer.');
        console.error('Error deleting offer:', err);
      }
    }
  };

  const resetForm = () => {
    setForm({
      title: '',
      description: '',
      discount_percentage: '',
      expires_at: '',
      image: '',
      hotel_id: '',
    });
  };

  if (loading) return <div className="text-center mt-5">Loading...</div>;
  if (error) return <div className="alert alert-danger mt-5">{error}</div>;

  return (
    <Layout>
      <div className="container mt-5">
        <div className="bg-white shadow-sm px-4 py-3 border d-flex justify-content-between align-items-center" style={{ borderTopLeftRadius: '15px', borderTopRightRadius: '15px' }}>
          <h5 className="mb-0 fw-bold">Offers List</h5>
          {/* Removed the Add Offer button */}
        </div>

        <div className="table-responsive">
          <table className="table align-middle table-hover shadow-sm rounded-bottom">
            <thead className="bg-light">
              <tr>
                <th>Title</th>
                <th>Discount (%)</th>
                <th>Expires At</th>
                <th>Hotel</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {offers.length === 0 && !loading && (
                <tr>
                  <td colSpan="5" className="text-center">No offers available.</td>
                </tr>
              )}
              {offers.map((offer) => (
                <tr key={offer.id} onClick={() => setSelected(offer)} style={{ cursor: 'pointer' }}>
                  <td>{offer.title || 'N/A'}</td>
                  <td>{offer.discount_percentage || 'N/A'}%</td>
                  <td>{offer.expires_at ? new Date(offer.expires_at).toLocaleDateString() : 'N/A'}</td>
                  <td>{offer.hotel?.name || 'Unknown Hotel'}</td>
                  <td>
                    <button
                      className="btn btn-sm btn-outline-primary me-2"
                      onClick={(e) => {
                        e.stopPropagation();
                        startEdit(offer);
                      }}
                    >
                      Edit
                    </button>
                    <button
                      className="btn btn-sm btn-outline-danger"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDelete(offer.id);
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
              <h5 className="mb-3">Offer Details</h5>
              <div style={{ maxHeight: '70vh', overflowY: 'auto' }}>
                <div className="card mb-3">
                  <div className="card-header">Offer Details</div>
                  <div className="card-body">
                    <p className="card-text"><strong>Title:</strong> {selected.title || 'N/A'}</p>
                    <p className="card-text"><strong>Description:</strong> {selected.description || 'N/A'}</p>
                    <p className="card-text"><strong>Discount:</strong> {selected.discount_percentage || 'N/A'}%</p>
                    <p className="card-text"><strong>Expires At:</strong> {selected.expires_at ? new Date(selected.expires_at).toLocaleDateString() : 'N/A'}</p>
                  </div>
                </div>

                <div className="card mb-3">
                  <div className="card-header">Image</div>
                  <div className="card-body">
                    {selected.image ? (
                      <img
                        src={selected.image}
                        alt="Offer Image"
                        style={{ maxWidth: '100px', maxHeight: '100px', objectFit: 'cover' }}
                        onError={(e) => { e.target.src = fallbackImage; }}
                      />
                    ) : (
                      <p className="card-text">No image available.</p>
                    )}
                  </div>
                </div>

                <div className="card">
                  <div className="card-header">Hotel</div>
                  <div className="card-body">
                    <p className="card-text"><strong>Name:</strong> {selected.hotel?.name || 'Unknown Hotel'}</p>
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
              <h5 className="mb-3">{editing ? 'Edit Offer' : 'Add Offer'}</h5>
              <div style={{ maxHeight: '70vh', overflowY: 'auto' }}>
                <div className="card mb-3">
                  <div className="card-header">Offer Details</div>
                  <div className="card-body">
                    <div className="mb-2">
                      <label className="form-label">Title</label>
                      <input
                        className="form-control"
                        value={form.title || ''}
                        onChange={(e) => setForm({ ...form, title: e.target.value })}
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
                      <label className="form-label">Discount (%)</label>
                      <input
                        type="number"
                        className="form-control"
                        value={form.discount_percentage || ''}
                        onChange={(e) => setForm({ ...form, discount_percentage: parseFloat(e.target.value) })}
                        min="0"
                        max="100"
                      />
                    </div>
                    <div className="mb-2">
                      <label className="form-label">Expires At</label>
                      <input
                        type="date"
                        className="form-control"
                        value={form.expires_at || ''}
                        onChange={(e) => setForm({ ...form, expires_at: e.target.value })}
                      />
                    </div>
                    <div className="mb-2">
                      <label className="form-label">Hotel</label>
                      <select
                        className="form-control"
                        value={form.hotel_id || ''}
                        onChange={(e) => setForm({ ...form, hotel_id: parseInt(e.target.value) })}
                      >
                        <option value="">Select a hotel</option>
                        {hotels.map((hotel) => (
                          <option key={hotel.id} value={hotel.id}>
                            {hotel.name}
                          </option>
                        ))}
                      </select>
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
                  onClick={editing ? saveEdit : handleAddOffer}
                  disabled={!form.hotel_id} // Disable if no hotel is selected
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
}

export default ListOffers;