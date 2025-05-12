"""Modelo de la tabla jugador"""
from app_config import db

class Jugador(db.Model):
    """Class representing a un jugador"""

    __tablename__ = "jugador"
    id = db.Column(db.Integer, primary_key=True)
    nombre = db.Column(db.String(50), nullable=False)
    es_cpu = db.Column(db.Boolean, default=False)
    fichas = db.relationship("Ficha", backref="jugador", lazy=True)

    def __init__(self, nombre, es_cpu):
        self.nombre = nombre  # Inicializa el atributo 'nombre'
        self.es_cpu = es_cpu

    def __repr__(self):
        return f"<Jugador {self.nombre}, CPU {self.es_cpu}>"

    def to_dict(self):
        """Convierte el objeto en un diccionario"""
        return {
            "id": self.id,
            "nombre": self.nombre,
            "es_cpu": self.es_cpu
        }
