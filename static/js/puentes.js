
export function obtenerCasillasAdyacentes(ficha) {
    const posicionActual = parseInt(ficha.dataset.posicion, 10);
    let jugador = parseInt(ficha.dataset.jugador,10);
    let casillaActual = document.querySelector(`.casilla[data-re${jugador}="${posicionActual}"]`);

    if (!casillaActual) {
        console.error(`No se encontró la casilla actual para posición ${posicionActual}`);
        return {};
    }

    // Buscar las casillas adyacentes
    let entradaPuente = document.querySelector(`.casilla[data-esp${jugador}= "puente"]`);
    console.log(entradaPuente);

    return { entradaPuente };
}
