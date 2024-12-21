"""_summary_Returns:_type_: _description_"""
from random import randint
from collections import deque
from tablero.casillas import tablero_configurado
from modelos import Casilla

class GameState:
    """Clase para gestionar el estado del juego."""
    def __init__(self):
        self.turno_actual = 1
        self.estado_dados = {"dado1": 0, "dado2": 0, "usados": [False, False]}
        self.ultimos_tiros = deque(maxlen=3)  # Cola para almacenar los últimos tiros
        self.casillas = []  # Lista de casillas del tablero

    def cambiar_turno(self):
        """Cambia el turno al siguiente jugador."""
        self.turno_actual = 2 if self.turno_actual == 1 else 1
        self.reiniciar_dados()  # Reinicia los dados al cambiar de turno
        return self.turno_actual

    def obtener_turno_actual(self):
        """Devuelve el turno actual."""
        return self.turno_actual

    def lanzar_dados(self):
        """Lanza los dados y actualiza su estado."""
        self.estado_dados["dado1"] = randint(1, 6)
        self.estado_dados["dado2"] = randint(1, 6)
        self.estado_dados["usados"] = [False, False]

        # Almacena los resultados en el historial
        self.ultimos_tiros.append({
            "dado1": self.estado_dados["dado1"],
            "dado2": self.estado_dados["dado2"],
            "jugador": self.turno_actual,
        })
        print(f"Lanzamiento:dado1={self.estado_dados['dado1']}, dado2={self.estado_dados['dado2']}")
        return self.estado_dados  # Retornar el estado para facilitar la sincronización

    def obtener_estado_dados(self):
        """Devuelve el estado actual de los dados."""
        return self.estado_dados


    def marcar_dado_usado(self, index):
        """Marca un dado como usado."""
        if index in [0, 1] and not self.estado_dados["usados"][index]:
            self.estado_dados["usados"][index] = True
            valor_dado = self.estado_dados["dado1"] if index == 0 else self.estado_dados["dado2"]
            print(
                f"Dado {index + 1} usado con"
                f"valor {valor_dado}"
                )
            return valor_dado
        else:
            print(f"Error: Dado {index + 1} ya fue usado o índice inválido.")
            return 0  # Devuelve 0 si ya fue usado o el índice es inválido

    def reiniciar_dados(self):
        """Reinicia los valores de los dados y su estado de uso."""
        self.estado_dados = {"dado1": 0, "dado2": 0, "usados": [False, False]}
        print("Estado de dados reiniciado.")

    def reset_dados_si_necesario(self):
        """Resetea los dados si ambos han sido usados"""
        if all(self.estado_dados["usados"]):
            self.estado_dados = {"dado1": 0, "dado2": 0, "usados": [False, False]}
            print("Dados reseteados para el siguiente turno.")

    def obtener_ultimos_tiros(self):
        """Devuelve los últimos tres lanzamientos de dados."""
        return list(self.ultimos_tiros)

    def obtener_casillas_tablero(self):
        """Genera las casillas del tablero a partir de la configuración."""
        for fila_index, fila in enumerate(tablero_configurado):
            for columna_index, celda in enumerate(fila):
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
