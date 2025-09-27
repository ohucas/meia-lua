from flask import Blueprint, request, jsonify
from ..models.treatment_unit import TreatmentUnit
from ..extensions import db
import math

treatment_units_bp = Blueprint('treatment_units', __name__)

@treatment_units_bp.route('/proximas', methods=['POST'])
def get_nearby_units():
    """Obter unidades próximas baseado na localização do usuário (público)"""
    try:
        data = request.get_json()
        
        if not data or 'latitude' not in data or 'longitude' not in data:
            return jsonify({
                'success': False,
                'message': 'Latitude e longitude são obrigatórias'
            }), 400
        
        user_lat = data['latitude']
        user_lng = data['longitude']
        radius = data.get('radius', 25)  # raio padrão de 25km
        limit = data.get('limit', 10)    # limite padrão de 10 unidades
        
        # Query em todas as unidades ativas
        query = TreatmentUnit.query.filter_by(active=True)

        # Filtrar por especialização em anemia falciforme
        query = query.filter(TreatmentUnit.specialization.ilike("%anemia falciforme%"))

        # Filtrar por tipo de unidade (público/privado) se fornecido
        unit_type_filter = data.get("unit_type")
        if unit_type_filter:
            query = query.filter_by(unit_type=unit_type_filter)

        units = query.all()
        
        # Calcular distâncias e filtrar por raio
        nearby_units = []
        for unit in units:
            distance = calculate_distance(user_lat, user_lng, unit.latitude, unit.longitude)
            if distance <= radius:
                unit_dict = unit.to_dict()
                unit_dict['distance'] = round(distance, 2)
                nearby_units.append(unit_dict)
        
        # Ordenar por distância e limitar resultados
        nearby_units.sort(key=lambda x: x['distance'])
        nearby_units = nearby_units[:limit]
        
        return jsonify({
            'success': True,
            'data': nearby_units,
            'total': len(nearby_units)
        }), 200
        
    except Exception as e:
        return jsonify({
            'success': False,
            'message': f'Erro ao buscar unidades próximas: {str(e)}'
        }), 500

def calculate_distance(lat1, lng1, lat2, lng2):
    """Calcular distância entre dois pontos usando a fórmula de Haversine"""
    R = 6371  # Raio da Terra em km
    lat1_rad, lng1_rad, lat2_rad, lng2_rad = map(math.radians, [lat1, lng1, lat2, lng2])
    
    dlat = lat2_rad - lat1_rad
    dlng = lng2_rad - lng1_rad
    
    a = math.sin(dlat/2)**2 + math.cos(lat1_rad) * math.cos(lat2_rad) * math.sin(dlng/2)**2
    c = 2 * math.atan2(math.sqrt(a), math.sqrt(1-a))
    
    return R * c
