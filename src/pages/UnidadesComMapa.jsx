import { useState, useEffect, useRef } from 'react';
import { MapPin, Phone, Clock, Navigation, AlertCircle, Loader2, Map, RefreshCw, Search } from 'lucide-react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';


delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});


const publicIcon = new L.Icon({
  iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-violet.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41]
});


const privateIcon = new L.Icon({
  iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-blue.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41]
});


const userLocationIcon = new L.Icon({
  iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-red.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41]
});


const MapLegend = () => {
  const legendStyle = {
    position: 'absolute',
    bottom: '20px',
    right: '20px',
    zIndex: 1000,
    backgroundColor: 'white',
    padding: '10px',
    borderRadius: '5px',
    boxShadow: '0 2px 4px rgba(0,0,0,0.2)',
    fontSize: '14px',
    lineHeight: '1.5',
  };

  const itemStyle = {
    display: 'flex',
    alignItems: 'center',
    marginBottom: '5px',
  };

  const colorStyle = {
    width: '10px',
    height: '10px',
    borderRadius: '50%',
    marginRight: '8px',
  };

  return (
    <div style={legendStyle}>
      <div style={{ fontWeight: 'bold', marginBottom: '5px' }}>Legenda</div>
      <div style={itemStyle}>
        <span style={{ ...colorStyle, backgroundColor: 'red' }}></span>
        🔴 Sua localização
      </div>
      <div style={itemStyle}>
        <span style={{ ...colorStyle, backgroundColor: 'purple' }}></span>
        🟣 Unidades Públicas
      </div>
      <div style={itemStyle}>
        <span style={{ ...colorStyle, backgroundColor: 'blue' }}></span>
        🔵 Unidades Privadas
      </div>
    </div>
  );
};


export default function UnidadesComMapa() {
  const [unidades, setUnidades] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [userLocation, setUserLocation] = useState(null);
  const mapRef = useRef(null);

  
  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setUserLocation({
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          });
        },
        (err) => {
          console.error("Erro ao obter a localização: ", err);
       
          setUserLocation({ lat: -15.7801, lng: -47.9292 }); 
        }
      );
    } else {
      console.log("Geolocalização não é suportada pelo navegador.");
      
      setUserLocation({ lat: -15.7801, lng: -47.9292 }); 
    }
  }, []);

  
  useEffect(() => {

    const mockUnidades = [
      { id: 1, nome: "Hospital Público Central", tipo: "Publica", lat: -15.785, lng: -47.935 },
      { id: 2, nome: "Clínica Privada Alfa", tipo: "Privada", lat: -15.770, lng: -47.910 },
      { id: 3, nome: "Posto de Saúde Comunitário", tipo: "Publica", lat: -15.790, lng: -47.900 },
      { id: 4, nome: "Hospital Privado Beta", tipo: "Privada", lat: -15.765, lng: -47.940 },
    ];

    setTimeout(() => {
      setUnidades(mockUnidades);
      setLoading(false);
    }, 1000); 
  }, []);

  if (loading || !userLocation) {
    return <div className="flex justify-center items-center h-screen"><Loader2 className="animate-spin" size={48} /> Carregando Mapa...</div>;
  }

  if (error) {
    return <div className="text-red-500 p-4">Erro ao carregar dados: {error.message}</div>;
  }

  
  function ChangeView({ center }) {
    const map = useMap();
    map.setView(center, map.getZoom());
    return null;
  }

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Unidades de Saúde com Mapa</h1>
      <div className="relative h-[600px] w-full rounded-lg shadow-lg">
        <MapContainer
          center={[userLocation.lat, userLocation.lng]}
          zoom={13}
          scrollWheelZoom={false}
          style={{ height: '100%', width: '100%' }}
          whenCreated={mapInstance => { mapRef.current = mapInstance; }}
        >
          <ChangeView center={[userLocation.lat, userLocation.lng]} />
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />

          {}
          <Marker position={[userLocation.lat, userLocation.lng]} icon={userLocationIcon}>
            <Popup>
              🔴 Sua Localização
            </Popup>
          </Marker>

          {}
          {unidades.map((unidade) => (
            <Marker
              key={unidade.id}
              position={[unidade.lat, unidade.lng]}
              icon={unidade.tipo === 'Publica' ? publicIcon : privateIcon}
            >
              <Popup>
                <div className="font-bold">{unidade.nome}</div>
                <div>Tipo: {unidade.tipo === 'Publica' ? '🟣 Pública' : '🔵 Privada'}</div>
              </Popup>
            </Marker>
          ))}
        </MapContainer>
        {}
        <MapLegend />
      </div>
    </div>
  );
}
