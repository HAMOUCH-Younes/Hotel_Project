import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';

const Layout = ({ children }) => {
  const location = useLocation();
  const [showTableList, setShowTableList] = useState(false);
  const [showOffersList, setShowOffersList] = useState(false); // New state for Offers submenu

  const isActive = (path) => location.pathname === path;

  return (
    <div style={{ minHeight: '100vh', position: 'relative', backgroundColor: '#f8f9fa' }}>
      {/* Teal header background */}
      <div
        style={{
          backgroundColor: '#11cdf0',
          height: '300px',
          width: '100%',
          position: 'absolute',
          top: 0,
          left: 0,
          zIndex: 0,
        }}
      ></div>

      {/* Sidebar */}
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
          borderTopLeftRadius: '1rem',
          borderBottomLeftRadius: '1rem',
          boxShadow: '4px 0 6px -2px rgba(0, 0, 0, 0.1)',
          overflowY: 'auto',
          padding: '1.5rem 1rem',
          fontFamily: "'Poppins', sans-serif",
          zIndex: 1000,
        }}
      >
        {/* Logo */}
        <div className="mb-4">
          <div
            style={{
              fontSize: '0.8rem',
              fontWeight: '600',
              color: '#344767',
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem',
            }}
          >
            <i className="fas fa-house-user" style={{ fontSize: '1.2rem' }}></i>
            Argon Dashboard 2 PRO
          </div>

          <div
            style={{
              marginTop: '0.6rem',
              height: '2px',
              width: '60%',
              background: 'linear-gradient(to right, transparent, #11cdf0, transparent)',
              margin: '0.6rem auto',
              borderRadius: '2px',
            }}
          ></div>
        </div>

        {/* Navigation */}
        <ul className="list-unstyled" style={{ paddingLeft: 0, marginBottom: 0 }}>
          {/* Dashboard */}
          <li style={{ marginBottom: '6px' }}>
            <Link
              to="/admin"
              style={{
                backgroundColor: isActive('/admin') ? '#e0f7fa' : '',
                borderRadius: '0.5rem',
                padding: '0.5rem 0.75rem',
                fontSize: '0.85rem',
                fontWeight: '500',
                color: '#344767',
                display: 'flex',
                alignItems: 'center',
                textDecoration: 'none',
                transition: 'background-color 0.3s',
              }}
            >
              <i className="fas fa-desktop me-2" style={{ color: '#00bcd4' }}></i>
              Dashboard
            </Link>
          </li>

          {/* Tables with Submenu */}
          <li style={{ marginBottom: '6px' }}>
            <div
              onClick={() => setShowTableList(!showTableList)}
              style={{
                cursor: 'pointer',
                padding: '0.5rem 0.75rem',
                borderRadius: '0.5rem',
                fontSize: '0.85rem',
                color: '#344767',
                fontWeight: '500',
                display: 'flex',
                alignItems: 'center',
                transition: 'background-color 0.3s',
              }}
            >
              <i className="fas fa-calendar-alt me-2" style={{ color: '#f44336' }}></i>
              Tables
            </div>

            {showTableList && (
              <ul style={{ listStyle: 'none', paddingLeft: '1.5rem', marginTop: '0.5rem', transition: 'all 1s ease' }}>
                {['hotels', 'rooms', 'bookings', 'users'].map((sub, i) => (
                  <li key={i} style={{ marginBottom: '0.6rem' }}>
                    <Link
                      to={`/admin/${sub}`} // Changed to absolute path
                      style={{
                        fontSize: '0.8rem',
                        textDecoration: 'none',
                        color: isActive(`/admin/${sub}`) ? '#11cdf0' : '#555',
                        fontWeight: isActive(`/admin/${sub}`) ? '600' : '400',
                        paddingLeft: '0.5rem',
                        display: 'inline-block',
                        transition: 'color 0.3s',
                      }}
                    >
                      <>
                        <i style={{ color: '#11cdf0' }}>{`->  `}</i>
                        <i
                          className={`fas ${{
                            hotels: 'fa-hotel',
                            rooms: 'fa-bed',
                            bookings: 'fa-calendar-check',
                            users: 'fa-user'
                          }[sub]} me-2`}
                          style={{
                            width: '18px',
                            textAlign: 'center',
                            color: {
                              hotels: '#00bcd4',
                              rooms: '#4caf50',
                              bookings: '#ff9800',
                              users: '#f44336'
                            }[sub],
                          }}
                        ></i>
                        {sub.charAt(0).toUpperCase() + sub.slice(1)}
                      </>
                    </Link>
                  </li>
                ))}
              </ul>
            )}
          </li>

          {/* Offers with Submenu */}
          <li style={{ marginBottom: '6px' }}>
            <div
              onClick={() => setShowOffersList(!showOffersList)}
              style={{
                cursor: 'pointer',
                padding: '0.5rem 0.75rem',
                borderRadius: '0.5rem',
                fontSize: '0.85rem',
                color: '#344767',
                fontWeight: '500',
                display: 'flex',
                alignItems: 'center',
                transition: 'background-color 0.3s',
              }}
            >
              <i className="fas fa-credit-card me-2" style={{ color: '#4caf50' }}></i>
              Offers
            </div>

            {showOffersList && (
              <ul style={{ listStyle: 'none', paddingLeft: '1.5rem', marginTop: '0.5rem', transition: 'all 1s ease' }}>
                {['offers', 'add-offers'].map((sub, i) => (
                  <li key={i} style={{ marginBottom: '0.6rem' }}>
                    <Link
                      to={`/admin/${sub}`} // Changed to absolute path
                      style={{
                        fontSize: '0.8rem',
                        textDecoration: 'none',
                        color: isActive(`/admin/${sub}`) ? '#11cdf0' : '#555',
                        fontWeight: isActive(`/admin/${sub}`) ? '600' : '400',
                        paddingLeft: '0.5rem',
                        display: 'inline-block',
                        transition: 'color 0.3s',
                      }}
                    >
                      <>
                        <i style={{ color: '#11cdf0' }}>{`->  `}</i>
                        <i
                          className={`fas ${{
                            offers: 'fa-list',
                            'add-offers': 'fa-plus'
                          }[sub]} me-2`}
                          style={{
                            width: '18px',
                            textAlign: 'center',
                            color: '#4caf50',
                          }}
                        ></i>
                        {sub === 'offers' ? 'List Offers' : 'Add Offers'}
                      </>
                    </Link>
                  </li>
                ))}
              </ul>
            )}
          </li>

          {/* Other Links */}
          {[
            { path: '/vr', icon: 'cube', text: 'Contacts', color: '#03a9f4' },
            { path: '/rtl', icon: 'globe', text: 'N .Letter', color: '#e91e63' },
          ].map((item, idx) => (
            <li key={idx} style={{ marginBottom: '6px' }}>
              <Link
                to={item.path}
                style={{
                  padding: '0.5rem 0.75rem',
                  borderRadius: '0.5rem',
                  fontSize: '0.85rem',
                  color: isActive(item.path) ? '#11cdf0' : '#344767',
                  fontWeight: '500',
                  display: 'flex',
                  alignItems: 'center',
                  textDecoration: 'none',
                  transition: 'color 0.3s',
                }}
              >
                <i className={`fas fa-${item.icon} me-2`} style={{ color: item.color }}></i>
                {item.text}
              </Link>
            </li>
          ))}

          {/* Divider */}
          <li
            style={{
              fontSize: '0.7rem',
              color: '#9e9e9e',
              fontWeight: '600',
              letterSpacing: '0.05rem',
              padding: '0 1rem',
              marginTop: '1rem',
              marginBottom: '0.5rem',
            }}
          >
            ACCOUNT PAGES
          </li>

          {/* Account links */}
          {[
            { path: '/profile', icon: 'user', text: 'Profile', color: '#3f51b5' },
            { path: '/signout', icon: 'file-alt', text: 'Sign Out', color: '#f44336' },
          ].map((item, idx) => (
            <li key={idx} style={{ marginBottom: '6px' }}>
              <Link
                to={item.path}
                style={{
                  padding: '0.5rem 0.75rem',
                  borderRadius: '0.5rem',
                  fontSize: '0.85rem',
                  color: isActive(item.path) ? '#11cdf0' : '#344767',
                  fontWeight: '500',
                  display: 'flex',
                  alignItems: 'center',
                  textDecoration: 'none',
                  transition: 'color 0.3s',
                }}
              >
                <i className={`fas fa-${item.icon} me-2`} style={{ color: item.color }}></i>
                {item.text}
              </Link>
            </li>
          ))}
        </ul>
      </aside>

      {/* Main content */}
      <main
        style={{
          paddingLeft: '290px',
          paddingTop: '40px',
          paddingRight: '20px',
          position: 'relative',
          zIndex: 1,
        }}
      >
        {children}
      </main>
    </div>
  );
};

export default Layout;