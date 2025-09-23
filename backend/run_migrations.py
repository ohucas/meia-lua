from flask_migrate import upgrade, Migrate
from app import create_app
from extensions import db

# Executa as migrações do Alembic/Flask-Migrate até a HEAD usando DATABASE_URL
# Utilize antes do deploy (ou em staging) para preparar o banco de dados.

def main():
    app = create_app()
    Migrate(app, db)
    with app.app_context():
        # Executa upgrade para a última versão
        upgrade()
        print("[OK] Migrações aplicadas com sucesso (alembic upgrade head)")


if __name__ == "__main__":
    main()
