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
} );

// Ícones personalizados para diferentes tipos de unidades
const publicIcon = new L.Icon({
  iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-blue.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41]
} );

const privateIcon = new L.Icon({
  iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-violet.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41]
} );

const userIcon = new L.Icon({
  iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-red.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41]
} );

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

const UnidadesComMapa = ( ) => {
  const [unidades, setUnidades] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [searchCity, setSearchCity] = useState('');
  const [userLocation, setUserLocation] = useState(null);
  const [center, setCenter] = useState([-15.7801, -47.9292]); // Centro do Brasil (Brasília)
  const [zoom, setZoom] = useState(4);
  const mapRef = useRef(null);

  const fetchUnidadesByCity = async () => {
    setLoading(true);
    setError(null);

    try {
      const url = `${API_BASE_URL}/api/unidades?cidade=${encodeURIComponent(searchCity)}&radius=50000`;
      console.log("URL da requisição (cidade):", url);

      const response = await fetch(url);
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Erro ao buscar unidades por cidade.');
      }

      setUnidades(data);
      setLoading(false);
      // Ajustar o mapa para a primeira unidade encontrada ou para o centro da cidade
      if (data.length > 0) {
        setCenter([data[0].latitude, data[0].longitude]);
        setZoom(10);
      }
    } catch (err) {
      console.error("Erro ao buscar unidades por cidade:", err);
      setError(err.message);
      setLoading(false);
    }
  };

  const fetchUnidadesByLocation = async (lat, lng) => {
    setLoading(true);
    setError(null);

    try {
      const url = `${API_BASE_URL}/api/unidades?lat=${lat}&lng=${lng}&radius=50000`;
      console.log("URL da requisição (localização):", url);

      const response = await fetch(url);
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Erro ao buscar unidades por localização.');
      }

      setUnidades(data);
      setLoading(false);
      setCenter([lat, lng]);
      setZoom(10);
    } catch (err) {
      console.error("Erro ao buscar unidades por localização:", err);
      setError(err.message);
      setLoading(false);
    }
  };

  // useEffect para buscar unidades ao carregar ou mudar a cidade
  useEffect(() => {
    if (searchCity) {
      fetchUnidadesByCity();
    }
  }, [searchCity]);

  // useEffect para buscar a localização do usuário
  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          setUserLocation([latitude, longitude]);
          fetchUnidadesByLocation(latitude, longitude);
        },
        (error) => {
          console.error("Erro ao obter localização:", error);
          setError("Não foi possível obter sua localização. Busque por uma cidade.");
          fetchUnidadesByCity(); // Tenta buscar por cidade se a localização falhar
        }
      );
    } else {
      setError("Geolocalização não é suportada por este navegador.");
      fetchUnidadesByCity(); // Tenta buscar por cidade se a geolocalização não for suportada
    }
  }, []); // Executa apenas na montagem

  // Função para obter o ícone baseado no tipo de unidade
  const getIcon = (tipo) => {
    if (tipo === 'Pública') return publicIcon;
    if (tipo === 'Privada') return privateIcon;
    return publicIcon; // Padrão
  };

  // Função para renderizar a lista de unidades
  const renderUnidadesList = () => (
    <div className="w-full lg:w-1/3 p-4 overflow-y-auto h-full bg-white shadow-lg rounded-lg">
      <h2 className="text-2xl font-bold mb-4 text-gray-800">Unidades Encontradas ({unidades.length})</h2>
      {loading && (
        <div className="flex justify-center items-center p-4">
          <Loader2 className="w-6 h-6 animate-spin text-blue-500" />
          <span className="ml-2 text-gray-600">Carregando unidades...</span>
        </div>
      )}
      {error && (
        <div className="flex items-center p-4 bg-red-100 border border-red-400 text-red-700 rounded mb-4">
          <AlertCircle className="w-5 h-5 mr-2" />
          <span>Erro: {error}</span>
        </div>
      )}
      {!loading && unidades.length === 0 && !error && (
        <p className="text-gray-600">Nenhuma unidade encontrada. Tente buscar por outra cidade.</p>
      )}
      <div className="space-y-4">
        {unidades.map((unidade) => (
          <div
            key={unidade._id}
            className="p-4 border border-gray-200 rounded-lg shadow-sm hover:shadow-md transition duration-300 cursor-pointer"
            onClick={() => {
              setCenter([unidade.latitude, unidade.longitude]);
              setZoom(15);
            }}
          >
            <h3 className="text-xl font-semibold text-blue-600">{unidade.nome}</h3>
            <p className="text-sm text-gray-500 mb-2">{unidade.tipo}</p>
            <div className="flex items-center text-gray-700 mb-1">
              <MapPin className="w-4 h-4 mr-2 text-red-500" />
              <span>{unidade.endereco}, {unidade.cidade} - {unidade.estado}</span>
            </div>
            {unidade.telefone && (
              <div className="flex items-center text-gray-700 mb-1">
                <Phone className="w-4 h-4 mr-2 text-green-500" />
                <span>{unidade.telefone}</span>
              </div>
            )}
            {unidade.horario_funcionamento && (
              <div className="flex items-center text-gray-700">
                <Clock className="w-4 h-4 mr-2 text-yellow-500" />
                <span>{unidade.horario_funcionamento}</span>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );

  // Função para renderizar o mapa
  const renderMap = () => (
    <div className="w-full lg:w-2/3 h-full">
      <MapContainer
        center={center}
        zoom={zoom}
        scrollWheelZoom={true}
        className="h-full w-full rounded-lg shadow-xl"
        ref={mapRef}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        <MapController center={center} zoom={zoom} />
        {userLocation && (
          <Marker position={userLocation} icon={userIcon}>
            <Popup>Sua Localização</Popup>
          </Marker>
         )}
        {unidades.map((unidade) => (
          <Marker
            key={unidade._id}
            position={[unidade.latitude, unidade.longitude]}
            icon={getIcon(unidade.tipo)}
          >
            <Popup>
              <div className="font-sans">
                <h4 className="text-lg font-bold text-blue-700">{unidade.nome}</h4>
                <p className="text-sm text-gray-600 mb-1">{unidade.tipo}</p>
                <p className="flex items-center text-sm text-gray-700">
                  <MapPin className="w-3 h-3 mr-1 text-red-500" />
                  {unidade.endereco}, {unidade.cidade} - {unidade.estado}
                </p>
                {unidade.telefone && (
                  <p className="flex items-center text-sm text-gray-700">
                    <Phone className="w-3 h-3 mr-1 text-green-500" />
                    {unidade.telefone}
                  </p>
                )}
                {unidade.horario_funcionamento && (
                  <p className="flex items-center text-sm text-gray-700">
                    <Clock className="w-3 h-3 mr-1 text-yellow-500" />
                    {unidade.horario_funcionamento}
                  </p>
                )}
                <a
                  href={`https://www.google.com/maps/dir/?api=1&destination=${unidade.latitude},${unidade.longitude}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-2 inline-flex items-center text-blue-500 hover:text-blue-700 transition duration-150 text-sm font-medium"
                >
                  <Navigation className="w-4 h-4 mr-1" />
                  Obter Direções
                </a>
              </div>
            </Popup>
          </Marker>
         ))}
      </MapContainer>
    </div>
  );

  return (
    <div className="flex flex-col lg:flex-row h-screen p-4 space-y-4 lg:space-y-0 lg:space-x-4 bg-gray-50">
      <div className="w-full lg:w-1/3">
        <div className="mb-4 p-4 bg-white shadow-lg rounded-lg">
          <h1 className="text-3xl font-extrabold text-gray-900 mb-4">Localizador de Unidades</h1>
          <div className="flex space-x-2">
            <input
              type="text"
              placeholder="Buscar por cidade..."
              value={searchCity}
              onChange={(e) => setSearchCity(e.target.value)}
              className="flex-grow p-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
            />
            <button
              onClick={fetchUnidadesByCity}
              disabled={loading || !searchCity}
              className="p-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition duration-150 disabled:bg-blue-300 flex items-center"
            >
              {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : <Search className="w-5 h-5" />}
            </button>
            <button
              onClick={() => {
                setSearchCity('');
                if (userLocation) {
                  fetchUnidadesByLocation(userLocation[0], userLocation[1]);
                } else {
                  // Tenta obter a localização novamente se não tiver
                  navigator.geolocation.getCurrentPosition(
                    (position) => {
                      const { latitude, longitude } = position.coords;
                      setUserLocation([latitude, longitude]);
                      fetchUnidadesByLocation(latitude, longitude);
                    },
                    () => {
                      setError("Não foi possível redefinir a busca. Tente buscar por uma cidade.");
                    }
                  );
                }
              }}
              disabled={loading}
              className="p-2 bg-gray-400 text-white rounded-lg hover:bg-gray-500 transition duration-150 disabled:bg-gray-300 flex items-center"
            >
              <RefreshCw className="w-5 h-5" />
            </button>
          </div>
        </div>
        {renderUnidadesList()}
      </div>
      {renderMap()}
    </div>
  );
};

export default UnidadesComMapa;
