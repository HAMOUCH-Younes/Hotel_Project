import React, { useState, useEffect } from 'react';
import { Form, Button, Alert } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { toast, ToastContainer } from 'react-toastify';
import { FaTimes } from 'react-icons/fa';
import 'react-toastify/dist/ReactToastify.css';
import 'bootstrap/dist/css/bootstrap.min.css';

function Settings() {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    password_confirmation: '',
    icon: '',
    cin: '',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [showPasswordFields, setShowPasswordFields] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const user = JSON.parse(localStorage.getItem('user'));
        if (!user) {
          setError('User not logged in. Please log in to edit settings.');
          return;
        }

        const response = await axios.get('http://127.0.0.1:8000/api/user', {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`,
          },
        });
        const data = response.data;

        setFormData({
          email: data.email || '',
          password: '',
          password_confirmation: '',
          icon: data.user_detail?.icon || '',
          cin: data.user_detail?.cin || '',
        });
      } catch (err) {
        setError(err.response?.data?.message || 'Failed to load user data.');
      }
    };
    fetchUserData();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);
    setLoading(true);

    try {
      const payload = {
        email: formData.email,
        ...(formData.password && { password: formData.password }), // Include only if not empty
        ...(formData.password_confirmation && { password_confirmation: formData.password_confirmation }), // Include only if not empty
        user_detail: {
          ...(formData.icon && { icon: formData.icon }), // Nested under user_detail
          ...(formData.cin && { cin: formData.cin }), // Nested under user_detail
        },
      };

      // Remove user_detail if it's empty
      if (Object.keys(payload.user_detail).length === 0) {
        delete payload.user_detail;
      }

      const response = await axios.put('http://127.0.0.1:8000/api/user', payload, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
        },
      });

      localStorage.setItem('user', JSON.stringify(response.data));
      setSuccess('Settings updated successfully!');
      toast.success('Settings updated!', {
        position: 'top-right',
        autoClose: 2000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
      });
      setTimeout(() => navigate('/profile'), 2000);
    } catch (err) {
      setError(err.response?.data?.message || 'An error occurred while updating settings.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mt-5 d-flex justify-content-center">
      <div
        className="bg-white rounded shadow-sm p-4 w-100"
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
        <h5 className="fw-bold mb-4">Paramètres du compte</h5>
        <p className="text-muted mb-4">
          Modifiez votre e-mail, mot de passe, icône de compte et CIN.
        </p>

        {success && <Alert variant="success">{success}</Alert>}
        {error && <Alert variant="danger">{error}</Alert>}

        <Form onSubmit={handleSubmit}>
          {/* Email */}
          <Form.Group className="mb-3">
            <Form.Label>Email *</Form.Label>
            <Form.Control
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
            />
          </Form.Group>

          {/* CIN */}
          <Form.Group className="mb-3">
            <Form.Label>CIN *</Form.Label>
            <Form.Control
              type="text"
              name="cin"
              value={formData.cin}
              onChange={handleChange}
              maxLength="20"
              required
            />
          </Form.Group>

          {/* Icon */}
          <Form.Group className="mb-3">
            <Form.Label>Icône user</Form.Label>
            <Form.Control
              as="select"
              name="icon"
              value={formData.icon}
              onChange={handleChange}
            >
              <option value="">Aucune icône sélectionnée</option>
              <option value="https://img.kooora.com/?i=o%2fp%2f4%2f313%2fcristiano-ronaldo-2.png">CR7</option>
              <option value="https://randomuser.me/api/portraits/women/61.jpg">Femme 1</option>
              <option value="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRrGYpDsvGp1EMtovV2IyatXKrUD_BAeoYfHFIAtLR_CdKy2mRtatOdD_k&s">Cheb Larbi</option>
              <option value="https://randomuser.me/api/portraits/women/45.jpg">Femme 2</option>
              <option value="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTZ3L5tT_3n7G7f32SuqXuUBYR7-hzKTbZAPJfcEBTkUFJfPCKYAEmWvcMnHKydEZmrKKE&usqp=CAU">Homme 3</option>
              <option value="https://randomuser.me/api/portraits/women/20.jpg">Femme 3</option>
              <option value="https://media.licdn.com/dms/image/v2/D4E03AQEUNg7iL1gAaQ/profile-displayphoto-shrink_400_400/profile-displayphoto-shrink_400_400/0/1700162425169?e=2147483647&v=beta&t=jB643lTLy7orLwev8HFM6uGozs0-X4f3HlAVEEazXw4">Homme 4</option>
              <option value="https://randomuser.me/api/portraits/women/51.jpg">Femme 4</option>
              <option value="https://media.licdn.com/dms/image/v2/C5603AQHNPKszYhQ4Nw/profile-displayphoto-shrink_400_400/profile-displayphoto-shrink_400_400/0/1516526552393?e=2147483647&v=beta&t=iOOiIm3iSq-yVNdS8YD_ilHeV8ebT6OK2DR5cP6DIaU">Homme 5</option>
              <option value="https://randomuser.me/api/portraits/women/60.jpg">Femme 5</option>
            </Form.Control>
            {formData.icon && (
              <div className="mt-2">
                <img
                  src={formData.icon}
                  alt="User Avatar"
                  style={{ width: '50px', height: '50px', borderRadius: '50%' }}
                />
              </div>
            )}
          </Form.Group>

          {/* Change Password Link */}
          <Form.Group className="mb-3">
            <Form.Label>
              <span
                className="text-primary fw-semibold"
                style={{ cursor: 'pointer', textDecoration: 'underline' }}
                onClick={() => setShowPasswordFields(!showPasswordFields)}
              >
                Changer le mot de passe
              </span>
            </Form.Label>
            {showPasswordFields && (
              <>
                <Form.Control
                  type="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="Nouveau mot de passe"
                  className="mb-2"
                />
                <Form.Control
                  type="password"
                  name="password_confirmation"
                  value={formData.password_confirmation}
                  onChange={handleChange}
                  placeholder="Confirmez le nouveau mot de passe"
                />
              </>
            )}
          </Form.Group>

          <Button variant="primary" type="submit" className="w-100" disabled={loading}>
            {loading ? 'En cours...' : 'Enregistrer'}
          </Button>
        </Form>
      </div>
      <ToastContainer />
    </div>
  );
}

export default Settings;