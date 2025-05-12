"""_summary_Returns:_type_: _description_"""
from collections import deque
from random import randint
from flask_socketio import emit
from game_state import game_state

# Cola para almacenar los últimos tres lanzamientos
ultimos_tiros = deque(maxlen=3)

# Función para tirar los dados
def tirar_dados(jugador_id):
    """Función para tirar los dados y almacenar el resultado."""
    dado1 = randint(1, 6)
    dado2 = randint(1, 6)
    print(f"Jugador{jugador_id}: Dado1 = {dado1}, Dado2 = {dado2}")
    # Almacenar el resultado en la cola
    ultimos_tiros.append({"jugador": jugador_id, "dado1": dado1, "dado2": dado2})
    return jugador_id, dado1, dado2

def obtener_ultimos_tiros():
    """Devuelve los últimos tres lanzamientos de dados."""
    return list(ultimos_tiros)


def register_dados_eventos(socketio):
    """_summary_Returns:_type_: _description_"""

    @socketio.on("tirar_dados")
    def manejar_tirar_dados(data):

        jugador_id = data.get("jugador_id")
        if not jugador_id:
            emit('error', {'mensaje': 'Jugador ID no proporcionado.'})
            return

        # Validar que el jugador tiene el turno
        if jugador_id != game_state.obtener_turno_actual():
            emit('error', {'mensaje': 'No es tu turno.'})
            return

        # Simular el lanzamiento de dados
        _, dado1, dado2 = tirar_dados(jugador_id)
        emit("dados_lanzados", {"dado1": dado1, "dado2": dado2}, broadcast=True)

        # Actualizar últimos tiros
        ultimo_tiro = obtener_ultimos_tiros()
        emit("actualizar_ultimos_tiros", {"tiros": ultimo_tiro}, broadcast=True)

        # Si los dados son pares, mantener el turno
        if dado1 == dado2:
            emit(
                "turno_repetido",
                {"jugador_id": game_state.obtener_turno_actual()},
                broadcast=True
            )
            print("turno reepetido")
            return  # Salir para no cambiar el turno

        # Cambiar al siguiente turno
        game_state.cambiar_turno()
        emit(
            "cambiar_turno",
            {"jugador_id": game_state.obtener_turno_actual()},
            broadcast=True
        )
