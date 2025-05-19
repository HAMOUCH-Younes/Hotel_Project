import React, { useState, useEffect } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import Layout from '../../Layout/Layout';
import axios from 'axios';

const Rooms = () => {
  const [rooms, setRooms] = useState([]);
  const [selected, setSelected] = useState(null);
  const [editing, setEditing] = useState(null);
  const [adding, setAdding] = useState(false);
  const [form, setForm] = useState({
    hotel_id: '',
    name: '',
    description: '',
    price_per_night: '',
    max_guests: '',
    amenity_ids: [],
    image_urls: [], // Array of image URLs
  });
  const [hotels, setHotels] = useState([]);
  const [amenities, setAmenities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = localStorage.getItem('token');
        const roomsResponse = await axios.get('http://127.0.0.1:8000/api/rooms', {
          headers: { 'Authorization': `Bearer ${token}` },
        });
        setRooms(roomsResponse.data || []);

        const hotelsResponse = await axios.get('http://127.0.0.1:8000/api/hotels', {
          headers: { 'Authorization': `Bearer ${token}` },
        });
        setHotels(hotelsResponse.data || []);

        const amenitiesResponse = await axios.get('http://127.0.0.1:8000/api/amenities', {
          headers: { 'Authorization': `Bearer ${token}` },
        });
        setAmenities(amenitiesResponse.data || []);

        setLoading(false);
      } catch (err) {
        setError('Failed to load data. Please try again.');
        console.error('Error fetching data:', err);
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const handleAddRoom = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.post('http://127.0.0.1:8000/api/rooms', form, {
        headers: { 'Authorization': `Bearer ${token}` },
      });
      setRooms([...rooms, response.data]);
      setAdding(false);
      resetForm();
    } catch (err) {
      setError('Failed to add room.');
      console.error('Error adding room:', err);
    }
  };

  const startEdit = (room) => {
    setEditing(room.id);
    setForm({
      ...room,
      hotel_id: room.hotel_id || '',
      amenity_ids: room.amenities ? room.amenities.map(a => a.id) : [],
      image_urls: room.image || [], // Load existing image URLs
    });
  };

  const saveEdit = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.put(`http://127.0.0.1:8000/api/rooms/${editing}`, form, {
        headers: { 'Authorization': `Bearer ${token}` },
      });
      setRooms(rooms.map(r => (r.id === editing ? response.data : r)));
      setEditing(null);
    } catch (err) {
      setError('Failed to save room changes.');
      console.error('Error saving edit:', err);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this room?')) {
      try {
        const token = localStorage.getItem('token');
        await axios.delete(`http://127.0.0.1:8000/api/rooms/${id}`, {
          headers: { 'Authorization': `Bearer ${token}` },
        });
        setRooms(rooms.filter(r => r.id !== id));
      } catch (err) {
        setError('Failed to delete room.');
        console.error('Error deleting room:', err);
      }
    }
  };

  const addImageUrl = () => {
    if (form.image_urls.length < 4) {
      setForm({ ...form, image_urls: [...form.image_urls, ''] });
    } else {
      alert('Maximum 4 images allowed.');
    }
  };

  const updateImageUrl = (index, value) => {
    const updatedUrls = [...form.image_urls];
    updatedUrls[index] = value;
    setForm({ ...form, image_urls: updatedUrls });
  };

  const removeImageUrl = (index) => {
    setForm({
      ...form,
      image_urls: form.image_urls.filter((_, i) => i !== index),
    });
  };

  const resetForm = () => {
    setForm({
      hotel_id: '',
      name: '',
      description: '',
      price_per_night: '',
      max_guests: '',
      amenity_ids: [],
      image_urls: [],
    });
  };

  if (loading) return <div className="text-center mt-5">Loading...</div>;
  if (error) return <div className="alert alert-danger mt-5">{error}</div>;

  return (
    <Layout>
      <div className="container mt-5">
        <div className="bg-white shadow-sm  px-4 py-3 border d-flex justify-content-between align-items-center" style={{ borderTopLeftRadius: '15px', borderTopRightRadius: '15px' }}>
          <h5 className="mb-0 fw-bold">Rooms List</h5>
          <button className="btn btn-primary" onClick={() => setAdding(true)}>
            Add Room
          </button>
        </div>

        <div className="table-responsive">
          <table className="table align-middle table-hover shadow-sm rounded-bottom">
            <thead className="bg-light">
              <tr>
                <th>Name</th>
                <th>Hotel</th>
                <th>Price/Night</th>
                <th>Max Guests</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {rooms.map((room) => (
                <tr key={room.id} onClick={() => setSelected(room)} style={{ cursor: 'pointer' }}>
                  <td>{room.name || 'N/A'}</td>
                  <td>{room.hotel?.name || 'N/A'}</td>
                  <td>{room.price_per_night ? `$${room.price_per_night}` : 'N/A'}</td>
                  <td>{room.max_guests || 'N/A'}</td>
                  <td>
                    <button
                      className="btn btn-sm btn-outline-primary me-2"
                      onClick={(e) => {
                        e.stopPropagation();
                        startEdit(room);
                      }}
                    >
                      Edit
                    </button>
                    <button
                      className="btn btn-sm btn-outline-danger"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDelete(room.id);
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

        {selected && !editing && !adding && (
          <div className="position-fixed top-0 start-0 w-100 h-100 d-flex align-items-center justify-content-center bg-dark bg-opacity-50">
            <div className="bg-white p-4 rounded shadow" style={{ maxWidth: '600px', width: '100%' }}>
              <h5 className="mb-3">Room Details</h5>
              <div style={{ maxHeight: '70vh', overflowY: 'auto' }}>
                <div className="card mb-3">
                  <div className="card-header">Room Details</div>
                  <div className="card-body">
                    <p className="card-text"><strong>Name:</strong> {selected.name || 'N/A'}</p>
                    <p className="card-text"><strong>Description:</strong> {selected.description || 'N/A'}</p>
                    <p className="card-text"><strong>Price/Night:</strong> {selected.price_per_night ? `$${selected.price_per_night}` : 'N/A'}</p>
                    <p className="card-text"><strong>Max Guests:</strong> {selected.max_guests || 'N/A'}</p>
                  </div>
                </div>

                <div className="card mb-3">
                  <div className="card-header">Hotel</div>
                  <div className="card-body">
                    <p className="card-text"><strong>Name:</strong> {selected.hotel?.name || 'N/A'}</p>
                    <p className="card-text"><strong>Location:</strong> {selected.hotel?.location || 'N/A'}</p>
                  </div>
                </div>

                <div className="card mb-3">
                  <div className="card-header">Images</div>
                  <div className="card-body">
                    {selected.image && selected.image.length > 0 ? (
                      <div className="d-flex flex-wrap gap-2">
                        {selected.image.map((img, index) => (
                          <img
                            key={index}
                            src={img}
                            alt={`Room Image ${index + 1}`}
                            style={{ maxWidth: '100px', maxHeight: '100px', objectFit: 'cover' }}
                          />
                        ))}
                      </div>
                    ) : (
                      <p className="card-text">No images available.</p>
                    )}
                  </div>
                </div>

                <div className="card">
                  <div className="card-header">Amenities</div>
                  <div className="card-body">
                    {selected.amenities && selected.amenities.length > 0 ? (
                      <ul>
                        {selected.amenities.map((amenity) => (
                          <li key={amenity.id}>{amenity.name || 'N/A'}</li>
                        ))}
                      </ul>
                    ) : (
                      <p className="card-text">No amenities available.</p>
                    )}
                  </div>
                </div>
              </div>

              <div className="d-flex justify-content-end gap-2 mt-3">
                <button className="btn btn-secondary" onClick={() => setSelected(null)}>Close</button>
              </div>
            </div>
          </div>
        )}

        {(editing || adding) && (
          <div className="position-fixed top-0 start-0 w-100 h-100 d-flex align-items-center justify-content-center bg-dark bg-opacity-50">
            <div className="bg-white p-4 rounded shadow" style={{ maxWidth: '600px', width: '100%' }}>
              <h5 className="mb-3">{editing ? 'Edit Room' : 'Add Room'}</h5>
              <div style={{ maxHeight: '70vh', overflowY: 'auto' }}>
                <div className="card mb-3">
                  <div className="card-header">Room Details</div>
                  <div className="card-body">
                    <div className="mb-2">
                      <label className="form-label">Name</label>
                      <input
                        className="form-control"
                        value={form.name || ''}
                        onChange={(e) => setForm({ ...form, name: e.target.value })}
                      />
                    </div>
                    <div className="mb-2">
                      <label className="form-label">Description</label>
                      <textarea
                        className="form-control"
                        value={form.description || ''}
                        onChange={(e) => setForm({ ...form, description: e.target.value })}
                      />
                    </div>
                    <div className="mb-2">
                      <label className="form-label">Price/Night</label>
                      <input
                        type="number"
                        className="form-control"
                        value={form.price_per_night || ''}
                        onChange={(e) => setForm({ ...form, price_per_night: parseFloat(e.target.value) })}
                      />
                    </div>
                    <div className="mb-2">
                      <label className="form-label">Max Guests</label>
                      <input
                        type="number"
                        className="form-control"
                        value={form.max_guests || ''}
                        onChange={(e) => setForm({ ...form, max_guests: parseInt(e.target.value) })}
                      />
                    </div>
                  </div>
                </div>

                <div className="card mb-3">
                  <div className="card-header">Hotel</div>
                  <div className="card-body">
                    <div className="mb-2">
                      <label className="form-label">Hotel</label>
                      <select
                        className="form-control"
                        value={form.hotel_id || ''}
                        onChange={(e) => setForm({ ...form, hotel_id: parseInt(e.target.value) })}
                      >
                        <option value="">Select a hotel</option>
                        {hotels.map((hotel) => (
                          <option key={hotel.id} value={hotel.id}>
                            {hotel.name}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>
                </div>

                <div className="card mb-3">
                  <div className="card-header">Images</div>
                  <div className="card-body">
                    {form.image_urls.map((url, index) => (
                      <div key={index} className="input-group mb-2" style={{ maxWidth: '300px' }}>
                        <input
                          type="url"
                          className="form-control"
                          value={url || ''}
                          onChange={(e) => updateImageUrl(index, e.target.value)}
                          placeholder="Enter image URL"
                        />
                        <button
                          className="btn btn-danger"
                          type="button"
                          onClick={() => removeImageUrl(index)}
                        >
                          Remove
                        </button>
                      </div>
                    ))}
                    <button
                      className="btn btn-secondary mt-2"
                      onClick={addImageUrl}
                      disabled={form.image_urls.length >= 4}
                    >
                      Add Image URL
                    </button>
                    <p className="text-muted mt-2">Maximum 4 images allowed. Current: {form.image_urls.length}</p>
                  </div>
                </div>

                <div className="card">
                  <div className="card-header">Amenities</div>
                  <div className="card-body">
                    {amenities.map((amenity) => (
                      <div key={amenity.id} className="form-check">
                        <input
                          type="checkbox"
                          className="form-check-input"
                          id={`amenity-${amenity.id}`}
                          checked={form.amenity_ids.includes(amenity.id)}
                          onChange={(e) => {
                            const updatedAmenities = e.target.checked
                              ? [...form.amenity_ids, amenity.id]
                              : form.amenity_ids.filter(id => id !== amenity.id);
                            setForm({ ...form, amenity_ids: updatedAmenities });
                          }}
                        />
                        <label className="form-check-label" htmlFor={`amenity-${amenity.id}`}>
                          {amenity.name}
                        </label>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              <div className="d-flex justify-content-end gap-2 mt-3">
                <button
                  className="btn btn-primary"
                  onClick={editing ? saveEdit : handleAddRoom}
                >
                  {editing ? 'Save' : 'Add'}
                </button>
                <button
                  className="btn btn-secondary"
                  onClick={() => {
                    setEditing(null);
                    setAdding(false);
                    resetForm();
                  }}
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </Layout>
  );
};

export default Rooms;