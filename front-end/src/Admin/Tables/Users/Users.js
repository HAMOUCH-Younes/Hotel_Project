import React, { useState, useEffect } from 'react';
import Layout from '../../Layout/Layout';
import axios from 'axios';
import 'bootstrap/dist/css/bootstrap.min.css';

const Users = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selected, setSelected] = useState(null);
  const [editing, setEditing] = useState(null);
  const [adding, setAdding] = useState(false);
  const [form, setForm] = useState({
    name: '',
    email: '',
    password: '',
    password_confirmation: '',
    user_detail: {
      bio: '',
      date_of_birth: '',
      sex: '',
      accessibility_needs: '',
      phone_number: '',
      emergency_contact: '',
      address: '',
      cin: '',
      icon: '',
    },
  });

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) throw new Error('No authentication token found');
        const response = await axios.get('http://localhost:8000/api/users', {
          headers: { 'Authorization': `Bearer ${token}` },
        });
        const currentUserId = (await axios.get('http://localhost:8000/api/user', {
          headers: { 'Authorization': `Bearer ${token}` },
        })).data.id;
        const filteredUsers = response.data.filter(user => user.id !== currentUserId);
        setUsers(filteredUsers);
        setLoading(false);
      } catch (err) {
        setError('Failed to load users. Please try again.');
        console.error('Error fetching users:', err);
        setLoading(false);
      }
    };
    fetchUsers();
  }, []);

  const isValidUrl = (string) => {
    try {
      new URL(string);
      return true;
    } catch (_) {
      return false;
    }
  };

  const handleAddUser = async () => {
    try {
      const token = localStorage.getItem('token');
      const payload = { ...form };
      payload.user_detail = Object.fromEntries(
        Object.entries(payload.user_detail).filter(([_, value]) => value !== '')
      );
      if (payload.user_detail.icon && !isValidUrl(payload.user_detail.icon)) {
        setError('The Icon URL must be a valid URL (e.g., https://example.com/icon.jpg).');
        return;
      }
      console.log('Sending payload (add user):', payload);
      const response = await axios.post('http://localhost:8000/api/users', payload, {
        headers: { 'Authorization': `Bearer ${token}` },
      });
      console.log('Server response (add user):', response.data);
      setUsers([...users, response.data]);
      setAdding(false);
      resetForm();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to add user.');
      console.error('Error adding user:', err);
    }
  };

  const startEdit = (user) => {
    setEditing(user.id);
    setForm({
      name: user.name || '',
      email: user.email || '',
      password: '',
      password_confirmation: '',
      user_detail: {
        bio: user.user_detail?.bio || '',
        date_of_birth: user.user_detail?.date_of_birth || '',
        sex: user.user_detail?.sex || '',
        accessibility_needs: user.user_detail?.accessibility_needs || '',
        phone_number: user.user_detail?.phone_number || '',
        emergency_contact: user.user_detail?.emergency_contact || '',
        address: user.user_detail?.address || '',
        cin: user.user_detail?.cin || '',
        icon: user.user_detail?.icon || '',
      },
    });
  };

  const saveEdit = async () => {
    try {
      const token = localStorage.getItem('token');
      const payload = { ...form };
      if (!payload.password && !payload.password_confirmation) {
        delete payload.password;
        delete payload.password_confirmation;
      }
      payload.user_detail = Object.fromEntries(
        Object.entries(payload.user_detail).filter(([_, value]) => value !== '')
      );
      if (payload.user_detail.icon && !isValidUrl(payload.user_detail.icon)) {
        setError('The Icon URL must be a valid URL (e.g., https://example.com/icon.jpg).');
        return;
      }
      console.log('Sending payload:', payload);
      const response = await axios.put(`http://localhost:8000/api/users/${editing}`, payload, {
        headers: { 'Authorization': `Bearer ${token}` },
      });
      console.log('Server response:', response.data);
      setUsers(users.map(u => (u.id === editing ? response.data : u)));
      setEditing(null);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to save user changes.');
      console.error('Error saving edit:', err);
    }
  };

  const handleDeleteUser = async (userId) => {
    if (!window.confirm(`Are you sure you want to delete the user with ID ${userId}?`)) {
      return;
    }
    try {
      const token = localStorage.getItem('token');
      await axios.delete(`http://localhost:8000/api/users/${userId}`, {
        headers: { 'Authorization': `Bearer ${token}` },
      });
      setUsers(users.filter(user => user.id !== userId));
      setSelected(null); // Close the details modal if the deleted user is selected
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to delete user.');
      console.error('Error deleting user:', err);
    }
  };

  const resetForm = () => {
    setForm({
      name: '',
      email: '',
      password: '',
      password_confirmation: '',
      user_detail: {
        bio: '',
        date_of_birth: '',
        sex: '',
        accessibility_needs: '',
        phone_number: '',
        emergency_contact: '',
        address: '',
        cin: '',
        icon: '',
      },
    });
  };

  if (loading) return <div className="text-center mt-5">Loading...</div>;
  if (error) return <div className="alert alert-danger mt-5">{error}</div>;
  console.log(users);

  return (
    <Layout>
      <div className="container mt-5">
        <div className="bg-white shadow-sm px-4 py-3 border d-flex justify-content-between align-items-center" style={{ borderTopLeftRadius: '15px', borderTopRightRadius: '15px' }}>
          <h5 className="mb-0 fw-bold">Users List</h5>
          <button className="btn btn-primary" onClick={() => setAdding(true)}>
            Add User
          </button>
        </div>

        <div className="table-responsive">
          <table className="table align-middle table-hover shadow-sm rounded-bottom">
            <thead className="bg-light">
              <tr>
                <th>Author</th>
                <th>Status</th>
                <th>Function</th>
                <th>Employed</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {users.map((user) => (
                <tr key={user.id} onClick={() => setSelected(user)} style={{ cursor: 'pointer' }}>
                  <td className="d-flex align-items-center gap-3">
                    <img
                      src={user.user_detail?.icon || 'https://i.pravatar.cc/40?img=1'}
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
                      <h6 className="mb-0">{user?.full_name || user?.name || 'Unknown'}</h6>
                      <small className="text-muted">{user?.email || 'No email'}</small>
                    </div>
                  </td>
                  <td>{Math.random() > 0.5 ? 'Online' : 'Offline'}</td>
                  <td>{user.role === 'admin' ? 'Admin' : 'Guest'}</td>
                  <td>{user.created_at ? new Date(user.created_at).toLocaleDateString() : 'N/A'}</td>
                  <td>
                    <button
                      className="btn btn-sm btn-outline-primary me-2"
                      onClick={(e) => {
                        e.stopPropagation();
                        startEdit(user);
                      }}
                    >
                      Edit
                    </button>
                    <button
                      className="btn btn-sm btn-outline-danger"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDeleteUser(user.id);
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
              <h5 className="mb-3">User Details</h5>
              <div style={{ maxHeight: '70vh', overflowY: 'auto' }}>
                <div className="card mb-3">
                  <div className="card-header">User Info</div>
                  <div className="card-body">
                    <p className="card-text"><strong>Name:</strong> {selected.name || 'N/A'}</p>
                    <p className="card-text"><strong>Email:</strong> {selected.email || 'N/A'}</p>
                    <p className="card-text"><strong>Role:</strong> {selected.role === 'admin' ? 'Admin' : 'Guest'}</p>
                  </div>
                </div>
                {selected.user_detail && (
                  <div className="card mb-3">
                    <div className="card-header">User Details</div>
                    <div className="card-body">
                      <p className="card-text"><strong>Bio:</strong> {selected.user_detail.bio || 'N/A'}</p>
                      <p className="card-text"><strong>Date of Birth:</strong> {selected.user_detail.date_of_birth || 'N/A'}</p>
                      <p className="card-text"><strong>Sex:</strong> {selected.user_detail.sex || 'N/A'}</p>
                      <p className="card-text"><strong>Accessibility Needs:</strong> {selected.user_detail.accessibility_needs || 'N/A'}</p>
                      <p className="card-text"><strong>Phone Number:</strong> {selected.user_detail.phone_number || 'N/A'}</p>
                      <p className="card-text"><strong>Emergency Contact:</strong> {selected.user_detail.emergency_contact || 'N/A'}</p>
                      <p className="card-text"><strong>Address:</strong> {selected.user_detail.address || 'N/A'}</p>
                      <p className="card-text"><strong>CIN:</strong> {selected.user_detail.cin || 'N/A'}</p>
                      <p className="card-text"><strong>Icon:</strong> {selected.user_detail.icon || 'N/A'}</p>
                    </div>
                  </div>
                )}
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
              <h5 className="mb-3">{editing ? 'Edit User' : 'Add User'}</h5>
              <div style={{ maxHeight: '70vh', overflowY: 'auto' }}>
                <div className="card mb-3">
                  <div className="card-header">User Info</div>
                  <div className="card-body">
                    <div className="mb-2">
                      <label className="form-label">Name</label>
                      <input
                        className="form-control"
                        value={form.name}
                        onChange={(e) => setForm({ ...form, name: e.target.value })}
                      />
                    </div>
                    <div className="mb-2">
                      <label className="form-label">Email</label>
                      <input
                        type="email"
                        className="form-control"
                        value={form.email}
                        onChange={(e) => setForm({ ...form, email: e.target.value })}
                      />
                    </div>
                    <div className="mb-2">
                      <label className="form-label">Password</label>
                      <input
                        type="password"
                        className="form-control"
                        value={form.password}
                        onChange={(e) => setForm({ ...form, password: e.target.value })}
                        placeholder={editing ? "Leave blank to keep existing password" : "Enter password"}
                      />
                    </div>
                    <div className="mb-2">
                      <label className="form-label">Confirm Password</label>
                      <input
                        type="password"
                        className="form-control"
                        value={form.password_confirmation}
                        onChange={(e) => setForm({ ...form, password_confirmation: e.target.value })}
                        placeholder="Confirm password"
                      />
                    </div>
                  </div>
                </div>
                <div className="card mb-3">
                  <div className="card-header">User Details</div>
                  <div className="card-body">
                    <div className="mb-2">
                      <label className="form-label">Bio</label>
                      <textarea
                        className="form-control"
                        value={form.user_detail.bio}
                        onChange={(e) => setForm({
                          ...form,
                          user_detail: { ...form.user_detail, bio: e.target.value }
                        })}
                      />
                    </div>
                    <div className="mb-2">
                      <label className="form-label">Date of Birth</label>
                      <input
                        type="date"
                        className="form-control"
                        value={form.user_detail.date_of_birth}
                        onChange={(e) => setForm({
                          ...form,
                          user_detail: { ...form.user_detail, date_of_birth: e.target.value }
                        })}
                      />
                    </div>
                    <div className="mb-2">
                      <label className="form-label">Sex</label>
                      <select
                        className="form-control"
                        value={form.user_detail.sex}
                        onChange={(e) => setForm({
                          ...form,
                          user_detail: { ...form.user_detail, sex: e.target.value }
                        })}
                      >
                        <option value="">Select</option>
                        <option value="Femme">Femme</option>
                        <option value="Homme">Homme</option>
                        <option value="Non binaire (X)">Non binaire (X)</option>
                        <option value="Non déclaré (U)">Non déclaré (U)</option>
                      </select>
                    </div>
                    <div className="mb-2">
                      <label className="form-label">Accessibility Needs</label>
                      <input
                        className="form-control"
                        value={form.user_detail.accessibility_needs}
                        onChange={(e) => setForm({
                          ...form,
                          user_detail: { ...form.user_detail, accessibility_needs: e.target.value }
                        })}
                      />
                    </div>
                    <div className="mb-2">
                      <label className="form-label">Phone Number</label>
                      <input
                        className="form-control"
                        value={form.user_detail.phone_number || ''}
                        onChange={(e) => setForm({
                          ...form,
                          user_detail: { ...form.user_detail, phone_number: e.target.value }
                        })}
                      />
                    </div>
                    <div className="mb-2">
                      <label className="form-label">Emergency Contact</label>
                      <input
                        className="form-control"
                        value={form.user_detail.emergency_contact || ''}
                        onChange={(e) => setForm({
                          ...form,
                          user_detail: { ...form.user_detail, emergency_contact: e.target.value }
                        })}
                      />
                    </div>
                    <div className="mb-2">
                      <label className="form-label">Address</label>
                      <input
                        className="form-control"
                        value={form.user_detail.address || ''}
                        onChange={(e) => setForm({
                          ...form,
                          user_detail: { ...form.user_detail, address: e.target.value }
                        })}
                      />
                    </div>
                    <div className="mb-2">
                      <label className="form-label">CIN</label>
                      <input
                        className="form-control"
                        value={form.user_detail.cin || ''}
                        onChange={(e) => setForm({
                          ...form,
                          user_detail: { ...form.user_detail, cin: e.target.value }
                        })}
                      />
                    </div>
                    <div className="mb-2">
                      <label className="form-label">Icon URL</label>
                      <input
                        type="url"
                        className="form-control"
                        value={form.user_detail.icon || ''}
                        onChange={(e) => setForm({
                          ...form,
                          user_detail: { ...form.user_detail, icon: e.target.value }
                        })}
                        placeholder="Enter icon URL (e.g., https://example.com/icon.jpg)"
                      />
                    </div>
                  </div>
                </div>
              </div>
              <div className="d-flex justify-content-end gap-2 mt-3">
                <button
                  className="btn btn-primary"
                  onClick={editing ? saveEdit : handleAddUser}
                  disabled={!form.name || !form.email || (adding && !form.password) || (form.password !== form.password_confirmation)}
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

export default Users;