import React from 'react';
import image from '../../assets/b.jpg';

const Hero = () => {
  const backgroundStyle = {
    backgroundImage: `url(${image})`,
    backgroundSize: 'cover',
    backgroundPosition: 'center',
    minHeight: '100vh',
    color: 'white',
  };

  return (
    <div style={backgroundStyle}>
      <div className="container text-center " style={{ paddingTop: '100px' }}>

        <div className="badge bg-primary rounded-pill py-2 px-4 mb-3 fs-6">
          The Ultimate Hotel Experience
        </div>
        <h1 className="display-5 fw-bold mb-3">Discover Your Perfect<br />Gateway Destination</h1>
        <p className="fs-5 mb-5">Unparalleled luxury and comfort await at the world's most exclusive<br />hotels and resorts. Start your journey today.</p>

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

export default Hero;
