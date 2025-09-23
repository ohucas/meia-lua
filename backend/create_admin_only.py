#!/usr/bin/env python3
"""
Script exclusivo para criação de administradores pelo sistema.
Este é o único meio de criar contas de administrador.
"""

import sys
import os
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from app import create_app
from extensions import db, bcrypt
from models.user import User
from datetime import datetime

def create_admin_user(email, cpf, full_name, password):
    """
    Cria um usuário administrador.
    Esta é a única forma de criar administradores no sistema.
    """
    app = create_app()
    
    with app.app_context():
        try:
            # Verificar se já existe
            existing_user = User.query.filter((User.email == email) | (User.cpf == cpf)).first()
            if existing_user:
                print(f"❌ Usuário já existe: {existing_user.email}")
                return False
            
            # Criar usuário administrador
            hashed_password = bcrypt.generate_password_hash(password).decode("utf-8")
            new_admin = User(
                email=email,
                cpf=cpf,
                full_name=full_name,
                password_hash=hashed_password,
                role="administrador",
                active=True,
                accept_terms=True,
                accept_privacy=True,
                terms_accepted_at=datetime.utcnow(),
                privacy_accepted_at=datetime.utcnow()
            )
            
            db.session.add(new_admin)
            db.session.commit()
            
            print(f"✅ Administrador criado com sucesso!")
            print(f"📧 Email: {email}")
            print(f"🆔 CPF: {cpf}")
            print(f"👤 Nome: {full_name}")
            print(f"🔑 Senha: {password}")
            print(f"⚠️  IMPORTANTE: Altere a senha após o primeiro login!")
            
            return True
            
        except Exception as e:
            db.session.rollback()
            print(f"❌ Erro ao criar administrador: {str(e)}")
            return False

if __name__ == "__main__":
    if len(sys.argv) != 5:
        print("Uso: python3 create_admin_only.py <email> <cpf> <nome_completo> <senha>")
        print("Exemplo: python3 create_admin_only.py admin@sistema.com 12345678901 'Admin Sistema' 'SenhaSegura123'")
        sys.exit(1)
    
    email = sys.argv[1]
    cpf = sys.argv[2]
    full_name = sys.argv[3]
    password = sys.argv[4]
    
    print("🔐 CRIAÇÃO DE ADMINISTRADOR - ACESSO RESTRITO")
    print("=" * 50)
    
    success = create_admin_user(email, cpf, full_name, password)
    
    if success:
        print("\n✅ Operação concluída com sucesso!")
    else:
        print("\n❌ Falha na operação!")
        sys.exit(1)

