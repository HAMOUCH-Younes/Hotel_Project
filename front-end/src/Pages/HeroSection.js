import React from 'react';
import '@fortawesome/fontawesome-free/css/all.min.css';
import image from '../assets/b.jpg'

const HeroSection = () => {
    const backgroundStyle = {
        backgroundImage: `url(${image})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        minHeight: '100vh',
        color: 'white',
      };
      

  return (
    <div style={backgroundStyle}>
      {/* Navbar */}
      <nav className="navbar navbar-expand-lg navbar-dark px-4 py-3">
        <div className="container-fluid">
          <a className="navbar-brand fw-bold fs-3" href="#">
            <i className="fas fa-hotel me-2"></i>QuickStay
          </a>
          <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav">
            <span className="navbar-toggler-icon"></span>
          </button>
          <div className="collapse navbar-collapse justify-content-end" id="navbarNav">
            <ul className="navbar-nav me-3">
              <li className="nav-item mx-2"><a className="nav-link active" href="#">Home</a></li>
              <li className="nav-item mx-2"><a className="nav-link" href="#">Hotels</a></li>
              <li className="nav-item mx-2"><a className="nav-link" href="#">Experience</a></li>
              <li className="nav-item mx-2"><a className="nav-link" href="#">About</a></li>
            </ul>
            <i className="fas fa-search text-white fs-5 me-3"></i>
            <button className="btn btn-dark rounded-pill px-4">Login</button>
          </div>
        </div>
      </nav>

      {/* Hero Content */}
      <div className="container text-center py-5 mt-5">
        <div className="badge bg-primary rounded-pill py-2 px-4 mb-3 fs-6">
          The Ultimate Hotel Experience
        </div>
        <h1 className="display-5 fw-bold mb-3">Discover Your Perfect<br />Gateway Destination</h1>
        <p className="fs-5 mb-5">Unparalleled luxury and comfort await at the world's most exclusive<br />hotels and resorts. Start your journey today.</p>

        {/* Search Form */}
        <div className="bg-white text-dark rounded shadow p-4 d-flex flex-wrap justify-content-center align-items-end gap-3">
          <div>
            <label className="form-label"><i className="fas fa-map-marker-alt me-1"></i>Destination</label>
            <input type="text" className="form-control" placeholder="Type here" />
          </div>
          <div>
            <label className="form-label"><i className="far fa-calendar-alt me-1"></i>Check in</label>
            <input type="date" className="form-control" />
          </div>
          <div>
            <label className="form-label"><i className="far fa-calendar-alt me-1"></i>Check out</label>
            <input type="date" className="form-control" />
          </div>
          <div>
            <label className="form-label"><i className="fas fa-user-friends me-1"></i>Guests</label>
            <input type="number" className="form-control" placeholder="0" />
          </div>
          <div>
            <button className="btn btn-dark px-4 py-2 mt-2 mt-md-0">
              <i className="fas fa-search me-2"></i>Search
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HeroSection;
