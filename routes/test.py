""" Módulo con rutas de prueba para verificar el estado del servidor. """
from flask_restx import Namespace, Resource
from flask import jsonify


# Crear un Namespace para las rutas de prueba
api = Namespace("test", description="Rutas para propósitos de prueba")

@api.route('/ping')
class Ping(Resource):
    """
    Ruta de prueba para verificar el estado del servidor.
    """
    @api.response(200, "El servidor está activo")
    def get(self):
        """
        Ruta get de prueba para verificar si el servidor está activo.
        """
        return jsonify({"message": "pong!"})
