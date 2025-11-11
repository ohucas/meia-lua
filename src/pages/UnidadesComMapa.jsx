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
} );


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
  const [userLocation, setUserLocation] = useState(null);
  const [locationError, setLocationError] = useState(null);
  const [locationLoading, setLocationLoading] = useState(false);
  const [searchCity, setSearchCity] = useState('');
  const [searchLoading, setSearchLoading] = useState(false);
  const [mapCenter, setMapCenter] = useState([-14.2350, -51.9253]);
  const [mapZoom, setMapZoom] = useState(4);
  const [showCitySearch, setShowCitySearch] = useState(false);

 
  const getUserLocation = () => {
    setLocationLoading(true);
    setLocationError(null);
    
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const location = {
            lat: position.coords.latitude,
            lng: position.coords.longitude
          };
          setUserLocation(location);
          setLocationLoading(false);
          setMapCenter([location.lat, location.lng]);
          setMapZoom(12);
          fetchUnidades(location.lat, location.lng);
        },
        (error) => {
          console.error('Erro ao obter localização:', error.code, error.message); 
          let errorMessage = 'Não foi possível obter sua localização. ';
          
          switch(error.code) {
            case error.PERMISSION_DENIED:
              errorMessage += 'Permissão negada. Por favor, permita o acesso à localização nas configurações do navegador.';
              break;
            case error.POSITION_UNAVAILABLE:
              errorMessage += 'Localização indisponível. Verifique se o GPS está ativado.';
              break;
            case error.TIMEOUT:
              errorMessage += 'Tempo limite excedido. Tente novamente.';
              break;
            default:
              errorMessage += 'Erro desconhecido.';
              break;
          }
          
          setLocationError(errorMessage);
          setLocationLoading(false);
          setShowCitySearch(true);
        },
        {
          enableHighAccuracy: true,
          timeout: 10000,
          maximumAge: 300000 
        }
      );
    } else {
      setLocationError('Geolocalização não é suportada por este navegador.');
      setLocationLoading(false);
      setShowCitySearch(true);
    }
  };


  const searchByCity = async () => {
    console.log("=== INÍCIO searchByCity ===");
    console.log("Cidade pesquisada:", searchCity);
    
    if (!searchCity.trim()) {
      alert('Por favor, digite o nome de uma cidade');
      return;
    }

    setSearchLoading(true);
    setError(null);

    try {
      const url = `${API_BASE_URL}/api/unidades?cidade=${encodeURIComponent(searchCity)}&radius=50000`;
      console.log("URL da requisição:", url);
      
      const response = await fetch(url);
      console.log("Status da resposta:", response.status);
      console.log("Headers da resposta:", response.headers);
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      console.log("Dados recebidos da API:", data);
      console.log("Tipo de data.data:", typeof data.data);
      console.log("Array.isArray(data.data):", Array.isArray(data.data));
      console.log("Quantidade de unidades:", data.data ? data.data.length : 0);
      
      if (data.success) {
        const unidadesData = data.data || [];
        console.log("Definindo unidades:", unidadesData);
        setUnidades(unidadesData);
        
        if (data.search_location) {
          const { latitude, longitude } = data.search_location;
          console.log("Definindo localização do mapa:", latitude, longitude);
          setMapCenter([latitude, longitude]);
          setMapZoom(12);
          setUserLocation({ lat: latitude, lng: longitude });
        }
      } else {
        throw new Error(data.message || 'Erro ao buscar unidades');
      }
      
    } catch (err) {
      console.error('Erro detalhado ao buscar unidades por cidade:', err);
      setError(`Erro ao buscar unidades na cidade "${searchCity}": ${err.message}`);
    } finally {
      setSearchLoading(false);
      console.log("=== FIM searchByCity ===");
    }
  };

 
  const fetchUnidades = async (lat, lng) => {
    console.log("=== INÍCIO fetchUnidades ===");
    console.log("Coordenadas:", lat, lng);
    
    try {
      setLoading(true);
      setError(null);
      
      const url = `${API_BASE_URL}/api/unidades?lat=${lat}&lng=${lng}&radius=50000`;
      console.log("URL da requisição:", url);
      
      const response = await fetch(url);
      console.log("Status da resposta:", response.status);
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      console.log("Dados recebidos da API:", data);
      console.log("Tipo de data.data:", typeof data.data);
      console.log("Array.isArray(data.data):", Array.isArray(data.data));
      console.log("Quantidade de unidades:", data.data ? data.data.length : 0);
      
      if (data.success) {
        const unidadesData = data.data || [];
        console.log("Definindo unidades:", unidadesData);
        setUnidades(unidadesData);
      } else {
        throw new Error(data.message || 'Erro ao buscar unidades');
      }
      
    } catch (err) {
      console.error('Erro detalhado ao buscar unidades:', err);
      setError(`Erro ao carregar as unidades: ${err.message}. Verifique se o backend está rodando.`);
    } finally {
      setLoading(false);
      console.log("=== FIM fetchUnidades ===");
    }
  };


  useEffect(() => {
    // Tenta obter a localização do usuário ao carregar o componente
    getUserLocation();
  }, []);
  
  // Efeito para buscar unidades quando a localização do usuário é definida
  useEffect(() => {
    if (userLocation && !unidades.length && !loading && !error) {
      fetchUnidades(userLocation.lat, userLocation.lng);
    }
  }, [userLocation]);


  const getTypeColor = (type) => {
    if (type === 'publica') return 'bg-blue-100 text-blue-800';
    if (type === 'privada') return 'bg-purple-100 text-purple-800';
    return 'bg-gray-100 text-gray-800';
  };

  // Get type label
  const getTypeLabel = (type) => {
    if (type === 'publica') return 'Pública';
    if (type === 'privada') return 'Privada';
    return 'Não especificado';
  };


  const getMarkerIcon = (type) => {
    if (type === 'publica') return publicIcon;
    if (type === 'privada') return privateIcon;
    return publicIcon;
  };


  const publicUnits = unidades.filter(u => u.type === 'publica');
  const privateUnits = unidades.filter(u => u.type === 'privada');

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-red-600 to-red-800 text-white py-16">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-4xl font-bold mb-4">Encontre Unidades de Saúde</h1>
          <p className="text-xl mb-8">Centros de referência e clínicas especializadas em anemia falciforme próximos à sua localização</p>
          
          <div className="flex flex-col items-center space-y-4">
            <div className="flex flex-col sm:flex-row gap-4 items-center">
              <button
                onClick={() => getUserLocation()}
                disabled={locationLoading || loading}
                className="bg-white text-red-600 px-6 py-3 rounded-lg font-medium hover:bg-gray-100 transition-colors flex items-center disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {locationLoading ? (
                  <>
                    <Loader2 className="animate-spin mr-2" />
                    Obtendo localização...
                  </>
                ) : (
                  <>
                    <Map className="mr-2" />
                    Usar minha localização
                  </>
                )}
              </button>
              
              <button
                onClick={() => setShowCitySearch(prev => !prev)}
                className="bg-red-500 text-white px-6 py-3 rounded-lg font-medium hover:bg-red-600 transition-colors flex items-center"
              >
                <Search className="mr-2" />
                Buscar por cidade
              </button>
            </div>
            
            {/* City Search */}
            {showCitySearch && (
              <div className="flex flex-col sm:flex-row gap-2 w-full max-w-md mt-4">
                <input
                  type="text"
                  placeholder="Digite o nome da cidade"
                  value={searchCity}
                  onChange={(e) => setSearchCity(e.target.value)}
                  className="p-3 rounded-lg text-gray-800 w-full focus:outline-none focus:ring-2 focus:ring-red-500"
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      searchByCity();
                    }
                  }}
                />
                <button
                  onClick={searchByCity}
                  disabled={searchLoading}
                  className="bg-red-700 text-white px-6 py-3 rounded-lg font-medium hover:bg-red-800 transition-colors flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {searchLoading ? (
                    <Loader2 className="animate-spin" />
                  ) : (
                    'Buscar'
                  )}
                </button>
              </div>
            )}

            {/* Location Error Message */}
            {locationError && (
              <div className="bg-yellow-100 border-l-4 border-yellow-500 text-yellow-700 p-4 mt-4 w-full max-w-xl" role="alert">
                <p className="font-bold">Atenção</p>
                <p>{locationError}</p>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Map and Results Section */}
      <section className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Map Column */}
          <div className="lg:col-span-2">
            <h2 className="text-2xl font-semibold mb-4 text-gray-800">Mapa de Unidades</h2>
            
            {/* Legenda Adicionada Aqui */}
            <div className="mb-4 p-3 bg-gray-100 rounded-lg shadow-sm text-sm text-gray-700">
              <span className="font-medium">Legenda:</span>
              <span className="ml-3">🔴 Sua localização</span>
              <span className="ml-3">🟣 Unidades Públicas</span>
              <span className="ml-3">🔵 Unidades Privadas</span>
            </div>
            
            <div className="relative h-[600px] w-full rounded-lg shadow-xl overflow-hidden">
              {loading ? (
                <div className="flex justify-center items-center h-full bg-white">
                  <Loader2 className="animate-spin text-red-600" size={48} />
                  <span className="ml-3 text-red-600">Carregando unidades...</span>
                </div>
              ) : error ? (
                <div className="flex justify-center items-center h-full bg-red-50">
                  <AlertCircle className="text-red-600 mr-3" size={24} />
                  <span className="text-red-600">{error}</span>
                </div>
              ) : (
                <MapContainer 
                  center={mapCenter} 
                  zoom={mapZoom} 
                  scrollWheelZoom={true} 
                  style={{ height: '100%', width: '100%' }}
                >
                  <MapController center={mapCenter} zoom={mapZoom} />
                  <TileLayer
                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                  />

                  {/* Marcador de Localização do Usuário */}
                  {userLocation && (
                    <Marker position={[userLocation.lat, userLocation.lng]} icon={userIcon}>
                      <Popup>
                        <div className="font-bold">Sua Localização</div>
                      </Popup>
                    </Marker>
                  )}

                  {/* Marcadores das Unidades */}
                  {unidades.map((unidade) => (
                    <Marker 
                      key={unidade.id} 
                      position={[unidade.latitude, unidade.longitude]} 
                      icon={getMarkerIcon(unidade.type)}
                    >
                      <Popup>
                        <div className="font-bold">{unidade.nome}</div>
                        <div className="text-sm text-gray-600">{unidade.endereco}</div>
                        <div className="mt-2">
                          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getTypeColor(unidade.type)}`}>
                            {getTypeLabel(unidade.type)}
                          </span>
                        </div>
                        {unidade.telefone && (
                          <div className="flex items-center mt-1 text-sm text-gray-700">
                            <Phone className="w-4 h-4 mr-1" /> {unidade.telefone}
                          </div>
                        )}
                        {unidade.horario_funcionamento && (
                          <div className="flex items-center mt-1 text-sm text-gray-700">
                            <Clock className="w-4 h-4 mr-1" /> {unidade.horario_funcionamento}
                          </div>
                        )}
                        <a 
                          href={`https://www.google.com/maps/dir/?api=1&destination=${unidade.latitude},${unidade.longitude}`} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="mt-2 inline-flex items-center text-red-600 hover:text-red-800 text-sm font-medium"
                        >
                          <Navigation className="w-4 h-4 mr-1" /> Obter Rotas
                        </a>
                      </Popup>
                    </Marker>
                  ))}
                </MapContainer>
              )}
            </div>
          </div>

          {/* List Column */}
          <div className="lg:col-span-1">
            <h2 className="text-2xl font-semibold mb-4 text-gray-800">Unidades Encontradas ({unidades.length})</h2>
            
            {/* Unit Counts */}
            <div className="flex justify-between mb-4 p-3 bg-white rounded-lg shadow-sm">
              <div className="text-center">
                <p className="text-lg font-bold text-blue-800">{publicUnits.length}</p>
                <p className="text-sm text-gray-600">Públicas</p>
              </div>
              <div className="text-center">
                <p className="text-lg font-bold text-purple-800">{privateUnits.length}</p>
                <p className="text-sm text-gray-600">Privadas</p>
              </div>
            </div>

            {/* Unit List */}
            <div className="space-y-4 max-h-[500px] overflow-y-auto pr-2">
              {unidades.length > 0 ? (
                unidades.map((unidade) => (
                  <div key={unidade.id} className="bg-white p-4 rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300">
                    <h3 className="text-lg font-bold text-gray-900">{unidade.nome}</h3>
                    <p className="text-sm text-gray-600 mb-2">{unidade.endereco}</p>
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getTypeColor(unidade.type)}`}>
                      {getTypeLabel(unidade.type)}
                    </span>
                    {unidade.telefone && (
                      <div className="flex items-center mt-2 text-sm text-gray-700">
                        <Phone className="w-4 h-4 mr-1" /> {unidade.telefone}
                      </div>
                    )}
                    <a 
                      href={`https://www.google.com/maps/dir/?api=1&destination=${unidade.latitude},${unidade.longitude}`} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="mt-2 inline-flex items-center text-red-600 hover:text-red-800 text-sm font-medium"
                    >
                      <Navigation className="w-4 h-4 mr-1" /> Obter Rotas
                    </a>
                  </div>
                ))
              ) : (
                <div className="bg-yellow-100 border-l-4 border-yellow-500 text-yellow-700 p-4" role="alert">
                  <p className="font-bold">Nenhuma unidade encontrada</p>
                  <p>Tente buscar por outra cidade ou verifique sua localização.</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-800 text-white py-6 mt-12">
        <div className="container mx-auto px-4 text-center">
          <p>&copy; {new Date().getFullYear()} Meia-Lua. Todos os direitos reservados.</p>
        </div>
      </footer>
    </div>
  );
};

export default UnidadesComMapa;
