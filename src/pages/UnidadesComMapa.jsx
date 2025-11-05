@@ -1,58 +1,60 @@
import { useState, useEffect, useRef } from 'react';
import { MapPin, Phone, Clock, Navigation, AlertCircle, Loader2, Map, RefreshCw, Search } from 'lucide-react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

// Fix para ícones do Leaflet no React
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

// Ícones personalizados para diferentes tipos de unidades
const publicIcon = new L.Icon({
  iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-blue.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41]
});

const privateIcon = new L.Icon({
  iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-violet.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41]
});

const userIcon = new L.Icon({
  iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-red.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41]
});

// Componente para centralizar o mapa
function MapController({ center, zoom }) {
  const map = useMap();

  useEffect(() => {
    if (center) {
      map.setView(center, zoom);
    }
  }, [center, zoom, map]);

  return null;
}

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'https://meialuaback.onrender.com';

const UnidadesComMapa = () => {
  const [unidades, setUnidades] = useState([]);
  const [loading, setLoading] = useState(false);
@@ -134,7 +136,7 @@
    setError(null);

    try {
      const url = `https://meialuaback.onrender.com/api/unidades?cidade=${encodeURIComponent(searchCity)}&radius=50000`;
      const url = `${API_BASE_URL}/api/unidades?cidade=${encodeURIComponent(searchCity)}&radius=50000`;
      console.log("URL da requisição:", url);

      const response = await fetch(url);
@@ -185,7 +187,7 @@
      setLoading(true);
      setError(null);

      const url = `https://meialuaback.onrender.com/api/unidades?lat=${lat}&lng=${lng}&radius=50000`;
      const url = `${API_BASE_URL}/api/unidades?lat=${lat}&lng=${lng}&radius=50000`;
      console.log("URL da requisição:", url);

      const response = await fetch(url);
@@ -542,5 +544,3 @@
};

export default UnidadesComMapa;
