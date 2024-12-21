function contarFichasEnPosicion(jugador, posicion) {
    // Seleccionar todas las fichas
    const fichas = document.querySelectorAll(".ficha");
    
    // Filtrar y contar las fichas que coinciden con el jugador y la posición
    const contador = Array.from(fichas).filter(
        ficha => ficha.dataset.jugador === jugador && ficha.dataset.posicion === String(posicion)
    ).length;

    console.log(`Jugador ${jugador} tiene ${contador} fichas en la posición ${posicion}.`);
    return contador;
}

export function actualizarContadores() {
    const fichasJugador1 = contarFichasEnPosicion("1", -1);
    const fichasJugador2 = contarFichasEnPosicion("2", -1);

    document.getElementById("contador-jugador-1").innerText = `Jugador 1: ${fichasJugador1} fichas en -1`;
    document.getElementById("contador-jugador-2").innerText = `Jugador 2: ${fichasJugador2} fichas en -1`;
}