import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Layout from '../Layout/Layout';
import 'bootstrap/dist/css/bootstrap.min.css';
import '@fortawesome/fontawesome-free/css/all.min.css';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';


function AddOffer() {
  const [hotels, setHotels] = useState([]);
  const [form, setForm] = useState({
    title: '',
    description: '',
    discount_percentage: '',
    expires_at: null,
    image: '',
    hotel_id: '',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

  useEffect(() => {
    const fetchHotels = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await axios.get('http://127.0.0.1:8000/api/hotels', {
          headers: { 'Authorization': `Bearer ${token}` },
        });
        setHotels(response.data || []);
      } catch (err) {
        setError('Failed to load hotels. Please try again.');
        console.error('Error fetching hotels:', err);
      }
    };
    fetchHotels();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess(null);

    try {
      const token = localStorage.getItem('token');
      const response = await axios.post('http://127.0.0.1:8000/api/offers', {
        ...form,
        expires_at: form.expires_at ? form.expires_at.toISOString().split('T')[0] : null,
      }, {
        headers: { 'Authorization': `Bearer ${token}` },
      });
      setSuccess('Offer added successfully!');
      resetForm();
    } catch (err) {
      setError('Failed to add offer. Please try again.');
      console.error('Error adding offer:', err);
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setForm({
      title: '',
      description: '',
      discount_percentage: '',
      expires_at: null,
      image: '',
      hotel_id: '',
    });
  };

  return (
    <Layout>
      <div className="container mt-5" style={{ fontFamily: "'Poppins', sans-serif" }}>
        <div className="row justify-content-center">
          <div className="col-lg-8">
            <div className="bg-white shadow-lg rounded-3 border-0 p-4" style={{ animation: 'fadeIn 0.5s ease-in-out' }}>
              <div
                className="text-center p-3 mb-4 rounded-top"
                style={{
                  background: 'linear-gradient(135deg, #4facfe, #00f2fe)',
                  color: '#ffffff',
                  borderRadius: '15px 15px 0 0',
                }}
              >
                <h4 className="mb-0 fw-bold">
                  <i className="fas fa-plus-circle me-2"></i>Add New Offer
                </h4>
              </div>

              {error && <div className="alert alert-danger mb-4">{error}</div>}
              {success && <div className="alert alert-success mb-4">{success}</div>}

              <form onSubmit={handleSubmit}>
                <div className="card mb-4 border-0 shadow-sm">
                  <div className="card-header bg-light py-3">
                    <h6 className="mb-0 fw-semibold text-primary">Offer Details</h6>
                  </div>
                  <div className="card-body">
                    <div className="mb-3">
                      <label className="form-label fw-medium text-muted">Title</label>
                      <input
                        type="text"
                        className="form-control border-primary"
                        value={form.title || ''}
                        onChange={(e) => setForm({ ...form, title: e.target.value })}
                        placeholder="Enter offer title"
                        required
                        style={{ transition: 'border-color 0.3s' }}
                      />
                    </div>
                    <div className="mb-3">
                      <label className="form-label fw-medium text-muted">Description</label>
                      <textarea
                        className="form-control border-primary"
                        value={form.description || ''}
                        onChange={(e) => setForm({ ...form, description: e.target.value })}
                        placeholder="Enter offer description"
                        rows="4"
                        required
                        style={{ transition: 'border-color 0.3s' }}
                      />
                    </div>
                    <div className="mb-3">
                      <label className="form-label fw-medium text-muted">Discount (%)</label>
                      <input
                        type="number"
                        className="form-control border-primary"
                        value={form.discount_percentage || ''}
                        onChange={(e) => setForm({ ...form, discount_percentage: parseFloat(e.target.value) })}
                        placeholder="Enter discount percentage"
                        min="0"
                        max="100"
                        step="0.1"
                        required
                        style={{ transition: 'border-color 0.3s' }}
                      />
                    </div>
                    <div className="mb-3">
                      <label className="form-label fw-medium text-muted">Expires At</label>
                      <DatePicker
                        selected={form.expires_at}
                        onChange={(date) => setForm({ ...form, expires_at: date })}
                        className="form-control border-primary"
                        placeholderText="Select expiration date"
                        dateFormat="yyyy-MM-dd"
                        required
                        style={{ transition: 'border-color 0.3s' }}
                      />
                    </div>
                    <div className="mb-3">
                      <label className="form-label fw-medium text-muted">Hotel</label>
                      <select
                        className="form-control border-primary"
                        value={form.hotel_id || ''}
                        onChange={(e) => setForm({ ...form, hotel_id: parseInt(e.target.value) })}
                        required
                        style={{ transition: 'border-color 0.3s' }}
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

                <div className="card mb-4 border-0 shadow-sm">
                  <div className="card-header bg-light py-3">
                    <h6 className="mb-0 fw-semibold text-primary">Image</h6>
                  </div>
                  <div className="card-body">
                    <div className="mb-3">
                      <label className="form-label fw-medium text-muted">Image URL</label>
                      <input
                        type="url"
                        className="form-control border-primary"
                        value={form.image || ''}
                        onChange={(e) => setForm({ ...form, image: e.target.value })}
                        placeholder="Enter image URL"
                        required
                        style={{ transition: 'border-color 0.3s' }}
                      />
                    </div>
                  </div>
                </div>

                <div className="d-flex justify-content-end gap-3">
                  <button
                    type="submit"
                    className="btn btn-primary px-4 py-2"
                    disabled={loading || !form.hotel_id}
                    style={{ background: 'linear-gradient(135deg, #4facfe, #00f2fe)', border: 'none', transition: 'transform 0.2s' }}
                    onMouseOver={(e) => (e.target.style.transform = 'scale(1.05)')}
                    onMouseOut={(e) => (e.target.style.transform = 'scale(1)')}
                  >
                    {loading ? (
                      <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                    ) : (
                      <i className="fas fa-save me-2"></i>
                    )}
                    Submit
                  </button>
                  <button
                    type="button"
                    className="btn btn-secondary px-4 py-2"
                    onClick={resetForm}
                    disabled={loading}
                    style={{ transition: 'transform 0.2s' }}
                    onMouseOver={(e) => (e.target.style.transform = 'scale(1.05)')}
                    onMouseOut={(e) => (e.target.style.transform = 'scale(1)')}
                  >
                    <i className="fas fa-times me-2"></i>Clear
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}

export default AddOffer;