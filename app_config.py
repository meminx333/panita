"""AI is creating summary for Returns:[type]: [description]"""
from flask import Flask
from flask_sqlalchemy import SQLAlchemy
from flask_migrate import Migrate
from flask_jwt_extended import JWTManager
from flask_talisman import Talisman
from flask_socketio import SocketIO
from flask_cors import CORS
from flask_restx import Api
from config import Config
#import rutas configuracion
from routes.test import api as test_ns
#conexion a la base de datos

db = SQLAlchemy()
migrate = Migrate()
jwt = JWTManager()

def create_app():
    """Crea la aplicación Flask y configura las extensiones."""
    app = Flask(__name__)
    app.config.from_object(Config)
    app.config['RESTX_MASK_SWAGGER'] = False  # Para evitar máscara en parámetros
    app.config[
        'SWAGGER_UI_DOC_EXPANSION'] = 'list'  # Configura la vista inicial del Swagger

    # Initialize extensions
    db.init_app(app)
    migrate.init_app(app, db)
    jwt.init_app(app)

    return app

aapp = create_app()

    # Configurar CORS para permitir solicitudes desde el frontend con credenciales
CORS(aapp,
     resources={r"/*": {
         "origins": ["*"],
         "methods": ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
         "allow_headers": ["Content-Type", "Authorization"],
         "supports_credentials": True
     }})

api = Api(
    aapp,
    version="1.0",
    title="API de Poleana",
    description="Documentación de la API para el juego Poleana",
    doc="/docs"  # Ruta donde estará la documentación Swagger
)

#configuracion de socketio
socketio = SocketIO(aapp)



# Usar solo en desarrollo
csp = {
    'script-src': ["'self'", 'https://cdn.socket.io'] +
                 (["'unsafe-inline'"] if aapp.debug else [])
}

Talisman(aapp, content_security_policy=csp)

#rutas configuracion
api.add_namespace(test_ns, path='/api/health')
