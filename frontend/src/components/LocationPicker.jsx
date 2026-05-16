import { useEffect, useRef, useState } from "react";
import { useNavigate } from 'react-router-dom';
import { isUserLoggedIn } from '../utils/authStorage.js';
import './LocationPicker.css';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

function LocationPicker({ show, onClose }) {
    const mapRef = useRef(null);
    const leafletMap = useRef(null);
    const markerRef = useRef(null);
    const [status, setStatus] = useState('');

    useEffect(() => {
        if (!show) return;

        if (!leafletMap.current) {
            leafletMap.current = L.map(mapRef.current, { zoomControl: true, attributionControl: false }).setView([20.5937, 78.9629], 5);

            L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
                maxZoom: 19,
            }).addTo(leafletMap.current);
        }

        return () => {
            // keep map instance for reuse
        };
    }, [show]);

    const setMarker = (lat, lng) => {
        if (!leafletMap.current) return;

        if (markerRef.current) {
            markerRef.current.setLatLng([lat, lng]);
        } else {
            markerRef.current = L.circleMarker([lat, lng], { radius: 8, color: '#ff2d6f', fillColor: '#ff2d6f', fillOpacity: 1 }).addTo(leafletMap.current);
        }

        leafletMap.current.setView([lat, lng], 15);
    };

    const useMyLocation = () => {
        if (!navigator.geolocation) {
            setStatus('Geolocation is not supported in this browser.');
            return;
        }

        setStatus('Locating...');
        navigator.geolocation.getCurrentPosition(
            (position) => {
                const { latitude, longitude } = position.coords;
                setMarker(latitude, longitude);
                setStatus('Location found');
            },
            (err) => {
                setStatus('Unable to retrieve location: ' + (err.message || 'error'));
            },
            { enableHighAccuracy: true, timeout: 10000 }
        );
    };

    const navigate = useNavigate();

    const saveLocation = async () => {
        if (!markerRef.current) {
            setStatus('Please select a location on the map first');
            return;
        }

        if (!isUserLoggedIn()) {
            navigate('/login', { state: { from: window.location.pathname } });
            return;
        }

        const latlng = markerRef.current.getLatLng();

        const token = localStorage.getItem('token') || localStorage.getItem('authToken');

        try {
            const res = await fetch('/api/location', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    ...(token ? { Authorization: `Bearer ${token}` } : {}),
                },
                body: JSON.stringify({ latitude: latlng.lat, longitude: latlng.lng }),
            });

            if (!res.ok) {
                const payload = await res.json().catch(() => ({}));
                throw new Error(payload?.error || 'Failed to save location');
            }

            setStatus('Location saved');
            setTimeout(() => onClose && onClose(true), 600);
        } catch (error) {
            setStatus('Error saving location: ' + (error.message || 'error'));
        }
    };

    const onMapClick = (e) => {
        const { lat, lng } = e.latlng;
        setMarker(lat, lng);
    };

    useEffect(() => {
        if (!leafletMap.current) return;
        leafletMap.current.off('click', onMapClick);
        leafletMap.current.on('click', onMapClick);
    }, [leafletMap.current]);

    if (!show) return null;

    return (
        <div className="lp-overlay" role="dialog" aria-modal="true">
            <div className="lp-modal">
                <div className="lp-header">
                    <h3>Select Location</h3>
                    <button type="button" className="lp-close" onClick={() => onClose && onClose(false)}>✕</button>
                </div>
                <div className="lp-body">
                    <div ref={mapRef} className="lp-map" />
                    <div className="lp-controls">
                        <button type="button" onClick={useMyLocation}>Use my location</button>
                        <button type="button" onClick={saveLocation}>Save location</button>
                        <div className="lp-status">{status}</div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default LocationPicker;
