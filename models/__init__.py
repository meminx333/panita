"""
Models initialization module - imports all models to make them available
when importing from the models package
"""
from .casilla import Casilla
from .ficha import Ficha
from .jugador import Jugador
from .partida import Partida
from .movimientos import Movimiento

__all__ = [
    'Casilla',
    'Ficha',
    'Jugador',
    'Partida',
    'Movimiento',
]
