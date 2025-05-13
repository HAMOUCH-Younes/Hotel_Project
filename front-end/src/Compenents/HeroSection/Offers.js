import React, { useState, useEffect } from 'react';
import axios from 'axios';
import 'bootstrap/dist/css/bootstrap.min.css';
import '@fortawesome/fontawesome-free/css/all.min.css';
import fallbackImage from '../../assets/b.jpg'; // Fallback image

const Offers = () => {
  const [offers, setOffers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch offers from the API
  useEffect(() => {
    const fetchOffers = async () => {
      try {
        setLoading(true);
        const response = await axios.get('http://127.0.0.1:8000/api/offers', {
          params: { active: true }, // Only fetch active offers
        });
        const formattedOffers = response.data.map((offer) => ({
          id: offer.id,
          discount: `${offer.discount_percentage}% OFF`,
          title: offer.title,
          description: offer.description,
          expires: new Date(offer.expires_at).toLocaleDateString('en-US', {
            month: 'short',
            day: 'numeric',
          }), // Format as "Aug 31"
          img: offer.image || fallbackImage, // Use offer.image instead of hotel.image
          hotelId: offer.hotel?.id,
        }));
        setOffers(formattedOffers);
      } catch (err) {
        setError('Failed to load offers. Please try again.');
      } finally {
        setLoading(false);
      }
    };
    fetchOffers();
  }, []);

  // Handle View Offer click
  const handleViewOffer = (offerId, hotelId) => {
    // Redirect to rooms filtered by hotel, passing offer_id
    window.location.href = `/rooms?hotel_id=${hotelId}&offer_id=${offerId}`;
  };

  // Handle View All Offers click
  const handleViewAllOffers = () => {
    window.location.href = '/rooms'; // Or a dedicated offers page
  };

  return (
    <div className="container my-5 pb-5">
      {/* Header */}
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div>
          <h2 className="fw-bold">Exclusive Offers</h2>
          <p className="text-muted mb-0" style={{ fontSize: '0.9rem' }}>
            Take advantage of our limited-time offers and special packages to enhance your stay and create unforgettable memories.
          </p>
        </div>
        <a
          href="#"
          className="fw-bold text-dark text-decoration-none"
          style={{ fontSize: '0.9rem' }}
          onClick={(e) => {
            e.preventDefault();
            handleViewAllOffers();
          }}
        >
          View All Offers <i className="fas fa-arrow-right ms-1"></i>
        </a>
      </div>

      {/* Loading and Error States */}
      {loading && <div className="text-center"><div className="spinner-border" role="status"></div></div>}
      {error && <div className="alert alert-danger">{error}</div>}

      {/* Cards */}
      <div className="row g-4">
        {offers.length === 0 && !loading && <p className="text-center">No offers available.</p>}
        {offers.map((offer) => (
          <div key={offer.id} className="col-md-4">
            <div
              className="card text-white border-0 h-100"
              style={{
                backgroundImage: `url(${offer.img})`,
                backgroundSize: 'cover',
                backgroundPosition: 'center',
                borderRadius: '15px',
              }}
            >
              <div
                className="card-body d-flex flex-column justify-content-between"
                style={{
                  backgroundColor: 'rgba(0, 0, 0, 0.4)',
                  borderRadius: '15px',
                  padding: '1.5rem',
                }}
              >
                <span
                  className="badge bg-light text-dark"
                  style={{ fontSize: '0.8rem', width: 'fit-content' }}
                >
                  {offer.discount}
                </span>
                <div>
                  <h5 className="card-title mt-2 " style={{ fontSize: '1rem' }}>
                    {offer.title}
                  </h5>
                  <p className="card-text" style={{ fontSize: '0.85rem' }}>
                    {offer.description}
                  </p>
                  <p className="small" style={{ fontSize: '0.75rem' }}>
                    Expires {offer.expires}
                  </p>
                  <a
                    href="#"
                    className="text-white fw-bold text-decoration-none"
                    style={{ fontSize: '0.85rem' }}
                    onClick={(e) => {
                      e.preventDefault();
                      handleViewOffer(offer.id, offer.hotelId);
                    }}
                  >
                    View Offer <i className="fas fa-arrow-right ms-1"></i>
                  </a>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Offers;