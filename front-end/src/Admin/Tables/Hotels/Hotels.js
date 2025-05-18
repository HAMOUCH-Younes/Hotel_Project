import React, { useState, useEffect } from 'react';
import Layout from '../../Layout/Layout';

const Hotels = () => {
  const [hotels, setHotels] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchHotels = async () => {
      try {
        const response = await fetch('http://localhost:8000/api/hotels');
        const data = await response.json();
        setHotels(data);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching hotels:', error);
        setLoading(false);
      }
    };
    fetchHotels();
  }, []);

  if (loading) return <div>Loading...</div>;

  return (
    <Layout >
    <div>
      <h2>Hotels List</h2>
      <ul>
        {hotels.map((hotel) => (
          <li key={hotel.id}>{hotel.name} - {hotel.location}</li>
        ))}
      </ul>
    </div>
    </Layout>
  );
};

export default Hotels;