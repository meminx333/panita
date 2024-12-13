"""_summary_Returns:_type_: _description_"""

from flask_socketio import emit
from game_state import game_state


def register_dados_eventos(socketio):
    """Registra los eventos relacionados con los dados para Socket.IO"""

    @socketio.on("tirar_dados")
    def manejar_tirar_dados(data):
        """Evento para manejar el lanzamiento de dados"""
        print("Evento 'tirar_dados' recibido:", data)
        jugador_id = data.get("jugador_id")  # Obtener el jugador_id del cliente

         # Validar que el jugador_id sea válido
        if not jugador_id:
            emit('error', {'mensaje': 'Jugador ID no proporcionado.'})
            return

        # Validar que sea el turno del jugador correcto
        turno_actual = game_state.obtener_turno_actual()
        if jugador_id != turno_actual:
            emit('error', {'mensaje': 'No es tu turno.'})
            return

        # Simular el lanzamiento de dados
        game_state.lanzar_dados()
        estado_dados = game_state.obtener_estado_dados()

        # Emitir los valores de los dados
        emit(
            "dados_lanzados",
            {"dado1": estado_dados["dado1"], "dado2": estado_dados["dado2"]},
            broadcast=True,
        )

        # Almacenar los últimos tiros
        ultimos_tiros = game_state.obtener_ultimos_tiros()
        tiros_serializables = [
            {
                "jugador": tiro.get("jugador"),
                "dado1": tiro.get("dado1"),
                "dado2": tiro.get("dado2"),
            }
            for tiro in ultimos_tiros
        ]
        emit(
            "actualizar_ultimos_tiros",
            {"tiros": tiros_serializables},
            broadcast=True,
        )

        # Si los dados son iguales, mantener el turno
        if estado_dados["dado1"] == estado_dados["dado2"]:
            emit(
                "turno_repetido",
                {"jugador_id": jugador_id},
                broadcast=True,
            )
            print("Turno repetido: el jugador lanza nuevamente.")
            return  # Salir sin cambiar el turno

        # Cambiar al siguiente turno
        game_state.cambiar_turno()
        nuevo_turno = game_state.obtener_turno_actual()
        emit(
            "cambiar_turno",
            {"jugador_id": nuevo_turno},
            broadcast=True,
        )

    @socketio.on("usar_dado")
    def manejar_usar_dado(data):
        """Evento para manejar el uso de un dado"""
        print("Evento 'usar_dado' recibido:", data)
        index = data.get("index")  # 0 para dado1, 1 para dado2

        # Validar que el índice sea válido
        if index not in [0, 1]:
            emit('error', {'mensaje': 'Índice de dado inválido.'})
            return

        estado_dados = game_state.obtener_estado_dados()

        # Validar que el dado no haya sido usado previamente
        if estado_dados["usados"][index]:
            emit('error', {'mensaje': f'Dado {index + 1} ya fue usado.'})
            return

        # Marcar el dado como usado y obtener su valor
        game_state.marcar_dado_usado(index)
        valor_dado = estado_dados["dado1"] if index == 0 else estado_dados["dado2"]

        # Emitir el valor del dado usado
        emit(
            "dado_usado",
            {"index": index, "valor": valor_dado},
            broadcast=True,
        )

        print(f"Dado {index + 1} usado con valor: {valor_dado}")
