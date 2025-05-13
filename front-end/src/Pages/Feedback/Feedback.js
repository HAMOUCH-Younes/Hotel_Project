import React, { useState } from 'react';
import axios from 'axios';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Link } from 'react-router-dom';

const FeedbackForm = () => {
  const [rating, setRating] = useState(0);
  const [recommendation, setRecommendation] = useState(null);
  const [category, setCategory] = useState('');
  const [comments, setComments] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);
    setLoading(true);

    // Client-side validation
    if (!rating || !comments) {
      setError('Please provide a rating and comments.');
      setLoading(false);
      return;
    }

    // Get user_id from localStorage
    const user = JSON.parse(localStorage.getItem('user'));
    if (!user || !user.id) {
      setError('User not logged in. Please log in to submit a review.');
      setLoading(false);
      return;
    }

    try {
      const response = await axios.post('http://127.0.0.1:8000/api/reviews', {
        user_id: user.id,
        hotel_id: 1, // Hardcoded hotel_id as 1
        rating: rating,
        comment: comments,
      }, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}` // Assuming token-based auth
        }
      });

      setSuccess('Thank you for your feedback! Your review has been submitted.');
      // Reset dynamic fields
      setRating(0);
      setComments('');
      // Reset static fields
      setRecommendation(null);
      setCategory('');
    } catch (err) {
      setError(err.response?.data?.message || 'An error occurred while submitting your review. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mt-5 d-flex justify-content-center" style={{ paddingTop: '40px', paddingBottom: '20px' }}>
      <div className="w-100" style={{ maxWidth: '650px' }}>
        <h2 className="mb-4 text-center">Faites part de vos commentaires</h2>

        <div className="alert alert-info text-center">
          <p className="mb-0">
            Nous ne pouvons pas répondre aux questions via ce formulaire. Veuillez vous{' '}
            <Link to="/support" className="fw-bold">
              rendre sur la page de l’assistance clientèle
            </Link>{' '}
            pour obtenir plus d’aide.
          </p>
        </div>

        {success && <div className="alert alert-success">{success}</div>}
        {error && <div className="alert alert-danger">{error}</div>}

        <form onSubmit={handleSubmit}>
          {/* Rating (Dynamic) */}
          <div className="mb-5 text-center">
            <label className="form-label fw-bold fs-5">Satisfaction générale concernant la page *</label>
            <div className="mb-2">
              {[1, 2, 3, 4, 5].map((star) => (
                <span
                  key={star}
                  style={{
                    fontSize: '2.5rem',
                    cursor: 'pointer',
                    color: star <= rating ? 'gold' : 'lightgray',
                    marginRight: '8px',
                  }}
                  onClick={() => setRating(star)}
                >
                  ★
                </span>
              ))}
            </div>
            <div className="d-flex justify-content-between px-2">
              <small>Terrible</small>
              <small>Excellent</small>
            </div>
          </div>

          {/* Recommendation (Static) */}
          <div className="mb-5 text-center">
            <label className="form-label fw-bold fs-5">
              Dans quelle mesure recommanderiez-vous Hotels.com à un ami ou un collègue ?
            </label>
            <div className="d-flex flex-wrap justify-content-center gap-2 my-3">
              {[...Array(11).keys()].map((num) => (
                <button
                  key={num}
                  type="button"
                  className={`btn ${recommendation === num ? 'btn-primary' : 'btn-outline-secondary'}`}
                  style={{ width: '45px', height: '45px', fontSize: '1.25rem' }}
                  onClick={() => setRecommendation(num)}
                >
                  {num}
                </button>
              ))}
            </div>
            <div className="d-flex justify-content-between px-2">
              <small>Not likely at all</small>
              <small>Extremely likely</small>
            </div>
          </div>

          {/* Category (Static) */}
          <div className="mb-5">
            <label className="form-label fw-bold fs-5">Choisissez la catégorie de votre commentaire *</label>
            {['Retour positif', 'Suggestion', 'Problème technique', 'Réclamation'].map((option, index) => (
              <div className="form-check my-2" key={index}>
                <input
                  className="form-check-input"
                  type="radio"
                  name="category"
                  id={`option${index}`}
                  value={option}
                  checked={category === option}
                  onChange={(e) => setCategory(e.target.value)}
                />
                <label className="form-check-label" htmlFor={`option${index}`}>
                  {option}
                </label>
              </div>
            ))}
          </div>

          {/* Comments (Dynamic) */}
          <div className="mb-4">
            <label className="form-label fw-bold fs-5">
              Veuillez inclure tout autre renseignement que vous aimeriez nous partager. *
            </label>
            <textarea
              className="form-control"
              rows="5"
              placeholder="Saisissez vos commentaires ici"
              value={comments}
              onChange={(e) => setComments(e.target.value)}
            ></textarea>
          </div>

          {/* Submit */}
          <div className="text-center">
            <button className="btn btn-primary px-4 py-2 fs-5" type="submit" disabled={loading}>
              {loading ? (
                <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
              ) : (
                'Envoyer'
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default FeedbackForm;