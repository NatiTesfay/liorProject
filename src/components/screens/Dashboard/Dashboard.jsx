import React, { useEffect, useState } from 'react';
import { jwtDecode } from 'jwt-decode';
import MapComponent from './mapComponents';
import './Dashboard.css';

const Dashboard = () => {
  const [user, setUser] = useState(null);
  const [location, setLocation] = useState({ latitude: null, longitude: null });
  const [key, setKey] = useState(0);
  const [address, setAddress] = useState({
    country: '',
    city: '',
    street: '',
    streetNum: '',
  });

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      const decoded = jwtDecode(token);
      setUser(decoded);
    }

    getLocation();
  }, []);

  const getLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          console.log('Location obtained:', position.coords);
          setLocation({
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
          });
          setKey((prevKey) => prevKey + 1); // Update key to force re-render
        },
        (error) => {
          console.error('Error getting location:', error);
        }
      );
    }
  };

  useEffect(() => {
    console.log('Location state updated:', location);
  }, [location]);

  if (!user) {
    return <div>Loading...</div>;
  }

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setAddress((prevFormData) => ({
      ...prevFormData,
      [name]: value,
    }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    console.log('The country is', address.country);
    console.log('The city is', address.city);
    console.log('The street is', address.street);
    console.log('The streetNum is', address.streetNum);
    const fullAddress = `${address.street} ${address.streetNum}, ${address.city}, ${address.country}`;

    try {
      const response = await fetch(
        `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(
          fullAddress
        )}`
      );
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      const data = await response.json();
      if (data.length === 0) {
        throw new Error('No results found');
      }
      const latitude = data[0].lat;
      const longitude = data[0].lon;
      console.log(latitude, longitude);
      setLocation({
        latitude: latitude,
        longitude: longitude,
      });
      setKey((prevKey) => prevKey + 1); // Update key to force re-render
    } catch (error) {
      console.error('Error fetching location:', error);
      alert(
        'Could not find the address. Please check your input and try again.'
      );
    }
  };

  return (
    <div className='container-main-page'>
      <div className='titles-main-page'>
        <h1>Dashboard</h1>
        <p>Welcome, {user.fullName}!</p>
        <p>GIS-NTA is in town!</p>
        <div className='separator'></div>
        <label className='address-text' htmlFor='address bar'>
          Address:
        </label>
        <form className='form-grid' onSubmit={handleSubmit}>
          <input
            className='address-input'
            type='text'
            name='country'
            onChange={handleInputChange}
            placeholder='Enter country'
          />
          <input
            className='address-input'
            type='text'
            name='city'
            onChange={handleInputChange}
            placeholder='Enter city'
          />
          <input
            className='address-input'
            type='text'
            name='street'
            onChange={handleInputChange}
            placeholder='Enter street'
          />
          <input
            className='address-input'
            type='text'
            name='streetNum'
            onChange={handleInputChange}
            placeholder='Enter street number'
          />
          <button className='address-input resetBtn' type='submit'>
            Submit
          </button>
        </form>
        <div className='separator'></div>
        <div className='CenterBtn'>
          <button className='resetBtn' onClick={getLocation}>
            My Location
          </button>
        </div>
      </div>
      <div className='iframe-main-page'>
        {location.latitude && location.longitude ? (
          <MapComponent
            key={key}
            latitude={location.latitude}
            longitude={location.longitude}
          />
        ) : (
          <div>Loading map...</div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;
