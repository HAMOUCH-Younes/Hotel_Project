import React from 'react';

const Layout = ({ children }) => {
  return (
    <div style={{ minHeight: '100vh', position: 'relative', backgroundColor: '#f8f9fa' }}>
      {/* Teal background spanning the entire page */}
      <div
        style={{
          backgroundColor: '#00ced1',
          height: '300px',
          width: '100%',
          position: 'absolute',
          top: 0,
          left: 0,
          zIndex: 0,
        }}
      ></div>

      {/* Sidebar fixed on left */}
      <aside
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          width: '250px',
          height: 'calc(100vh - 40px)',
          marginTop: '20px',
          marginLeft: '20px',
          backgroundColor: '#fff',
          boxShadow: '2px 0 5px rgba(0,0,0,0.1)',
          padding: '1.5rem 1rem',
          color: '#344767',
          fontFamily: "'Poppins', sans-serif'",
          zIndex: 1000,
          borderTopLeftRadius: '1rem',
          borderBottomLeftRadius: '1rem',
        }}
      >
        <div className="mb-4">
          <img
            src="https://raw.githubusercontent.com/creativetimofficial/public-assets/master/argon-dashboard-pro/assets/img/argon-logo.png"
            alt="Argon Dashboard 2 PRO"
            style={{ width: '120px' }}
          />
        </div>
        <ul className="list-unstyled">
          <li className="mb-3">
            <a href="#dashboard" className="text-decoration-none text-primary fw-bold">
              <i className="fas fa-tachometer-alt me-2"></i>Dashboard
            </a>
          </li>
          <li className="mb-3">
            <a href="#tables" className="text-decoration-none text-dark">
              <i className="fas fa-table me-2"></i>Tables
            </a>
          </li>
          <li className="mb-3">
            <a href="#billing" className="text-decoration-none text-dark">
              <i className="fas fa-receipt me-2"></i>Billing
            </a>
          </li>
          <li className="mb-3">
            <a href="#vr" className="text-decoration-none text-dark">
              <i className="fas fa-vr-cardboard me-2"></i>Virtual Reality
            </a>
          </li>
          <li className="mb-3">
            <a href="#rtl" className="text-decoration-none text-dark">
              <i className="fas fa-globe me-2"></i>RTL
            </a>
          </li>
          <li className="small text-muted mt-4">ACCOUNT PAGES</li>
          <li className="mb-2">
            <a href="#profile" className="text-decoration-none text-dark">
              <i className="fas fa-user me-2"></i>Profile
            </a>
          </li>
          <li>
            <a href="#signin" className="text-decoration-none text-dark">
              <i className="fas fa-sign-in-alt me-2"></i>Sign In
            </a>
          </li>
        </ul>
      </aside>

      {/* Main content with padding left to avoid sidebar */}
      <main style={{ paddingLeft: '290px', paddingTop: '40px', paddingRight: '20px', position: 'relative', zIndex: 1 }}>
        {children}
      </main>
    </div>
  );
};

export default Layout;