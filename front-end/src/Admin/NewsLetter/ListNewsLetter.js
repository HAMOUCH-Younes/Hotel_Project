import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Layout from '../Layout/Layout';
import 'bootstrap/dist/css/bootstrap.min.css';
import '@fortawesome/fontawesome-free/css/all.min.css';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function ListNewsLetter() {
  const [newsletters, setNewsletters] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedNewsletter, setSelectedNewsletter] = useState(null);

  // Fetch all newsletters on component mount
  useEffect(() => {
    const fetchNewsletters = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) {
          setError('Authentication required. Please log in as an admin.');
          setLoading(false);
          return;
        }

        setLoading(true);
        const response = await axios.get('http://127.0.0.1:8000/api/newsletters', {
          headers: {
            'Authorization': `Bearer ${token}`,
          },
        });

        setNewsletters(response.data || []);
        setLoading(false);
      } catch (err) {
        setError(err.response?.data?.error || 'Failed to load newsletters. Please try again.');
        setLoading(false);
        console.error('Error fetching newsletters:', err);
      }
    };

    fetchNewsletters();
  }, []);

  // Handle deleting a newsletter
  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this newsletter?')) return;

    try {
      const token = localStorage.getItem('token');
      if (!token) {
        setError('Authentication required. Please log in as an admin.');
        return;
      }

      await axios.delete(`http://127.0.0.1:8000/api/newsletters/${id}`, {
        headers: { 'Authorization': `Bearer ${token}` },
      });

      setNewsletters(newsletters.filter((newsletter) => newsletter.id !== id));
      toast.success('Newsletter deleted successfully!', {
        position: "top-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
      });

      // Close modal if open
      setSelectedNewsletter(null);
    } catch (err) {
      toast.error(err.response?.data?.error || 'Failed to delete newsletter.', {
        position: "top-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
      });
    }
  };

  if (loading) return <Layout><div className="text-center mt-5"><div className="spinner-border" role="status"></div></div></Layout>;
  if (error) return <div className="alert alert-danger mt-5">{error}</div>;

  return (
    <Layout>
      <div className="container mt-5 mb-5">
        {/* Header */}
        <div className="text-center mb-5">
          <h2 className="fw-bold text-dark">List Newsletters</h2>
          <p className="text-muted">View and manage all sent newsletters.</p>
        </div>

        {/* Newsletters List */}
        <div className="card shadow-sm border-0 rounded-4">
          <div className="card-header bg-light rounded-top-4">
            <h5 className="mb-0 text-dark">Sent Newsletters</h5>
          </div>
          <div className="card-body p-0">
            <div className="table-responsive">
              <table className="table table-hover mb-0">
                <thead className="bg-light">
                  <tr>
                    <th>Subject</th>
                    <th>Sent At</th>
                    <th>Message</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {newsletters.length === 0 && !loading && (
                    <tr>
                      <td colSpan="4" className="text-center text-muted py-4">
                        No newsletters have been sent yet.
                      </td>
                    </tr>
                  )}
                  {newsletters.map((newsletter) => (
                    <tr key={newsletter.id} onClick={() => setSelectedNewsletter(newsletter)} style={{ cursor: 'pointer' }}>
                      <td>{newsletter.subject}</td>
                      <td>{new Date(newsletter.sent_at).toLocaleString()}</td>
                      <td>
                        <span
                          style={{
                            maxWidth: '300px',
                            display: 'block',
                            whiteSpace: 'nowrap',
                            overflow: 'hidden',
                            textOverflow: 'ellipsis',
                          }}
                        >
                          {newsletter.message}
                        </span>
                      </td>
                      <td onClick={(e) => e.stopPropagation()}>
                        <button
                          className="btn btn-sm btn-outline-danger rounded-pill"
                          onClick={() => handleDelete(newsletter.id)}
                        >
                          <i className="fas fa-trash me-1"></i> Delete
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Modal for Viewing Newsletter Details - Moved to Right */}
        {selectedNewsletter && (
          <div className="modal fade show d-block" tabIndex="-1" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
            <div className="modal-dialog modal-dialog-centered" style={{ marginRight: '40px', marginLeft: 'auto', maxWidth: '900px' }}>
              <div className="modal-content rounded-4 border-0 shadow-lg">
                <div className="modal-header bg-primary text-white rounded-top-4">
                  <h5 className="modal-title">{selectedNewsletter.subject}</h5>
                  <button
                    type="button"
                    className="btn-close btn-close-white"
                    onClick={() => setSelectedNewsletter(null)}
                  ></button>
                </div>
                <div className="modal-body p-4">
                  <p><strong>Sent At:</strong> {new Date(selectedNewsletter.sent_at).toLocaleString()}</p>
                  <p><strong>Message:</strong></p>
                  <div
                    className="border p-3 rounded-3 bg-light"
                    style={{ whiteSpace: 'pre-wrap', minHeight: '150px' }}
                  >
                    {selectedNewsletter.message}
                  </div>
                </div>
                <div className="modal-footer border-0">
                  <button
                    className="btn btn-danger rounded-pill px-4 me-2"
                    onClick={() => handleDelete(selectedNewsletter.id)}
                  >
                    <i className="fas fa-trash me-1"></i> Delete
                  </button>
                  <button
                    type="button"
                    className="btn btn-secondary rounded-pill px-4"
                    onClick={() => setSelectedNewsletter(null)}
                  >
                    Close
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Toast Container */}
      <ToastContainer position="top-right" autoClose={5000} pauseOnHover closeOnClick draggable />
    </Layout>
  );
}

export default ListNewsLetter;