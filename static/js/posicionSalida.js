import { moverFichaAfuera } from "./fichas.js";
import { usarDado } from "./dados.js";

// Determinar nueva posición inicial según los dados
export async function determinarPosicionInicial(dado1, dado2) {
    if (
        (dado1 === 5 && dado2 === 1) || (dado1 === 1 && dado2 === 5) ||
        (dado1 === 4 && dado2 === 2) || (dado1 === 2 && dado2 === 4) ||
        (dado1 === 3 && dado2 === 3)
    ) {
        return 0; // Caso 5-1, 1-5, etc.
    } else if ((dado1 === 6 && dado2 === 3) || (dado1 === 3 && dado2 === 6)) {
        return 3; // Caso 6-3, 3-6
    } else if (dado1 === 6 && dado2 === 6) {
        // Llamar y esperar el resultado de manejarSeisSeis
        const posicion = await manejarSeisSeis(window.turnoActual);
        // turnoActual puede ser "1" o "2"
        return posicion;
    }
    return null; // No hay movimiento válido
}

export async function manejarSeisSeis(turnoActual) {

    turnoActual = window.turnoActual || turnoActual;
    const jugador = String(window.turnoActual || turnoActual);

    // Obtener todas las fichas en la posición inicial (-1)
    const fichasEnInicio = Array.from(
        document.querySelectorAll(`.ficha[data-jugador="${jugador}"][data-posicion="-1"]`)
    );

    console.log(
        `Jugador ${jugador} tiene ${fichasEnInicio.length} fichas en posición inicial.`
    );

    if (fichasEnInicio.length >= 2) {
        // Caso donde hay dos o más fichas en posición inicial
        console.log(
            `Jugador ${jugador}, selecciona dos fichas para moverlas a la posición 0.`
        );

        // Permitir que el jugador seleccione dos fichas para mover
        fichasEnInicio.forEach(ficha => {
            ficha.addEventListener("click", async function seleccionarFicha() {
                ficha.classList.add("seleccionada"); // Resaltar la ficha seleccionada

                if (
                    document.querySelectorAll(".ficha.seleccionada").length === 2
                ) {
                    // Mover ambas fichas a la posición inicial (0)
                    for (const fichaSeleccionada of document.querySelectorAll(".ficha.seleccionada")) {
                        await moverFichaAfuera(fichaSeleccionada.id, 0);
                        fichaSeleccionada.classList.remove("seleccionada");
                    }

                    // Limpiar eventos para evitar duplicados
                    fichasEnInicio.forEach(f => {
                        f.removeEventListener("click", seleccionarFicha);
                    });

                    // Salir del flujo después de mover las fichas
                    return;
                }
            });
        });
    } else if (fichasEnInicio.length === 1) {
        // Caso donde hay solo una ficha en la posición inicial
        const ficha = fichasEnInicio[0];

        const eleccion = prompt(
            `Jugador ${jugador}: Ingresa "1" para mover la ficha a la posición 6 o "2" para moverla a la posición 0 y avanzar otra ficha +6.`
        );

        if (eleccion === "1") {
            await moverFichaAfuera(ficha.id, 6);
            ficha.dataset.posicion = 6;
            console.log(`Jugador ${jugador} movió una ficha a la posición 6.`);
        } else if (eleccion === "2") {
            await moverFichaAfuera(ficha.id, 0);
            ficha.dataset.posicion = 0;

            // Buscar otra ficha para avanzar 6 posiciones
            const fichasRangoValido = Array.from(
                document.querySelectorAll(
                    `.ficha[data-jugador="${jugador}"][data-posicion]:not([data-posicion="-1"])`
                )
            );

            fichasRangoValido.forEach((otraFicha) => {
                otraFicha.addEventListener("click", async function avanzarOtraFicha() {
                    const nuevaPosicion = parseInt(otraFicha.dataset.posicion, 10) + 6;
                    await moverFichaAfuera(otraFicha.id, nuevaPosicion);
                    otraFicha.dataset.posicion = nuevaPosicion;

                    console.log(
                        `Jugador ${jugador} avanzó otra ficha ${otraFicha.id} 6 posiciones a la posición ${nuevaPosicion}.`
                    );

                    otraFicha.removeEventListener("click", avanzarOtraFicha); // Eliminar evento
                });
            });
        } else {
            console.log("Opción no válida.");
            return null;
        }

        usarDado(0);
        usarDado(1);
        window.dados.usados = [true, true]; // Actualizar estado global
        console.log("Turno repetido: dados usados correctamente.");
    } else {
        console.log(`Jugador ${jugador} no tiene fichas en la posición -1.`);
        return null;
    }
}