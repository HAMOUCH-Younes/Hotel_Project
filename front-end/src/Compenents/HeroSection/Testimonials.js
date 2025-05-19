import React, { useState, useEffect } from 'react';
import axios from 'axios';
import 'bootstrap/dist/css/bootstrap.min.css';
import '@fortawesome/fontawesome-free/css/all.min.css';
import fallbackImage from '../../assets/b.jpg'; // Fallback image

const Testimonials = () => {
  const [testimonials, setTestimonials] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch reviews from the API
  useEffect(() => {
    const fetchReviews = async () => {
      try {
        setLoading(true);
        const response = await axios.get('http://127.0.0.1:8000/api/reviews', {
          params: { limit: 3 }, // Limit to 3 reviews
          
        });
        console.log(response)
        const formattedTestimonials = response.data.map((review) => ({
          name: review.user?.name || 'Anonymous',
          image: review.user?.user_detail?.icon || fallbackImage, // Use userDetail.icon
          rating: review.rating,
          text: review.comment,
          hotelName: review.hotel?.name || 'Unknown Hotel',
        }));
        setTestimonials(formattedTestimonials);
      } catch (err) {
        setError('Failed to load reviews. Please try again.');
      } finally {
        setLoading(false);
      }
    };
    fetchReviews();
  }, []);

  return (
    <div className="pb-3" style={{
      background: 'linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%)', // Subtle gradient background
    }}>
      <div className="container py-5">
        {/* Header */}
        <div className="text-center mb-5">
          <h2 className="fw-bold">What Our Guests Say</h2>
          <p className="text-muted mx-auto" style={{ maxWidth: '700px' }}>
            Discover why discerning travelers consistently choose QuickStay for their exclusive and luxurious accommodations around the world.
          </p>
        </div>

        {/* Loading and Error States */}
        {loading && <div className="text-center"><div className="spinner-border" role="status"></div></div>}
        {error && <div className="alert alert-danger">{error}</div>}

        {/* Testimonials */}
        <div className="row g-4">
          {testimonials.length === 0 && !loading && <p className="text-center">No reviews available.</p>}
          {testimonials.map((testimonial, index) => (
            <div className="col-md-6 col-lg-4" key={index}>
              <div className="card h-100 shadow-sm border-0 rounded-4 p-4">
                <div className="d-flex align-items-center mb-3">
                  <img
                    src={testimonial.image}
                    alt={testimonial.name}
                    className="rounded-circle me-3"
                    width="50"
                    height="50"
                    onError={(e) => {
                      e.target.src = fallbackImage; // Fallback on image load failure
                    }}
                  />
                  <h5 className="mb-0">{testimonial.name}</h5>
                </div>
                <p className="text-warning mb-2">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <i key={i} className="fas fa-star me-1"></i>
                  ))}
                  {[...Array(5 - testimonial.rating)].map((_, i) => (
                    <i key={i} className="far fa-star me-1"></i>
                  ))}
                </p>
                <p className="text-muted">{testimonial.text}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Testimonials;