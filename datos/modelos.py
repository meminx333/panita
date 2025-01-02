"""AI is creating summary for Returns:[type]: [description]"""

from app_config import db


class Partida(db.Model):  # Modelo para almacenar el estado del juego
    """Class representing a game"""

    id = db.Column(db.Integer, primary_key=True)
    estado = db.Column(db.String(20), nullable=False)  # Activa, terminada, etc.
    turno_actual = db.Column(db.Integer, db.ForeignKey("jugador.id"))


class Jugador(db.Model):
    """Class representing a un jugador"""

    __tablename__ = "jugador"
    id = db.Column(db.Integer, primary_key=True)
    nombre = db.Column(db.String(50), nullable=False)
    fichas = db.relationship("Ficha", backref="jugador", lazy=True)

    def __init__(self, nombre):
        self.nombre = nombre  # Inicializa el atributo 'nombre'

    def __repr__(self):
        return f"<Jugador {self.nombre}>"


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
            f"<Ficha {self.ficha_id}: Posición={self.posicion},"
            f"Jugador={self.jugador_id}, Numero={self.numero},"
            f"Casilla={self.casilla_id}>"
        )


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
    tipo = db.Column(db.String(50), primary_key=True)
    esp1 = db.Column(db.String(50), primary_key=True)
    esp2 = db.Column(db.String(50), primary_key=True)

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
