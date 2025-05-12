"""_summary_Returns:_type_: _description_"""

from tablero.casillas import tablero_configurado
from models import Casilla

class GameState:
    """_summary_Returns:_type_: _description_"""
    def __init__(self):
        """_summary_Returns:_type_: _description_"""
        self.turno_actual = 1
        self.dados = {"dado1": 0, "dado2": 0}
        self.casillas = []

    def cambiar_turno(self):
        """_summary_Returns:_type_: _description_"""
        self.turno_actual = 2 if self.turno_actual == 1 else 1
        return self.turno_actual

    def obtener_turno_actual(self):
        """_summary_Returns:_type_: _description_"""
        return self.turno_actual

    def actualizar_dados(self, dado1, dado2):
        """_summary_Returns:_type_: _description_"""
        self.dados["dado1"] = dado1
        self.dados["dado2"] = dado2

    def obtener_dados(self):
        """_summary_Returns:_type_: _description_"""
        return self.dados
    def obtener_casillas_tablero(self):
        """_summary_Returns:_type_: _description_"""
        self.casillas = []  # Resetear antes de llenar

        # Agregar datos iniciales para verificar
        for fila_index, fila in enumerate(tablero_configurado):
            for columna_index, celda in enumerate(fila):
                # Crear una instancia de Casilla
                casilla = Casilla(
                    casilla_id=celda["id"],
                    fila=fila_index,
                    columna=columna_index,
                    re1=celda["re1"],
                    re2=celda["re2"],
                    numero=celda["numero"],
                    tipo=celda["tipo"],
                    esp1=celda["esp1"],
                    esp2=celda["esp2"],
                    rowspan=celda["rowspan"],
                    colspan=celda["colspan"],
                )
                self.casillas.append(casilla)
            if not self.casillas:  # Si está vacío, llenarlo
                self._cargar_casillas()
            return self.casillas

    def _cargar_casillas(self):
        # Lógica para cargar las casillas desde tablero_configurado
        self.casillas = []  # Tus datos del tablero
        # Agregar datos iniciales para verificar
        for fila_index, fila in enumerate(tablero_configurado):
            for columna_index, celda in enumerate(fila):
                # Crear una instancia de Casilla
                casilla = Casilla(
                    casilla_id=celda["id"],
                    fila=fila_index,
                    columna=columna_index,
                    re1=celda["re1"],
                    re2=celda["re2"],
                    numero=celda["numero"],
                    tipo=celda["tipo"],
                    esp1=celda["esp1"],
                    esp2=celda["esp2"],
                    rowspan=celda["rowspan"],
                    colspan=celda["colspan"],
                )
                self.casillas.append(casilla)
        return self.casillas

# Crear una instancia global de GameState
game_state = GameState()
