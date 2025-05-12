"""Modelo de la tabla Casilla"""
from app_config import db

class Casilla(db.Model):
    """Class representing a casilla"""

    __tablename__ = "casilla"
    casilla_id = db.Column(db.String(50), primary_key=True)
    fila = db.Column(db.Integer, nullable=False)
    columna = db.Column(db.Integer, nullable=False)
    numero = db.Column(db.Integer, nullable=False)
    re1 = db.Column(db.Integer, nullable=False)
    re2 = db.Column(db.Integer, nullable=False)
    colspan = db.Column(db.Integer, nullable=False)
    rowspan = db.Column(db.Integer, nullable=False)
    tipo = db.Column(db.String(50))
    esp1 = db.Column(db.String(50))
    esp2 = db.Column(db.String(50))

    def __init__(
        self, casilla_id, columna, fila, re1, re2, numero, tipo, esp1, esp2, colspan, rowspan
    ):
        self.casilla_id = casilla_id
        self.columna = columna
        self.numero = numero
        self.fila = fila
        self.re1 = re1
        self.re2 = re2
        self.tipo = tipo
        self.esp1 = esp1
        self.esp2 = esp2
        self.colspan = colspan
        self.rowspan = rowspan

    def __repr__(self):
        return (
            f"<Casilla {self.casilla_id}: re1={self.re1},"
            f"Fila={self.fila}, Columna={self.columna},"
            f"re2={self.re2}, numero={self.numero},"
            f"colspan={self.colspan}, rowspan={self.rowspan},"
            f"esp2={self.esp2}, esp1={self.esp1},tipo={self.tipo}>"
            )
