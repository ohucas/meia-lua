import os
import sys

# Ensure project root is on sys.path to import the backend package
ROOT_DIR = os.path.dirname(os.path.dirname(__file__))
if ROOT_DIR not in sys.path:
    sys.path.append(ROOT_DIR)

from backend.app import create_app

_flask_app = create_app()


def _prefix_middleware(app, prefix: str):
    def _wrapped(environ, start_response):
        path = environ.get("PATH_INFO", "")
        # Apenas prefixar quando a rota original vier de /api/*
        # (ex.: '/api/...' -> manter '/api/...'); outras rotas (ex.: '/unidades-tratamento') ficam intactas
        if path.startswith("/api/") and not path.startswith(prefix + "/"):
            # já começa com /api/ mas sem o prefixo efetivo no app? garantir consistência
            environ["PATH_INFO"] = path
        return app(environ, start_response)

    return _wrapped

# Expose WSGI callable
app = _prefix_middleware(_flask_app, "/api")
