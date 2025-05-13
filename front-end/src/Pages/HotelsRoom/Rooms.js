import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import 'bootstrap/dist/css/bootstrap.min.css';
import '@fortawesome/fontawesome-free/css/all.min.css';
import fallbackImage from '../../assets/b.jpg';

const Rooms = () => {
  const [rooms, setRooms] = useState([]);
  const [amenities, setAmenities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filters, setFilters] = useState({
    amenityIds: [],
    priceRanges: [],
    sortBy: '',
  });

  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const amenitiesResponse = await axios.get('http://127.0.0.1:8000/api/amenities');
        setAmenities(amenitiesResponse.data);

        const params = {};
        if (filters.amenityIds.length) {
          params.amenity_ids = filters.amenityIds.join(',');
        }
        if (filters.priceRanges.length) {
          const [min, max] = filters.priceRanges[0].split(' to ').map(Number);
          params.price_min = min;
          params.price_max = max;
        }
        if (filters.sortBy) {
          params.sort = filters.sortBy;
        }
        const roomsResponse = await axios.get('http://127.0.0.1:8000/api/rooms', { params });
        setRooms(roomsResponse.data);
      } catch (err) {
        setError('Failed to load data. Please try again.');
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [filters]);

  const handleFilterChange = (type, value) => {
    setFilters((prev) => {
      if (type === 'amenityIds') {
        const updated = prev.amenityIds.includes(value)
          ? prev.amenityIds.filter((item) => item !== value)
          : [...prev.amenityIds, value];
        return { ...prev, amenityIds: updated };
      }
      if (type === 'priceRanges') {
        return { ...prev, priceRanges: [value] };
      }
      if (type === 'sortBy') {
        return { ...prev, sortBy: value };
      }
      return prev;
    });
  };

  const clearFilters = () => {
    setFilters({ amenityIds: [], priceRanges: [], sortBy: '' });
  };

  const renderStars = (rating) => {
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 >= 0.5;
    const stars = [];
    for (let i = 0; i < 5; i++) {
      if (i < fullStars) {
        stars.push(<i key={i} className="fas fa-star me-1"></i>);
      } else if (i === fullStars && hasHalfStar) {
        stars.push(<i key={i} className="fas fa-star-half-alt me-1"></i>);
      } else {
        stars.push(<i key={i} className="far fa-star me-1"></i>);
      }
    }
    return stars;
  };

  const handleBookNow = (roomId) => {
    navigate(`/book?room_id=${roomId}`);
  };

  return (
    <div className="container py-5" style={{ marginTop: '60px' }}>
      <div className="mb-5">
        <h2 className="fw-bold">Hotel Rooms</h2>
        <p className="text-muted" style={{ maxWidth: '600px' }}>
          Take advantage of our limited-time offers and special packages to enhance your stay.
        </p>
      </div>

      {loading && <div className="text-center"><div className="spinner-border" role="status"></div></div>}
      {error && <div className="alert alert-danger">{error}</div>}

      <div className="row">
        {/* Room Cards */}
        <div className="col-lg-8 mb-4">
          {rooms.length === 0 && !loading && <p>No rooms found.</p>}
          {rooms.map((room) => (
            <div key={room.id} className="card border-0 shadow-sm rounded-4 overflow-hidden mb-4">
              <div className="row g-0">
                <div className="col-md-5 position-relative">
                  <img
                    src={room.image || fallbackImage}
                    alt={room.name}
                    className="img-fluid h-100 object-fit-cover"
                    style={{ objectFit: 'cover' }}
                  />
                  {room.hotel?.is_best_seller && (
                    <span className="badge bg-light text-dark position-absolute top-0 start-0 m-2">Best Seller</span>
                  )}
                </div>
                <div className="col-md-7 p-4">
                  <p className="text-muted mb-1">{room.hotel?.name || 'Unknown Hotel'}</p>
                  <h4 className="fw-bold">{room.name}</h4>
                  <p className="text-warning mb-2">
                    {renderStars(room.hotel?.rating || 0)}
                    <span className="text-dark ms-2">{room.hotel?.reviews?.length || 0} reviews</span>
                  </p>
                  <p className="text-muted mb-2">
                    <i className="fas fa-map-marker-alt me-2"></i>
                    {room.hotel?.address || 'Unknown Address'}
                    {room.hotel?.city && `, ${room.hotel.city}`}
                    {room.hotel?.country && `, ${room.hotel.country}`}
                  </p>
                  <p className="text-muted mb-2">
                    <i className="fas fa-users me-2"></i> Max Guests: {room.max_guests}
                  </p>
                  <p className="text-muted mb-3">{room.description || 'No description available.'}</p>
                  <div className="d-flex flex-wrap gap-2 mb-3">
                    {room.amenities.map((amenity) => (
                      <span key={amenity.id} className="badge bg-light text-dark rounded-pill px-3 py-2">
                        <i className="fas fa-check me-1"></i> {amenity.name}
                      </span>
                    ))}
                  </div>
                  <h5 className="fw-bold mt-3">
                    ${room.price_per_night} <small className="text-muted fw-normal">/night</small>
                  </h5>
                  <button
                    className="btn btn-outline-secondary mt-2"
                    onClick={() => handleBookNow(room.id)}
                  >
                    Book Now
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Filters Sidebar (Modified) */}
        <div className="col-lg-4 d-none d-lg-block">
          <div
            className="border rounded-4 shadow-sm"
            style={{
              position: 'sticky',
              top: '100px',
              maxHeight: 'calc(100vh - 120px)',
              display: 'flex',
              flexDirection: 'column',
            }}
          >
            {/* Sticky Header */}
            <div
              className="p-4"
              style={{
                position: 'sticky',
                top: 0,
                zIndex: 1,
                backgroundColor: '#fff',
                borderBottom: '1px solid #dee2e6',
              }}
            >
              <div className="d-flex justify-content-between align-items-center">
                <h5 className="fw-bold mb-0">FILTERS</h5>
                <button
                  className="btn btn-link text-decoration-none text-muted p-0"
                  onClick={clearFilters}
                >
                  CLEAR
                </button>
              </div>
            </div>

            {/* Scrollable Filter Content */}
            <div className="p-4" style={{ overflowY: 'auto' }}>
              {/* Amenities Filter */}
              <div className="mb-4">
                <h6 className="fw-bold">Amenities</h6>
                {amenities.map((amenity) => (
                  <div className="form-check" key={amenity.id}>
                    <input
                      className="form-check-input"
                      type="checkbox"
                      id={`amenity-${amenity.id}`}
                      checked={filters.amenityIds.includes(amenity.id)}
                      onChange={() => handleFilterChange('amenityIds', amenity.id)}
                    />
                    <label className="form-check-label" htmlFor={`amenity-${amenity.id}`}>
                      {amenity.name}
                    </label>
                  </div>
                ))}
              </div>

              {/* Price Range */}
              <div className="mb-4">
                <h6 className="fw-bold">Price Range</h6>
                {['0 to 500', '500 to 1000', '1000 to 2000', '2000 to 3000'].map((range) => (
                  <div className="form-check" key={range}>
                    <input
                      className="form-check-input"
                      type="checkbox"
                      id={`price-${range}`}
                      checked={filters.priceRanges.includes(range)}
                      onChange={() => handleFilterChange('priceRanges', range)}
                    />
                    <label className="form-check-label" htmlFor={`price-${range}`}>
                      $ {range}
                    </label>
                  </div>
                ))}
              </div>

              {/* Sort By */}
              <div>
                <h6 className="fw-bold">Sort By</h6>
                {['Price Low to High', 'Price High to Low', 'Newest First'].map((option) => (
                  <div className="form-check" key={option}>
                    <input
                      className="form-check-input"
                      type="radio"
                      name="sort"
                      id={`sort-${option}`}
                      checked={filters.sortBy === option}
                      onChange={() => handleFilterChange('sortBy', option)}
                    />
                    <label className="form-check-label" htmlFor={`sort-${option}`}>
                      {option}
                    </label>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Rooms;