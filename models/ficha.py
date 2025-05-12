"""Modelo de la tabla fichas"""
from app_config import db

class Ficha(db.Model):
    """Class representing a ficha"""

    __tablename__ = "ficha"
    ficha_id = db.Column(db.String(50), primary_key=True)
    numero = db.Column(db.Integer, nullable=False)
    posicion = db.Column(db.Integer, nullable=False)  # Posición inicial de la ficha
    jugador_id = db.Column(db.Integer, db.ForeignKey("jugador.id"), nullable=False)
    casilla_id = db.Column(db.String, db.ForeignKey("casilla.casilla_id"), nullable=True)

    def __init__(self, posicion, numero, jugador_id, casilla_id):
        self.ficha_id = f"Fj{jugador_id}-{numero}" # Genera el ID dinámicamente
        self.numero = numero # Inicializa el atributo 'numero'
        self.posicion = posicion  # Inicializa el atributo 'posicion'
        self.jugador_id = jugador_id  # Inicializa el atributo 'jugador_id'
        self.casilla_id = casilla_id # Inicializa el atributo 'casilla_id'

    def __repr__(self):
        return (
            f"<Ficha {self.ficha_id}: Posicion={self.posicion},"
            f"Jugador={self.jugador_id}, Numero={self.numero},"
            f"Casilla={self.casilla_id}>"
        )


    def to_dict(self):
        """Convierte el objeto en un diccionario"""
        return {
            'Ficha': self.ficha_id,
            'jugador': self.jugador_id,
            'numero': self.numero,
            'posicion': self.posicion,
            'casilla': self.casilla_id
        }
