import React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import '@fortawesome/fontawesome-free/css/all.min.css';

const Newsletter = () => {
  return (
    <div
      className="py-5"
      
    >
      <div className="container">
        <div className="row justify-content-center">
          <div className="col-md-8 col-lg-6 text-center">
            {/* Header */}
            <h2 className="fw-bold mb-3" style={{ fontSize: '2.5rem', position: 'relative' }}>
              Stay Inspired
              <span
                style={{
                  display: 'block',
                  width: '60px',
                  height: '4px',
                  backgroundColor: '#dc3545', // Decorative red underline
                  margin: '10px auto',
                  borderRadius: '2px',
                }}
              />
            </h2>
            <p
              className="text-muted mb-5 mx-auto"
              style={{
                maxWidth: '450px',
                fontSize: '1.1rem',
                lineHeight: '1.6',
              }}
            >
              Join our newsletter and be the first to discover new destinations, exclusive offers, and travel inspiration.
            </p>

            {/* Email Input */}
            <div className="mb-4">
              <div className="input-group input-group-lg shadow-sm">
                <span className="input-group-text bg-white border-0" style={{ borderRadius: '8px 0 0 8px' }}>
                  <i className="fas fa-envelope text-muted"></i> {/* Envelope icon */}
                </span>
                <input
                  type="email"
                  className="form-control border-0"
                  placeholder="Enter your email"
                  style={{
                    borderRadius: '0',
                    padding: '0.75rem 1rem',
                    fontSize: '1rem',
                  }}
                />
                <button
                  className="btn btn-danger text-white"
                  type="button"
                  style={{
                    borderRadius: '0 8px 8px 0',
                    padding: '0.75rem 1.5rem',
                    fontSize: '1rem',
                    transition: 'background-color 0.3s ease',
                  }}
                  onMouseOver={(e) => (e.target.style.backgroundColor = '#c82333')}
                  onMouseOut={(e) => (e.target.style.backgroundColor = '#dc3545')}
                >
                  Subscribe <i className="fas fa-arrow-right ms-2"></i>
                </button>
              </div>
            </div>

            {/* Privacy Text */}
            <p className="text-muted small mt-4" style={{ fontSize: '0.9rem' }}>
              By subscribing, you agree to our{' '}
              <a
                href="/privacy-policy"
                className="text-muted"
                style={{
                  textDecoration: 'underline',
                  transition: 'color 0.3s ease',
                }}
                onMouseOver={(e) => (e.target.style.color = '#dc3545')}
                onMouseOut={(e) => (e.target.style.color = '#6c757d')}
              >
                Privacy Policy
              </a>{' '}
              and consent for review updates.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Newsletter;