#!/usr/bin/env python3
import os
import sys
from datetime import datetime

# Adicionar o diretório do projeto ao path
sys.path.insert(0, os.path.abspath('.'))

from app import create_app
from extensions import db
# Importar explicitamente todos os modelos
from models.user import User
from models.patient import Patient
from models.pharmacist import Pharmacist
from models.medication import Medication
from models.inventory import Inventory
from models.appointment import Appointment
from models.audit_log import AuditLog

def init_database():
    print("🔧 Iniciando configuração do banco de dados...")
    
    app = create_app()
    
    with app.app_context():
        print("📋 Modelos carregados:")
        print(f"   - User: {User}")
        print(f"   - Patient: {Patient}")
        print(f"   - Pharmacist: {Pharmacist}")
        print(f"   - Medication: {Medication}")
        print(f"   - Inventory: {Inventory}")
        print(f"   - Appointment: {Appointment}")
        print(f"   - AuditLog: {AuditLog}")
        
        print("🗑️ Removendo tabelas existentes...")
        db.drop_all()
        
        print("🔨 Criando tabelas...")
        db.create_all()
        
        # Verificar se as tabelas foram criadas
        inspector = db.inspect(db.engine)
        tables = inspector.get_table_names()
        print(f"📊 Tabelas criadas: {tables}")
        
        if 'users' in tables:
            print("✅ Tabela 'users' criada com sucesso!")
        else:
            print("❌ Erro: Tabela 'users' não foi criada!")
            return False
            
        print("✅ Banco de dados inicializado com sucesso!")
        return True

if __name__ == "__main__":
    success = init_database()
    if not success:
        sys.exit(1)


