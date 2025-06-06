import React, { useState, useEffect } from 'react';
import axios from 'axios';
import 'bootstrap/dist/css/bootstrap.min.css';
import { FaTimes } from 'react-icons/fa';

function ContactForm() {
  const [formData, setFormData] = useState({
    phone_country_code: 'France +33',
    phone_number: '',
    sms_updates: false,
    emergency_contact_name: '',
    emergency_country_code: 'France +33',
    emergency_number: '',
    email: '',
    country: 'France',
    address: '',
    address_details: '',
    city: '',
    state: '',
    postal_code: '',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

  // Fetch initial user data (excluding contacts)
  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const user = JSON.parse(localStorage.getItem('user'));
        if (!user) {
          setError('User not logged in. Please log in to edit your contact information.');
          return;
        }

        // Fetch user data including user_detail
        const userResponse = await axios.get('http://127.0.0.1:8000/api/user', {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`,
          },
        });

        const userData = userResponse.data;
        console.log('Fetched user data:', userData);

        // Pre-fill form with name, email, and phone_number from user data, leaving others empty
        setFormData({
          phone_country_code: 'France +33', // Default, not fetched
          phone_number: userData.user_detail?.phone_number || '',
          sms_updates: false, // Default, not fetched
          emergency_contact_name: '', // Default, not fetched
          emergency_country_code: 'France +33', // Default, not fetched
          emergency_number: '', // Default, not fetched
          email: userData.email || '',
          country: 'France', // Default, not fetched
          address: '', // Default, not fetched
          address_details: '', // Default, not fetched
          city: '', // Default, not fetched
          state: '', // Default, not fetched
          postal_code: '', // Default, not fetched
        });
      } catch (err) {
        setError(err.response?.data?.message || 'Failed to load user data. Please try again.');
        console.error('Error fetching data:', err);
      }
    };
    fetchUserData();
  }, []);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);
    setLoading(true);

    const payload = {
      phone_country_code: formData.phone_country_code,
      phone_number: formData.phone_number,
      sms_updates: formData.sms_updates,
      emergency_contact_name: formData.emergency_contact_name,
      emergency_country_code: formData.emergency_country_code,
      emergency_number: formData.emergency_number,
      email: formData.email,
      country: formData.country,
      address: formData.address,
      address_details: formData.address_details,
      city: formData.city,
      state: formData.state,
      postal_code: formData.postal_code,
    };

    try {
      const response = await axios.post('http://127.0.0.1:8000/api/contacts', payload, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
        },
      });
      setSuccess('Contact information saved successfully!');
    } catch (err) {
      setError(err.response?.data?.message || 'An error occurred while saving your contact information. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container d-flex justify-content-center mt-5 mb-5">
      <div
        className="w-100"
        style={{
          maxWidth: '600px',
          fontFamily: '"Segoe UI", "Helvetica Neue", system-ui, sans-serif',
          color: '#1a1a1a',
        }}
      >
        <button
          className="btn btn-link text-danger position-absolute top-0 start-0 mt-2 ms-4"
          style={{ fontSize: '1.5rem', padding: 0 }}
          onClick={() => window.history.back()}
        >
          <FaTimes />
        </button>
        <h5 className="fw-bold mb-1">Contact</h5>
        <p className="text-muted mb-4" style={{ fontSize: '15px' }}>
          Partagez ces informations pour recevoir des mises à jour de voyages et des alertes liées à l’activité de votre compte.
        </p>

        {success && <div className="alert alert-success">{success}</div>}
        {error && <div className="alert alert-danger">{error}</div>}

        <form onSubmit={handleSubmit}>
          {/* Numéro téléphone */}
          <label className="form-label">Numéro de téléphone portable</label>
          <div className="d-flex mb-3 gap-2">
            <select
              className="form-select"
              style={{ maxWidth: '150px' }}
              name="phone_country_code"
              value={formData.phone_country_code}
              onChange={handleChange}
            >
              <option>France +33</option>
              <option>Maroc +212</option>
              <option>Belgique +32</option>
            </select>
            <input
              type="text"
              className="form-control"
              name="phone_number"
              value={formData.phone_number}
              onChange={handleChange}
              placeholder="Numéro de téléphone"
              required
            />
          </div>

          <div className="form-check mb-4">
            <input
              type="checkbox"
              className="form-check-input"
              id="smsUpdates"
              name="sms_updates"
              checked={formData.sms_updates}
              onChange={handleChange}
            />
            <label className="form-check-label" htmlFor="smsUpdates">
              M’envoyer les mises à jour par SMS
            </label>
            <div className="form-text">Des frais d’envoi de SMS et de données peuvent s’appliquer.</div>
          </div>

          {/* Contact d'urgence */}
          <label className="form-label">Contact en cas d’urgence</label>
          <input
            type="text"
            className="form-control mb-2"
            name="emergency_contact_name"
            value={formData.emergency_contact_name}
            onChange={handleChange}
            placeholder="Personne à contacter"
          />
          <div className="d-flex mb-4 gap-2">
            <select
              className="form-select"
              style={{ maxWidth: '150px' }}
              name="emergency_country_code"
              value={formData.emergency_country_code}
              onChange={handleChange}
            >
              <option>France +33</option>
              <option>Maroc +212</option>
              <option>Belgique +32</option>
            </select>
            <input
              type="text"
              className="form-control"
              name="emergency_number"
              value={formData.emergency_number}
              onChange={handleChange}
              placeholder="Numéro de téléphone"
            />
          </div>

          {/* Email */}
          <div className="mb-4">
            <label className="form-label">E-mail <span className="text-danger">*</span></label>
            <input
              type="email"
              className="form-control"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="Entrez votre e-mail"
              required
            />
          </div>

          {/* Adresse */}
          <label className="form-label">Adresse</label>
          <div className="mb-3">
            <select
              className="form-select"
              name="country"
              value={formData.country}
              onChange={handleChange}
            >
              <option>France</option>
              <option>Maroc</option>
              <option>Belgique</option>
            </select>
          </div>
          <div className="mb-2">
            <input
              type="text"
              className="form-control"
              name="address"
              value={formData.address}
              onChange={handleChange}
              placeholder="Adresse"
            />
          </div>
          <div className="mb-2">
            <input
              type="text"
              className="form-control"
              name="address_details"
              value={formData.address_details}
              onChange={handleChange}
              placeholder="Informations complémentaires sur l’adresse"
            />
          </div>
          <div className="mb-2">
            <input
              type="text"
              className="form-control"
              name="city"
              value={formData.city}
              onChange={handleChange}
              placeholder="Ville"
            />
          </div>
          <div className="mb-2">
            <input
              type="text"
              className="form-control"
              name="state"
              value={formData.state}
              onChange={handleChange}
              placeholder="État"
            />
          </div>
          <div className="mb-4">
            <input
              type="text"
              className="form-control"
              name="postal_code"
              value={formData.postal_code}
              onChange={handleChange}
              placeholder="Code postal"
            />
          </div>

          {/* Enregistrer */}
          <div className="text-center">
            <button className="btn btn-primary px-4" type="submit" disabled={loading}>
              {loading ? (
                <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
              ) : (
                'Enregistrer'
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default ContactForm;