"""Script para reiniciar la base de datos y agregar datos iniciales."""
from app_config import db, aapp
from models import Jugador, Ficha
from tablero.casillas import obtener_casilla_inicial


def reset_database():
    "Base de datos reiniciada y datos iniciales agregados."
    with aapp.app_context():  # Asegura que Flask esté en un contexto de aplicación
        db.drop_all()  # Elimina todas las tablas
        db.create_all()  # Crea todas las tablas de nuevo
        print("Base de datos reiniciada y datos iniciales agregados.")

        # Agregar datos iniciales para verificar
        jugador1 = Jugador(nombre="1", es_cpu=False)
        jugador2 = Jugador(nombre="2", es_cpu=True)
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
                        posicion=-1,
                        jugador_id=jugador_id,
                        numero=numero,
                        casilla_id=casilla_inicial,  # Asociar la casilla directamente
                    )
                    fichas.append(ficha)
                else:
                    print(
                        f"Adve: No se encontró casilla para Jugador {jugador_id}, Ficha {numero}"
                        )
        db.session.add_all(fichas)
        db.session.commit()


        print("Base de datos reiniciada con jugadores y fichas.")
