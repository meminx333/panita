"""_summary_Returns:_type_: _description_"""

from tablero.matriz import (
    matriz_uso,
    matriz_numeracion,
    matriz_jugador1,
    matriz_jugador2,
    matriz_recorrido1,
    matriz_recorrido2,
)
from tablero.casillas_data import (
    numero_casillas,
    recorrido_fichas,
    uso_casillas,
    valor_jugadores,
)


# Función para crear el tablero combinando las matrices de uso y numeración
def crear_tablero(
    uso_matriz,
    numeracion_matriz,
    jugador1_matriz,
    jugador2_matriz,
    recorrido1_matriz,
    recorrido2_matriz,
):
    """ Crea el tablero combinando los datos de las matrices usando diccionarios predefinidos. """
    tablero_completo = []
    filas = len(uso_matriz)
    columnas = len(uso_matriz[0])

    # Conjunto para evitar duplicar casillas que se fusionan (colspan/rowspan)
    casillas_fusionadas = set()

    for i in range(filas):
        fila_completa = []
        j = 0
        while j < columnas:
            # Evitar procesar casillas ya fusionadas
            if (i, j) in casillas_fusionadas:
                j += 1
                continue

            # Obtener datos de cada matriz
            uso = uso_matriz[i][j]
            num = numeracion_matriz[i][j]
            ju1 = jugador1_matriz[i][j]
            ju2 = jugador2_matriz[i][j]
            # Aquí extraemos dos caracteres para cada casilla de los recorridos
            rec1 = recorrido1_matriz[i][
                j * 2 : (j * 2) + 2
            ]  # Tomar dos dígitos del recorrido 2
            rec2 = recorrido2_matriz[i][
                j * 2 : (j * 2) + 2
            ]  # Tomar dos dígitos del recorrido 2

            # Mapear valores con los diccionarios predefinidos
            tipo = uso_casillas.get(uso, "desconocido")
            numero = numero_casillas.get(num, num if num.isdigit() else "desconocido")
            esp1 = valor_jugadores.get(ju1, "desconocido")
            esp2 = valor_jugadores.get(ju2, "desconocido")
            re1 = recorrido_fichas.get(rec1, "desconocido")
            re2 = recorrido_fichas.get(rec2, "desconocido")

            # Inicializamos colspan y rowspan
            colspan = 1
            rowspan = 1

            # Si es una casilla doble (marcada con "9"), combinamos horizontal y/o verticalmente
            if uso == "9" or uso == "#":
                # Unir horizontalmente si la siguiente casilla es también "9"
                if (
                    j + 1 < columnas
                    and uso_matriz[i][j + 1] == "9"
                    or j + 1 < columnas
                    and uso_matriz[i][j + 1] == "#"
                ):
                    colspan = 2
                    casillas_fusionadas.add((i, j + 1))  # Marcar como fusionada
                # Unir verticalmente si la casilla de abajo también es "9"
                if (
                    i + 1 < filas
                    and uso_matriz[i + 1][j] == "9"
                    or i + 1 < filas
                    and uso_matriz[i + 1][j] == "#"
                ):
                    rowspan = 2
                    casillas_fusionadas.add((i + 1, j))  # Marcar como fusionada

            # Añadir la casilla con todos los datos integrados
            fila_completa.append(
                {
                    "id": f"casilla-{i}-{j}",
                    "tipo": tipo,
                    "numero": numero,
                    "colspan": colspan,
                    "rowspan": rowspan,
                    "esp1": esp1,  # Estado del jugador 1
                    "esp2": esp2,  # Estado del jugador 3
                    "re1": re1,  # Recorrido del jugador 1
                    "re2": re2,  # Recorrido del jugador 3
                }
            )
            j += colspan  # Saltar casillas que ya fueron combinadas
        tablero_completo.append(fila_completa)

    return tablero_completo


# Crear el tablero configurado
tablero_configurado = crear_tablero(
    matriz_uso,
    matriz_numeracion,
    matriz_jugador1,
    matriz_jugador2,
    matriz_recorrido1,
    matriz_recorrido2,
)

# Mejorar usando un diccionario de búsqueda
casillas_iniciales = {
    1: {1: "casilla-6-0", 2: "casilla-7-0", 3: "casilla-8-0", 4: "casilla-9-0"},
    2: {1: "casilla-6-15", 2: "casilla-7-13", 3: "casilla-8-13", 4: "casilla-9-15"}
}

def obtener_casilla_inicial(jugador_id, numero):
    """obtener la casilla inicial de cada ficha"""
    return casillas_iniciales.get(jugador_id, {}).get(numero)

#print("Tablero configurado:")
#for fila in tablero_configurado:
    #for casilla in fila:
        #print(casilla)
