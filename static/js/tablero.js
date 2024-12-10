import { moverFicha, moverFichaAfuera } from "./fichas.js";
let fichaSeleccionada = null;

// Agregar eventos a todas las fichas al cargarse la página
document.querySelectorAll(".ficha").forEach((ficha) => {
    const inicialPosicion = ficha.dataset.posicion;

    // Verificar si es del jugador 1 o 2
    if (ficha.dataset.jugador === "1") {
        // Buscar casilla para jugador 1 (re1)
        const inicioCasilla = document.querySelector(
            `[data-re1="${inicialPosicion}"][data-numero="${ficha.dataset.numero}"]`
        );
        console.log(inicioCasilla);
    
        if (inicioCasilla) {
            inicioCasilla.appendChild(ficha); // Mover ficha al contenedor
            ficha.dataset.posicion = inicialPosicion; // Actualizar posición
        } else {
            console.error(`No se encontró la casilla para jugador 1 en posición ${nuevaPosicion}`);
        }
    } else if (ficha.dataset.jugador === "2") {
        // Buscar casilla para jugador 2 (re2)
        const inicioCasilla = document.querySelector(
            `[data-re2="${inicialPosicion}"][data-numero="${ficha.dataset.numero}"]`
        );
        console.log(inicioCasilla);
        
        if (inicioCasilla) {
            inicioCasilla.appendChild(ficha); // Mover ficha al contenedor
            ficha.dataset.posicion = inicialPosicion; // Actualizar posición
        } else {
            console.error(`No se encontró la casilla para jugador 2 en posición ${nuevaPosicion}`);
        }
    } else {
        console.error("Jugador no identificado en el dataset.");
    }
    
        
    document.getElementById("boton-fichas").addEventListener("click", () => {    
        const primerPosicion = -1;
        // Validar si la ficha tiene posición inicial
        if (ficha.dataset.posicion === "-3") {
            const nuevaPosicion = primerPosicion;
            moverFicha(ficha.id, nuevaPosicion);
            console.log(`Ficha ${ficha.id} seleccionada para mover desde posición inicial.`);
        } else {
            console.log(`Ficha ${ficha.id} está en posición ${ficha.dataset.posicion}.`);
        }


    });

    ficha.addEventListener("click", () => {
        const fichaId = ficha.id;
        fichaSeleccionada = fichaId;
        console.log(`Ficha seleccionada: ${fichaId}, ${fichaSeleccionada}`);
        // Validar si la ficha tiene posición inicial
        if (ficha.dataset.posicion === "-1") {
            const [dado1, dado2] = window.dados;
        
            // Lógica para determinar la nueva posición según los dados
            if (
                (dado1 === 5 && dado2 === 1) || (dado1 === 1 && dado2 === 5) ||
                (dado1 === 4 && dado2 === 2) || (dado1 === 2 && dado2 === 4) ||
                (dado1 === 3 && dado2 === 3) 
            ) {
                moverFichaAfuera(ficha.id, 0); // Caso 5-1 o 1-5
            } else if (
                (dado1 === 6 && dado2 === 3) || (dado1 === 3 && dado2 === 6)
            ) {
                moverFichaAfuera(ficha.id, 3); // Caso 6-3 o 3-6
            } else if (
                dado1 === 6 && dado2 === 6
            ) {
                moverFichaAfuera(ficha.id, 6); // Caso 6-6 con características adicionales
            }
            fichaSeleccionada = null;
        } else if (
            ficha.dataset.posicion >= "-1" ||
            ficha.dataset.posicion <= "61"
        ) {
            document.addEventListener('keydown', (event) => {
                if (!fichaSeleccionada) {
                    console.log('Primero selecciona una ficha.');
                    return;
                }
                const [dado1, dado2] = window.dados || [0,0]; // Asegúrate de que los dados están disponibles
                const posicionActual = parseInt(ficha.dataset.posicion, 10);
                let nuevaPosicion;
                if (ficha.dataset.posicion >= 0 && ficha.dataset.posicion <= 61 ) {
                    switch (event.key.toLowerCase()) {
                        case 'a':
                    
                            nuevaPosicion = posicionActual + dado1;
                    
                            moverFichaAfuera(fichaId, nuevaPosicion);
                    
                            break;
                        case 'b':
                    
                            nuevaPosicion = posicionActual + dado2;
                            moverFichaAfuera(fichaId, nuevaPosicion);
                    
                            break;
                        case 'c':
                    
                            nuevaPosicion = posicionActual + dado1 + dado2 ;
                            moverFichaAfuera(fichaId, nuevaPosicion);
                    
                            break;
                        default:
                            console.log('Tecla no válida.');
                            return;
                    }

                    moverFichaAfuera(fichaId, nuevaPosicion);

                    fichaSeleccionada = null;
                    
                } else {
                    console.log("Ficha no esta en rango");
                }
                fichaSeleccionada = null;
            });
        }    
    });
});

document.querySelectorAll(".casilla").forEach((casilla) => {
    casilla.addEventListener("click", () => {
        const esp1 = casilla.dataset.esp1 || "Desconocido";
        const numero = casilla.dataset.numero || "Desconocido";
        const re1 = casilla.dataset.re1 || "Desconocido";
        const re2 = casilla.dataset.re2 || "Desconocido";
        const esp2 = casilla.dataset.esp2 || "Desconocido";
        const fila = casilla.dataset.fila || "Desconocido";
        const tipo = casilla.dataset.tipo || "Desconocido";
        const columna = casilla.dataset.columna || "Desconocido";
        console.log(`Casilla selccionada :
            \nesp1: ${esp1}, esp2: ${esp2}
            \nFila: ${fila}, Columna: ${columna}
            \nnumero: ${numero}, tipo: ${tipo}
            \nre1: ${re1}, re2: ${re2}`);
    });
});
