from flask import Flask, jsonify
from extensions import db, jwt, cors, bcrypt
from routes.treatment_units import treatment_units_bp
from routes.free_maps import free_maps_bp
from config import Config
from flask_migrate import Migrate
# Importar todos os modelos para garantir que sejam registrados
from models import *

def create_app():
    app = Flask(__name__)
    app.config.from_object(Config)

    db.init_app(app)
    jwt.init_app(app)
    cors.init_app(app, resources={
        r"/*": {
            "origins": ["http://localhost:5173", "http://127.0.0.1:5173", "*"],
            "methods": ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
            "allow_headers": ["Content-Type", "Authorization", "Access-Control-Allow-Origin"],
            "supports_credentials": True
        }
    })
    bcrypt.init_app(app)
    migrate = Migrate(app, db)

    @app.route('/')
    def health_check():
        return jsonify({
            "status": "ok",
            "message": "Sistema Meia Lua API está funcionando",
            "version": "1.0.0"
        })

    # Apenas rotas necessárias para Unidades e Mapas públicos
    app.register_blueprint(treatment_units_bp, url_prefix='/unidades-tratamento')
    app.register_blueprint(free_maps_bp, url_prefix='/api')

    return app

if __name__ == '__main__':
    app = create_app()
    app.run(debug=True, host='0.0.0.0', port=5001)

