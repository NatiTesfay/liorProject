import React, { useEffect } from 'react';

const MapComponent = ({ latitude, longitude }) => {
  useEffect(() => {
    console.log('MapComponent received props:', { latitude, longitude });
  }, [latitude, longitude]);

  const src = `http://localhost:8080/#18/${latitude}/${longitude}`;

  return (
    <div style={{ width: '100%', height: '75vh' }}>
      <iframe
        src={src}
        style={{ width: '100%', height: '100%', border: 'none' }}
        title='QGIS Map'
        className='full-width'
      ></iframe>
    </div>
  );
};

export default MapComponent;
