import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import axios from 'axios';

const Layout = ({ children }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const [showTableList, setShowTableList] = useState(false);
  const [showOffersList, setShowOffersList] = useState(false);
  const [showNewsletterList, setShowNewsletterList] = useState(false);

  const isActive = (path) => location.pathname === path;

  // Check if the current path is within a submenu to keep it open
  const isSubmenuActive = (basePath) => {
    const paths = {
      tables: ['/admin/hotels', '/admin/rooms', '/admin/bookings', '/admin/users'],
      offers: ['/admin/offers', '/admin/add-offers'],
      newsletter: ['/admin/newsletter', '/admin/newsletter-list'],
    };
    return paths[basePath].some((path) => isActive(path));
  };

  // Update submenu states based on current location
  useEffect(() => {
    setShowTableList((prev) => prev || isSubmenuActive('tables'));
    setShowOffersList((prev) => prev || isSubmenuActive('offers'));
    setShowNewsletterList((prev) => prev || isSubmenuActive('newsletter'));
  }, [location.pathname]);

  const handleLogout = async () => {
    try {
      await axios.post('http://127.0.0.1:8000/api/logout', {}, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
      });
      localStorage.removeItem('token'); // Clear the token
      navigate('/'); // Redirect to home or login page (e.g., '/login')
    } catch (error) {
      console.error('Logout failed:', error);
      // Optionally show a toast or alert for failure
    }
  };

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
          <li style={{ marginBottom: '12px' }}>
            <Link
              to="/admin"
              style={{
                backgroundColor: isActive('/admin') ? '#d4edda' : '',
                borderRadius: '0.5rem',
                padding: '0.75rem 1rem',
                fontSize: '1rem',
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
          <li style={{ marginBottom: '12px' }}>
            <div
              onClick={() => setShowTableList(!showTableList)}
              style={{
                cursor: 'pointer',
                padding: '0.75rem 1rem',
                borderRadius: '0.5rem',
                fontSize: '1rem',
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
                  <li key={i} style={{ marginBottom: '12px' }}>
                    <Link
                      to={`/admin/${sub}`}
                      style={{
                        fontSize: '0.9rem',
                        textDecoration: 'none',
                        color: isActive(`/admin/${sub}`) ? '#11cdf0' : '#555',
                        fontWeight: isActive(`/admin/${sub}`) ? '600' : '400',
                        paddingLeft: '0.5rem',
                        display: 'inline-block',
                        backgroundColor: isActive(`/admin/${sub}`) ? '#d4edda' : '',
                        borderRadius: '0.5rem',
                        padding: '0.5rem 0.75rem',
                        transition: 'color 0.3s, background-color 0.3s',
                      }}
                    >
                      <>
                        <i style={{ color: '#11cdf0' }}>{`->  `}</i>
                        <i
                          className={`fas ${{
                            hotels: 'fa-hotel',
                            rooms: 'fa-bed',
                            bookings: 'fa-calendar-check',
                            users: 'fa-user',
                          }[sub]} me-2`}
                          style={{
                            width: '18px',
                            textAlign: 'center',
                            color: {
                              hotels: '#00bcd4',
                              rooms: '#4caf50',
                              bookings: '#ff9800',
                              users: '#f44336',
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
          <li style={{ marginBottom: '12px' }}>
            <div
              onClick={() => setShowOffersList(!showOffersList)}
              style={{
                cursor: 'pointer',
                padding: '0.75rem 1rem',
                borderRadius: '0.5rem',
                fontSize: '1rem',
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
                  <li key={i} style={{ marginBottom: '12px' }}>
                    <Link
                      to={`/admin/${sub}`}
                      style={{
                        fontSize: '0.9rem',
                        textDecoration: 'none',
                        color: isActive(`/admin/${sub}`) ? '#11cdf0' : '#555',
                        fontWeight: isActive(`/admin/${sub}`) ? '600' : '400',
                        paddingLeft: '0.5rem',
                        display: 'inline-block',
                        backgroundColor: isActive(`/admin/${sub}`) ? '#d4edda' : '',
                        borderRadius: '0.5rem',
                        padding: '0.5rem 0.75rem',
                        transition: 'color 0.3s, background-color 0.3s',
                      }}
                    >
                      <>
                        <i style={{ color: '#11cdf0' }}>{`->  `}</i>
                        <i
                          className={`fas ${{
                            offers: 'fa-list',
                            'add-offers': 'fa-plus',
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

          {/* Contacts */}
          <li style={{ marginBottom: '12px' }}>
            <Link
              to="/admin/contacts"
              style={{
                padding: '0.75rem 1rem',
                borderRadius: '0.5rem',
                fontSize: '1rem',
                color: isActive('/admin/contacts') ? '#11cdf0' : '#344767',
                fontWeight: '500',
                display: 'flex',
                alignItems: 'center',
                textDecoration: 'none',
                backgroundColor: isActive('/admin/contacts') ? '#d4edda' : '',
                transition: 'color 0.3s, background-color 0.3s',
              }}
            >
              <i className="fas fa-address-book me-2" style={{ color: '#03a9f4' }}></i>
              Contacts
            </Link>
          </li>

          {/* Reviews */}
          <li style={{ marginBottom: '12px' }}>
            <Link
              to="/admin/reviews"
              style={{
                padding: '0.75rem 1rem',
                borderRadius: '0.5rem',
                fontSize: '1rem',
                color: isActive('/admin/reviews') ? '#11cdf0' : '#344767',
                fontWeight: '500',
                display: 'flex',
                alignItems: 'center',
                textDecoration: 'none',
                backgroundColor: isActive('/admin/reviews') ? '#d4edda' : '',
                transition: 'color 0.3s, background-color 0.3s',
              }}
            >
              <i className="fas fa-star me-2" style={{ color: '#ff9800' }}></i>
              Reviews
            </Link>
          </li>

          {/* Newsletter with Submenu */}
          <li style={{ marginBottom: '12px' }}>
            <div
              onClick={() => setShowNewsletterList(!showNewsletterList)}
              style={{
                cursor: 'pointer',
                padding: '0.75rem 1rem',
                borderRadius: '0.5rem',
                fontSize: '1rem',
                color: '#344767',
                fontWeight: '500',
                display: 'flex',
                alignItems: 'center',
                transition: 'background-color 0.3s',
              }}
            >
              <i className="fas fa-globe me-2" style={{ color: '#e91e63' }}></i>
              N .Letter
            </div>

            {showNewsletterList && (
              <ul style={{ listStyle: 'none', paddingLeft: '1.5rem', marginTop: '0.5rem', transition: 'all 1s ease' }}>
                {['newsletter', 'newsletter-list'].map((sub, i) => (
                  <li key={i} style={{ marginBottom: '12px' }}>
                    <Link
                      to={`/admin/${sub}`}
                      style={{
                        fontSize: '0.9rem',
                        textDecoration: 'none',
                        color: isActive(`/admin/${sub}`) ? '#11cdf0' : '#555',
                        fontWeight: isActive(`/admin/${sub}`) ? '600' : '400',
                        paddingLeft: '0.5rem',
                        display: 'inline-block',
                        backgroundColor: isActive(`/admin/${sub}`) ? '#d4edda' : '',
                        borderRadius: '0.5rem',
                        padding: '0.5rem 0.75rem',
                        transition: 'color 0.3s, background-color 0.3s',
                      }}
                    >
                      <>
                        <i style={{ color: '#11cdf0' }}>{`->  `}</i>
                        <i
                          className={`fas ${{
                            newsletter: 'fa-plus',
                            'newsletter-list': 'fa-list',
                          }[sub]} me-2`}
                          style={{
                            width: '18px',
                            textAlign: 'center',
                            color: '#e91e63',
                          }}
                        ></i>
                        {sub === 'newsletter' ? 'Add NewsLetter' : 'List NewsLetter'}
                      </>
                    </Link>
                  </li>
                ))}
              </ul>
            )}
          </li>

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
            { path: null, icon: 'sign-out-alt', text: 'Log Out', color: '#f44336', onClick: handleLogout },
          ].map((item, idx) => (
            <li key={idx} style={{ marginBottom: '12px' }}>
              {item.path ? (
                <Link
                  to={item.path}
                  style={{
                    padding: '0.75rem 1rem',
                    borderRadius: '0.5rem',
                    fontSize: '1rem',
                    color: isActive(item.path) ? '#11cdf0' : '#344767',
                    fontWeight: '500',
                    display: 'flex',
                    alignItems: 'center',
                    textDecoration: 'none',
                    backgroundColor: isActive(item.path) ? '#d4edda' : '',
                    transition: 'color 0.3s, background-color 0.3s',
                  }}
                >
                  <i className={`fas fa-${item.icon} me-2`} style={{ color: item.color }}></i>
                  {item.text}
                </Link>
              ) : (
                <button
                  onClick={item.onClick}
                  style={{
                    padding: '0.75rem 1rem',
                    borderRadius: '0.5rem',
                    fontSize: '1rem',
                    color: '#344767',
                    fontWeight: '500',
                    display: 'flex',
                    alignItems: 'center',
                    textDecoration: 'none',
                    backgroundColor: '',
                    border: 'none',
                    width: '100%',
                    cursor: 'pointer',
                    transition: 'color 0.3s, background-color 0.3s',
                  }}
                >
                  <i className={`fas fa-${item.icon} me-2`} style={{ color: item.color }}></i>
                  {item.text}
                </button>
              )}
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