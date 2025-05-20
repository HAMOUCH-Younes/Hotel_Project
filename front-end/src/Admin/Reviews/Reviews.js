import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Layout from '../Layout/Layout';
import 'bootstrap/dist/css/bootstrap.min.css';
import '@fortawesome/fontawesome-free/css/all.min.css';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function Reviews() {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selected, setSelected] = useState(null);

  // Fetch all reviews on component mount
  useEffect(() => {
    const fetchReviews = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) {
          setError('Authentication required. Please log in as an admin.');
          setLoading(false);
          return;
        }

        setLoading(true);
        const response = await axios.get('http://127.0.0.1:8000/api/reviews', {
          headers: {
            'Authorization': `Bearer ${token}`,
          },
        });

        setReviews(response.data || []);
        setLoading(false);
      } catch (err) {
        setError(err.response?.data?.error || 'Failed to load reviews. Please try again.');
        setLoading(false);
        console.error('Error fetching reviews:', err);
      }
    };

    fetchReviews();
  }, []);

  // Calculate the number of selected reviews
  const selectedReviewsCount = reviews.filter((review) => review.show_on_testimonial).length;

  // Handle delete action
  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this review?')) {
      try {
        const token = localStorage.getItem('token');
        await axios.delete(`http://127.0.0.1:8000/api/reviews/${id}`, {
          headers: { 'Authorization': `Bearer ${token}` },
        });
        setReviews(reviews.filter((r) => r.id !== id));
        toast.success('Review deleted successfully!', {
          position: "top-right",
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
        });
      } catch (err) {
        setError('Failed to delete review.');
        console.error('Error deleting review:', err);
        toast.error('Failed to delete review.', {
          position: "top-right",
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
        });
      }
    }
  };

  // Toggle show_on_testimonial
  const handleToggleTestimonial = async (id) => {
    const review = reviews.find((r) => r.id === id);
    const newValue = !review.show_on_testimonial;

    // Check if trying to enable a 4th review
    if (newValue && selectedReviewsCount >= 3) {
      toast.warn('You can only select up to 3 reviews for the Testimonials page.', {
        position: "top-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
      });
      return;
    }

    try {
      const token = localStorage.getItem('token');
      const response = await axios.put(
        `http://127.0.0.1:8000/api/reviews/${id}`,
        { show_on_testimonial: newValue },
        { headers: { 'Authorization': `Bearer ${token}` } }
      );
      setReviews(reviews.map((r) => (r.id === id ? response.data : r)));
      toast.success(`Review ${newValue ? 'added to' : 'removed from'} Testimonials!`, {
        position: "top-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
      });
    } catch (err) {
      setError('Failed to update testimonial visibility.');
      console.error('Error toggling testimonial:', err);
      toast.error('Failed to update testimonial visibility.', {
        position: "top-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
      });
    }
  };

  if (loading) return <Layout><div className="text-center mt-5">Loading...</div></Layout>;
  if (error) return <div className="alert alert-danger mt-5">{error}</div>;

  return (
    <Layout>
      <div className="container mt-5">
        <div
          className="bg-white shadow-sm px-4 py-3 border d-flex justify-content-between align-items-center"
          style={{ borderTopLeftRadius: '15px', borderTopRightRadius: '15px' }}
        >
          <h5 className="mb-0 fw-bold">Reviews List</h5>
          <span className="badge bg-primary">
            {selectedReviewsCount}/3 Selected for Testimonials
          </span>
        </div>

        <div className="table-responsive">
          <table className="table align-middle table-hover shadow-sm rounded-bottom">
            <thead className="bg-light">
              <tr>
                <th>User</th>
                <th>Hotel</th>
                <th>Rating</th>
                <th>Comment</th>
                <th>Show on Testimonial</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {reviews.length === 0 && !loading && (
                <tr>
                  <td colSpan="6" className="text-center">
                    No reviews available.
                  </td>
                </tr>
              )}
              {reviews.map((review) => (
                <tr
                  key={review.id}
                  onClick={() => setSelected(review)}
                  style={{ cursor: 'pointer' }}
                >
                  <td className="d-flex align-items-center gap-3">
                    <img
                      src={review.user?.user_detail?.icon || 'https://i.pravatar.cc/40?img=1'}
                      alt="Avatar"
                      className="rounded-circle"
                      width="45"
                      height="45"
                      onError={(e) => {
                        console.error('Image load failed for URL:', e.target.src);
                        e.target.src = 'https://i.pravatar.cc/40?img=1';
                      }}
                    />
                    <div>
                      <h6 className="mb-0">{review.user?.name || 'Unknown'}</h6>
                      <small className="text-muted">{review.user?.email || 'No email'}</small>
                    </div>
                  </td>
                  <td>{review.hotel?.name || 'Unknown Hotel'}</td>
                  <td>
                    <p className="text-warning mb-2">
                      {[...Array(review.rating || 0)].map((_, i) => (
                        <i key={i} className="fas fa-star me-1"></i>
                      ))}
                      {[...Array(5 - (review.rating || 0))].map((_, i) => (
                        <i key={i} className="far fa-star me-1"></i>
                      ))}
                    </p>
                  </td>
                  <td>
                    <span className="text-break" style={{ maxWidth: '200px', display: 'block', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                      {review.comment || 'N/A'}
                    </span>
                  </td>
                  <td>
                    <div className="form-check form-switch">
                      <input
                        type="checkbox"
                        className="form-check-input"
                        checked={review.show_on_testimonial || false}
                        onChange={() => handleToggleTestimonial(review.id)}
                        disabled={!review.show_on_testimonial && selectedReviewsCount >= 3} // Disable if not selected and limit reached
                      />
                    </div>
                  </td>
                  <td>
                    <button
                      className="btn btn-sm btn-outline-danger"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDelete(review.id);
                      }}
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Details Modal */}
        {selected && (
          <div className="position-fixed top-0 start-0 w-100 h-100 d-flex align-items-center justify-content-center bg-dark bg-opacity-50">
            <div
              className="bg-white p-4 rounded shadow"
              style={{ maxWidth: '600px', width: '100%' }}
            >
              <h5 className="mb-3">Review Details</h5>
              <div style={{ maxHeight: '70vh', overflowY: 'auto' }}>
                <div className="card mb-3">
                  <div className="card-header">Review Information</div>
                  <div className="card-body">
                    <p className="card-text">
                      <strong>User:</strong> {selected.user?.name || 'N/A'}
                    </p>
                    <p className="card-text">
                      <strong>Hotel:</strong> {selected.hotel?.name || 'Unknown Hotel'}
                    </p>
                    <p className="card-text">
                      <strong>Rating:</strong>{' '}
                      <span className="text-warning">
                        {[...Array(selected.rating || 0)].map((_, i) => (
                          <i key={i} className="fas fa-star me-1"></i>
                        ))}
                        {[...Array(5 - (selected.rating || 0))].map((_, i) => (
                          <i key={i} className="far fa-star me-1"></i>
                        ))}
                      </span>
                    </p>
                    <p className="card-text">
                      <strong>Comment:</strong> {selected.comment || 'N/A'}
                    </p>
                    <p className="card-text">
                      <strong>Show on Testimonial:</strong>{' '}
                      {selected.show_on_testimonial ? 'Yes' : 'No'}
                    </p>
                  </div>
                </div>
              </div>

              <div className="d-flex justify-content-end gap-2 mt-3">
                <button className="btn btn-secondary" onClick={() => setSelected(null)}>
                  Close
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Toast Container */}
        <ToastContainer position="top-right" autoClose={5000} pauseOnHover closeOnClick draggable />
      </div>
    </Layout>
  );
}

export default Reviews;