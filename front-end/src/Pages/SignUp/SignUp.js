import React, { useState } from 'react';
import { Container, Row, Col, Form, Button, Alert } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import axios from 'axios';
import { FaUser, FaEnvelope, FaLock, FaSpinner } from 'react-icons/fa';
import { Link } from 'react-router-dom';

const SignUp = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    password_confirmation: '',
    role: 'guest',
  });
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);
    setLoading(true);

    // Client-side validation
    if (!formData.name || !formData.email || !formData.password || !formData.password_confirmation) {
      setError('Please fill in all fields.');
      setLoading(false);
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      setError('Please enter a valid email address.');
      setLoading(false);
      return;
    }

    if (formData.password.length < 8) {
      setError('Password must be at least 8 characters long.');
      setLoading(false);
      return;
    }

    if (formData.password !== formData.password_confirmation) {
      setError('Passwords do not match.');
      setLoading(false);
      return;
    }

    try {
      const response = await axios.post('http://127.0.0.1:8000/api/register', {
        name: formData.name,
        email: formData.email,
        password: formData.password,
        password_confirmation: formData.password_confirmation,
        role: formData.role,
      });

      setSuccess('Registration successful! Redirecting...');
      localStorage.setItem('token', response.data.token);
      localStorage.setItem('user', JSON.stringify(response.data.user));
      setTimeout(() => {
        window.location.href = '/';
      }, 2000);
    } catch (err) {
      setError(err.response?.data?.message || 'An error occurred during registration. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      style={{
        minHeight: '100vh',
        background: 'linear-gradient(135deg, #0a2a6d 0%, #2d3748 100%)',
        position: 'relative',
        overflow: 'hidden',
        fontFamily: "'Poppins', sans-serif",
        paddingTop: '100px',
        paddingBottom: '30px',
      }}
    >
      <style>
        {`
          @import url('https://fonts.googleapis.com/css2?family=Poppins:wght@400;500;600;700&display=swap');

          .login-bg {
            position: absolute;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: url('https://images.unsplash.com/photo-1551882547-ff40c63fe5fa?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&q=80') no-repeat center center/cover;
            filter: blur(8px) brightness(0.5);
            z-index: -1;
          }

          .login-bg-overlay {
            position: absolute;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: url('https://www.transparenttextures.com/patterns/asfalt-dark.png');
            opacity: 0.1;
            z-index: -1;
          }

          .login-card {
            background: rgba(255, 255, 255, 0.95);
            backdrop-filter: blur(12px);
            border: 1px solid transparent;
            border-image: linear-gradient(45deg, #e63946, transparent) 1;
            border-radius: 20px;
            box-shadow: 0 12px 40px rgba(0, 0, 0, 0.4);
            animation: slideIn 0.8s ease-out;
            padding: 50px;
            max-width: 550px;
            margin: 0 auto;
          }

          @keyframes slideIn {
            0% { opacity: 0; transform: translateY(50px) scale(0.95); }
            70% { opacity: 1; transform: translateY(-10px) scale(1.02); }
            100% { opacity: 1; transform: translateY(0) scale(1); }
          }

          .form-floating .form-control {
            border: none;
            border-bottom: 2px solid #d1d5db;
            border-radius: 0;
            padding: 12px 12px 12px 40px;
            background: transparent;
            transition: border-bottom-color 0.4s ease;
            color: #1a1e4a;
            font-weight: 500;
            position: relative;
          }

          .form-floating .form-control:focus {
            border-bottom-color: #e63946;
            box-shadow: none;
          }

          .form-floating label {
            color: #9ca3af;
            font-size: 1rem;
            font-weight: 500;
            transform: translateY(0.5rem);
            transition: transform 0.3s ease, color 0.3s ease, font-size 0.3s ease;
            padding-left: 30px;
          }

          .form-floating .form-control:focus ~ label,
          .form-floating .form-control:not(:placeholder-shown) ~ label {
            transform: translateY(-1.8rem);
            color: #e63946;
            font-size: 0.8rem;
          }

          .input-icon {
            position: absolute;
            left: 8px;
            top: 50%;
            transform: translateY(-50%);
            color: #9ca3af;
            font-size: 1.2rem;
            z-index: 2;
            transition: color 0.3s ease;
          }

          .form-floating .form-control:focus ~ .input-icon,
          .form-floating .form-control:not(:placeholder-shown) ~ .input-icon {
            color: #e63946;
          }

          .form-select {
            border: none;
            border-bottom: 2px solid #d1d5db;
            border-radius: 0;
            padding: 12px;
            background: transparent;
            color: #1a1e4a;
            font-weight: 500;
            transition: border-bottom-color 0.4s ease;
          }

          .form-select:focus {
            border-bottom-color: #e63946;
            box-shadow: none;
            outline: none;
          }

          .btn-metallic {
            background: linear-gradient(90deg, #ff4d4d 0%, #d43f3f 100%);
            border: none;
            border-radius: 10px;
            padding: 16px;
            font-weight: 600;
            color: #ffffff;
            position: relative;
            overflow: hidden;
            transition: transform 0.3s ease, box-shadow 0.3s ease;
          }

          .btn-metallic:hover {
            transform: scale(1.02);
            box-shadow: 0 5px 20px rgba(230, 57, 70, 0.5);
          }

          .btn-metallic .ripple {
            position: absolute;
            background: rgba(255, 255, 255, 0.3);
            border-radius: 50%;
            width: 100px;
            height: 100px;
            animation: ripple 0.7s linear;
            pointer-events: none;
          }

          @keyframes ripple {
            0% { transform: scale(0); opacity: 1; }
            100% { transform: scale(4); opacity: 0; }
          }

          .btn-metallic .spinner {
            position: absolute;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            display: none;
          }

          .btn-metallic:disabled .spinner {
            display: block;
          }

          .btn-metallic:disabled .btn-text {
            display: none;
          }

          .text-link {
            color: #e63946;
            font-weight: 600;
            text-decoration: none;
            position: relative;
            transition: color 0.3s ease;
          }

          .text-link:hover {
            color: #d43f3f;
          }

          .text-link::after {
            content: '';
            position: absolute;
            width: 100%;
            height: 2px;
            bottom: -2px;
            left: 0;
            background-color: #d43f3f;
            transform: scaleX(0);
            transform-origin: bottom right;
            transition: transform 0.3s ease-out;
          }

          .text-link:hover::after {
            transform: scaleX(1);
            transform-origin: bottom left;
          }

          .alert {
            animation: fadeIn 0.5s ease-in-out;
            font-size: 0.9rem;
          }

          @keyframes fadeIn {
            0% { opacity: 0; }
            100% { opacity: 1; }
          }

          .footer {
            font-size: 0.9rem;
            color: #9ca3af;
            margin-top: 30px;
          }

          .footer a {
            color: #e63946;
            font-weight: 600;
            text-decoration: none;
            position: relative;
          }

          .footer a:hover {
            color: #d43f3f;
          }

          .footer a::after {
            content: '';
            position: absolute;
            width: 100%;
            height: 2px;
            bottom: -2px;
            left: 0;
            background-color: #d43f3f;
            transform: scaleX(0);
            transform-origin: bottom right;
            transition: transform 0.3s ease-out;
          }

          .footer a:hover::after {
            transform: scaleX(1);
            transform-origin: bottom left;
          }
        `}
      </style>

      <div className="login-bg"></div>
      <div className="login-bg-overlay"></div>

      <Container>
        <Row className="justify-content-center align-items-center">
          <Col md={6} lg={5}>
            <div className="login-card">
              <div className="text-center mb-5">
                <h2 style={{ color: '#0a2a6d', fontWeight: 800, fontSize: '2.2rem' }}>Staybnb</h2>
                <p style={{ color: '#9ca3af', fontWeight: 500, fontSize: '1.1rem' }}>
                  Create Your Account
                </p>
              </div>

              {success && <Alert variant="success">{success}</Alert>}
              {error && <Alert variant="danger">{error}</Alert>}

              <Form onSubmit={handleSubmit}>
                <Form.Group className="mb-5 position-relative" controlId="formName">
                  <FaUser className="input-icon" />
                  <Form.Floating>
                    <Form.Control
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleInputChange}
                      placeholder="Full Name"
                      required
                    />
                    <label>Full Name</label>
                  </Form.Floating>
                </Form.Group>

                <Form.Group className="mb-5 position-relative" controlId="formEmail">
                  <FaEnvelope className="input-icon" />
                  <Form.Floating>
                    <Form.Control
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      placeholder="Email address"
                      required
                    />
                    <label>Email Address</label>
                  </Form.Floating>
                </Form.Group>

                <Form.Group className="mb-5 position-relative" controlId="formPassword">
                  <FaLock className="input-icon" />
                  <Form.Floating>
                    <Form.Control
                      type="password"
                      name="password"
                      value={formData.password}
                      onChange={handleInputChange}
                      placeholder="Password"
                      required
                    />
                    <label>Password</label>
                  </Form.Floating>
                </Form.Group>

                <Form.Group className="mb-5 position-relative" controlId="formPasswordConfirm">
                  <FaLock className="input-icon" />
                  <Form.Floating>
                    <Form.Control
                      type="password"
                      name="password_confirmation"
                      value={formData.password_confirmation}
                      onChange={handleInputChange}
                      placeholder="Confirm Password"
                      required
                    />
                    <label>Confirm Password</label>
                  </Form.Floating>
                </Form.Group>

                <Button
                  type="submit"
                  className="btn-metallic w-100 position-relative"
                  disabled={loading}
                  onClick={(e) => {
                    if (!loading) {
                      const ripple = document.createElement('span');
                      ripple.classList.add('ripple');
                      const rect = e.currentTarget.getBoundingClientRect();
                      ripple.style.left = `${e.clientX - rect.left - 50}px`;
                      ripple.style.top = `${e.clientY - rect.top - 50}px`;
                      e.currentTarget.appendChild(ripple);
                    }
                  }}
                >
                  {loading && <FaSpinner className="spinner" />}
                  <span className="btn-text">{loading ? '' : 'Sign Up'}</span>
                </Button>
              </Form>

              <div className="text-center mt-4">
                <p style={{ color: '#9ca3af', fontWeight: 100, fontSize: '1rem' }}>
                  Already have an account?{' '}
                  <Link to="/login" className="text-link">
                    Login
                  </Link>
                </p>
              </div>

              <div className="text-center footer">
                © 2025 Staybnb. All rights reserved. |{' '}
                <Link to="/support" className="text-link">
                  Support
                </Link>
              </div>
            </div>
          </Col>
        </Row>
      </Container>
    </div>
  );
};

export default SignUp;