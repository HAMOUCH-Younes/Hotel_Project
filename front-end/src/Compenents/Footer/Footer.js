import React, { useState } from 'react';
import axios from 'axios';
import 'bootstrap/dist/css/bootstrap.min.css';
import '@fortawesome/fontawesome-free/css/all.min.css';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const Footer = () => {
  const [email, setEmail] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post('http://127.0.0.1:8000/api/newsletter-subscribe', { email });
      toast.success('Thank you for subscribing!', {
        position: "top-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
      });
      setEmail('');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Subscription failed. Please try again.', {
        position: "top-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
      });
    }
  };

  return (
    <footer className="bg-light text-muted pt-5 pb-4 border-top">
      <div className="container">
        <div className="row">
          {/* Left Logo and About */}
          <div className="col-md-4 mb-4">
            <h4 className="fw-bold mb-2">
              <i className="fas fa-house-chimney-user me-2"></i> QuickStay
            </h4>
            <p>
              Discover the world's most extraordinary places to stay, from boutique hotels to luxury villas and private islands.
            </p>
            <div className="d-flex gap-3 mt-3">
              <a href="#" className="text-muted fs-5">
                <i className="fab fa-instagram"></i>
              </a>
              <a href="#" className="text-muted fs-5">
                <i className="fab fa-facebook"></i>
              </a>
              <a href="#" className="text-muted fs-5">
                <i className="fab fa-twitter"></i>
              </a>
              <a href="#" className="text-muted fs-5">
                <i className="fab fa-linkedin"></i>
              </a>
            </div>
          </div>

          {/* Company Links */}
          <div className="col-md-2 mb-4">
            <h6 className="fw-bold text-uppercase mb-3">Company</h6>
            <ul className="list-unstyled">
              <li><a href="#" className="text-muted text-decoration-none">About</a></li>
              <li><a href="#" className="text-muted text-decoration-none">Careers</a></li>
              <li><a href="#" className="text-muted text-decoration-none">Press</a></li>
              <li><a href="#" className="text-muted text-decoration-none">Blog</a></li>
              <li><a href="#" className="text-muted text-decoration-none">Partners</a></li>
            </ul>
          </div>

          {/* Support Links */}
          <div className="col-md-3 mb-4">
            <h6 className="fw-bold text-uppercase mb-3">Support</h6>
            <ul className="list-unstyled">
              <li><a href="#" className="text-muted text-decoration-none">Help Center</a></li>
              <li><a href="#" className="text-muted text-decoration-none">Safety Information</a></li>
              <li><a href="#" className="text-muted text-decoration-none">Cancellation Options</a></li>
              <li><a href="#" className="text-muted text-decoration-none">Contact Us</a></li>
              <li><a href="#" className="text-muted text-decoration-none">Accessibility</a></li>
            </ul>
          </div>

          {/* Newsletter */}
          <div className="col-md-3 mb-4">
            <h6 className="fw-bold text-uppercase mb-3">Stay Updated</h6>
            <p>Subscribe to our newsletter for travel inspiration and special offers.</p>
            <form onSubmit={handleSubmit} className="d-flex">
              <input
                type="email"
                className="form-control rounded-start"
                placeholder="Your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
              <button type="submit" className="btn btn-dark rounded-end">
                <i className="fas fa-arrow-right"></i>
              </button>
            </form>
          </div>
        </div>

        {/* Bottom Text */}
        <div className="d-flex flex-column flex-md-row justify-content-between align-items-center border-top pt-3 mt-3">
          <p className="mb-2 mb-md-0">© 2025 QuickStay. All rights reserved.</p>
          <div className="d-flex gap-3">
            <a href="#" className="text-muted text-decoration-none">Privacy</a>
            <a href="#" className="text-muted text-decoration-none">Terms</a>
            <a href="#" className="text-muted text-decoration-none">Sitemap</a>
          </div>
        </div>
      </div>

      {/* Toast Container */}
      <ToastContainer position="top-right" autoClose={5000} pauseOnHover closeOnClick draggable />
    </footer>
  );
};

export default Footer;