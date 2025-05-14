import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import 'bootstrap/dist/css/bootstrap.min.css';

function ProfileInfo() {
  const [userData, setUserData] = useState({
    name: '',
    email: '',
    bio: 'Non précisée',
    date_of_birth: 'Non précisée',
    sex: 'Non précisé',
    accessibility_needs: 'Non précisés',
    phone_number: 'Non précisé',
    emergency_contact: 'Non précisé',
    address: 'Non précisée',
    cin: 'Non précisé', // Added for CIN
    icon: 'Aucune icône sélectionnée', // Added for user icon
  });
  const [error, setError] = useState(null);

  // Fetch user data on mount
  useEffect(() => {
    const fetchUserData = async () => {
      try {
        // First, check localStorage for basic user data
        const user = JSON.parse(localStorage.getItem('user'));
        if (!user) {
          setError('User not logged in. Please log in to view your profile.');
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

        setUserData({
          name: data.name || 'Non précisé',
          email: data.email || 'Non précisé',
          bio: data.user_detail?.bio || 'Non précisée',
          date_of_birth: data.user_detail?.date_of_birth || 'Non précisée',
          sex: data.user_detail?.sex || 'Non précisé',
          accessibility_needs: data.user_detail?.accessibility_needs || 'Non précisés',
          phone_number: data.user_detail?.phone_number || 'Non précisé',
          emergency_contact: data.user_detail?.emergency_contact || 'Non précisé',
          address: data.user_detail?.address || 'Non précisée',
          cin: data.user_detail?.cin || 'Non précisé', // Fetch CIN
          icon: data.user_detail?.icon || 'Aucune icône sélectionnée', // Fetch icon
        });
      } catch (err) {
        setError(err.response?.data?.message || 'Failed to load profile data. Please try again.');
      }
    };
    fetchUserData();
  }, []);

  return (
    <div className="container mt-5 d-flex justify-content-center ">
      <div
        className="bg-white rounded shadow-sm p-4 w-100"
        style={{
          maxWidth: '800px',
          fontFamily: '"Segoe UI", "Helvetica Neue", system-ui, sans-serif',
          fontSize: '16px',
          color: '#1a1a1a',
        }}
      >
        {/* Display error if any */}
        {error && <div className="alert alert-danger">{error}</div>}

        {/* Nom principal */}
        <h3 className="fw-bold mb-4">{userData.name}</h3>

        {/* Informations de base */}
        <div className="d-flex justify-content-between align-items-center mb-3">
          <h5 className="fw-bold mb-0">Informations de base</h5>
          <Link to="/profile/edit" className="text-primary fw-semibold" style={{ textDecoration: 'none' }}>
            Modifier
          </Link>
        </div>
        <p className="text-muted mb-4">
          Assurez-vous que ces informations correspondent à votre pièce d’identité pour le voyage, par exemple votre passeport.
        </p>

        <div className="row mb-5">
          <div className="col-md-6 mb-3">
            <strong>Nom</strong><br />
            {userData.name}
          </div>
          <div className="col-md-6 mb-3">
            <strong>Bio</strong><br />
            {userData.bio}
          </div>
          <div className="col-md-6 mb-3">
            <strong>Date de naissance</strong><br />
            {userData.date_of_birth}
          </div>
          <div className="col-md-6 mb-3">
            <strong>Sexe</strong><br />
            {userData.sex}
          </div>
          <div className="col-md-6 mb-3">
            <strong>Besoins d’accessibilité</strong><br />
            {userData.accessibility_needs}
          </div>
        </div>

        {/* Account Settings */}
        <div className="d-flex justify-content-between align-items-center mb-3 mt-5">
          <h5 className="fw-bold mb-0">Paramètres du compte</h5>
          <Link to="/profile/settings" className="text-primary fw-semibold" style={{ textDecoration: 'none' }}>
            Modifier
          </Link>
        </div>
        <p className="text-muted mb-4">
          Gérez votre e-mail, mot de passe, icône de compte et CIN.
        </p>

        <div className="row mb-5">
          <div className="col-md-6 mb-3">
            <strong>Email</strong><br />
            {userData.email}
          </div>
          <div className="col-md-6 mb-3">
            <strong>Mot de passe</strong><br />
            **********
          </div>
          <div className="col-md-6 mb-3">
            <strong>Icône user</strong><br />
            {userData.icon}
          </div>
          <div className="col-md-6 mb-3">
            <strong>CIN</strong><br />
            {userData.cin}
          </div>
        </div>

        {/* Contact */}
        <div className="d-flex justify-content-between align-items-center mb-3">
          <h5 className="fw-bold mb-0">Contact</h5>
          <Link to="/contact" className="text-primary fw-semibold" style={{ textDecoration: 'none' }}>
            Modifier
          </Link>
        </div>
        <p className="text-muted mb-4">
          Partagez ces informations pour recevoir des mises à jour de voyages et des alertes liées à l’activité de votre compte.
        </p>

        <div className="row mb-5">
          <div className="col-md-6 mb-3">
            <strong>Numéro de téléphone portable</strong><br />
            {userData.phone_number}
          </div>
          <div className="col-md-6 mb-3">
            <strong>Adresse e-mail</strong><br />
            {userData.email}
          </div>
          <div className="col-md-6 mb-3">
            <strong>Contact en cas d’urgence</strong><br />
            {userData.emergency_contact}
          </div>
          <div className="col-md-6 mb-3">
            <strong>Adresse</strong><br />
            {userData.address}
          </div>
        </div>

        
      </div>
    </div>
  );
}

export default ProfileInfo;