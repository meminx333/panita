// Manejo de colisiones y torres
export function detectarTorresYColisiones(casillaId) {
    // Obtener todas las fichas en la misma casilla
    const fichasEnCasilla = Array.from(
        document.querySelectorAll(`.ficha[data-casilla_id="${casillaId}"]`)
    );
    
    // Verificar si hay más de una ficha en la casilla
    if (fichasEnCasilla.length > 1) {
        const jugadores = new Set(
            fichasEnCasilla.map((ficha) => ficha.dataset.jugador)
        );

        if (jugadores.size === 1) {
            // Todas las fichas pertenecen al mismo jugador (torre)
            console.log("Torre detectada en la casilla:", casillaId);
            fichasEnCasilla.forEach((ficha) => ficha.classList.add("torre"));

        } else {
            // Hay fichas de diferentes jugadores (colisión)
            console.log("Colisión detectada en la casilla", casillaId);
        
            // Lógica de colisión: eliminar fichas del oponente o enviarlas a la base
            fichasEnCasilla.forEach(ficha => {
                if (ficha.dataset.jugador !== jugador) {
                    ficha.dataset.posicion = -1; // Regresar a la posición inicial
                    ficha.dataset.casilla_id = null; // Eliminar la casilla actual

                    // Actualizar visualmente
                    const baseJugador = document.querySelector(
                        `.base[data-jugador="${ficha.dataset.jugador}"]`
                    );
                    if (baseJugador) baseJugador.appendChild(ficha);

                    console.log(
                        `Ficha ${ficha.id} regresada a la base del jugador ${ficha.dataset.jugador}`
                    );
                }
            });
        }

        if (jugadores.size !== 1) {
                fichasEnCasilla.forEach((ficha) => ficha.classList.remove(`.torre`));
                fichasEnCasilla.replaceWith(ficha.cloneNode(true)); // Elimina listeners
        }
    }
}

export function detectarSalto(fichaId, nuevaPosicion, jugador) {
    const fichasJugador = Array.from(document.querySelectorAll(`.ficha[data-jugador="${jugador}"]`));
    const posicionesActuales = fichasJugador.map((ficha) => parseInt(ficha.dataset.posicion, 10));

    fichasJugador.forEach((otraFicha) => {
        const otraPosicion = parseInt(otraFicha.dataset.posicion, 10);

        // Comparar posiciones de fichas entre jugadores diferentes
        if (jugador === 1 && otraFicha.dataset.jugador === "2") {
            if ((nuevaPosicion >= 31 && otraPosicion <= 29) || (nuevaPosicion >= 10 && otraPosicion < 9)) {
                console.log(`La ficha ${otraFicha.id} fue saltada.`);
            }
        } else if (jugador === 2 && otraFicha.dataset.jugador === "1") {
            if ((nuevaPosicion >= 30 && otraPosicion <= 0)) {
                console.log(`La ficha ${otraFicha.id} fue saltada.`);
            }
        }
    });
}
