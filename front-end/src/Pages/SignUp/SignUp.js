import React, { useState } from "react";
import { Form, Button, Card } from "react-bootstrap";
import { Link, useNavigate } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';
import { FaSpinner } from 'react-icons/fa';
import axios from 'axios';

function SignUp() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    password_confirmation: '',
    role: 'guest',
    terms: false,
  });
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log("Form submitted with data:", formData); // Debug log to confirm submission
    setLoading(true);

    // Client-side validation
    if (!formData.name || !formData.email || !formData.password || !formData.password_confirmation) {
      toast.error('Please fill in all fields.', {
        position: 'top-right',
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
      });
      console.log("Validation failed: Missing fields");
      setLoading(false);
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      toast.error('Please enter a valid email address.', {
        position: 'top-right',
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
      });
      console.log("Validation failed: Invalid email");
      setLoading(false);
      return;
    }

    if (formData.password.length < 8) {
      toast.error('Password must be at least 8 characters long.', {
        position: 'top-right',
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
      });
      console.log("Validation failed: Password too short");
      setLoading(false);
      return;
    }

    if (formData.password !== formData.password_confirmation) {
      toast.error('Passwords do not match.', {
        position: 'top-right',
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
      });
      console.log("Validation failed: Passwords do not match");
      setLoading(false);
      return;
    }

    if (!formData.terms) {
      toast.error('Please agree to the Terms and Conditions.', {
        position: 'top-right',
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
      });
      console.log("Validation failed: Terms not accepted");
      setLoading(false);
      return;
    }

    try {
      console.log("Sending API request to register...");
      const response = await axios.post('http://127.0.0.1:8000/api/register', {
        name: formData.name,
        email: formData.email,
        password: formData.password,
        password_confirmation: formData.password_confirmation,
        role: formData.role,
      });

      console.log("API response:", response.data);
      toast.success('Registration successful! Redirecting...', {
        position: 'top-right',
        autoClose: 2000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
      });

      localStorage.setItem('token', response.data.token);
      localStorage.setItem('user', JSON.stringify(response.data.user));
      setTimeout(() => {
        console.log("Redirecting to /");
        navigate('/');
      }, 2000);
    } catch (err) {
      console.error("API error:", err);
      const errorMessage = err.response?.data?.message || 'An error occurred during registration. Please try again.';
      toast.error(errorMessage, {
        position: 'top-right',
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
      });
    } finally {
      setLoading(false);
      console.log("Loading state reset");
    }
  };

  return (
    <div>
      {/* Header Image Section */}
      <div
        className="header-image d-flex flex-column justify-content-center align-items-center text-white text-center"
        style={{
          backgroundImage: `url('https://plus.unsplash.com/premium_photo-1747135794086-280753a24793?w=600&auto=format&fit=crop&q=60')`,
          height: '450px',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          position: 'relative',
        }}
      >
        <h1 className="display-4 fw-bold">Welcome!</h1>
        <p className="lead">Use these awesome forms to login or create new account in your project for free.</p>
      </div>

      {/* Sign Up Form Overlapping Card */}
      <div
        className="d-flex justify-content-center"
        style={{ marginTop: '-140px', marginLeft: '20px', marginRight: '20px' }}
      >
        <Card
          className="shadow p-4 bg-white"
          style={{ width: '100%', maxWidth: '400px', borderRadius: '25px' }}
        >
          <h4 className="text-center mb-3">Register with</h4>
          <div className="d-flex justify-content-center mb-3">
            <Button variant="light" className="mx-1 border"><i className="fab fa-facebook-f"></i></Button>
            <Button variant="light" className="mx-1 border"><i className="fab fa-apple"></i></Button>
            <Button variant="light" className="mx-1 border"><i className="fab fa-google"></i></Button>
          </div>

          <div className="text-center text-muted mb-3"><small>or</small></div>

          <Form onSubmit={handleSubmit}>
            <Form.Group className="mb-3">
              <Form.Control
                type="text"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                placeholder="Name"
                required
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Control
                type="email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                placeholder="Email"
                required
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Control
                type="password"
                name="password"
                value={formData.password}
                onChange={handleInputChange}
                placeholder="Password"
                required
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Control
                type="password"
                name="password_confirmation"
                value={formData.password_confirmation}
                onChange={handleInputChange}
                placeholder="Confirm Password"
                required
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Check
                type="checkbox"
                name="terms"
                checked={formData.terms}
                onChange={handleInputChange}
                label="I agree to the Terms and Conditions"
              />
            </Form.Group>
            <Button
              type="submit"
              variant="primary"
              className="w-100 rounded-pill position-relative"
              disabled={loading}
              onClick={(e) => {
                if (!loading) {
                  const ripple = document.createElement('span');
                  ripple.className = 'ripple';
                  const rect = e.currentTarget.getBoundingClientRect();
                  ripple.style.left = `${e.clientX - rect.left - 50}px`;
                  ripple.style.top = `${e.clientY - rect.top - 50}px`;
                  e.currentTarget.appendChild(ripple);
                }
              }}
            >
              {loading ? <FaSpinner className="spinner" /> : 'Sign Up'}
            </Button>
          </Form>

          <div className="text-center mt-3">
            <small>Already have an account? <Link to="/login">Sign In</Link></small>
          </div>
        </Card>
      </div>

      <ToastContainer />
    </div>
  );
}

export default SignUp;