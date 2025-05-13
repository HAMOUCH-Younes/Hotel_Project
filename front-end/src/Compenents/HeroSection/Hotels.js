import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import 'bootstrap/dist/css/bootstrap.min.css';
import '@fortawesome/fontawesome-free/css/all.min.css';
import fallbackImage from '../../assets/b.jpg'; // Fallback image

const Hotels = () => {
  const [rooms, setRooms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  // Fetch up to 4 rooms from the API
  useEffect(() => {
    const fetchRooms = async () => {
      try {
        setLoading(true);
        const response = await axios.get('http://localhost:8000/api/rooms', {
          params: { limit: 4 },
        });
        const roomsWithData = response.data.map((room) => ({
          id: room.id,
          image: room.image || fallbackImage, // Use first image from room.images via backend
          bestSeller: room.price_per_night < 200, // Example logic: rooms under $200
          title: room.name,
          address: room.hotel?.address || 'Unknown Address',
          rating: room.hotel?.rating || 4.5, // Use actual rating if available
          price: room.price_per_night,
        }));
        setRooms(roomsWithData.slice(0, 4)); // Ensure max 4 rooms
      } catch (err) {
        setError('Failed to load rooms. Please try again.');
      } finally {
        setLoading(false);
      }
    };
    fetchRooms();
  }, []);

  // Handle Book Now click
  const handleBookNow = (roomId) => {
    navigate(`/book?room_id=${roomId}`);
  };

  return (
    <div
      style={{
        background: 'linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%)', // Subtle gradient background
      }}
    >
      <div className="container py-5">
        <div className="text-center mb-5">
          <h2 className="fw-bold">Featured Rooms</h2>
          <p className="text-muted">
            Discover our handpicked selection of exceptional rooms, offering unparalleled comfort and unforgettable experiences.
          </p>
        </div>

        {loading && <div className="text-center"><div className="spinner-border" role="status"></div></div>}
        {error && <div className="alert alert-danger">{error}</div>}

        <div className="row">
          {rooms.length === 0 && !loading && <p className="text-center">No rooms found.</p>}
          {rooms.map((room) => (
            <div className="col-md-3 mb-4" key={room.id}>
              <div className="card shadow-sm h-100">
                <div className="position-relative">
                  <img
                    src={room.image}
                    className="card-img-top"
                    alt={room.title}
                    style={{ height: '200px', objectFit: 'cover' }}
                  />
                  {room.bestSeller && (
                    <span className="badge bg-light text-dark position-absolute top-0 start-0 m-2">Best Seller</span>
                  )}
                </div>
                <div className="card-body">
                  <h5 className="card-title">{room.title}</h5>
                  <p className="card-text text-muted mb-1">
                    <i className="fas fa-map-marker-alt me-1"></i> {room.address}
                  </p>
                  <p className="text-warning mb-2">
                    <i className="fas fa-star me-1"></i> {room.rating}
                  </p>
                  <p className="h5">
                    ${room.price}<small className="text-muted">/night</small>
                  </p>
                  <button
                    className="btn btn-outline-secondary w-100 mt-2"
                    onClick={() => handleBookNow(room.id)}
                  >
                    Book Now
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
        <div className="text-center mt-4">
          <button className="btn btn-outline-dark" onClick={() => navigate('/rooms')}>
            View All Rooms
          </button>
        </div>
      </div>
    </div>
  );
};

export default Hotels;