import { actualizarTablaDebug } from "./debug.js";
import { actualizarContadores } from "./contadorInicial.js";

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

        const nuevaCasilla = document.querySelector(`[data-re${ficha.dataset.jugador}="${nuevaPosicion}"]`);
        if (!nuevaCasilla) {
            console.error(`Error: No se encontró una casilla válida para el jugador ${ficha.dataset.jugador} en posición ${nuevaPosicion}.`);
            return;
        }

        if (nuevaCasilla && ficha) {
            // Mover ficha al contenedor visual
            nuevaCasilla.appendChild(ficha);


            // Actualizar atributos de datos de la ficha
            ficha.dataset.posicion = nuevaPosicion; // Actualizar posición en los atributos de datos
            ficha.dataset.casilla_id = nuevaCasilla.id;

            console.log(`Ficha ${fichaId} movida a la casilla ${nuevaCasilla.id} en la posicion ${nuevaPosicion}`);
            
            // Actualizar contadores de fichas
            actualizarContadores();
            actualizarTablaDebug(fichaId, nuevaPosicion, nuevaCasilla.id);
            
        } else {
            console.error("Error al mover la ficha:", data.mensaje || "Error desconocido");
        }
    } catch (error) {
        console.error("Error en la solicitud de movimiento:", error);   
    }
}