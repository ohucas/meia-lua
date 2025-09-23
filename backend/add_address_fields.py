#!/usr/bin/env python3
"""
Script para adicionar campos de endereço à tabela patients
"""

import sqlite3
import os

def add_address_fields():
    # Caminho para o banco de dados
    db_path = os.path.join(os.path.dirname(__file__), '..', 'instance', 'meialua.db')
    
    if not os.path.exists(db_path):
        print(f"Banco de dados não encontrado em: {db_path}")
        return False
    
    try:
        # Conectar ao banco
        conn = sqlite3.connect(db_path)
        cursor = conn.cursor()
        
        # Verificar se os campos já existem
        cursor.execute("PRAGMA table_info(patients)")
        columns = [column[1] for column in cursor.fetchall()]
        
        # Adicionar campos se não existirem
        if 'address' not in columns:
            cursor.execute("ALTER TABLE patients ADD COLUMN address TEXT")
            print("Campo 'address' adicionado")
        
        if 'city' not in columns:
            cursor.execute("ALTER TABLE patients ADD COLUMN city TEXT")
            print("Campo 'city' adicionado")
        
        if 'state' not in columns:
            cursor.execute("ALTER TABLE patients ADD COLUMN state TEXT")
            print("Campo 'state' adicionado")
        
        if 'cep' not in columns:
            cursor.execute("ALTER TABLE patients ADD COLUMN cep TEXT")
            print("Campo 'cep' adicionado")
        
        # Commit das alterações
        conn.commit()
        print("Campos de endereço adicionados com sucesso!")
        
        # Verificar estrutura final da tabela
        cursor.execute("PRAGMA table_info(patients)")
        final_columns = cursor.fetchall()
        print("\nEstrutura final da tabela patients:")
        for column in final_columns:
            print(f"  {column[1]} ({column[2]})")
        
        conn.close()
        return True
        
    except Exception as e:
        print(f"Erro ao adicionar campos: {e}")
        if 'conn' in locals():
            conn.close()
        return False

if __name__ == "__main__":
    print("Adicionando campos de endereço à tabela patients...")
    success = add_address_fields()
    if success:
        print("\n✅ Operação concluída com sucesso!")
    else:
        print("\n❌ Erro na operação!")
