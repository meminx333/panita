import { moverFichaAfuera, inicializarFichas } from "./fichas.js";
import { usarDado, verificarDadosDisponibles } from "./dados.js";
import { inicializarCasillas } from "./casillas.js";
import { determinarPosicionInicial } from "./posicionSalida.js";
import { manejarTeclado } from "./movimientoDados.js";

let keydownListener = null; // Referencia al evento actual

// Función para inicializar eventos en las fichas
function inicializarMovimiento() {
    document.querySelectorAll(".ficha").forEach((ficha) => {
        inicializarFichas();
        // Agregar evento click a la ficha
        ficha.addEventListener("click", async () => {
            console.log(`Ficha seleccionada: ${ficha.id}, posición: ${ficha.dataset.posicion}`);

            // Remover el listener anterior si existe
            if (keydownListener) {
                document.removeEventListener("keydown", keydownListener);
                keydownListener = null;
                console.log("Listener de teclado eliminado.");
            }

            // Verificar si hay dados disponibles
            const disponibles = await verificarDadosDisponibles();
            if (!disponibles) {
                console.log("No hay dados disponibles para usar.");
                return;
            }

             // Lógica para usar un dado
            const valorDado1 = window.dados?.dado1 || 0; // Intentar usar dado 1
            const valorDado2 = window.dados?.dado2 || 0; // Intentar usar dado 2

            

            if (valorDado1 === 0 && valorDado2 === 0) {
                console.warn("No hay movimientos disponibles con los dados actuales.");
                return;
            }
            
            // Continuar con la lógica de movimiento usando los valores válidos
            console.log("Valores de los dados:", valorDado1, valorDado2);
            console.log(`Estado actualizado de los dados: ${JSON.stringify(window.dados)}`);
            
            // Validar si la ficha tiene posición inicial
            if (ficha.dataset.posicion === "-1" ) {
                // Lógica para mover ficha desde posición inicial
                let nuevaPosicion = await determinarPosicionInicial(valorDado1, valorDado2);


                if (typeof nuevaPosicion === "number" && nuevaPosicion >= 0 && nuevaPosicion <= 61) {
                    await moverFichaAfuera(ficha.id, nuevaPosicion);
                    ficha.dataset.posicion = nuevaPosicion;
                    console.log(`Ficha ${ficha.id} movida a la posición inicial ${nuevaPosicion}`);
                } else {
                    console.warn("No se puede mover la ficha desde la posición inicial con los dados actuales o la posición es inválida:", nuevaPosicion);
                }
            } else {
                console.log("Ficha no está en la posición inicial.");
            }

            let nuevaPosicion = parseInt(ficha.dataset.posicion);

            if (nuevaPosicion >= 0 && nuevaPosicion <= 61) {
                manejarTeclado(ficha, nuevaPosicion, valorDado1, valorDado2);

            } else {
                console.warn("Ficha fuera de rango:", nuevaPosicion);
            }
        });
    });
}

// Inicialización principal
function inicializarTablero() {
    inicializarMovimiento();
    inicializarCasillas();
}

export default inicializarTablero;
