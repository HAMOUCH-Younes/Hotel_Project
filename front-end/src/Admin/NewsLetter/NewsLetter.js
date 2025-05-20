import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Layout from '../Layout/Layout';
import 'bootstrap/dist/css/bootstrap.min.css';
import '@fortawesome/fontawesome-free/css/all.min.css';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function NewsLetter() {
  const [newsletters, setNewsletters] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [formData, setFormData] = useState({
    subject: '',
    message: '',
  });

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

  // Handle form input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  // Handle form submission (send newsletter)
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        setError('Authentication required. Please log in as an admin.');
        return;
      }

      const response = await axios.post(
        'http://127.0.0.1:8000/api/newsletters',
        formData,
        { headers: { 'Authorization': `Bearer ${token}` } }
      );

      setNewsletters([response.data.newsletter, ...newsletters]);
      toast.success('Newsletter sent successfully to subscribers!', {
        position: "top-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
      });

      // Reset form
      setFormData({ subject: '', message: '' });
    } catch (err) {
      toast.error(err.response?.data?.error || 'Failed to send newsletter.', {
        position: "top-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
      });
    }
  };

  if (loading) return <div className="text-center mt-5"><div className="spinner-border" role="status"></div></div>;
  if (error) return <div className="alert alert-danger mt-5">{error}</div>;

  return (
    <Layout>
      <div className="container mt-5 mb-5">
        {/* Header */}
        <div className="text-center mb-5">
          <h2 className="fw-bold text-dark">Newsletter Management</h2>
          <p className="text-muted">Compose and send newsletters to all subscribers with ease.</p>
        </div>

        {/* Form to Compose Newsletter */}
        <div className="card shadow-lg mb-5 border-0 rounded-4">
          <div className="card-header bg-primary text-white rounded-top-4">
            <h5 className="mb-0">Compose Newsletter</h5>
          </div>
          <div className="card-body p-4">
            <form onSubmit={handleSubmit}>
              <div className="mb-4">
                <label htmlFor="subject" className="form-label fw-semibold text-dark">Subject</label>
                <input
                  type="text"
                  className="form-control form-control-lg rounded-3"
                  id="subject"
                  name="subject"
                  value={formData.subject}
                  onChange={handleInputChange}
                  placeholder="Enter the subject of your newsletter"
                  required
                />
              </div>
              <div className="mb-4">
                <label htmlFor="message" className="form-label fw-semibold text-dark">Message</label>
                <textarea
                  className="form-control rounded-3"
                  id="message"
                  name="message"
                  rows="6"
                  value={formData.message}
                  onChange={handleInputChange}
                  placeholder="Write your newsletter message here..."
                  required
                ></textarea>
              </div>
              <div className="d-flex justify-content-end">
                <button type="submit" className="btn btn-primary btn-lg rounded-pill px-4">
                  <i className="fas fa-paper-plane me-2"></i> Send Newsletter
                </button>
              </div>
            </form>
          </div>
        </div>

        {/* Sent Newsletters List */}
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
                    <tr key={newsletter.id}>
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
                      <td>
                        <button
                          className="btn btn-sm btn-outline-primary rounded-pill"
                          onClick={() => alert(`Viewing: ${newsletter.subject}\n\n${newsletter.message}`)}
                          disabled
                        >
                          View
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>

      {/* Toast Container */}
      <ToastContainer position="top-right" autoClose={5000} pauseOnHover closeOnClick draggable />
    </Layout>
  );
}

export default NewsLetter;