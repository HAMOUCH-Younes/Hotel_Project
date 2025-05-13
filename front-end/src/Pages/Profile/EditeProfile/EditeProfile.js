import React, { useState, useEffect } from 'react';
import axios from 'axios';
import 'bootstrap/dist/css/bootstrap.min.css';

function EditProfile() {
  const [formData, setFormData] = useState({
    name: '',
    bio: '',
    date_of_birth_month: '',
    date_of_birth_day: '',
    date_of_birth_year: '',
    sex: '',
    accessibility_needs: '',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [hasUserDetail, setHasUserDetail] = useState(false); // Track if userDetail exists

  // Fetch initial user data
  useEffect(() => {
    const fetchUserData = async () => {
      try {
        // Check if user is logged in via localStorage
        const user = JSON.parse(localStorage.getItem('user'));
        if (!user) {
          setError('User not logged in. Please log in to edit your profile.');
          return;
        }

        // Fetch full user data including userDetail from the backend
        const response = await axios.get('http://127.0.0.1:8000/api/user', {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`,
          },
        });
        const data = response.data;

        // Debug: Log the fetched data to inspect it
        console.log('Fetched user data:', data);

        // Split date_of_birth into month, day, year if it exists
        let month = '';
        let day = '';
        let year = '';
        if (data.user_detail?.date_of_birth) { // Changed from userDetail to user_detail
          const [yyyy, mm, dd] = data.user_detail.date_of_birth.split('-');
          year = yyyy;
          month = mm;
          day = dd;
        }

        // Set form data
        setFormData({
          name: data.name || '',
          bio: data.user_detail?.bio || '', // Changed from userDetail to user_detail
          date_of_birth_month: month,
          date_of_birth_day: day,
          date_of_birth_year: year,
          sex: data.user_detail?.sex || '', // Changed from userDetail to user_detail
          accessibility_needs: data.user_detail?.accessibility_needs || '', // Changed from userDetail to user_detail
        });

        // Debug: Log the form data after setting it
        console.log('Form data after setting:', {
          name: data.name || '',
          bio: data.user_detail?.bio || '',
          date_of_birth_month: month,
          date_of_birth_day: day,
          date_of_birth_year: year,
          sex: data.user_detail?.sex || '',
          accessibility_needs: data.user_detail?.accessibility_needs || '',
        });

        // Check if userDetail exists to determine button text
        setHasUserDetail(!!data.user_detail); // Changed from userDetail to user_detail
      } catch (err) {
        setError(err.response?.data?.message || 'Failed to load profile data. Please try again.');
      }
    };
    fetchUserData();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);
    setLoading(true);

    // Combine date of birth
    const dateOfBirth = formData.date_of_birth_year && formData.date_of_birth_month && formData.date_of_birth_day
      ? `${formData.date_of_birth_year}-${formData.date_of_birth_month}-${formData.date_of_birth_day}`
      : null;

    const payload = {
      name: formData.name,
      bio: formData.bio,
      date_of_birth: dateOfBirth,
      sex: formData.sex,
      accessibility_needs: formData.accessibility_needs,
    };

    try {
      const response = await axios.put('http://127.0.0.1:8000/api/user', payload, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
        },
      });
      // Update localStorage with the new user data
      localStorage.setItem('user', JSON.stringify(response.data));
      setSuccess('Profile updated successfully!');
      // Update hasUserDetail since data now exists
      setHasUserDetail(true);
    } catch (err) {
      setError(err.response?.data?.message || 'An error occurred while updating your profile. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container d-flex justify-content-center mt-5">
      <div
        className="w-100"
        style={{
          maxWidth: '600px',
          fontFamily: '"Segoe UI", "Helvetica Neue", system-ui, sans-serif',
          color: '#1a1a1a',
        }}
      >
        <h5 className="fw-bold mb-1">Informations de base</h5>
        <p className="text-muted mb-4" style={{ fontSize: '15px' }}>
          Assurez-vous que ces informations correspondent à votre pièce d’identité pour le voyage, par exemple votre passeport.
        </p>

        {success && <div className="alert alert-success">{success}</div>}
        {error && <div className="alert alert-danger">{error}</div>}

        <form onSubmit={handleSubmit}>
          {/* Nom */}
          <div className="mb-3">
            <label className="form-label">Nom *</label>
            <input
              type="text"
              className="form-control"
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
            />
          </div>

          {/* Bio */}
          <div className="mb-3">
            <label className="form-label">Bio</label>
            <textarea
              className="form-control"
              rows="3"
              name="bio"
              value={formData.bio}
              onChange={handleChange}
              placeholder="Aidez vos futurs hôtes à mieux vous connaître..."
            ></textarea>
          </div>

          {/* Date de naissance */}
          <label className="form-label">Date de naissance</label>
          <div className="row mb-3">
            <div className="col">
              <input
                type="text"
                className="form-control"
                name="date_of_birth_month"
                value={formData.date_of_birth_month}
                onChange={handleChange}
                placeholder="MM"
                maxLength="2"
              />
            </div>
            <div className="col">
              <input
                type="text"
                className="form-control"
                name="date_of_birth_day"
                value={formData.date_of_birth_day}
                onChange={handleChange}
                placeholder="JJ"
                maxLength="2"
              />
            </div>
            <div className="col">
              <input
                type="text"
                className="form-control"
                name="date_of_birth_year"
                value={formData.date_of_birth_year}
                onChange={handleChange}
                placeholder="AAAA"
                maxLength="4"
              />
            </div>
          </div>

          {/* Sexe */}
          <div className="mb-3">
            <label className="form-label">Sexe</label>
            <div className="form-check">
              <input
                className="form-check-input"
                type="radio"
                name="sex"
                id="femme"
                value="Femme"
                checked={formData.sex === 'Femme'}
                onChange={handleChange}
              />
              <label className="form-check-label" htmlFor="femme">Femme</label>
            </div>
            <div className="form-check">
              <input
                className="form-check-input"
                type="radio"
                name="sex"
                id="homme"
                value="Homme"
                checked={formData.sex === 'Homme'}
                onChange={handleChange}
              />
              <label className="form-check-label" htmlFor="homme">Homme</label>
            </div>
            <div className="form-check">
              <input
                className="form-check-input"
                type="radio"
                name="sex"
                id="nonbinaire"
                value="Non binaire (X)"
                checked={formData.sex === 'Non binaire (X)'}
                onChange={handleChange}
              />
              <label className="form-check-label" htmlFor="nonbinaire">Non binaire (X)</label>
            </div>
            <div className="form-check">
              <input
                className="form-check-input"
                type="radio"
                name="sex"
                id="nondeclaré"
                value="Non déclaré (U)"
                checked={formData.sex === 'Non déclaré (U)'}
                onChange={handleChange}
              />
              <label className="form-check-label" htmlFor="nondeclaré">Non déclaré (U)</label>
            </div>
          </div>

          {/* Besoins d’accessibilité */}
          <div className="mb-4">
            <label className="form-label">Besoins d’accessibilité</label>
            <select
              className="form-select"
              name="accessibility_needs"
              value={formData.accessibility_needs}
              onChange={handleChange}
            >
              <option value="">Non précisés</option>
              <option value="Besoin fauteuil roulant">Besoin fauteuil roulant</option>
              <option value="Déficience visuelle">Déficience visuelle</option>
              <option value="Autre">Autre</option>
            </select>
          </div>

          {/* Enregistrer/Edit */}
          <div className="text-center">
            <button className="btn btn-primary px-4" type="submit" disabled={loading}>
              {loading ? (
                <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
              ) : hasUserDetail ? (
                'Edit'
              ) : (
                'Enregistrer'
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default EditProfile;