import React, { useState } from 'react';
import { Form, Button } from 'react-bootstrap';
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';


const Login = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    remember: false,
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
    setLoading(true);

    if (!formData.email || !formData.password) {
      toast.error('Please fill in all fields.');
      setLoading(false);
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      toast.error('Please enter a valid email address.');
      setLoading(false);
      return;
    }

    try {
      const response = await axios.post('http://127.0.0.1:8000/api/login', formData);
      localStorage.setItem('token', response.data.token);
      localStorage.setItem('user', JSON.stringify(response.data.user));

      const redirectPath = response.data.user.role === 'admin' ? '/admin' : '/';

      toast.success('Login successful! Redirecting...');
      setTimeout(() => navigate(redirectPath), 2000);
    } catch (err) {
      toast.error(err.response?.data?.message || 'Login failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container-fluid d-flex justify-content-center align-items-center min-vh-100 bg-light">
      <div className="login-container d-flex shadow overflow-hidden rounded-4">
        <div className="form-section p-5 bg-white">
          <h2 className="mb-3 fw-bold">Sign In</h2>
          <p className="text-muted mb-4">Enter your email and password to sign in</p>

          <Form onSubmit={handleSubmit}>
            <Form.Group className="mb-3">
              <Form.Control
                type="email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                className="form-control rounded-pill"
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
                className="form-control rounded-pill"
                placeholder="Password"
                required
              />
            </Form.Group>

            <Form.Check
              type="checkbox"
              label="Remember me"
              name="remember"
              checked={formData.remember}
              onChange={handleInputChange}
              className="mb-3"
            />

            <Button type="submit" className="btn btn-info w-100 text-white rounded-pill" disabled={loading}>
              {loading ? 'Signing In...' : 'Sign In'}
            </Button>
          </Form>

          <div className="mt-4 text-center">
            <small>
              Don't have an account? <Link to="/signup">Sign up</Link>
            </small>
          </div>
        </div>

        <div className="image-section text-white text-center p-5 d-flex flex-column justify-content-center align-items-center">
          <h4 className="fw-bold mb-3">"Attention is the new currency"</h4>
          <p>The more effortless the writing looks, the more effort the writer actually put into the process.</p>
        </div>
      </div>
      <ToastContainer position="top-right" autoClose={5000} pauseOnHover closeOnClick draggable />
    </div>
  );
};

export default Login;
