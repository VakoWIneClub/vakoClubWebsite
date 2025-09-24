import React from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import L from 'leaflet';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';

delete L.Icon.Default.prototype._getIconUrl;

L.Icon.Default.mergeOptions({
    iconRetinaUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon-2x.png',
    iconUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png',
    shadowUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-shadow.png'
});

const GuideMap = ({ wineries }) => {
    const wineriesWithCoords = wineries.filter(w => w.latitude && w.longitude);

    if (wineriesWithCoords.length === 0) {
        return (
            <div className="h-[500px] flex items-center justify-center bg-stone-900/50 rounded-2xl text-amber-100/70">
                No hay bodegas con ubicación para mostrar en el mapa.
            </div>
        );
    }

    const bounds = L.latLngBounds(wineriesWithCoords.map(w => [w.latitude, w.longitude]));

    return (
        <motion.div 
            className="h-[500px] rounded-2xl overflow-hidden shadow-lg shadow-black/20"
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
                                <strong className="font-playfair text-lg text-stone-800">{winery.title}</strong>
                                <p className="text-sm text-stone-600">{winery.city}, {winery.country}</p>
                                <Button asChild size="sm" className="mt-2">
                                    <Link to={`/guia/${winery.slug}`}>Ver Bodega</Link>
                                </Button>
                            </div>
                        </Popup>
                    </Marker>
                ))}
            </MapContainer>
        </motion.div>
    );
};

export default GuideMap;