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

export async function moverFichaAfuera(fichaId, nuevaPosicion) {
    // Validaciones iniciales
    if (!fichaId || nuevaPosicion === undefined) {
        console.error("Ficha ID o nueva posición no definidos.");
        return;
    }
    // Validar rango de posición
    if (typeof nuevaPosicion !== "number" || nuevaPosicion < 0 || nuevaPosicion > 61) {
        console.error("Posición fuera de rango:", nuevaPosicion);
        return;
    }

    try {
        // Petición al servidor para mover la ficha
        const respuesta = await fetch('/mover_ficha', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ ficha_id: fichaId, nueva_posicion: nuevaPosicion })
        });

        const data = await respuesta.json();
        console.log("Reespuesta del servidor", data);
    
        if (data.success) {
            // Actualizar visualmente
            const ficha = document.getElementById(fichaId);
            if (!ficha) {
                console.error(`No se encontró la ficha con ID ${fichaId}`);
                return;
            }

            const nuevaCasilla = document.querySelector(`[data-re${ficha.dataset.jugador}="${nuevaPosicion}"]`);
            if (nuevaCasilla) {
                // Mover ficha al contenedor visual
                nuevaCasilla.appendChild(ficha);
                ficha.dataset.posicion=nuevaPosicion; // Actualizar posición en los atributos de datos
                console.log(`Ficha ${fichaId} movida a la casilla ${nuevaPosicion}`);

                // Actualizar contadores de fichas
                actualizarContadores();
            } else {
                console.error(`No se encontró la casilla para jugador ${ficha.dataset.jugador} en posición ${nuevaPosicion}`);
            }
        } else {
            console.error("Error al mover la ficha:", data.mensaje || "Error desconocido");
        }
    } catch (error) {
        console.error("Error en la solicitud de movimiento:", error);   
    }
}