'use client';

import React from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import { LatLngTuple } from 'leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';

// Fix Leaflet marker URLs
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: '/leaflet/marker-icon-2x.png',
  iconUrl: '/leaflet/marker-icon.png',
  shadowUrl: '/leaflet/marker-shadow.png',
});

const Map = ({ services }: { services: any[] }) => {
  const firstLat = services[0]?.company.latitude;
  const firstLng = services[0]?.company.longitude;

  const defaultPosition: LatLngTuple =
    typeof firstLat === 'number' && typeof firstLng === 'number'
      ? [firstLat, firstLng]
      : [41.3275, 19.8189]; // Tirana fallback

  return (
    <MapContainer center={defaultPosition} zoom={8} className="h-[500px] w-full rounded-xl z-0">
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org">OpenStreetMap</a>'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      {services.map((service) => {
        const lat = service.company.latitude;
        const lng = service.company.longitude;

        if (typeof lat !== 'number' || typeof lng !== 'number') return null;

        const position: LatLngTuple = [lat, lng];

        return (
          <Marker key={service.id} position={position}>
            <Popup>
              <strong>{service.name}</strong><br />
              {service.company.name}<br />
              €{service.price}
            </Popup>
          </Marker>
        );
      })}
    </MapContainer>
  );
};

export default Map;
