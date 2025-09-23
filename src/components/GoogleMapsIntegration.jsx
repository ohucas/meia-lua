import React, { useState, useEffect, useCallback } from 'react'
import { MapPin, Navigation, Loader2, AlertCircle } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Alert, AlertDescription } from '@/components/ui/alert'

const GoogleMapsIntegration = ({ treatmentUnits = [], onUnitSelect }) => {
  const [userLocation, setUserLocation] = useState(null)
  const [nearbyUnits, setNearbyUnits] = useState([])
  const [isLoadingLocation, setIsLoadingLocation] = useState(false)
  const [locationError, setLocationError] = useState(null)
  const [map, setMap] = useState(null)
  const [markers, setMarkers] = useState([])

  // Função para calcular distância entre dois pontos
  const calculateDistance = useCallback((lat1, lng1, lat2, lng2) => {
    const R = 6371 // Raio da Terra em km
    const dLat = (lat2 - lat1) * Math.PI / 180
    const dLng = (lng2 - lng1) * Math.PI / 180
    const a = Math.sin(dLat/2) * Math.sin(dLat/2) +
              Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
              Math.sin(dLng/2) * Math.sin(dLng/2)
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a))
    return R * c
  }, [])

  // Obter localização do usuário
  const getUserLocation = useCallback(() => {
    setIsLoadingLocation(true)
    setLocationError(null)

    if (!navigator.geolocation) {
      setLocationError('Geolocalização não é suportada pelo seu navegador')
      setIsLoadingLocation(false)
      return
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const location = {
          lat: position.coords.latitude,
          lng: position.coords.longitude
        }
        setUserLocation(location)
        setIsLoadingLocation(false)
        
        // Calcular unidades próximas
        calculateNearbyUnits(location)
      },
      (error) => {
        let errorMessage = 'Erro ao obter localização'
        switch(error.code) {
          case error.PERMISSION_DENIED:
            errorMessage = 'Permissão de localização negada'
            break
          case error.POSITION_UNAVAILABLE:
            errorMessage = 'Localização não disponível'
            break
          case error.TIMEOUT:
            errorMessage = 'Tempo limite para obter localização'
            break
        }
        setLocationError(errorMessage)
        setIsLoadingLocation(false)
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 300000 // 5 minutos
      }
    )
  }, [])

  // Calcular unidades próximas
  const calculateNearbyUnits = useCallback((userLoc) => {
    if (!userLoc || !treatmentUnits.length) return

    const unitsWithDistance = treatmentUnits
      .filter(unit => unit.latitude && unit.longitude)
      .map(unit => ({
        ...unit,
        distance: calculateDistance(
          userLoc.lat,
          userLoc.lng,
          unit.latitude,
          unit.longitude
        )
      }))
      .sort((a, b) => a.distance - b.distance)
      .slice(0, 5) // Mostrar apenas as 5 mais próximas

    setNearbyUnits(unitsWithDistance)
  }, [treatmentUnits, calculateDistance])

  // Inicializar mapa do Google
  const initializeMap = useCallback(() => {
    if (!window.google || !userLocation) return

    const mapElement = document.getElementById('google-map')
    if (!mapElement) return

    const mapInstance = new window.google.maps.Map(mapElement, {
      center: userLocation,
      zoom: 12,
      styles: [
        {
          featureType: 'poi',
          elementType: 'labels',
          stylers: [{ visibility: 'off' }]
        }
      ]
    })

    setMap(mapInstance)

    // Adicionar marcador do usuário
    new window.google.maps.Marker({
      position: userLocation,
      map: mapInstance,
      title: 'Sua localização',
      icon: {
        url: 'data:image/svg+xml;charset=UTF-8,' + encodeURIComponent(`
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <circle cx="12" cy="12" r="8" fill="#3B82F6" stroke="#FFFFFF" stroke-width="2"/>
            <circle cx="12" cy="12" r="3" fill="#FFFFFF"/>
          </svg>
        `),
        scaledSize: new window.google.maps.Size(24, 24)
      }
    })

    // Adicionar marcadores das unidades
    const unitMarkers = nearbyUnits.map(unit => {
      const marker = new window.google.maps.Marker({
        position: { lat: unit.latitude, lng: unit.longitude },
        map: mapInstance,
        title: unit.name,
        icon: {
          url: 'data:image/svg+xml;charset=UTF-8,' + encodeURIComponent(`
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7z" fill="#C8102E" stroke="#FFFFFF" stroke-width="1"/>
              <circle cx="12" cy="9" r="2.5" fill="#FFFFFF"/>
            </svg>
          `),
          scaledSize: new window.google.maps.Size(24, 24)
        }
      })

      // Adicionar info window
      const infoWindow = new window.google.maps.InfoWindow({
        content: `
          <div style="padding: 8px; max-width: 200px;">
            <h3 style="margin: 0 0 8px 0; font-size: 14px; font-weight: bold;">${unit.name}</h3>
            <p style="margin: 0 0 4px 0; font-size: 12px; color: #666;">${unit.address}</p>
            <p style="margin: 0; font-size: 12px; color: #C8102E; font-weight: bold;">${unit.distance.toFixed(1)} km</p>
          </div>
        `
      })

      marker.addListener('click', () => {
        infoWindow.open(mapInstance, marker)
        if (onUnitSelect) {
          onUnitSelect(unit)
        }
      })

      return marker
    })

    setMarkers(unitMarkers)
  }, [userLocation, nearbyUnits, onUnitSelect])

  // Carregar script do Google Maps
  useEffect(() => {
    if (window.google) {
      initializeMap()
      return
    }

    const script = document.createElement('script')
    script.src = `https://maps.googleapis.com/maps/api/js?key=${process.env.REACT_APP_GOOGLE_MAPS_API_KEY}&libraries=places`
    script.async = true
    script.defer = true
    script.onload = initializeMap
    document.head.appendChild(script)

    return () => {
      if (script.parentNode) {
        script.parentNode.removeChild(script)
      }
    }
  }, [initializeMap])

  // Atualizar unidades próximas quando a localização ou unidades mudarem
  useEffect(() => {
    if (userLocation) {
      calculateNearbyUnits(userLocation)
    }
  }, [userLocation, treatmentUnits, calculateNearbyUnits])

  // Abrir no Google Maps
  const openInGoogleMaps = (unit) => {
    if (unit.latitude && unit.longitude) {
      const url = `https://www.google.com/maps/dir/?api=1&destination=${unit.latitude},${unit.longitude}&travelmode=driving`
      window.open(url, '_blank')
    }
  }

  return (
    <div className="space-y-4">
      {/* Controles de localização */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <div className="flex items-center">
              <MapPin className="w-5 h-5 mr-2" />
              Unidades Próximas
            </div>
            <Button 
              onClick={getUserLocation}
              disabled={isLoadingLocation}
              variant="outline"
              size="sm"
            >
              {isLoadingLocation ? (
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              ) : (
                <Navigation className="w-4 h-4 mr-2" />
              )}
              {isLoadingLocation ? 'Localizando...' : 'Minha Localização'}
            </Button>
          </CardTitle>
        </CardHeader>
        <CardContent>
          {locationError && (
            <Alert className="mb-4">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>{locationError}</AlertDescription>
            </Alert>
          )}

          {userLocation && (
            <div className="mb-4">
              <div 
                id="google-map" 
                className="w-full h-64 rounded-lg border"
                style={{ minHeight: '256px' }}
              />
            </div>
          )}

          {nearbyUnits.length > 0 && (
            <div className="space-y-3">
              <h4 className="font-semibold text-gray-900">Unidades mais próximas:</h4>
              {nearbyUnits.map((unit) => (
                <div key={unit.id} className="flex items-center justify-between p-3 border rounded-lg hover:bg-gray-50">
                  <div className="flex-1">
                    <div className="flex items-center space-x-2 mb-1">
                      <h5 className="font-medium text-gray-900">{unit.name}</h5>
                      <Badge variant="outline">
                        {unit.distance.toFixed(1)} km
                      </Badge>
                    </div>
                    <p className="text-sm text-gray-600">{unit.address}</p>
                  </div>
                  <div className="flex space-x-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => openInGoogleMaps(unit)}
                    >
                      <Navigation className="w-4 h-4 mr-1" />
                      Rota
                    </Button>
                    {onUnitSelect && (
                      <Button
                        variant="default"
                        size="sm"
                        onClick={() => onUnitSelect(unit)}
                      >
                        Selecionar
                      </Button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}

          {!userLocation && !isLoadingLocation && !locationError && (
            <div className="text-center py-8 text-gray-500">
              <MapPin className="w-12 h-12 mx-auto mb-4 text-gray-300" />
              <p className="mb-2">Clique em "Minha Localização" para encontrar unidades próximas</p>
              <p className="text-sm">Você precisará permitir o acesso à sua localização</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}

export default GoogleMapsIntegration

