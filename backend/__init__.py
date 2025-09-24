from flask import Flask
from flask_sqlalchemy import SQLAlchemy

db = SQLAlchemy()

def create_app():
    app = Flask(__name__)
    # ... configure seu aplicativo ...
    db.init_app(app)
    
    from . import models  # Isso importará os modelos
    from . import routes
    
    return app

