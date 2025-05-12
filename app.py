"""_summary_Returns:_type_: _description_"""
import os
from flask import render_template, jsonify, send_from_directory, request
from app_config import aapp, socketio, db, create_app
from eventos import register_eventos
from eventos.dados import obtener_ultimos_tiros
from database_reset import reset_database
from game_state import game_state
from utils.cache import limpiar_cache
from models import Ficha, Jugador
from cpu.cpu import CPU


# Reinicia la base de datos al iniciar la aplicación solo en desarrollo
if aapp.config.get("DEBUG") or os.environ.get("FLASK_ENV") == "development":
    reset_database()

# Registrar los eventos de Socket.IO
register_eventos(socketio)

@aapp.route("/")
def index():
    """_summary_Returns:_type_: _description_"""
    jugadores = Jugador.query.all()  # Obtenemos todos los jugadores
    fichas = Ficha.query.all()  # Obtenemos todas las fichas
    tiros = obtener_ultimos_tiros()
    casillas = game_state.obtener_casillas_tablero()
    return render_template(
        "index.html",
        jugadores=jugadores,
        fichas=fichas,
        casillas=casillas,
        tiros=tiros
    )

@aapp.route("/estado")
def obtener_estado():
    """Devuelve el estado actual del juego."""
    return jsonify({
        "turno": game_state.turno_actual,
        "dados": game_state.dados,
        "fichas": [f.__dict__ for f in Ficha.query.all()]
    })

@aapp.route("/turno_cpu", methods=["POST"])
def turno_cpu():
    """Ejecuta el turno de la CPU y decide el movimiento de una ficha."""
    cpu = CPU(jugador_id=2)  # Asume que el jugador 2 es la CPU
    ficha_id = cpu.decidir_movimiento(game_state.dados.values())

    if ficha_id:
        # Reutilizar lógica existente de mover_ficha
        return mover_ficha()
    else:
        return jsonify({"success": False, "mensaje": "CPU no pudo mover"})

@aapp.route("/test")
def test():
    """_summary_Returns:_type_: _description_"""
    jugadores = Jugador.query.all()  # Obtenemos todos los jugadores
    fichas = Ficha.query.all()  # Obtenemos todas las fichas
    casillas = game_state.obtener_casillas_tablero()
    print(
        {
            "Casillas": casillas,
            "Jugadores": jugadores,
            "Fichas": fichas
        }
    )
    return jsonify({"success": True, "mensaje": "Test exitoso."}), 200

@aapp.route("/mover_ficha", methods=["POST"])
def mover_ficha():
    """Procesa el movimiento de una ficha.
    Returns:
        JSON: Resultado del movimiento con formato {success: bool, mensaje: str}
    """
    data = request.json

    if data is None:
        return jsonify({"success": False, "mensaje": "No se enviaron datos JSON."}), 400

    ficha_id = data.get("ficha_id")
    nueva_posicion = data.get("nueva_posicion")

    ficha = Ficha.query.filter_by(ficha_id=ficha_id).first()
    if not ficha:
        return jsonify({"success": False, "mensaje": "Ficha no encontrada."}), 404

    # Validación de movimiento desde posición inicial
    if ficha.posicion == -3 and nueva_posicion != -1:
        return (
            jsonify(
                {
                    "success": False,
                    "mensaje": "Movimiento inválido desde la posición -3.",
                }
            ),
            400,
        )

    # Validación de posiciones normales
    if not 0 <= nueva_posicion < 62:
        return jsonify({"success": False, "mensaje": "Movimiento fuera de rango."}), 400

    # Actualizar la posición
    ficha.posicion = nueva_posicion
    try:
        db.session.commit()
    except ImportError as e:
        db.session.rollback()
        return jsonify({"success": False, "mensaje": str(e)}), 500

    return jsonify({"success": True, "nueva_posicion": ficha.posicion})


@aapp.errorhandler(404)
def page_not_found(_):
    """_summary_Returns:_type_: _description_"""
    return "Ruta no encontrada. Revisa tus rutas o tu archivo index.html.", 404


@aapp.route("/static/<path:filename>")
def serve_static(filename):
    """_summary_Returns:_type_: _description_"""
    response = send_from_directory("static/data", filename)
    response.headers["Content-Type"] = "application/json; charset=utf-8"
    return response


@aapp.after_request
def remove_csp_header(response):
    """_summary_Returns:_type_: _description_"""
    # Elimina el encabezado Content-Security-Policy si no es necesario
    if "Content-Security-Policy" in response.headers:
        del response.headers["Content-Security-Policy"]
    return response


if __name__ == "__main__":
    app = create_app()  # Crear la app aquí
    with app.app_context():
        db.create_all()
        if app.config.get("DEBUG"):
            reset_database()

    print("Iniciando servidor...")
    socketio.run(app, debug=True)
    limpiar_cache()  # Limpiar la caché al cerrar el servidor
