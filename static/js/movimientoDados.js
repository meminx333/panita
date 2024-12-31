import { usarDado } from "./dados.js";
import { moverFichaAfuera } from "./fichas.js";

export function resaltarOpcionesMovimiento(ficha, dado1, dado2) {
    const posicionActual = parseInt(ficha.dataset.posicion, 10);
    let jugador = parseInt(ficha.dataset.jugador,10);

    // Opciones adicionales para los valores de los dados
    const posiblesPosiciones = [
        { pos: posicionActual + dado1, tipo: "dado1" },
        { pos: posicionActual + dado2, tipo: "dado2" },
        { pos: posicionActual + dado1 + dado2, tipo: "suma" },
    ];
    console.log(posiblesPosiciones);

    posiblesPosiciones.forEach(({ pos, tipo }) => {
        document.querySelectorAll(`.casilla[data-re${jugador}="${pos}"]`).forEach((casilla) => {
            console.log(casilla);

            if (casilla) {
                casilla.classList.add(`resaltada-${tipo}`);
                casilla.addEventListener("click", async function mover() {
                    await moverFichaAfuera(ficha.id, pos);
                    limpiarResaltado();
                    if (tipo === "dado1") {
                        usarDado(0);
                    } 
                    if  (tipo === "dado2") {
                        usarDado(1);
                    }
                    if (tipo === "suma") {
                        usarDado(0);
                        usarDado(1);
                    }
                });
            }
        });
    });
}

export function limpiarResaltado() {
    document.querySelectorAll(".ficha.seleccionada").forEach(ficha => ficha.classList.remove("seleccionada"));
    document.querySelectorAll(".casilla.resaltada-dado1, .casilla.resaltada-dado2, .casilla.resaltada-suma").forEach(casilla => {
        casilla.classList.remove("resaltada-dado1", "resaltada-dado2", "resaltada-suma");
        casilla.replaceWith(casilla.cloneNode(true)); // Remueve todos los listeners
    });
}