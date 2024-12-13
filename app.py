"""_summary_Returns:_type_: _description_"""
import os
from flask import render_template, jsonify, send_from_directory, request
from app_config import app, socketio, db
from eventos import register_eventos
from database_reset import reset_database
from modelos import Ficha, Jugador, Casilla
from game_state import game_state

# Reinicia la base de datos al iniciar la aplicación
reset_database()

# Registrar los eventos de Socket.IO
register_eventos(socketio)

@app.route('/favicon.ico')
def favicon():
    """Inserta el favicon.ico"""
    return send_from_directory(
        os.path.join(app.root_path, 'static'),
        'favicon.ico', mimetype='image/vnd.microsoft.icon'
        )


@app.route("/")
def main():
    """Renderiza la página principal con el estado actual del juego."""
    jugadores = Jugador.query.all()  # Obtenemos todos los jugadores
    fichas = Ficha.query.all()  # Obtenemos todas las fichas
    casillas = game_state.obtener_casillas_tablero()
    tiros = game_state.obtener_ultimos_tiros()
    estado_dados = game_state.obtener_estado_dados()

    return render_template(
        "main.html",
        jugadores=jugadores,
        fichas=fichas,
        casillas=casillas,
        estado_dados=estado_dados,
        tiros=tiros,
    )

@app.route('/tirar_dados', methods=['POST'])
def tirar_dados(): #Función para tirar los dados
    """Lanza los dados y devuelve sus valores."""
    game_state.lanzar_dados()
    estado_dados = game_state.obtener_estado_dados()
    return jsonify({
        "success": True,
        "dado1": estado_dados["dado1"],
        "dado2": estado_dados["dado2"]
    })

@app.route("/test")
def test():
    """_summary_Returns:_type_: _description_"""
    jugadores = Jugador.query.all()  # Obtenemos todos los jugadores
    fichas = Ficha.query.all()  # Obtenemos todas las fichas
    casillas = Casilla.query.all()
    print(f"Casillas: {casillas}, Jugadores: {jugadores}, Fichas: {fichas}")
    return jsonify({"success": True, "mensaje": "Test exitoso."}), 200

@app.route("/mover_ficha", methods=["POST"])
def mover_ficha():
    """Mueve una ficha a una nueva posición."""
    data = request.json

    if not data:
        return jsonify({"success": False, "error": "Solicitud inválida: falta 'index'"}), 400

    ficha_id = data.get("ficha_id")
    nueva_posicion = data.get("nueva_posicion")

    if ficha_id is None or nueva_posicion is None:
        return jsonify({"success": False, "mensaje": "No se enviaron datos JSON."}), 400

    try:
        nueva_posicion = int(nueva_posicion)  # Convertir a entero
    except ValueError:
        return jsonify({"success": False, "error": "Posición inválida"}), 400

    # Validar rango de nueva_posicion
    if nueva_posicion < 0 or nueva_posicion > 61:
        return jsonify({"success": False, "error": "Movimiento fuera de rango"}), 400

     # Buscar la ficha en la base de datos
    ficha = Ficha.query.filter_by(ficha_id=ficha_id).first()
    if not ficha:
        return jsonify({"success": False, "mensaje": "Ficha no encontrada."}), 404


    # Actualizar la posición
    ficha.posicion = nueva_posicion
    db.session.commit()

    return jsonify({"success": True, "mensaje": "Ficha movida correctamente"})

@app.route('/dados_disponibles', methods=['GET'])
def dados_disponibles():
    """Verifica si hay dados disponibles para usar."""
    estado_dados = game_state.obtener_estado_dados()
    disponibles = not all(estado_dados["usados"])
    return jsonify({"success": True, "disponibles": disponibles})

@app.errorhandler(404)
def page_not_found(_):
    """Muestra un mensaje de error cuando no se encuentra una ruta."""
    return "Ruta no encontrada. Revisa tus rutas o tu archivo main.html.", 404

@app.route("/static/<path:filename>")
def serve_static(filename):
    """Sirve archivos estáticos."""
    response = send_from_directory("static/data", filename)
    response.headers["Content-Type"] = "application/json; charset=utf-8"
    return response


@app.after_request
def remove_csp_header(response):
    """Elimina el encabezado Content-Security-Policy si no es necesario."""
    if "Content-Security-Policy" in response.headers:
        del response.headers["Content-Security-Policy"]
    return response


if __name__ == "__main__":
    print("Iniciando servidor...")
    socketio.run(app, debug=True)
