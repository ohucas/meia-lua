#!/usr/bin/env python3
"""
Script de migração para PostgreSQL
Adiciona suporte para PostgreSQL e novos campos
"""

from flask import Flask
from flask_sqlalchemy import SQLAlchemy
from flask_migrate import Migrate
import os
import sys

# Adicionar o diretório pai ao path para importar os módulos
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from config import Config
from extensions import db
from models import *

def create_app():
    app = Flask(__name__)
    app.config.from_object(Config)
    
    # Tentar conectar com PostgreSQL primeiro
    try:
        db.init_app(app)
        with app.app_context():
            # Testar conexão
            db.engine.execute('SELECT 1')
        print("✅ Conectado ao PostgreSQL com sucesso!")
        return app
    except Exception as e:
        print(f"❌ Erro ao conectar com PostgreSQL: {e}")
        print("🔄 Tentando fallback para SQLite...")
        
        # Fallback para SQLite
        app.config['SQLALCHEMY_DATABASE_URI'] = Config.SQLALCHEMY_DATABASE_URI_FALLBACK
        db.init_app(app)
        print("✅ Conectado ao SQLite como fallback!")
        return app

def run_migration():
    app = create_app()
    
    with app.app_context():
        print("🔄 Criando todas as tabelas...")
        
        try:
            # Criar todas as tabelas
            db.create_all()
            print("✅ Tabelas criadas com sucesso!")
            
            # Verificar se as tabelas foram criadas
            inspector = db.inspect(db.engine)
            tables = inspector.get_table_names()
            print(f"📋 Tabelas criadas: {', '.join(tables)}")
            
            return True
            
        except Exception as e:
            print(f"❌ Erro ao criar tabelas: {e}")
            return False

if __name__ == "__main__":
    success = run_migration()
    if success:
        print("🎉 Migração concluída com sucesso!")
    else:
        print("💥 Migração falhou!")
        sys.exit(1)

