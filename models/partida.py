"""Modelo de la tabla partidas"""
from app_config import db

class Partida(db.Model):  # Modelo para almacenar el estado del juego
    """Modelo de la tabla partidas"""
    __tablename__ = 'partidas'

    id = db.Column(db.Integer, primary_key=True)
    estado = db.Column(db.String(20), nullable=False)  # Activa, terminada, etc.
    turno_actual = db.Column(db.Integer, db.ForeignKey("jugador.id"))

    def __init__(self, estado, turno_actual):
        self.estado = estado
        self.turno_actual = turno_actual


    def __repr__(self):
        return f"<Partida(id={self.id}, estado='{self.estado}', turno='{self.turno_actual}')>"

    def to_dict(self):
        """Convierte el objeto en un diccionario"""
        return {
            'id': self.id,
            'estado': self.estado,
            'turno_actual' : self.turno_actual
        }
