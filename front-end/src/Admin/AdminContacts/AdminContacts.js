import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Layout from '../Layout/Layout';
import 'bootstrap/dist/css/bootstrap.min.css';
import '@fortawesome/fontawesome-free/css/all.min.css';

function AdminContacts() {
  const [contacts, setContacts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selected, setSelected] = useState(null);
  const [form, setForm] = useState({
    phone_country_code: '',
    phone_number: '',
    sms_updates: false,
    emergency_contact_name: '',
    emergency_country_code: '',
    emergency_number: '',
    email: '',
    country: '',
    address: '',
    address_details: '',
    city: '',
    state: '',
    postal_code: '',
    name: '',
  });

  // Fetch all contacts on component mount
  useEffect(() => {
    const fetchContacts = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) {
          setError('Authentication required. Please log in as an admin.');
          setLoading(false);
          return;
        }

        setLoading(true);
        const response = await axios.get('http://127.0.0.1:8000/api/contacts', {
          headers: {
            'Authorization': `Bearer ${token}`,
          },
        });

        setContacts(response.data || []);
        setLoading(false);
      } catch (err) {
        setError(err.response?.data?.error || 'Failed to load contacts. Please try again.');
        setLoading(false);
        console.error('Error fetching contacts:', err);
      }
    };

    fetchContacts();
  }, []);

  // Start editing a contact (no longer used since edit is removed)
  const startEdit = (contact) => {
    setSelected(contact); // Keep this to pre-fill form if needed later
    setForm({
      phone_country_code: contact.phone_country_code || '',
      phone_number: contact.phone_number || '',
      sms_updates: contact.sms_updates || false,
      emergency_contact_name: contact.emergency_contact_name || '',
      emergency_country_code: contact.emergency_country_code || '',
      emergency_number: contact.emergency_number || '',
      email: contact.email || '',
      country: contact.country || '',
      address: contact.address || '',
      address_details: contact.address_details || '',
      city: contact.city || '',
      state: contact.state || '',
      postal_code: contact.postal_code || '',
      name: contact.name || contact.user?.name || '',
    });
  };

  // Save edited contact (no longer used since edit is removed)
  const saveEdit = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.put(`http://127.0.0.1:8000/api/contacts/${selected.id}`, form, {
        headers: { 'Authorization': `Bearer ${token}` },
      });
      setContacts(contacts.map((c) => (c.id === selected.id ? response.data : c)));
      setSelected(null);
    } catch (err) {
      setError('Failed to save contact changes.');
      console.error('Error saving edit:', err);
    }
  };

  // Delete a contact
  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this contact?')) {
      try {
        const token = localStorage.getItem('token');
        await axios.delete(`http://127.0.0.1:8000/api/contacts/${id}`, {
          headers: { 'Authorization': `Bearer ${token}` },
        });
        setContacts(contacts.filter((c) => c.id !== id));
      } catch (err) {
        setError('Failed to delete contact.');
        console.error('Error deleting contact:', err);
      }
    }
  };

  // Reset form to initial state
  const resetForm = () => {
    setForm({
      phone_country_code: '',
      phone_number: '',
      sms_updates: false,
      emergency_contact_name: '',
      emergency_country_code: '',
      emergency_number: '',
      email: '',
      country: '',
      address: '',
      address_details: '',
      city: '',
      state: '',
      postal_code: '',
      name: '',
    });
  };

  // Handle reply action (placeholder)
const handleReply = () => {
  if (selected && selected.email) {
    const subject = encodeURIComponent('Reply to your message');
    const body = encodeURIComponent('Salam,\n\nThank you for your message.');
    const gmailLink = `https://mail.google.com/mail/?view=cm&fs=1&to=${selected.email}&su=${subject}&body=${body}`;
    window.open(gmailLink, '_blank');
  }
};



  if (loading) return <div className="text-center mt-5">Loading...</div>;
  if (error) return <div className="alert alert-danger mt-5">{error}</div>;

  return (
    <Layout>
      <div className="container mt-5">
        <div
          className="bg-white shadow-sm px-4 py-3 border d-flex justify-content-between align-items-center"
          style={{ borderTopLeftRadius: '15px', borderTopRightRadius: '15px' }}
        >
          <h5 className="mb-0 fw-bold">Contacts List</h5>
        </div>

        <div className="table-responsive">
          <table className="table align-middle table-hover shadow-sm rounded-bottom">
            <thead className="bg-light">
              <tr>
                <th>Name</th>
                <th>Email</th>
                <th>Phone Number</th>
                <th>Country</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {contacts.length === 0 && !loading && (
                <tr>
                  <td colSpan="5" className="text-center">
                    No contacts available.
                  </td>
                </tr>
              )}
              {contacts.map((contact) => (
                <tr
                  key={contact.id}
                  onClick={() => setSelected(contact)}
                  style={{ cursor: 'pointer' }}
                >
                  <td>{contact.name || contact.user?.name || 'N/A'}</td>
                  <td>{contact.email || 'N/A'}</td>
                  <td>
                    {contact.phone_country_code && contact.phone_number
                      ? `${contact.phone_country_code} ${contact.phone_number}`
                      : 'N/A'}
                  </td>
                  <td>{contact.country || 'N/A'}</td>
                  <td>
                    <button
                      className="btn btn-sm btn-outline-danger"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDelete(contact.id);
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
              <h5 className="mb-3">Contact Details</h5>
              <div style={{ maxHeight: '70vh', overflowY: 'auto' }}>
                <div className="card mb-3">
                  <div className="card-header">Contact Information</div>
                  <div className="card-body">
                    <p className="card-text">
                      <strong>Name:</strong> {selected.name || selected.user?.name || 'N/A'}
                    </p>
                    <p className="card-text">
                      <strong>Email:</strong> {selected.email || 'N/A'}
                    </p>
                    <p className="card-text">
                      <strong>Phone Number:</strong>{' '}
                      {selected.phone_country_code && selected.phone_number
                        ? `${selected.phone_country_code} ${selected.phone_number}`
                        : 'N/A'}
                    </p>
                    <p className="card-text">
                      <strong>SMS Updates:</strong> {selected.sms_updates ? 'Yes' : 'No'}
                    </p>
                  </div>
                </div>

                <div className="card mb-3">
                  <div className="card-header">Emergency Contact</div>
                  <div className="card-body">
                    <p className="card-text">
                      <strong>Name:</strong> {selected.emergency_contact_name || 'N/A'}
                    </p>
                    <p className="card-text">
                      <strong>Phone Number:</strong>{' '}
                      {selected.emergency_country_code || selected.emergency_number
                        ? `${selected.emergency_country_code || ''} ${selected.emergency_number || ''}`
                        : 'N/A'}
                    </p>
                  </div>
                </div>

                <div className="card">
                  <div className="card-header">Address</div>
                  <div className="card-body">
                    <p className="card-text">
                      <strong>Country:</strong> {selected.country || 'N/A'}
                    </p>
                    <p className="card-text">
                      <strong>Address:</strong>{' '}
                      {selected.address || selected.address_details || selected.city || selected.state || selected.postal_code
                        ? `${selected.address || ''} ${selected.address_details || ''}, ${selected.city || ''}, ${selected.state || ''} ${selected.postal_code || ''}`
                        : 'N/A'}
                    </p>
                  </div>
                </div>
              </div>

              <div className="d-flex justify-content-end gap-2 mt-3">
                <button className="btn btn-primary" onClick={handleReply}>
                  Reply
                </button>
                <button className="btn btn-secondary" onClick={() => setSelected(null)}>
                  Close
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </Layout>
  );
}

export default AdminContacts;