import React, { useEffect, useState } from 'react';
import { jwtDecode } from 'jwt-decode'; // Use named import
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
  const [addressList, setAddressList] = useState([]);
  const [locationList, setLocationList] = useState([]);
  const [locationFetched, setLocationFetched] = useState(false);
  const [showWelcomePopup, setShowWelcomePopup] = useState(true);
  const [showDashboard, setShowDashboard] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      try {
        const decoded = jwtDecode(token);
        setUser(decoded);

        const timer = setTimeout(() => {
          setShowWelcomePopup(false);
          setShowDashboard(true);
        }, 4000);

        return () => clearTimeout(timer);
      } catch (error) {
        console.error('Error decoding token:', error);
      }
    }
  }, []);

  // Remove getLocation function if not used

  useEffect(() => {
    console.log('Location state updated:', location);
  }, [location]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setAddress((prevFormData) => ({
      ...prevFormData,
      [name]: value,
    }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    const addressArray = [
      `Country: ${address.country}`,
      `City: ${address.city}`,
      `Street: ${address.street}`,
      `Street Number: ${address.streetNum}`,
    ];
    setAddressList(addressArray);

    const fullAddress = `${address.street} ${address.streetNum}, ${address.city}, ${address.country}`;

    try {
      const response = await fetch(
        `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(fullAddress)}`
      );

      if (!response.ok) {
        const errorDetails = await response.text();
        throw new Error(`Network response was not ok: ${response.status} ${response.statusText}. Details: ${errorDetails}`);
      }

      const data = await response.json();
      if (data.length === 0) {
        throw new Error('No results found');
      }

      const latitude = data[0].lat;
      const longitude = data[0].lon;
      setLocation({
        latitude: latitude,
        longitude: longitude,
      });
      setKey((prevKey) => prevKey + 1); // Update key to force re-render
    } catch (error) {
      console.error('Error fetching location:', error);
      alert(
        `Could not find the address. Please check your input and try again. Error: ${error.message}`
      );
    }
  };

  const handleMyLocationClick = () => {
    if (!locationFetched) {
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
          (position) => {
            const newLocation = {
              latitude: position.coords.latitude,
              longitude: position.coords.longitude,
            };
            setLocation(newLocation);
            setLocationList((prevList) => [
              ...prevList,
              `Lat: ${newLocation.latitude}, Lon: ${newLocation.longitude}`
            ]);
            setLocationFetched(true); // Set flag to true after fetching location
          },
          (error) => {
            console.error('Error getting location:', error);
          }
        );
      }
    }
  };

  if (!user) {
    return <div>Loading...</div>;
  }

  return (
    <div className='container-main-page'>
      {/* Welcome Popup */}
      {showWelcomePopup && (
        <div className='welcome-popup'>
          <div className='welcome-popup-content'>
            <h2 style={{ color: 'black' }}>Welcome, {user.fullName}!</h2>
            <p style={{ color: 'black' }}>We are glad to have you here.</p>
          </div>
        </div>
      )}
  
      {showDashboard && (
        <div className='dashboard-content'>
          <div className='left-side'>
            <div className='titles-main-page'>
              <h1>GPS Project</h1>
              <p>Welcome, {user.fullName}!</p>
              <p>GIS-NTA is in town!</p>
              <div className='separator'></div>
              <label className='address-text' htmlFor='address bar'>
                Please Fill Your Address:
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
                <button className='resetBtn' onClick={handleMyLocationClick}>
                  My Location
                </button>
              </div>
              <div className='address-display'>
                {addressList.length > 0 && (
                  <ul>
                    {addressList.map((item, index) => (
                      <li key={index}>{item}</li>
                    ))}
                  </ul>
                )}
              </div>
              <div className='location-list'>
                {locationList.length > 0 && (
                  <ul>
                    {locationList.map((loc, index) => (
                      <li key={index}>{loc}</li>
                    ))}
                  </ul>
                )}
              </div>
            </div>
          </div>
          <div className='right-side'>
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
      )}
    </div>
  );
};

export default Dashboard;
