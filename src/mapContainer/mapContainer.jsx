import React, { useEffect, useRef } from 'react';
import mapboxgl from 'mapbox-gl';
import {ACCESS_TOKEN} from '../constants';

const MapContainer = ({ mapboxAccessToken, onVisibleRegionChange }) => {
  const mapRef = useRef(null);

  useEffect(() => {
    mapboxgl.accessToken = ACCESS_TOKEN;
    const map = new mapboxgl.Map({
      container: mapRef.current,
      style: 'mapbox://styles/mapbox/streets-v11',
      center: [-122.4194, 37.7749],
      zoom: 14,
    });

    map.on('click', event => {
      const visibleRegion = {
        lng: event.lngLat.lng,
        lat: event.lngLat.lat,
      };
      onVisibleRegionChange(visibleRegion);
    });

    return () => {
      map.remove();
    };
  }, [mapboxAccessToken, onVisibleRegionChange]);

  return <div id='map-container' ref={mapRef} style={{ height: '50vh', width: '0vw' }} />;
};

export default MapContainer;
