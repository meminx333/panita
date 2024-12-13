"""_summary_Returns:_type_: _description_"""
from flask_socketio import emit
from game_state import game_state

def register_turnos_eventos(socketio):
    """_summary_Returns:_type_: _description_"""
    @socketio.on("finalizar_turno")
    def finalizar_turno():
        """_summary_Returns:_type_: _description_"""
        nuevo_turno = game_state.cambiar_turno()
        emit("cambiar_turno", {"jugador_id": nuevo_turno}, broadcast=True)
