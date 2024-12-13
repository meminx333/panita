import { moverFichaAfuera } from "./fichas.js";
import { actualizarTablaDebug } from "./debug.js";
import { usarDado } from "./dados.js";
let keydownListener = null; // Referencia al evento actual 


// Función para inicializar eventos en las fichas
function inicializarFichas() {
    document.querySelectorAll(".ficha").forEach((ficha) => {
        const casillaId = ficha.dataset.casilla_id;
        const fichaId = ficha.id;
        let posicion = parseInt(ficha.dataset.posicion, 10); // Asegurar que sea un entero
        let nuevaPosicion;
        
        const inicioCasilla = document.querySelector(`[id="${casillaId}"]`);
        if (inicioCasilla) {
            inicioCasilla.appendChild(ficha); // Mover ficha al contenedor
            ficha.dataset.casilla_id = casillaId; // Actualizar posición inicial
            nuevaPosicion = posicion;
        } else {
            console.log(`Casilla inicial no encontrada para ficha ${fichaId}.`);
        }
    
        actualizarTablaDebug(fichaId, nuevaPosicion, casillaId);

        // Agregar evento click a la ficha
        ficha.addEventListener("click", () => {
            let [dado1,dado2] = window.dados || [0,0];

            // Remover el listener anterior si existe
            if (keydownListener) {
                document.removeEventListener("keydown", keydownListener);
                console.log("Listener de teclado eliminado.");
            }
        
            // Validar si la ficha tiene posición inicial
            if (posicion === "-1" ) {
                nuevaPosicion = determinarPosicionInicial(dado1, dado2);
                if (nuevaPosicion !== null) {
                    moverFichaAfuera(fichaId, nuevaPosicion);
                    actualizarTablaDebug(fichaId, nuevaPosicion, casillaId);
                    posicion = nuevaPosicion;
                    usarDado(0);
                    usarDado(1);
                } else {
                    console.log("No se puede mover la ficha desde la posición inicial con los dados actuales.");
                }
            } else if (posicion >= 0 && posicion <= 61) {
                keydownListener = manejarTeclado(fichaId, posicion, casillaId, dado1, dado2);
                document.addEventListener("keydown", keydownListener);
            } else {
                console.warn("Ficha fuera de rango:", posicion);
            }
        });
    });
}

// Determinar nueva posición inicial según los dados
function determinarPosicionInicial(dado1, dado2) {
    if (
        (dado1 === 5 && dado2 === 1) || (dado1 === 1 && dado2 === 5) ||
        (dado1 === 4 && dado2 === 2) || (dado1 === 2 && dado2 === 4) ||
        (dado1 === 3 && dado2 === 3)
    ) {
        return 0; // Caso 5-1, 1-5, etc.
    } else if ((dado1 === 6 && dado2 === 3) || (dado1 === 3 && dado2 === 6)) {
        return 3; // Caso 6-3, 3-6
    } else if (dado1 === 6 && dado2 === 6) {
        return 6; // Caso 6-6 con características adicionales
    }
    return null; // No hay movimiento válido
}

// Manejo del teclado para mover fichas en posiciones no iniciales
function manejarTeclado(fichaId, posicion, casillaId, dado1, dado2) {
    return (event) => {
        let nuevaPosicion;
        switch (event.key.toLowerCase()) {
            case 'a': // Usar dado 1
                nuevaPosicion = posicion + dado1;
                usarDado(0);
                break;
            case 'b': // Usar dado 2
                nuevaPosicion = posicion + dado2;
                usarDado(1);
                break;
            case 'c': // Usar ambos dados
                nuevaPosicion = posicion + dado1 + dado2;
                usarDado(0);
                usarDado(1);
                break;
            default:
                console.log("Tecla no válida:", event.key);
                return;
        }

        if (nuevaPosicion !== undefined) {
            moverFichaAfuera(fichaId, nuevaPosicion);
            posicion = nuevaPosicion;
            actualizarTablaDebug(fichaId, nuevaPosicion, casillaId);
        }
    };
}

// Inicializar eventos en las casillas
function inicializarCasillas() {
    document.querySelectorAll(".casilla").forEach((casilla) => {
        casilla.addEventListener("click", () => {
            const id = casilla.id || "desconocido";
            const esp1 = casilla.dataset.esp1 || "Desconocido";
            const numero = casilla.dataset.numero || "Desconocido";
            const re1 = casilla.dataset.re1 || "Desconocido";
            const re2 = casilla.dataset.re2 || "Desconocido";
            const esp2 = casilla.dataset.esp2 || "Desconocido";
            const fila = casilla.dataset.fila || "Desconocido";
            const tipo = casilla.dataset.tipo || "Desconocido";
            const columna = casilla.dataset.columna || "Desconocido";

            console.log(
                `Casilla selccionada : ${id}
                \nesp1: ${esp1}, esp2: ${esp2}
                \nFila: ${fila}, Columna: ${columna}
                \nnumero: ${numero}, tipo: ${tipo}
                \nre1: ${re1}, re2: ${re2}`
            );
        });
    });
}

// Inicialización principal
function inicializarTablero() {
    inicializarFichas();
    inicializarCasillas();
}

export default inicializarTablero;
