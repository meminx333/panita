import { moverFichaAfuera, inicializarFichas } from "./fichas.js";
import { usarDado, verificarDadosDisponibles } from "./dados.js";
import { inicializarCasillas } from "./casillas.js";
import { determinarPosicionInicial } from "./posicionSalida.js";
import { resaltarOpcionesMovimiento, limpiarResaltado } from "./movimientoDados.js";

// Función para inicializar eventos en las fichas
function inicializarMovimiento() {
    document.querySelectorAll(".ficha").forEach((ficha) => {
        inicializarFichas();
        // Agregar evento click a la ficha
        ficha.addEventListener("click", async () => {
            console.log(`Ficha seleccionada: ${ficha.id}, posición: ${ficha.dataset.posicion}`);

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
            if (ficha.dataset.posicion === "-1" && valorDado1 !== 0 && valorDado2 !== 0) {
                // Lógica para mover ficha desde posición inicial
                let nuevaPosicion = await determinarPosicionInicial(valorDado1, valorDado2);


                if (typeof nuevaPosicion === "number" && nuevaPosicion >= 0 && nuevaPosicion <= 61) {
                    await moverFichaAfuera(ficha.id, nuevaPosicion);
                    ficha.dataset.posicion = nuevaPosicion;
                    console.log(`Ficha ${ficha.id} movida a la posición inicial ${nuevaPosicion}`);
                    usarDado(0);
                    usarDado(1);
                    return;
                } else {
                    console.warn("No se puede mover la ficha desde la posición inicial con los dados actuales o la posición es inválida:", nuevaPosicion);
                }
            } else {
                console.log("Ficha no está en la posición inicial.");
            }
        
            let posicionActual = parseInt(ficha.dataset.posicion,10);

            if (posicionActual >= 0 && posicionActual <= 61) {

                const jugador = parseInt(ficha.dataset.jugador,10);

                resaltarOpcionesMovimiento(ficha, valorDado1, valorDado2);

                // Al hacer clic en una casilla resaltada:
                document.querySelectorAll(".casilla.resaltada").forEach((casilla) => {
                    casilla.addEventListener("click", () => {
                        const nuevaPosicion = parseInt(casilla.dataset[`re${jugador}`], 10);
                        moverFichaAfuera(ficha.id, nuevaPosicion);
                        limpiarResaltado();
                    });
                });
            } else {
                console.warn("Ficha fuera de rango:", posicionActual);
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
