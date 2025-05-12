"""Inicio de la clase CPU"""
from models import Ficha, Casilla

class CPU:
    """Clase para la lógica de la CPU en el juego"""
    def __init__(self, jugador_id):
        self.jugador_id = jugador_id

    def decidir_movimiento(self, dados):
        """Decide el movimiento de la CPU basado en los dados lanzados"""
        # Lógica básica: Mover primera ficha disponible
        fichas_cpu = Ficha.query.filter_by(jugador_id=self.jugador_id).all()

        for ficha in fichas_cpu:
            nueva_pos = ficha.posicion + sum(dados)
            casilla_valida = Casilla.query.filter_by(numero=nueva_pos).first()

            if casilla_valida and (0 <= nueva_pos < 62):
                return ficha.ficha_id, nueva_pos

        return None, None  # Si no hay movimientos válidos
