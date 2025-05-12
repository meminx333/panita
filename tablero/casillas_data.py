"""_summary_Returns:_type_: _description_"""
# Diccionario para mapear el tipo de uso de las casillas basado en la primera matriz
uso_casillas = {
    "1": "camino_azul",
    "2": "camino_verde",
    "3": "camino_rojo",
    "4": "camino_amarillo",
    "a": "canton_azul",
    "u": "canton_verde",
    "e": "canton_rojo",
    "o": "canton_amarillo",
    "5": "puente_1",
    "6": "puente_2",
    "7": "puente_3",
    "8": "puente_4",
    "9": "casilla_doble1",
    "#": "casilla_doble2",
    "0": "vacio",
    "q": "policia-2",
    "p": "policia-1",
    "w": "segura_1",
    "x": "segura_2",
    "y": "segura_3",
    "z": "segura_4",
    "d": "final_1",
    "f": "final_2",
    "g": "final_3",
    "h": "final_4",
}

# Diccionario para mapear los números en las casillas basado en la segunda matriz
numero_casillas = {
    "u": 10,
    "o": 11,
    "c": 12,
    "e": 13,
    "a": 14,
    "w": 1,
    "y": 3,
    "z": 4,
    "×": 2,  # Casillas especiales sin número pero con color
    "+": " ",  # Casillas vacías sin importancia en el recorrido
    "4": "4",
}


# Diccionario para definir los tipos de casillas y su descripción para el jugador 1
valor_jugadores = {
    "0": "sin_uso",  # Casillas no usadas por el jugador 1
    "1": "segura",  # Casillas seguras para el jugador 1
    "2": "peligro_otro",  # Casillas de peligro potencial para el jugador 1 si las usa otro jugador
    "3": "camino",  # Casillas donde el jugador 1 se mueve, puede pegar y hacer torres
    "4": "segura_otro",  # Casillas seguras para otros jugadores
    "5": "prohibida",  # Casillas prohibidas para el jugador 1
    "6": "policia",  # Casillas en zona de policía
    "7": "casa",  # Casillas que solo el jugador 1 puede usar, pertenecen a su casa
    "8": "puente",  # Casillas de puentes, donde no se pueden poner torres ni pegar
    "9": "casilla_doble",  # Casillas dobles que se consideran como una sola
    "+": "canton",  # Cantón donde se ubican las fichas del jugador 1
    "×": "combinada_no_uso",  # Casillas combinadas que el jugador 1 no usa
    "$": "salida",  # Casilla de salida donde la ficha del jugador 1 sale del juego
}

# Diccionario para definir el recorrido de las fichas para el jugador
recorrido_fichas = {
    "00": -2,  # Casillas no usadas por el jugador
    "??": 0,  # Casilla0
    "01": 1,  # Casilla1
    "02": 2,  # Casilla2
    "03": 3,  # Casilla3
    "04": 4,  # Casilla4
    "05": 5,  # Casilla5
    "06": 6,  # Casilla6
    "07": 7,  # Casilla7
    "08": 8,  # Casilla8
    "09": 9,  # Casilla9
    "10": 10,  # Casilla10
    "11": 11,  # Casilla11
    "12": 12,  # Casilla12
    "13": 13,  # Casilla13
    "14": 14,  # Casilla14
    "15": 15,  # Casilla15
    "16": 16,  # Casilla16
    "17": 17,  # Casilla17
    "18": 18,  # Casilla18
    "19": 19,  # Casilla19
    "20": 20,  # Casilla20
    "21": 21,  # Casilla21
    "22": 22,  # Casilla22
    "23": 23,  # Casilla23
    "24": 24,  # Casilla24
    "25": 25,  # Casilla25
    "26": 26,  # Casilla26
    "27": 27,  # Casilla27
    "28": 28,  # Casilla28
    "29": 29,  # Casilla29
    "30": 30,  # Casilla30
    "31": 31,  # Casilla31
    "32": 32,  # Casilla32
    "33": 33,  # Casilla33
    "34": 34,  # Casilla34
    "35": 35,  # Casilla35
    "36": 36,  # Casilla36
    "37": 37,  # Casilla37
    "38": 38,  # Casilla38
    "39": 39,  # Casilla39
    "40": 40,  # Casilla40
    "41": 41,  # Casilla41
    "42": 42,  # Casilla42
    "43": 43,  # Casilla43
    "44": 44,  # Casilla44
    "45": 45,  # Casilla45
    "46": 46,  # Casilla46
    "47": 47,  # Casilla47
    "48": 48,  # Casilla48
    "49": 49,  # Casilla49
    "50": 50,  # Casilla50
    "51": 51,  # Casilla51
    "52": 52,  # Casilla52
    "53": 53,  # Casilla53
    "54": 54,  # Casilla54
    "55": 55,  # Casilla55
    "56": 56,  # Casilla56
    "57": 57,  # Casilla57
    "58": 58,  # Casilla58
    "59": 59,  # Casilla59
    "60": 60,  # Casilla60
    "61": 61,  # Casilla61
    "+1": -1,  # Canton donde se ubican las fichas 1 de los jugadores
    "+2": -1,  # Canton donde se ubican las fichas 2 de los jugadores
    "+3": -1,  # Canton donde se ubican las fichas 3 de los jugadores
    "+4": -1,  # Canton donde se ubican las fichas 4 de los jugadores
}
