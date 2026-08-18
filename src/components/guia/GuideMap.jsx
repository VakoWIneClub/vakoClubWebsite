import React from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import L from 'leaflet';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';

delete L.Icon.Default.prototype._getIconUrl;

L.Icon.Default.mergeOptions({
    iconRetinaUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon-2x.png',
    iconUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png',
    shadowUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-shadow.png'
});

const GuideMap = ({ wineries }) => {
    // != null (not truthy) so a winery legitimately sitting on the equator/prime meridian
    // (latitude or longitude === 0) isn't silently dropped from the map.
    const wineriesWithCoords = wineries.filter(w => w.latitude != null && w.longitude != null);

    if (wineriesWithCoords.length === 0) {
        return (
            <div className="h-[500px] flex items-center justify-center border border-copa-gold bg-copa-creamDeep text-copa-ink/60" style={{ fontFamily: "'EB Garamond', serif" }}>
                No hay bodegas con ubicación para mostrar en el mapa.
            </div>
        );
    }

    const bounds = L.latLngBounds(wineriesWithCoords.map(w => [w.latitude, w.longitude]));

    return (
        <motion.div
            className="h-[500px] border border-copa-gold overflow-hidden"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
        >
            <MapContainer bounds={bounds} scrollWheelZoom={true} style={{ height: '100%', width: '100%', zIndex: 0 }}>
                <TileLayer
                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                />
                {wineriesWithCoords.map(winery => (
                    <Marker key={winery.id} position={[winery.latitude, winery.longitude]}>
                        <Popup>
                            <div className="text-center">
                                <strong className="font-cormorant text-lg text-copa-ink">{winery.title}</strong>
                                <p className="text-sm text-copa-ink/70">{winery.city}, {winery.country}</p>
                                <Link to={`/guia/${winery.slug}`} className="copa-btn-nav mt-2 inline-flex">Ver Bodega</Link>
                            </div>
                        </Popup>
                    </Marker>
                ))}
            </MapContainer>
        </motion.div>
    );
};

export default GuideMap;