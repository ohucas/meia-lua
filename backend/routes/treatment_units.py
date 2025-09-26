from flask import Blueprint, request, jsonify
from ..models.treatment_unit import TreatmentUnit
from ..extensions import db
import math

treatment_units_bp = Blueprint('treatment_units', __name__)

@treatment_units_bp.route('/', methods=['GET'])
def get_treatment_units():
    """Listar todas as unidades de tratamento ativas (público)"""
    try:
        # Parâmetros de filtro
        unit_type = request.args.get('type')
        lat = request.args.get('lat', type=float)
        lng = request.args.get('lng', type=float)
        radius = request.args.get('radius', default=50, type=float)  # raio em km
        
        # Query base
        query = TreatmentUnit.query.filter_by(active=True)
        
        # Filtrar por tipo se especificado
        if unit_type and unit_type != 'all':
            query = query.filter_by(type=unit_type)
        
        units = query.all()
        
        # Se coordenadas foram fornecidas, calcular distâncias
        if lat and lng:
            units_with_distance = []
            for unit in units:
                if unit.latitude and unit.longitude:
                    distance = calculate_distance(lat, lng, unit.latitude, unit.longitude)
                    if distance <= radius:
                        unit_dict = unit.to_dict()
                        unit_dict['distance'] = round(distance, 2)
                        units_with_distance.append(unit_dict)
            
            # Ordenar por distância
            units_with_distance.sort(key=lambda x: x['distance'])
            units_data = units_with_distance
        else:
            units_data = [unit.to_dict() for unit in units]
        
        return jsonify({
            'success': True,
            'data': units_data,
            'total': len(units_data)
        }), 200
        
    except Exception as e:
        return jsonify({
            'success': False,
            'message': f'Erro ao buscar unidades de tratamento: {str(e)}'
        }), 500

@treatment_units_bp.route('/<int:unit_id>', methods=['GET'])
def get_treatment_unit(unit_id):
    """Obter uma unidade de tratamento específica (público)"""
    try:
        unit = TreatmentUnit.query.get_or_404(unit_id)
        
        # Se coordenadas do usuário foram fornecidas, calcular distância
        lat = request.args.get('lat', type=float)
        lng = request.args.get('lng', type=float)
        
        unit_data = unit.to_dict()
        
        if lat and lng and unit.latitude and unit.longitude:
            distance = calculate_distance(lat, lng, unit.latitude, unit.longitude)
            unit_data['distance'] = round(distance, 2)
        
        return jsonify({
            'success': True,
            'data': unit_data
        }), 200
        
    except Exception as e:
        return jsonify({
            'success': False,
            'message': f'Erro ao buscar unidade de tratamento: {str(e)}'
        }), 500

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
        limit = data.get('limit', 5)  # máximo 5 unidades
        unit_type = data.get('type')  # filtro por tipo
        
        # Query base
        query = TreatmentUnit.query.filter_by(active=True)
        
        # Filtrar por tipo se especificado
        if unit_type and unit_type != 'all':
            query = query.filter_by(type=unit_type)
        
        units = query.all()
        
        # Calcular distâncias e filtrar por raio
        nearby_units = []
        for unit in units:
            if unit.latitude and unit.longitude:
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
            'total': len(nearby_units),
            'user_location': {
                'latitude': user_lat,
                'longitude': user_lng
            }
        }), 200
        
    except Exception as e:
        return jsonify({
            'success': False,
            'message': f'Erro ao buscar unidades próximas: {str(e)}'
        }), 500

## Rotas administrativas (criar/atualizar/excluir) removidas para desacoplar de papéis de usuário

def calculate_distance(lat1, lng1, lat2, lng2):
    """Calcular distância entre dois pontos usando a fórmula de Haversine"""
    R = 6371  # Raio da Terra em km
    
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
    c = 2 * math.atan2(math.sqrt(a), math.sqrt(1-a))
    
    return R * c

