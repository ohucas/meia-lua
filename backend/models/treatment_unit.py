from extensions import db
from datetime import datetime

class TreatmentUnit(db.Model):
    __tablename__ = 'treatment_units'
    
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(255), nullable=False)
    type = db.Column(db.Enum("publica", "privada", name="unit_type"), nullable=False)
    address = db.Column(db.String(500), nullable=False)
    phone = db.Column(db.String(20))
    email = db.Column(db.String(255))
    opening_hours = db.Column(db.String(255))  # Ex: "Terça a Quinta: 6h às 12h"
    services = db.Column(db.Text)  # Serviços disponíveis
    accessibility_features = db.Column(db.Text)  # Recursos de acessibilidade
    latitude = db.Column(db.Float)  # Para localização no mapa
    longitude = db.Column(db.Float)  # Para localização no mapa
    active = db.Column(db.Boolean, default=True)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    updated_at = db.Column(db.DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    
    def to_dict(self):
        return {
            'id': self.id,
            'name': self.name,
            'type': self.type,
            'address': self.address,
            'phone': self.phone,
            'email': self.email,
            'opening_hours': self.opening_hours,
            'services': self.services,
            'accessibility_features': self.accessibility_features,
            'latitude': self.latitude,
            'longitude': self.longitude,
            'active': self.active,
            'created_at': self.created_at.isoformat() if self.created_at else None,
            'updated_at': self.updated_at.isoformat() if self.updated_at else None
        }

