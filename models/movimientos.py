"""Modelo de la tabla movimientos"""
from app_config import db

class Movimiento(db.Model):
    """Clase que guarda los movimientos de las fichas"""
    id = db.Column(db.Integer, primary_key=True)
    ficha_id = db.Column(db.String, db.ForeignKey('ficha.ficha_id'))
    origen = db.Column(db.Integer)
    destino = db.Column(db.Integer)
