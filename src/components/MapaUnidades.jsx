import React, { useState, useEffect } from 'react'
import { MapPin, Filter, Phone, Mail, Clock, Accessibility, Navigation } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import GoogleMapsIntegration from './GoogleMapsIntegration'

const MapaUnidades = () => {
  const [treatmentUnits, setTreatmentUnits] = useState([])
  const [filteredUnits, setFilteredUnits] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [typeFilter, setTypeFilter] = useState('all')
  const [selectedUnit, setSelectedUnit] = useState(null)
  const [showMap, setShowMap] = useState(false)

  useEffect(() => {
    fetchTreatmentUnits()
  }, [])

  useEffect(() => {
    filterUnits()
  }, [treatmentUnits, typeFilter])

  const fetchTreatmentUnits = async () => {
    try {
      const token = localStorage.getItem('token')
      const response = await fetch('/api/unidades-tratamento', {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      })
      
      if (response.ok) {
        const data = await response.json()
        setTreatmentUnits(data.data || [])
      } else {
        // Fallback para dados simulados se a API não estiver disponível
        setTreatmentUnits(getDefaultUnits())
      }
    } catch (error) {
      console.error('Erro ao buscar unidades de tratamento:', error)
      // Usar dados simulados como fallback
      setTreatmentUnits(getDefaultUnits())
    } finally {
      setIsLoading(false)
    }
  }

  const getDefaultUnits = () => {
    return [
      {
        id: 1,
        name: 'HEMOBA - Hemocentro da Bahia',
        type: 'publica',
        address: 'Ladeira do Hospital Geral, s/n - Brotas, Salvador - BA, 40285-001',
        phone: '(71) 3116-5555',
        email: 'hemoba@saude.ba.gov.br',
        opening_hours: 'Segunda a Sexta: 7h às 17h',
        services: 'Hematologia, Hemoterapia, Transplante de Medula Óssea',
        accessibility_features: 'Acesso para cadeirantes, elevadores, banheiros adaptados',
        latitude: -12.9777,
        longitude: -38.4951,
        active: true
      },
      {
        id: 2,
        name: 'Hospital Ana Nery',
        type: 'publica',
        address: 'Rua Augusto Viana, s/n - Canela, Salvador - BA, 40110-060',
        phone: '(71) 3283-8000',
        email: 'contato@hananery.ba.gov.br',
        opening_hours: 'Segunda a Sexta: 6h às 18h',
        services: 'Pediatria, Hematologia Pediátrica, Urgência',
        accessibility_features: 'Rampa de acesso, sinalização em braile',
        latitude: -12.9896,
        longitude: -38.5108,
        active: true
      },
      {
        id: 3,
        name: 'Centro de Referência Estadual para Assistência ao Diabetes e Endocrinologia',
        type: 'publica',
        address: 'Av. Anita Garibaldi, 2266 - Ondina, Salvador - BA, 40170-130',
        phone: '(71) 3117-1400',
        email: 'cedeba@saude.ba.gov.br',
        opening_hours: 'Segunda a Sexta: 7h às 16h',
        services: 'Endocrinologia, Hematologia, Consultas especializadas',
        accessibility_features: 'Estacionamento para deficientes, acesso facilitado',
        latitude: -13.0037,
        longitude: -38.5147,
        active: true
      },
      {
        id: 4,
        name: 'Hospital Universitário Professor Edgard Santos',
        type: 'publica',
        address: 'Rua Dr. Augusto Viana, s/n - Canela, Salvador - BA, 40110-060',
        phone: '(71) 3283-8000',
        email: 'hupes@ufba.br',
        opening_hours: 'Segunda a Sexta: 6h às 18h, Sábado: 6h às 12h',
        services: 'Hematologia, Oncologia, Medicina Interna',
        accessibility_features: 'Acesso completo para pessoas com deficiência',
        latitude: -12.9889,
        longitude: -38.5115,
        active: true
      },
      {
        id: 5,
        name: 'Hospital Martagão Gesteira',
        type: 'publica',
        address: 'Rua Dr. Augusto Viana, s/n - Canela, Salvador - BA, 40110-060',
        phone: '(71) 3283-8100',
        email: 'martagao@ufba.br',
        opening_hours: 'Segunda a Sexta: 7h às 17h',
        services: 'Pediatria, Hematologia Pediátrica, Emergência Pediátrica',
        accessibility_features: 'Área pediátrica adaptada, brinquedoteca acessível',
        latitude: -12.9885,
        longitude: -38.5120,
        active: true
      }
    ]
  }

  const filterUnits = () => {
    let filtered = treatmentUnits

    if (typeFilter !== 'all') {
      filtered = filtered.filter(unit => unit.type === typeFilter)
    }

    setFilteredUnits(filtered)
  }

  const openInMaps = (unit) => {
    if (unit.latitude && unit.longitude) {
      const url = `https://www.google.com/maps/dir/?api=1&destination=${unit.latitude},${unit.longitude}`
      window.open(url, '_blank')
    } else {
      const url = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(unit.address)}`
      window.open(url, '_blank')
    }
  }

  const getUnitTypeBadge = (type) => {
    return (
      <Badge variant={type === 'publica' ? 'default' : 'secondary'}>
        {type === 'publica' ? 'Pública' : 'Privada'}
      </Badge>
    )
  }

  const handleUnitSelect = (unit) => {
    setSelectedUnit(unit)
    // Aqui você pode adicionar lógica adicional quando uma unidade é selecionada
  }

  if (isLoading) {
    return (
      <Card>
        <CardContent className="flex items-center justify-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#C8102E]"></div>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="space-y-6">
      {/* Integração com Google Maps */}
      <GoogleMapsIntegration 
        treatmentUnits={filteredUnits}
        onUnitSelect={handleUnitSelect}
      />

      {/* Lista de unidades */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <div className="flex items-center">
              <MapPin className="w-5 h-5 mr-2" />
              Todas as Unidades de Tratamento
            </div>
            <div className="flex items-center space-x-2">
              <Filter className="w-4 h-4" />
              <Select value={typeFilter} onValueChange={setTypeFilter}>
                <SelectTrigger className="w-32">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todas</SelectItem>
                  <SelectItem value="publica">Públicas</SelectItem>
                  <SelectItem value="privada">Privadas</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardTitle>
        </CardHeader>
        <CardContent>
          {filteredUnits.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              <MapPin className="w-12 h-12 mx-auto mb-4 text-gray-300" />
              <p>Nenhuma unidade encontrada</p>
            </div>
          ) : (
            <div className="space-y-4">
              {filteredUnits.map((unit) => (
                <div key={unit.id} className="border rounded-lg p-4 hover:bg-gray-50 transition-colors">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center space-x-2 mb-2">
                        <h3 className="font-semibold text-gray-900">{unit.name}</h3>
                        {getUnitTypeBadge(unit.type)}
                      </div>
                      
                      <div className="space-y-1 text-sm text-gray-600">
                        <div className="flex items-start">
                          <MapPin className="w-4 h-4 mr-2 mt-0.5 flex-shrink-0" />
                          <span>{unit.address}</span>
                        </div>
                        
                        {unit.phone && (
                          <div className="flex items-center">
                            <Phone className="w-4 h-4 mr-2" />
                            <span>{unit.phone}</span>
                          </div>
                        )}
                        
                        {unit.opening_hours && (
                          <div className="flex items-center">
                            <Clock className="w-4 h-4 mr-2" />
                            <span>{unit.opening_hours}</span>
                          </div>
                        )}
                      </div>
                    </div>
                    
                    <div className="flex flex-col space-y-2 ml-4">
                      <Dialog>
                        <DialogTrigger asChild>
                          <Button 
                            variant="outline" 
                            size="sm"
                            onClick={() => setSelectedUnit(unit)}
                          >
                            Detalhes
                          </Button>
                        </DialogTrigger>
                        <DialogContent className="max-w-2xl">
                          <DialogHeader>
                            <DialogTitle className="flex items-center">
                              <MapPin className="w-5 h-5 mr-2" />
                              {unit.name}
                            </DialogTitle>
                          </DialogHeader>
                          <div className="space-y-4">
                            <div className="flex items-center space-x-2">
                              {getUnitTypeBadge(unit.type)}
                            </div>
                            
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                              <div>
                                <h4 className="font-semibold text-gray-900 mb-2">Informações de Contato</h4>
                                <div className="space-y-2 text-sm">
                                  <div className="flex items-start">
                                    <MapPin className="w-4 h-4 mr-2 mt-0.5 flex-shrink-0" />
                                    <span>{unit.address}</span>
                                  </div>
                                  {unit.phone && (
                                    <div className="flex items-center">
                                      <Phone className="w-4 h-4 mr-2" />
                                      <span>{unit.phone}</span>
                                    </div>
                                  )}
                                  {unit.email && (
                                    <div className="flex items-center">
                                      <Mail className="w-4 h-4 mr-2" />
                                      <span>{unit.email}</span>
                                    </div>
                                  )}
                                  {unit.opening_hours && (
                                    <div className="flex items-center">
                                      <Clock className="w-4 h-4 mr-2" />
                                      <span>{unit.opening_hours}</span>
                                    </div>
                                  )}
                                </div>
                              </div>
                              
                              <div>
                                <h4 className="font-semibold text-gray-900 mb-2">Serviços</h4>
                                {unit.services ? (
                                  <p className="text-sm text-gray-600">{unit.services}</p>
                                ) : (
                                  <p className="text-sm text-gray-500">Informações não disponíveis</p>
                                )}
                              </div>
                            </div>
                            
                            {unit.accessibility_features && (
                              <div>
                                <h4 className="font-semibold text-gray-900 mb-2 flex items-center">
                                  <Accessibility className="w-4 h-4 mr-2" />
                                  Acessibilidade
                                </h4>
                                <p className="text-sm text-gray-600">{unit.accessibility_features}</p>
                              </div>
                            )}
                            
                            <div className="flex space-x-2">
                              <Button onClick={() => openInMaps(unit)} className="flex-1">
                                <Navigation className="w-4 h-4 mr-2" />
                                Ver no Mapa
                              </Button>
                            </div>
                          </div>
                        </DialogContent>
                      </Dialog>
                      
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => openInMaps(unit)}
                      >
                        <Navigation className="w-4 h-4 mr-1" />
                        Rota
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}

export default MapaUnidades

