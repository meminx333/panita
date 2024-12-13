"""AI is creating summary for Returns:[type]: [description]"""

from app_config import db, app
from modelos import Jugador, Ficha
from tablero.casillas import obtener_casilla_inicial


def reset_database():
    "Base de datos reiniciada y datos iniciales agregados."
    with app.app_context():  # Asegura que Flask esté en un contexto de aplicación
        db.drop_all()  # Elimina todas las tablas
        db.create_all()  # Crea todas las tablas de nuevo
        print("Base de datos reiniciada y datos iniciales agregados.")

        # Agregar datos iniciales para verificar
        jugador1 = Jugador(nombre="1")
        jugador2 = Jugador(nombre="2")
        db.session.add(jugador1)
        db.session.add(jugador2)
        db.session.commit()

        # Crear fichas asociadas a los jugadores
        fichas = []
        for jugador_id in range(1, 3):
            for numero in range(1, 5):
                casilla_inicial = obtener_casilla_inicial(jugador_id, numero)

                if casilla_inicial:
                    ficha = Ficha(
                        posicion=(
                            casilla_inicial["re1"]
                            if jugador_id == 1
                            else casilla_inicial["re2"]
                        ),
                        jugador_id=jugador_id,
                        numero=numero,
                        casilla_id=casilla_inicial["id"],  # Asociar la casilla directamente
                    )
                    fichas.append(ficha)
                else:
                    print(
                        f"Adve: No se encontró casilla para Jugador {jugador_id}, Ficha {numero}"
                        )
        db.session.add_all(fichas)
        db.session.commit()


        print("Base de datos reiniciada con jugadores y fichas.")
