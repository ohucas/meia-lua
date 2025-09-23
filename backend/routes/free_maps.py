from flask import Blueprint, request, jsonify
import requests
import json
import time
from typing import List, Dict, Any, Optional

free_maps_bp = Blueprint('free_maps', __name__)

# URLs das APIs gratuitas
NOMINATIM_URL = 'https://nominatim.openstreetmap.org'
OVERPASS_URL = 'https://overpass-api.de/api/interpreter'

# Dados estáticos de fallback para centros de hematologia no Brasil
FALLBACK_UNITS = [
    {
        'id': 'hemoba_salvador',
        'name': 'HEMOBA - Fundação de Hematologia e Hemoterapia da Bahia',
        'type': 'publica',
        'address': 'Ladeira do Hospital Geral, s/n - Brotas, Salvador - BA, 40285-001',
        'phone': '(71) 3116-5555',
        'latitude': -12.9714,
        'longitude': -38.5014,
        'opening_hours': 'Segunda a sexta: 7h às 17h',
        'website': 'http://www.hemoba.ba.gov.br',
        'specialties': ['hematologia', 'anemia_falciforme', 'hemocentro']
    },
    {
        'id': 'hemoce_fortaleza',
        'name': 'HEMOCE - Centro de Hematologia e Hemoterapia do Ceará',
        'type': 'publica',
        'address': 'Av. José Bastos, 3390 - Rodolfo Teófilo, Fortaleza - CE, 60431-086',
        'phone': '(85) 3101-2300',
        'latitude': -3.7319,
        'longitude': -38.5267,
        'opening_hours': 'Segunda a sexta: 7h às 17h',
        'website': 'http://www.hemoce.ce.gov.br',
        'specialties': ['hematologia', 'anemia_falciforme', 'hemocentro']
    },
    {
        'id': 'hemorio_rj',
        'name': 'HEMORIO - Instituto Estadual de Hematologia Arthur de Siqueira Cavalcanti',
        'type': 'publica',
        'address': 'R. Frei Caneca, 8 - Centro, Rio de Janeiro - RJ, 20211-030',
        'phone': '(21) 2334-3000',
        'latitude': -22.9068,
        'longitude': -43.1729,
        'opening_hours': 'Segunda a sexta: 7h às 17h',
        'website': 'http://www.hemorio.rj.gov.br',
        'specialties': ['hematologia', 'anemia_falciforme', 'hemocentro']
    },
    {
        'id': 'hemosp_sp',
        'name': 'Fundação Pró-Sangue Hemocentro de São Paulo',
        'type': 'publica',
        'address': 'Av. Dr. Enéas de Carvalho Aguiar, 155 - Cerqueira César, São Paulo - SP, 05403-000',
        'phone': '(11) 4573-7800',
        'latitude': -23.5505,
        'longitude': -46.6333,
        'opening_hours': 'Segunda a sexta: 7h às 17h',
        'website': 'http://www.prosangue.sp.gov.br',
        'specialties': ['hematologia', 'anemia_falciforme', 'hemocentro']
    },
    {
        'id': 'hemominas_bh',
        'name': 'HEMOMINAS - Fundação Centro de Hematologia e Hemoterapia de Minas Gerais',
        'type': 'publica',
        'address': 'Alameda Ezequiel Dias, 321 - Centro, Belo Horizonte - MG, 30130-110',
        'phone': '(31) 3248-4500',
        'latitude': -19.9167,
        'longitude': -43.9345,
        'opening_hours': 'Segunda a sexta: 7h às 17h',
        'website': 'http://www.hemominas.mg.gov.br',
        'specialties': ['hematologia', 'anemia_falciforme', 'hemocentro']
    },
    {
        'id': 'hemosc_florianopolis',
        'name': 'HEMOSC - Centro de Hematologia e Hemoterapia de Santa Catarina',
        'type': 'publica',
        'address': 'Av. Othon Gama D\'Eça, 756 - Centro, Florianópolis - SC, 88015-240',
        'phone': '(48) 3251-9712',
        'latitude': -27.5954,
        'longitude': -48.5480,
        'opening_hours': 'Segunda a sexta: 7h às 17h',
        'website': 'http://www.hemosc.org.br',
        'specialties': ['hematologia', 'anemia_falciforme', 'hemocentro']
    },
    {
        'id': 'hemope_recife',
        'name': 'HEMOPE - Fundação de Hematologia e Hemoterapia de Pernambuco',
        'type': 'publica',
        'address': 'R. Joaquim Nabuco, 171 - Graças, Recife - PE, 52011-900',
        'phone': '(81) 3182-4600',
        'latitude': -8.0476,
        'longitude': -34.8770,
        'opening_hours': 'Segunda a sexta: 7h às 17h',
        'website': 'http://www.hemope.pe.gov.br',
        'specialties': ['hematologia', 'anemia_falciforme', 'hemocentro']
    },
    {
        'id': 'hemoam_manaus',
        'name': 'HEMOAM - Fundação de Hematologia e Hemoterapia do Amazonas',
        'type': 'publica',
        'address': 'Av. Constantino Nery, 4397 - Chapada, Manaus - AM, 69050-002',
        'phone': '(92) 2125-0700',
        'latitude': -3.1190,
        'longitude': -60.0217,
        'opening_hours': 'Segunda a sexta: 7h às 17h',
        'website': 'http://www.hemoam.am.gov.br',
        'specialties': ['hematologia', 'anemia_falciforme', 'hemocentro']
    }
]

@free_maps_bp.route('/unidades', methods=['GET'])
def get_medical_centers():
    """
    Buscar centros médicos de hematologia usando APIs gratuitas
    Aceita coordenadas (lat/lng) ou nome de cidade
    """
    try:
        # Parâmetros da requisição
        lat = request.args.get('lat', type=float)
        lng = request.args.get('lng', type=float)
        cidade = request.args.get('cidade', type=str)
        radius = request.args.get('radius', default=50000, type=int)  # 50km em metros
        
        # Se não temos coordenadas, tentar geocodificar a cidade
        if not lat or not lng:
            if cidade:
                coords = geocode_city(cidade)
                if coords:
                    lat, lng = coords
                else:
                    return jsonify({
                        'success': False,
                        'message': f'Não foi possível encontrar a cidade: {cidade}',
                        'error_code': 'CITY_NOT_FOUND'
                    }), 400
            else:
                return jsonify({
                    'success': False,
                    'message': 'É necessário fornecer coordenadas (lat/lng) ou nome da cidade',
                    'error_code': 'LOCATION_REQUIRED'
                }), 400
        
        # Buscar centros médicos usando Overpass API
        medical_centers = []
        
        try:
            # Buscar hospitais e clínicas com especialidade em hematologia
            overpass_results = search_medical_centers_overpass(lat, lng, radius)
            medical_centers.extend(overpass_results)
        except Exception as e:
            print(f"Erro na Overpass API: {str(e)}")
        
        # Se não encontrou resultados suficientes, usar dados de fallback
        if len(medical_centers) < 3:
            fallback_results = get_fallback_units(lat, lng, radius)
            medical_centers.extend(fallback_results)
        
        # Remover duplicatas baseado no ID
        seen_ids = set()
        unique_results = []
        
        for center in medical_centers:
            if center['id'] not in seen_ids:
                seen_ids.add(center['id'])
                unique_results.append(center)
        
        # Calcular distâncias e ordenar por proximidade
        for center in unique_results:
            center['distance_km'] = calculate_distance(
                lat, lng, 
                center['latitude'], center['longitude']
            )
        
        # Ordenar por distância
        unique_results.sort(key=lambda x: x['distance_km'])
        
        return jsonify({
            'success': True,
            'data': unique_results,
            'total': len(unique_results),
            'search_location': {
                'latitude': lat,
                'longitude': lng,
                'radius_km': radius / 1000,
                'city': cidade if cidade else 'Coordenadas fornecidas'
            },
            'data_sources': ['overpass_api', 'fallback_data']
        }), 200
        
    except Exception as e:
        return jsonify({
            'success': False,
            'message': f'Erro interno do servidor: {str(e)}'
        }), 500

@free_maps_bp.route('/cidades', methods=['GET'])
def search_cities():
    """
    Buscar cidades brasileiras para autocomplete
    """
    try:
        query = request.args.get('q', type=str)
        
        if not query or len(query) < 2:
            return jsonify({
                'success': False,
                'message': 'Query deve ter pelo menos 2 caracteres'
            }), 400
        
        # Buscar cidades usando Nominatim
        params = {
            'q': f"{query}, Brasil",
            'format': 'json',
            'limit': 10,
            'countrycodes': 'br',
            'featuretype': 'city',
            'addressdetails': 1
        }
        
        headers = {
            'User-Agent': 'Sistema-Meia-Lua/1.0 (contato@sistema-meia-lua.com)'
        }
        
        response = requests.get(f"{NOMINATIM_URL}/search", params=params, headers=headers)
        response.raise_for_status()
        
        data = response.json()
        
        cities = []
        for item in data:
            address = item.get('address', {})
            city_name = address.get('city') or address.get('town') or address.get('village')
            state = address.get('state')
            
            if city_name and state:
                cities.append({
                    'name': city_name,
                    'state': state,
                    'full_name': f"{city_name}, {state}",
                    'latitude': float(item['lat']),
                    'longitude': float(item['lon'])
                })
        
        return jsonify({
            'success': True,
            'data': cities,
            'total': len(cities)
        }), 200
        
    except Exception as e:
        return jsonify({
            'success': False,
            'message': f'Erro ao buscar cidades: {str(e)}'
        }), 500

def geocode_city(city_name: str) -> Optional[tuple]:
    """
    Geocodificar nome da cidade usando Nominatim
    """
    try:
        # Adicionar "Brasil" para melhorar a precisão
        query = f"{city_name}, Brasil"
        
        params = {
            'q': query,
            'format': 'json',
            'limit': 1,
            'countrycodes': 'br',  # Restringir ao Brasil
            'addressdetails': 1
        }
        
        headers = {
            'User-Agent': 'Sistema-Meia-Lua/1.0 (contato@sistema-meia-lua.com)'
        }
        
        response = requests.get(f"{NOMINATIM_URL}/search", params=params, headers=headers)
        response.raise_for_status()
        
        data = response.json()
        
        if data and len(data) > 0:
            result = data[0]
            return float(result['lat']), float(result['lon'])
        
        return None
        
    except Exception as e:
        print(f"Erro na geocodificação: {str(e)}")
        return None

def search_medical_centers_overpass(lat: float, lng: float, radius: int) -> List[Dict[Any, Any]]:
    """
    Buscar centros médicos usando Overpass API
    """
    try:
        # Query Overpass para buscar hospitais e clínicas
        overpass_query = f"""
        [out:json][timeout:25];
        (
          node["amenity"="hospital"](around:{radius},{lat},{lng});
          node["amenity"="clinic"](around:{radius},{lat},{lng});
          node["healthcare"="hospital"](around:{radius},{lat},{lng});
          node["healthcare"="clinic"](around:{radius},{lat},{lng});
          way["amenity"="hospital"](around:{radius},{lat},{lng});
          way["amenity"="clinic"](around:{radius},{lat},{lng});
          way["healthcare"="hospital"](around:{radius},{lat},{lng});
          way["healthcare"="clinic"](around:{radius},{lat},{lng});
        );
        out center meta;
        """
        
        response = requests.post(OVERPASS_URL, data=overpass_query, timeout=30)
        response.raise_for_status()
        
        data = response.json()
        
        medical_centers = []
        
        for element in data.get('elements', []):
            # Obter coordenadas
            if element['type'] == 'node':
                element_lat = element['lat']
                element_lng = element['lon']
            elif element['type'] == 'way' and 'center' in element:
                element_lat = element['center']['lat']
                element_lng = element['center']['lon']
            else:
                continue
            
            tags = element.get('tags', {})
            name = tags.get('name', 'Centro Médico')
            
            # Filtrar apenas locais que podem ter serviços de hematologia
            if is_relevant_medical_facility(name, tags):
                medical_center = {
                    'id': f"osm_{element['type']}_{element['id']}",
                    'name': name,
                    'type': determine_unit_type_from_tags(name, tags),
                    'address': format_address_from_tags(tags),
                    'phone': tags.get('phone', ''),
                    'latitude': element_lat,
                    'longitude': element_lng,
                    'opening_hours': format_opening_hours_from_tags(tags),
                    'website': tags.get('website', ''),
                    'specialties': extract_specialties_from_tags(tags),
                    'osm_id': element['id'],
                    'osm_type': element['type']
                }
                
                medical_centers.append(medical_center)
        
        return medical_centers
        
    except Exception as e:
        print(f"Erro na Overpass API: {str(e)}")
        return []

def is_relevant_medical_facility(name: str, tags: Dict[str, str]) -> bool:
    """
    Verificar se a instalação médica é relevante para hematologia
    """
    name_lower = name.lower()
    
    # Palavras-chave que indicam relevância para hematologia
    relevant_keywords = [
        'hospital', 'hemocentro', 'hemoterapia', 'hematologia',
        'centro médico', 'clínica', 'ambulatório', 'policlínica',
        'unidade de saúde', 'posto de saúde', 'upa', 'pronto socorro',
        'santa casa', 'fundação', 'instituto'
    ]
    
    # Verificar nome
    for keyword in relevant_keywords:
        if keyword in name_lower:
            return True
    
    # Verificar tags
    amenity = tags.get('amenity', '').lower()
    healthcare = tags.get('healthcare', '').lower()
    speciality = tags.get('speciality', '').lower()
    
    if amenity in ['hospital', 'clinic'] or healthcare in ['hospital', 'clinic']:
        return True
    
    if 'hematology' in speciality or 'haematology' in speciality:
        return True
    
    return False

def determine_unit_type_from_tags(name: str, tags: Dict[str, str]) -> str:
    """
    Determinar se a unidade é pública ou privada baseado no nome e tags
    """
    name_lower = name.lower()
    
    # Palavras-chave que indicam unidade pública
    public_keywords = [
        'sus', 'público', 'municipal', 'estadual', 'federal',
        'upa', 'posto', 'centro de saúde', 'unidade básica',
        'hospital geral', 'hospital municipal', 'hospital estadual',
        'hospital universitário', 'hemoba', 'hemocentro', 'hemominas',
        'hemorio', 'hemoce', 'hemope', 'hemoam', 'hemosc',
        'fundação', 'instituto público', 'santa casa'
    ]
    
    # Verificar nome
    for keyword in public_keywords:
        if keyword in name_lower:
            return 'publica'
    
    # Verificar tags
    operator = tags.get('operator', '').lower()
    operator_type = tags.get('operator:type', '').lower()
    
    if 'government' in operator_type or 'public' in operator_type:
        return 'publica'
    
    if any(word in operator for word in ['municipal', 'estadual', 'federal', 'governo']):
        return 'publica'
    
    # Se não conseguir determinar claramente, assumir como privada
    return 'privada'

def format_address_from_tags(tags: Dict[str, str]) -> str:
    """
    Formatar endereço a partir das tags do OSM
    """
    address_parts = []
    
    # Componentes do endereço em ordem de prioridade
    components = [
        ('addr:street', ''),
        ('addr:housenumber', ', '),
        ('addr:neighbourhood', ' - '),
        ('addr:city', ', '),
        ('addr:state', ' - '),
        ('addr:postcode', ', ')
    ]
    
    for tag, separator in components:
        if tag in tags and tags[tag]:
            if address_parts and separator:
                address_parts.append(separator)
            address_parts.append(tags[tag])
    
    if address_parts:
        return ''.join(address_parts)
    
    # Fallback para endereço genérico
    return tags.get('addr:full', 'Endereço não disponível')

def format_opening_hours_from_tags(tags: Dict[str, str]) -> str:
    """
    Formatar horários de funcionamento a partir das tags
    """
    opening_hours = tags.get('opening_hours', '')
    
    if opening_hours:
        # Tentar interpretar horários comuns
        if opening_hours == '24/7':
            return '24 horas'
        elif 'Mo-Fr' in opening_hours:
            return f'Segunda a sexta: {opening_hours.replace("Mo-Fr ", "")}'
        else:
            return opening_hours
    
    return 'Horários não disponíveis'

def extract_specialties_from_tags(tags: Dict[str, str]) -> List[str]:
    """
    Extrair especialidades médicas das tags
    """
    specialties = []
    
    speciality = tags.get('speciality', '').lower()
    healthcare_speciality = tags.get('healthcare:speciality', '').lower()
    
    # Especialidades relacionadas à hematologia
    hematology_keywords = ['hematology', 'haematology', 'blood', 'hemotherapy']
    
    for keyword in hematology_keywords:
        if keyword in speciality or keyword in healthcare_speciality:
            specialties.append('hematologia')
            break
    
    # Adicionar outras especialidades relevantes
    if 'emergency' in speciality or 'emergency' in healthcare_speciality:
        specialties.append('emergencia')
    
    if not specialties:
        specialties.append('medicina_geral')
    
    return specialties

def get_fallback_units(lat: float, lng: float, radius: int) -> List[Dict[Any, Any]]:
    """
    Obter unidades de fallback próximas à localização
    """
    fallback_results = []
    
    for unit in FALLBACK_UNITS:
        distance_km = calculate_distance(lat, lng, unit['latitude'], unit['longitude'])
        
        # Incluir unidades dentro do raio especificado
        if distance_km <= (radius / 1000):
            unit_copy = unit.copy()
            unit_copy['distance_km'] = distance_km
            unit_copy['data_source'] = 'fallback'
            fallback_results.append(unit_copy)
    
    return fallback_results

def calculate_distance(lat1: float, lng1: float, lat2: float, lng2: float) -> float:
    """
    Calcular distância entre duas coordenadas usando fórmula de Haversine
    """
    import math
    
    # Converter graus para radianos
    lat1_rad = math.radians(lat1)
    lng1_rad = math.radians(lng1)
    lat2_rad = math.radians(lat2)
    lng2_rad = math.radians(lng2)
    
    # Diferenças
    dlat = lat2_rad - lat1_rad
    dlng = lng2_rad - lng1_rad
    
    # Fórmula de Haversine
    a = math.sin(dlat/2)**2 + math.cos(lat1_rad) * math.cos(lat2_rad) * math.sin(dlng/2)**2
    c = 2 * math.asin(math.sqrt(a))
    
    # Raio da Terra em km
    r = 6371
    
    return c * r

