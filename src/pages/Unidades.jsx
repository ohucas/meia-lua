import { useState, useEffect } from 'react';
import { MapPin, Phone, Clock, Navigation, AlertCircle, Loader2, Map } from 'lucide-react';

const UnidadesNova = () => {
  const [unidades, setUnidades] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [userLocation, setUserLocation] = useState(null);
  const [locationError, setLocationError] = useState(null);

  
  const sampleUnits = [

    {
      id: 'hemoba-salvador',
      name: 'HEMOBA - Hemocentro da Bahia',
      type: 'hospital',
      address: 'Ladeira do Hospital Geral, s/n - Brotas, Salvador - BA',
      phone: '(71) 3116-5555',
      latitude: -12.9714,
      longitude: -38.5014,
      opening_hours: 'Segunda a Sexta: 7h às 17h',
      rating: 4.5,
      isReference: true,
      isPrivate: false
    },
    {
      id: 'hospital-ana-nery',
      name: 'Hospital Ana Nery - Ambulatório de Hematologia',
      type: 'hospital',
      address: 'Rua Saldanha Marinho, s/n - Nazaré, Salvador - BA',
      phone: '(71) 3117-4000',
      latitude: -12.9789,
      longitude: -38.5152,
      opening_hours: 'Segunda a Sexta: 8h às 17h',
      rating: 4.3,
      isReference: true,
      isPrivate: false
    },

    {
      id: 'hospital-santa-izabel',
      name: 'Hospital Santa Izabel - Serviço de Hematologia',
      type: 'hospital',
      address: 'Av. Sete de Setembro, 4015 - Barra, Salvador - BA',
      phone: '(71) 2203-9000',
      latitude: -12.9907,
      longitude: -38.5229,
      opening_hours: '24 horas',
      rating: 4.6,
      isReference: true,
      isPrivate: true
    },
    {
      id: 'clinica-hemomed',
      name: 'Clínica HemoMed - Hematologia e Hemoterapia',
      type: 'clinica',
      address: 'Av. Tancredo Neves, 1632 - Caminho das Árvores, Salvador - BA',
      phone: '(71) 3346-1000',
      latitude: -12.9815,
      longitude: -38.4589,
      opening_hours: 'Segunda a Sexta: 8h às 18h | Sábado: 8h às 12h',
      rating: 4.7,
      isReference: false,
      isPrivate: true
    },
    {
      id: 'hemoclinc',
      name: 'HemoClinc - Clínica de Hematologia',
      type: 'clinica',
      address: 'Rua Baependi, 22 - Ondina, Salvador - BA',
      phone: '(71) 3283-8000',
      latitude: -13.0049,
      longitude: -38.5156,
      opening_hours: 'Segunda a Sexta: 7h às 19h',
      rating: 4.4,
      isReference: false,
      isPrivate: true
    }
  ];


  const getUserLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setUserLocation({
            lat: position.coords.latitude,
            lng: position.coords.longitude
          });
          fetchUnidades(position.coords.latitude, position.coords.longitude);
        },
        (error) => {
          console.error('Erro ao obter localização:', error);
          setLocationError('Não foi possível obter sua localização');
   
          setUserLocation({
            lat: -12.9714,
            lng: -38.5014
          });
          fetchUnidades(-12.9714, -38.5014);
        }
      );
    } else {
      setLocationError('Geolocalização não suportada pelo navegador');

      setUserLocation({
        lat: -12.9714,
        lng: -38.5014
      });
      fetchUnidades(-12.9714, -38.5014);
    }
  };


  const fetchUnidades = async (lat, lng) => {
    try {
      setLoading(true);
      setError(null);
      

      setTimeout(() => {
        setUnidades(sampleUnits);
        setLoading(false);
      }, 1000);
      
    } catch (err) {
      console.error('Erro ao buscar unidades:', err);
      setError('Não foi possível carregar as unidades. Tente novamente mais tarde.');
      setLoading(false);
    }
  };

  // Get initial data
  useEffect(() => {
    getUserLocation();
  }, []);


  const isInSalvador = (lat, lng) => {
   
    return (
      lat >= -13.1 && lat <= -12.8 &&
      lng >= -38.6 && lng <= -38.3
    );
  };

  const formatDistance = (distance) => {
    if (!distance) return '';
    return distance < 1 
      ? `${(distance * 1000).toFixed(0)}m` 
      : `${distance.toFixed(1)}km`;
  };

 
  const getTypeColor = (type) => {
    return type === 'hospital' ? 'bg-blue-100 text-blue-800' : 'bg-green-100 text-green-800';
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-red-600 to-red-800 text-white py-16">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-4xl font-bold mb-4">Encontre Unidades de Saúde</h1>
          <p className="text-xl mb-8">Centros de referência e clínicas especializadas em anemia falciforme</p>
          
          <button
            onClick={getUserLocation}
            disabled={loading}
            className="bg-white text-red-600 px-6 py-3 rounded-lg font-medium hover:bg-gray-100 transition-colors flex items-center mx-auto"
          >
            {loading ? (
              <>
                <Loader2 className="animate-spin mr-2" />
                Buscando...
              </>
            ) : (
              <>
                <Map className="mr-2" />
                Usar minha localização
              </>
            )}
          </button>
          
          {locationError && (
            <div className="mt-4 bg-yellow-100 text-yellow-800 p-3 rounded-lg inline-flex items-center">
              <AlertCircle className="mr-2" />
              {locationError}
            </div>
          )}
        </div>
      </section>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-12">
        {/* Reference Centers */}
        <section className="mb-16">
          <h2 className="text-2xl font-bold mb-6 flex items-center">
            <MapPin className="text-red-600 mr-2" />
            Centros de Referência Públicos
          </h2>
          
          {loading ? (
            <div className="flex justify-center items-center py-12">
              <Loader2 className="h-8 w-8 text-red-600 animate-spin" />
              <span className="ml-2 text-gray-600">Carregando unidades...</span>
            </div>
          ) : error ? (
            <div className="bg-red-50 border-l-4 border-red-400 p-4">
              <div className="flex">
                <div className="flex-shrink-0">
                  <AlertCircle className="h-5 w-5 text-red-400" />
                </div>
                <div className="ml-3">
                  <p className="text-sm text-red-700">{error}</p>
                </div>
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {unidades
                .filter(u => u.isReference && !u.isPrivate)
                .map((unidade) => (
                  <div key={unidade.id} className="bg-white rounded-lg shadow-md overflow-hidden border border-gray-100">
                    <div className="p-6">
                      <div className="flex justify-between items-start">
                        <h3 className="text-lg font-semibold text-gray-900">{unidade.name}</h3>
                        <span className="bg-red-100 text-red-800 text-xs font-medium px-2.5 py-0.5 rounded-full">
                          Referência
                        </span>
                      </div>
                      
                      <p className="mt-2 text-sm text-gray-500">{unidade.address}</p>
                      
                      <div className="mt-4 space-y-2">
                        <p className="flex items-center text-sm text-gray-600">
                          <Phone className="h-4 w-4 mr-2 text-gray-400" />
                          {unidade.phone}
                        </p>
                        <p className="flex items-center text-sm text-gray-600">
                          <Clock className="h-4 w-4 mr-2 text-gray-400" />
                          {unidade.opening_hours}
                        </p>
                      </div>
                      
                      <div className="mt-6">
                        <a
                          href={`https://www.google.com/maps/dir/?api=1&destination=${unidade.latitude},${unidade.longitude}&travelmode=driving`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="w-full inline-flex justify-center items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                        >
                          <Navigation className="-ml-1 mr-2 h-4 w-4" />
                          Como chegar
                        </a>
                      </div>
                    </div>
                  </div>
                ))}
              
              {unidades.filter(u => u.isReference && !u.isPrivate).length === 0 && !loading && (
                <div className="col-span-full text-center py-8">
                  <p className="text-gray-500">Nenhum centro de referência encontrado na sua região.</p>
                </div>
              )}
            </div>
          )}
        </section>

        {}
        <section className="mb-16">
          <h2 className="text-2xl font-bold mb-6 flex items-center">
            <MapPin className="text-purple-600 mr-2" />
            Clínicas Particulares
          </h2>
          
          {loading ? (
            <div className="flex justify-center items-center py-12">
              <Loader2 className="h-8 w-8 text-purple-600 animate-spin" />
              <span className="ml-2 text-gray-600">Carregando clínicas...</span>
            </div>
          ) : error ? (
            <div className="bg-red-50 border-l-4 border-red-400 p-4">
              <div className="flex">
                <div className="flex-shrink-0">
                  <AlertCircle className="h-5 w-5 text-red-400" />
                </div>
                <div className="ml-3">
                  <p className="text-sm text-red-700">{error}</p>
                </div>
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {unidades
                .filter(u => u.isPrivate)
                .map((unidade) => (
                  <div key={unidade.id} className="bg-white rounded-lg shadow-md overflow-hidden border border-gray-100">
                    <div className="p-6">
                      <div className="flex justify-between items-start">
                        <h3 className="text-lg font-semibold text-gray-900">{unidade.name}</h3>
                        <span className="bg-purple-100 text-purple-800 text-xs font-medium px-2.5 py-0.5 rounded-full">
                          Particular
                        </span>
                      </div>
                      
                      <p className="mt-2 text-sm text-gray-500">{unidade.address}</p>
                      
                      <div className="mt-4 space-y-2">
                        <p className="flex items-center text-sm text-gray-600">
                          <Phone className="h-4 w-4 mr-2 text-gray-400" />
                          {unidade.phone}
                        </p>
                        <p className="flex items-center text-sm text-gray-600">
                          <Clock className="h-4 w-4 mr-2 text-gray-400" />
                          {unidade.opening_hours}
                        </p>
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
                      </div>
                      
                      <div className="mt-6">
                        <a
                          href={`https://www.google.com/maps/dir/?api=1&destination=${unidade.latitude},${unidade.longitude}&travelmode=driving`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="w-full inline-flex justify-center items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-purple-600 hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500"
                        >
                          <Navigation className="-ml-1 mr-2 h-4 w-4" />
                          Como chegar
                        </a>
                      </div>
                    </div>
                  </div>
                ))}
              
              {unidades.filter(u => u.isPrivate).length === 0 && !loading && (
                <div className="col-span-full text-center py-8">
                  <p className="text-gray-500">Nenhuma clínica particular encontrada na sua região.</p>
                </div>
              )}
            </div>
          )}
        </section>

        {}
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
