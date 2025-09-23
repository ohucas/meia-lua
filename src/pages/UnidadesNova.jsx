import { useState, useEffect } from 'react';
import { MapPin, Phone, Clock, Navigation, AlertCircle, Loader2, Map, RefreshCw } from 'lucide-react';

const UnidadesNova = () => {
  const [unidades, setUnidades] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [userLocation, setUserLocation] = useState(null);
  const [locationError, setLocationError] = useState(null);
  const [locationLoading, setLocationLoading] = useState(false);

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
    }
  };

  // Fetch healthcare units from backend
  const fetchUnidades = async (lat, lng) => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await fetch(`http://localhost:5001/api/unidades?lat=${lat}&lng=${lng}&radius=50000`);
      const data = await response.json();
      
      if (data.success) {
        setUnidades(data.data || []);
      } else {
        throw new Error(data.message || 'Erro ao buscar unidades');
      }
      
    } catch (err) {
      console.error('Erro ao buscar unidades:', err);
      setError(`Erro ao carregar as unidades: ${err.message}. Verifique se o backend está rodando.`);
    } finally {
      setLoading(false);
    }
  };

  // Get initial data
  useEffect(() => {
    // Não buscar automaticamente, aguardar o usuário permitir a localização
  }, []);

  // Format distance (if available in the future)
  const formatDistance = (distance) => {
    if (!distance) return '';
    return distance < 1 
      ? `${(distance * 1000).toFixed(0)}m` 
      : `${distance.toFixed(1)}km`;
  };

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
            <button
              onClick={getUserLocation}
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
                  Buscar unidades próximas
                </>
              )}
            </button>
            
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
        {!userLocation && !locationError && (
          <section className="mb-12 bg-blue-50 border-l-4 border-blue-400 p-6 rounded-lg">
            <div className="flex">
              <div className="flex-shrink-0">
                <MapPin className="h-5 w-5 text-blue-400" />
              </div>
              <div className="ml-3">
                <h3 className="text-lg font-medium text-blue-800">Como funciona</h3>
                <p className="mt-2 text-blue-700">
                  Para encontrar unidades de saúde especializadas em anemia falciforme próximas a você, 
                  clique no botão "Buscar unidades próximas" e permita o acesso à sua localização quando solicitado pelo navegador.
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

        {/* Public Reference Centers */}
        {publicUnits.length > 0 && (
          <section className="mb-16">
            <h2 className="text-2xl font-bold mb-6 flex items-center">
              <MapPin className="text-red-600 mr-2" />
              Centros de Referência Públicos ({publicUnits.length})
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {publicUnits.map((unidade) => (
                <div key={unidade.id} className="bg-white rounded-lg shadow-md overflow-hidden border border-gray-100">
                  <div className="p-6">
                    <div className="flex justify-between items-start mb-3">
                      <h3 className="text-lg font-semibold text-gray-900 pr-2">{unidade.name}</h3>
                      <span className={`text-xs font-medium px-2.5 py-0.5 rounded-full flex-shrink-0 ${getTypeColor(unidade.type)}`}>
                        {getTypeLabel(unidade.type)}
                      </span>
                    </div>
                    
                    <p className="mt-2 text-sm text-gray-500">{unidade.address}</p>
                    
                    <div className="mt-4 space-y-2">
                      {unidade.phone && (
                        <p className="flex items-center text-sm text-gray-600">
                          <Phone className="h-4 w-4 mr-2 text-gray-400 flex-shrink-0" />
                          <a href={`tel:${unidade.phone}`} className="hover:text-blue-600">
                            {unidade.phone}
                          </a>
                        </p>
                      )}
                      {unidade.opening_hours && (
                        <p className="flex items-start text-sm text-gray-600">
                          <Clock className="h-4 w-4 mr-2 text-gray-400 flex-shrink-0 mt-0.5" />
                          <span>{unidade.opening_hours}</span>
                        </p>
                      )}
                      {unidade.rating && (
                        <div className="flex items-center text-yellow-500">
                          {[...Array(5)].map((_, i) => (
                            i < Math.floor(unidade.rating) ? (
                              <svg key={i} className="w-4 h-4 fill-current" viewBox="0 0 20 20">
                                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                              </svg>
                            ) : (
                              <svg key={i} className="w-4 h-4 fill-current text-gray-300" viewBox="0 0 20 20">
                                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                              </svg>
                            )
                          ))}
                          <span className="ml-1 text-gray-500 text-sm">({unidade.rating})</span>
                        </div>
                      )}
                    </div>
                    
                    <div className="mt-6 space-y-2">
                      <a
                        href={unidade.google_maps_url || `https://www.google.com/maps/dir/?api=1${userLocation ? `&origin=${userLocation.lat},${userLocation.lng}` : ''}&destination=${unidade.latitude},${unidade.longitude}&travelmode=driving`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="w-full inline-flex justify-center items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                      >
                        <Navigation className="-ml-1 mr-2 h-4 w-4" />
                        Como chegar
                      </a>
                      {unidade.website && (
                        <a
                          href={unidade.website}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="w-full inline-flex justify-center items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                        >
                          Site oficial
                        </a>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Private Clinics */}
        {privateUnits.length > 0 && (
          <section className="mb-16">
            <h2 className="text-2xl font-bold mb-6 flex items-center">
              <MapPin className="text-purple-600 mr-2" />
              Clínicas Particulares ({privateUnits.length})
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {privateUnits.map((unidade) => (
                <div key={unidade.id} className="bg-white rounded-lg shadow-md overflow-hidden border border-gray-100">
                  <div className="p-6">
                    <div className="flex justify-between items-start mb-3">
                      <h3 className="text-lg font-semibold text-gray-900 pr-2">{unidade.name}</h3>
                      <span className={`text-xs font-medium px-2.5 py-0.5 rounded-full flex-shrink-0 ${getTypeColor(unidade.type)}`}>
                        {getTypeLabel(unidade.type)}
                      </span>
                    </div>
                    
                    <p className="mt-2 text-sm text-gray-500">{unidade.address}</p>
                    
                    <div className="mt-4 space-y-2">
                      {unidade.phone && (
                        <p className="flex items-center text-sm text-gray-600">
                          <Phone className="h-4 w-4 mr-2 text-gray-400 flex-shrink-0" />
                          <a href={`tel:${unidade.phone}`} className="hover:text-blue-600">
                            {unidade.phone}
                          </a>
                        </p>
                      )}
                      {unidade.opening_hours && (
                        <p className="flex items-start text-sm text-gray-600">
                          <Clock className="h-4 w-4 mr-2 text-gray-400 flex-shrink-0 mt-0.5" />
                          <span>{unidade.opening_hours}</span>
                        </p>
                      )}
                      {unidade.rating && (
                        <div className="flex items-center text-yellow-500">
                          {[...Array(5)].map((_, i) => (
                            i < Math.floor(unidade.rating) ? (
                              <svg key={i} className="w-4 h-4 fill-current" viewBox="0 0 20 20">
                                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                              </svg>
                            ) : (
                              <svg key={i} className="w-4 h-4 fill-current text-gray-300" viewBox="0 0 20 20">
                                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                              </svg>
                            )
                          ))}
                          <span className="ml-1 text-gray-500 text-sm">({unidade.rating})</span>
                        </div>
                      )}
                    </div>
                    
                    <div className="mt-6 space-y-2">
                      <a
                        href={unidade.google_maps_url || `https://www.google.com/maps/dir/?api=1${userLocation ? `&origin=${userLocation.lat},${userLocation.lng}` : ''}&destination=${unidade.latitude},${unidade.longitude}&travelmode=driving`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="w-full inline-flex justify-center items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-purple-600 hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500"
                      >
                        <Navigation className="-ml-1 mr-2 h-4 w-4" />
                        Como chegar
                      </a>
                      {unidade.website && (
                        <a
                          href={unidade.website}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="w-full inline-flex justify-center items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500"
                        >
                          Site oficial
                        </a>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* No Results */}
        {userLocation && !loading && unidades.length === 0 && !error && (
          <section className="mb-16">
            <div className="text-center py-12">
              <MapPin className="mx-auto h-12 w-12 text-gray-400" />
              <h3 className="mt-2 text-sm font-medium text-gray-900">Nenhuma unidade encontrada</h3>
              <p className="mt-1 text-sm text-gray-500">
                Não foram encontradas unidades especializadas em anemia falciforme na sua região.
                Tente expandir o raio de busca ou entre em contato com o sistema de saúde local.
              </p>
            </div>
          </section>
        )}

        {/* Emergency Information */}
        <section className="bg-red-50 rounded-lg p-8">
          <h2 className="text-2xl font-bold text-center text-red-700 mb-8">
            Informações de Emergência
          </h2>
          
          <div className="grid md:grid-cols-2 gap-6 max-w-4xl mx-auto">
            <div className="bg-white p-6 rounded-lg shadow">
              <h3 className="text-xl font-semibold text-red-700 mb-3">
                SAMU - Serviço de Atendimento Móvel de Urgência
              </h3>
              <p className="text-gray-700 mb-2">
                <strong>Telefone:</strong>{' '}
                <a href="tel:192" className="text-blue-600 hover:underline">192</a>
              </p>
              <p className="text-gray-700">
                <strong>Atendimento:</strong> 24 horas
              </p>
            </div>
            
            <div className="bg-white p-6 rounded-lg shadow">
              <h3 className="text-xl font-semibold text-red-700 mb-3">
                Bombeiros
              </h3>
              <p className="text-gray-700 mb-2">
                <strong>Telefone:</strong>{' '}
                <a href="tel:193" className="text-blue-600 hover:underline">193</a>
              </p>
              <p className="text-gray-700">
                <strong>Atendimento:</strong> 24 horas
              </p>
            </div>
          </div>
          
          <div className="mt-8 bg-yellow-50 border-l-4 border-yellow-400 p-4 rounded max-w-4xl mx-auto">
            <div className="flex">
              <div className="flex-shrink-0">
                <AlertCircle className="h-5 w-5 text-yellow-400" />
              </div>
              <div className="ml-3">
                <p className="text-sm text-yellow-700">
                  <strong>Importante:</strong> Sempre informe que você tem anemia falciforme ao buscar atendimento médico de emergência.
                </p>
              </div>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
};

export default UnidadesNova;

