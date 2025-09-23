#!/usr/bin/env python3
"""
Script para criar as tabelas da base de dados
"""

import sys
import os
sys.path.append(os.path.dirname(os.path.abspath(__file__)))

from app import create_app
from extensions import db

def create_tables():
    app = create_app()
    
    with app.app_context():
        try:
            # Criar todas as tabelas
            db.create_all()
            print("✅ Tabelas criadas com sucesso!")
            
            # Listar tabelas criadas
            from sqlalchemy import inspect
            inspector = inspect(db.engine)
            tables = inspector.get_table_names()
            print(f"📊 Tabelas na base de dados: {', '.join(tables)}")
            
        except Exception as e:
            print(f"❌ Erro ao criar tabelas: {str(e)}")
            raise

if __name__ == "__main__":
    create_tables()

