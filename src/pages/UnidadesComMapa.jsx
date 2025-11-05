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
  const [userLocation, setUserLocation] = useState(null);
  const [locationError, setLocationError] = useState(null);
  const [locationLoading, setLocationLoading] = useState(false);
  const [searchCity, setSearchCity] = useState('');
  const [searchLoading, setSearchLoading] = useState(false);
  const [mapCenter, setMapCenter] = useState([-14.2350, -51.9253]); // Centro do Brasil
  const [mapZoom, setMapZoom] = useState(4);
  const [showCitySearch, setShowCitySearch] = useState(false);

  // Get user location
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
          console.error('Erro ao obter localização:', error);
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
          maximumAge: 300000 // 5 minutos
        }
      );
    } else {
      setLocationError('Geolocalização não é suportada por este navegador.');
      setLocationLoading(false);
      setShowCitySearch(true);
    }
  };

  // Search by city
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

  // Fetch healthcare units from backend
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

  // Get initial data
  useEffect(() => {
    // Não buscar automaticamente, aguardar o usuário permitir a localização
  }, []);
  
  // Get type color based on unit type
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

  // Get marker icon based on unit type
  const getMarkerIcon = (type) => {
    if (type === 'publica') return publicIcon;
    if (type === 'privada') return privateIcon;
    return publicIcon;
  };

  // Separate units by type
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
              onClick={() => getUserLocation()} // Corrigido para garantir que a função seja chamada no clique
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
              <div className="bg-white rounded-lg p-4 text-gray-800 w-full max-w-md">
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={searchCity}
                    onChange={(e) => setSearchCity(e.target.value)}
                    placeholder="Digite o nome da cidade..."
                    className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500"
                    onKeyPress={(e) => e.key === 'Enter' && searchByCity()}
                  />
                  <button
                    onClick={searchByCity}
                    disabled={searchLoading}
                    className="bg-red-600 text-white px-4 py-2 rounded-md hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {searchLoading ? (
                      <Loader2 className="animate-spin h-4 w-4" />
                    ) : (
                      <Search className="h-4 w-4" />
                    )}
                  </button>
                </div>
              </div>
            )}
            
            {userLocation && (
              <button
                onClick={() => fetchUnidades(userLocation.lat, userLocation.lng)}
                disabled={loading}
                className="bg-red-500 text-white px-4 py-2 rounded-lg font-medium hover:bg-red-600 transition-colors flex items-center disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? (
                  <>
                    <Loader2 className="animate-spin mr-2" />
                    Atualizando...
                  </>
                ) : (
                  <>
                    <RefreshCw className="mr-2" />
                    Atualizar resultados
                  </>
                )}
              </button>
            )}
          </div>
          
          {locationError && (
            <div className="mt-4 bg-yellow-100 text-yellow-800 p-3 rounded-lg inline-flex items-start max-w-2xl">
              <AlertCircle className="mr-2 mt-0.5 flex-shrink-0" />
              <span className="text-left">{locationError}</span>
            </div>
          )}
          
          {userLocation && (
            <div className="mt-4 bg-green-100 text-green-800 p-3 rounded-lg inline-flex items-center">
              <MapPin className="mr-2" />
              Localização obtida com sucesso! Buscando unidades próximas...
            </div>
          )}
        </div>
      </section>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-12">
        {/* Instructions */}
        {!userLocation && !locationError && !showCitySearch && (
          <section className="mb-12 bg-blue-50 border-l-4 border-blue-400 p-6 rounded-lg">
            <div className="flex">
              <div className="flex-shrink-0">
                <MapPin className="h-5 w-5 text-blue-400" />
              </div>
              <div className="ml-3">
                <h3 className="text-lg font-medium text-blue-800">Como funciona</h3>
                <p className="mt-2 text-blue-700">
                  Para encontrar unidades de saúde especializadas em anemia falciforme próximas a você, 
                  clique em "Usar minha localização" e permita o acesso quando solicitado pelo navegador, 
                  ou use "Buscar por cidade" para pesquisar em uma cidade específica.
                </p>
              </div>
            </div>
          </section>
        )}

        {/* Error Display */}
        {error && (
          <section className="mb-12">
            <div className="bg-red-50 border-l-4 border-red-400 p-4 rounded-lg">
              <div className="flex">
                <div className="flex-shrink-0">
                  <AlertCircle className="h-5 w-5 text-red-400" />
                </div>
                <div className="ml-3">
                  <p className="text-sm text-red-700">{error}</p>
                </div>
              </div>
            </div>
          </section>
        )}

        {/* Loading State */}
        {loading && (
          <section className="mb-12">
            <div className="flex justify-center items-center py-12">
              <Loader2 className="h-8 w-8 text-red-600 animate-spin" />
              <span className="ml-2 text-gray-600">Buscando unidades especializadas...</span>
            </div>
          </section>
        )}

        {/* Map Section */}
         {(userLocation || unidades.length > 0) && (
          <section className="mb-12">
            <h2 className="text-2xl font-bold mb-6 flex items-center">
              <Map className="text-red-600 mr-2" />
              Mapa das Unidades
            </h2>
            
            <div className="bg-white rounded-lg shadow-md overflow-hidden" style={{ height: '500px' }}>
              <MapContainer
                center={mapCenter}
                zoom={mapZoom}
                style={{ height: '100%', width: '100%' }}
              >
                <TileLayer
                  attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                  url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                />
                
                <MapController center={mapCenter} zoom={mapZoom} />
                
                {/* User location marker */}
                {userLocation && (
                  <Marker position={[userLocation.lat, userLocation.lng]} icon={userIcon}>
                    <Popup>
                      <div className="text-center">
                        <strong>Sua localização</strong>
                      </div>
                    </Popup>
                  </Marker>
                 )}
                
                {/* Medical units markers */}
                {unidades.map((unidade, index) => {
                  console.log(`Renderizando marcador ${index}:`, unidade);
                  console.log(`Posição: [${unidade.latitude}, ${unidade.longitude}]`);
                  
                  return (
                    <Marker
                      key={unidade.id}
                      position={[unidade.latitude, unidade.longitude]}
                      icon={getMarkerIcon(unidade.type)}
                    >
                      <Popup maxWidth={300}>
                        <div className="p-2">
                          <div className="flex justify-between items-start mb-2">
                            <h3 className="font-semibold text-sm pr-2">{unidade.name}</h3>
                            <span className={`text-xs font-medium px-2 py-1 rounded-full flex-shrink-0 ${getTypeColor(unidade.type)}`}>
                              {getTypeLabel(unidade.type)}
                            </span>
                          </div>
                          
                          <p className="text-xs text-gray-600 mb-2">{unidade.address}</p>
                          
                          {unidade.phone && (
                            <p className="text-xs text-gray-600 mb-2 flex items-center">
                              <Phone className="h-3 w-3 mr-1" /> {unidade.phone}
                            </p>
                          )}
                          
                          {unidade.opening_hours && (
                            <p className="text-xs text-gray-600 mb-2 flex items-center">
                              <Clock className="h-3 w-3 mr-1" /> {unidade.opening_hours}
                            </p>
                          )}
                          
                          {unidade.distance_km && (
                            <p className="text-xs text-gray-600 flex items-center">
                              <Navigation className="h-3 w-3 mr-1" /> {unidade.distance_km.toFixed(2)} km
                            </p>
                          )}
                        </div>
                      </Popup>
                    </Marker>
                  );
                })}
              </MapContainer>
            </div>
          </section>
        )}

        {/* Units List */}
        {unidades.length > 0 && (
          <section>
            <h2 className="text-2xl font-bold mb-6 flex items-center">
              <MapPin className="text-red-600 mr-2" />
              Unidades Encontradas
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {unidades.map((unidade) => (
                <div key={unidade.id} className="bg-white rounded-lg shadow-md p-6 border border-gray-200">
                  <div className="flex justify-between items-start mb-3">
                    <h3 className="font-semibold text-lg pr-2">{unidade.name}</h3>
                    <span className={`text-xs font-medium px-2 py-1 rounded-full flex-shrink-0 ${getTypeColor(unidade.type)}`}>
                      {getTypeLabel(unidade.type)}
                    </span>
                  </div>
                  <p className="text-sm text-gray-600 mb-2">{unidade.address}</p>
                  {unidade.phone && (
                    <p className="text-sm text-gray-600 mb-2 flex items-center">
                      <Phone className="h-4 w-4 mr-2" /> {unidade.phone}
                    </p>
                  )}
                  {unidade.opening_hours && (
                    <p className="text-sm text-gray-600 mb-2 flex items-center">
                      <Clock className="h-4 w-4 mr-2" /> {unidade.opening_hours}
                    </p>
                  )}
                  {unidade.distance_km && (
                    <p className="text-sm text-gray-600 flex items-center">
                      <Navigation className="h-4 w-4 mr-2" /> {unidade.distance_km.toFixed(2)} km
                    </p>
                  )}
                </div>
              ))}
            </div>
          </section>
        )}

        {/* No Units Found */}
        {!loading && !error && unidades.length === 0 && (userLocation || showCitySearch) && (
          <section className="mb-12">
            <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 rounded-lg">
              <div className="flex">
                <div className="flex-shrink-0">
                  <AlertCircle className="h-5 w-5 text-yellow-400" />
                </div>
                <div className="ml-3">
                  <p className="text-sm text-yellow-700">
                    Nenhuma unidade especializada em anemia falciforme foi encontrada na região pesquisada.
                    Tente expandir o raio de busca ou entre em contato com o sistema de saúde local.
                  </p>
                </div>
              </div>
            </div>
          </section>
        )}
      </div>
    </div>
  );
};

export default UnidadesComMapa;
