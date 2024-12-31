import { actualizarTablaDebug } from "./debug.js";
import { actualizarContadores } from "./contadorInicial.js";
import { limpiarResaltado } from "./movimientoDados.js";
import { detectarTorresYColisiones, detectarSalto } from "./torresColiciones.js";


// Función para inicializar eventos en las fichas
export function inicializarFichas() {
    document.querySelectorAll(".ficha").forEach((ficha) => {
        let fichaId = ficha.id;
        const posicionInicial = parseInt(ficha.dataset.posicion,10);
        
        const inicioCasilla = document.querySelector(`[id="${ficha.dataset.casilla_id}"]`);
        if (inicioCasilla) {
            inicioCasilla.appendChild(ficha); // Mover ficha al contenedor
            ficha.dataset.casilla_id = inicioCasilla.id; // Actualizar casilla inicial
            actualizarTablaDebug(fichaId, posicionInicial, ficha.dataset.casilla_id);
        } else {
            console.log(`Casilla inicial no encontrada para ficha ${fichaId}.`);
        }
    });
}

export async function moverFichaAfuera(fichaId, nuevaPosicion) {
    
    // Validaciones iniciales
    if (!fichaId ) {
        console.error("Ficha ID no definidos.");
        return;
    }

    if (nuevaPosicion === undefined) {
        console.error("Nueva posición no definida.");
        return;
    }

    console.log(`Intentando mover la ficha ${fichaId} a la posición ${nuevaPosicion}`);
    
    // Validar rango de posición
    if (!Number.isInteger(nuevaPosicion) || nuevaPosicion < 0 || nuevaPosicion > 61) {
        console.error(`Posición fuera de rango: ${nuevaPosicion}`);
        return Promise.reject(`Posición fuera de rango: ${nuevaPosicion}`);// Evita el movimiento fuera del rango
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

        if (!data.success) {
            console.error(`Error al mover la ficha: ${data.error || "Error desconocido"}`);
            return;
        }

        // Actualizar visualmente
        const ficha = document.getElementById(fichaId);

        if (!ficha) {
            console.error(`No se encontró la ficha con ID ${fichaId}`);
            return;
        } 

        // Obtener el ID del jugador desde la ficha
        const jugador = parseInt(ficha.dataset.jugador,10);
        
        let posicionActual = parseInt(ficha.dataset.posicion, 10);
        let casillaActual = document.querySelector(`.casilla[data-re${jugador}="${posicionActual}"]`);
        if (!casillaActual) {
            console.error(`No se encontró una casilla válida para la posición ${posicionActual}`);
            return;
        }
        let casillaFinal = document.querySelector(`.casilla[data-re${jugador}="${nuevaPosicion}"]`);
               
        if (!casillaFinal) {
            console.error(`No se encontró una casilla válida para la posición ${nuevaPosicion}`);
            return;
        }
        // Detectar entrada al puente
        if (
            casillaActual.dataset[`esp${jugador}`] !== "puente" &&
            casillaFinal.dataset[`esp${jugador}`] === "puente"
        ) {
            console.log("Entrando al puente...");
        }

        // Detectar salida del puente y ajustar posición
        if (
            casillaActual.dataset[`esp${jugador}`] === "puente" &&
            casillaFinal.dataset[`esp${jugador}`] !== "puente"
        ) {
            console.log("Saliendo del puente, ajustando posición...");
            nuevaPosicion -= 3; // Ajustar posición al salir del puente
            casillaFinal = document.querySelector(`.casilla[data-re${jugador}="${nuevaPosicion}"]`);
        }

        // Mover ficha a la casilla final
        if (casillaFinal) {
            // Mover ficha al contenedor visual
            casillaFinal.appendChild(ficha);


            // Actualizar atributos de datos de la ficha 
            ficha.dataset.posicion = nuevaPosicion; // Actualizar posición en los atributos de datos
            ficha.dataset.casilla_id = casillaFinal.id;

            console.log(`Ficha ${fichaId} movida a la casilla ${casillaFinal.id} en la posicion ${nuevaPosicion}`);
            
            // Actualizar contadores de fichas
            actualizarContadores();
            detectarTorresYColisiones(casillaFinal.id);
            detectarSalto(ficha.id, nuevaPosicion, jugador);
            actualizarTablaDebug(fichaId, nuevaPosicion, casillaFinal.id);
            limpiarResaltado();

        } else {
            console.error("Error al mover la ficha:", data.mensaje || "Error desconocido");
        }
        // Verificar si es una torre
        //if (data.tipo === "torre") {
            //console.log("Torre detectada en la posición:", nuevaPosicion);
            //ficha.classList.add("torre"); // Marcar visualmente como torre
        //} else {
            //ficha.classList.remove("torre");
            //ficha.replaceWith(ficha.cloneNode(true)); // Elimina listeners
        //}
    } catch (error) {
        console.error("Error en la solicitud de movimiento:", error);   
    }
}