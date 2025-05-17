import React from 'react';

const Layout = ({ children }) => {
  return (
    <div
      style={{
        height:'300px',
        backgroundColor: '#00ced1',
        padding: '20px',
      }}
    >
      <div className="d-flex">
        {/* Sidebar */}
        <aside
          className="bg-white p-3 shadow-sm"
          style={{
            width: '250px',
            
            borderRadius: '1rem',
            
            flexShrink: 0,
          }}
        >
          <h5 className="fw-bold mb-4">Argon Dashboard 2 PRO</h5>
          <ul className="list-unstyled">
            <li className="mb-3 fw-bold text-primary">Dashboard</li>
            <li className="mb-3">Tables</li>
            <li className="mb-3">Billing</li>
            <li className="mb-3">Virtual Reality</li>
            <li className="mb-3">RTL</li>
            <li className="text-muted small mt-4">ACCOUNT PAGES</li>
            <li className="mb-2">Profile</li>
            <li>Sign In</li>
          </ul>
        </aside>

        {/* Main Content */}
        <main
          className="flex-grow-1 ms-4"
          style={{
            borderRadius: '1rem',
            padding: '10px',
            backgroundColor: 'transparent',
          }}
        >
          {children}
        </main>
      </div>
    </div>
  );
};

export default Layout;
