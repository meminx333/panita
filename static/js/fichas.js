import { actualizarTablaDebug } from "./debug.js";


export function actualizarFichas(fichas) {
    const container = document.getElementById('fichas-container');
    container.innerHTML = fichas.map(ficha => `
        <div class="ficha"
            {% for ficha in fichas %}
                <div class="ficha jugador-{{ ficha.jugador_id }}"
                     id="{{ ficha.ficha_id }}"
                     data-jugador="{{ ficha.jugador_id }}"
                     data-posicion="{{ ficha.posicion }}"
                     data-numero="{{ ficha.numero }}"
                     data-casilla_id="{{ ficha.casilla_id}}">
                    {{ ficha.ficha_id }}
                </div>
            {% endfor %}
        </div>
    `).join('');
}
// Función genérica para mover fichas
async function moverFichaGenerico(fichaId, nuevaPosicion, esAfuera = false) {
    try {
        // Enviar datos al backend
        const respuesta = await fetch('/mover_ficha', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ ficha_id: fichaId, nueva_posicion: nuevaPosicion })
        });

        if (!respuesta.ok) {
            throw new Error(`Network error: ${respuesta.status} - ${respuesta.statusText}`);
        }

        const data = await respuesta.json();
        if (!data.success) throw new Error(data.mensaje);

        // Actualizar visualmente
        const ficha = document.getElementById(fichaId);
        const cachedElements = {}; // Cache para almacenar elementos ya seleccionados
        const getSelector = (selector) => {
            if (!cachedElements[selector]) {
                cachedElements[selector] = document.querySelector(selector);
            }
            return cachedElements[selector];
        };

        const selector = esAfuera
            ? `[data-re${ficha.dataset.jugador}="${nuevaPosicion}"]`
            : `[data-re${ficha.dataset.jugador}="${nuevaPosicion}"][data-numero="${ficha.dataset.numero}"]`;

        const nuevaCasilla = getSelector(selector);
        if (!nuevaCasilla) throw new Error(`No se encontró la casilla para jugador ${ficha.dataset.jugador}.`);

        nuevaCasilla.appendChild(ficha); // Mover ficha
        ficha.dataset.posicion = nuevaPosicion; // Actualizar posición

        // Actualizar depuración y contadores
        actualizarTablaDebug(fichaId, nuevaPosicion, nuevaCasilla.dataset.fila, nuevaCasilla.dataset.columna);
        actualizarContadores();

    } catch (error) {
        console.error("Error al mover la ficha:", error.message);
    }
}

// Actualizar contadores de fichas en posición -1
export function actualizarContadores() {
    const contarFichas = (jugador) => Array.from(document.querySelectorAll(`.ficha[data-jugador="${jugador}"][data-posicion="-1"]`)).length;
    document.getElementById("contador-jugador-1").innerText = `Jugador 1: ${contarFichas("1")} fichas en -1`;
    document.getElementById("contador-jugador-2").innerText = `Jugador 2: ${contarFichas("2")} fichas en -1`;
}

// Exportar funciones simplificadas
export function moverFicha(fichaId, nuevaPosicion) {
    moverFichaGenerico(fichaId, nuevaPosicion, false);
}

export function moverFichaAfuera(fichaId, nuevaPosicion) {
    moverFichaGenerico(fichaId, nuevaPosicion, true);
}
