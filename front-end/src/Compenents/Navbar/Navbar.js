import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import axios from 'axios';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap-icons/font/bootstrap-icons.css';
import '@fortawesome/fontawesome-free/css/all.min.css';

const Navbar = () => {
  const [scrolled, setScrolled] = useState(false);
  const location = useLocation();
  const [user, setUser] = useState(null);

  useEffect(() => {
    const loggedInUser = localStorage.getItem('user');
    if (loggedInUser) {
      const parsedUser = JSON.parse(loggedInUser);
      setUser(parsedUser);
      // Fetch userDetail only if icon is missing
      if (!parsedUser.user_detail?.icon) {
        fetchUserDetail();
      }
    }
  }, [location]);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const isRoomsPage = ['/rooms', '/book', '/login', '/signup', '/commentaire', '/profile', '/profile/edit', '/activitie'].includes(location.pathname);
  const isDarkNavbar = !scrolled && !isRoomsPage;

  const handleLogout = () => {
    localStorage.removeItem('user');
    localStorage.removeItem('token');
    window.location.href = '/login';
  };

  const fetchUserDetail = async () => {
    try {
      const token = localStorage.getItem('token');
      console.log('Fetching user detail with token:', token);
      const response = await axios.get('http://localhost:8000/api/user', {
        headers: { 'Authorization': `Bearer ${token}` },
      });
      const updatedUser = response.data;
      setUser(updatedUser);
      localStorage.setItem('user', JSON.stringify(updatedUser));
    } catch (err) {
      console.error('Error fetching user detail:', err.response ? err.response.data : err.message);
    }
  };

  console.log('Current user:', user);

  return (
    <nav
      className={`navbar navbar-expand-lg fixed-top px-4 py-2 ${isDarkNavbar ? 'navbar-dark' : 'navbar-light'}`}
      style={{
        transition: 'all 0.5s ease',
        backgroundColor: scrolled || isRoomsPage ? 'rgba(248, 249, 250, 0.95)' : 'transparent',
        backdropFilter: scrolled || isRoomsPage ? 'blur(3px)' : 'none',
        WebkitBackdropFilter: scrolled || isRoomsPage ? 'blur(8px)' : 'none',
      }}
    >
      <div className="container-fluid">
        <Link className="navbar-brand fw-bold fs-3" to="/">
          <i className="fas fa-hotel me-2"></i>QuickStay
        </Link>
        <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav">
          <span className="navbar-toggler-icon"></span>
        </button>
        <div className="collapse navbar-collapse flex-grow-1" id="navbarNav">
          <ul className="navbar-nav mx-auto">
            <li className="nav-item mx-3"><Link className="nav-link" to="/">Home</Link></li>
            <li className="nav-item mx-3"><Link className="nav-link" to="/rooms">Rooms</Link></li>
            <li className="nav-item mx-3"><Link className="nav-link" to="/experience">Experience</Link></li>
            <li className="nav-item mx-3"><Link className="nav-link" to="/about">About</Link></li>
          </ul>
          <div className="d-flex align-items-center">
            <i className={`fas fa-search me-3 ${isDarkNavbar ? 'text-white' : 'text-dark'}`}></i>
            {user ? (
              <div className="dropdown">
                <button
                  className="btn dropdown-toggle d-flex align-items-center"
                  type="button"
                  data-bs-toggle="dropdown"
                  aria-expanded="false"
                  style={{
                    background: 'transparent',
                    border: 'none',
                    color: isDarkNavbar ? '#fff' : '#000',
                    boxShadow: 'none',
                    appearance: 'none',
                  }}
                >
                  {user?.user_detail?.icon ? (
                    <img
                      src={user.user_detail.icon}
                      alt="User Icon"
                      style={{ width: '32px', height: '32px', borderRadius: '50%', marginRight: '8px' }}
                      onError={(e) => {
                        e.target.src = 'https://i.pravatar.cc/32';
                      }}
                    />
                  ) : (
                    <i className="fas fa-user-circle fs-4 me-2"></i>
                  )}
                  <span>{user.name}</span>
                </button>

                <ul
                  className="dropdown-menu dropdown-menu-end p-4 shadow"
                  style={{ minWidth: '320px', fontSize: '1rem' }}
                >
                  <li className="text-center fw-bold fs-5 mb-1">Bonjour {user.name}</li>
                  <li className="text-center text-muted mb-3">{user.email}</li>

                  <hr className="dropdown-divider" />

                  <li><Link className="dropdown-item px-2" to="/profile">Compte</Link></li>
                  <li><Link className="dropdown-item px-2" to="/activitie">Activité</Link></li>

                  <hr className="dropdown-divider" />

                  <li><Link className="dropdown-item px-2" to="/commentaire">Commentaire</Link></li>

                  <hr className="dropdown-divider" />

                  <li><button className="dropdown-item px-2 text-danger" onClick={handleLogout}>Se déconnecter</button></li>
                </ul>
              </div>
            ) : (
              <Link to="/login" className="btn btn-dark text-white rounded-pill px-4">Login</Link>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;