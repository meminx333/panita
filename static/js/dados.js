export function inicializarDados(socket, turnoActual) {
    // Botón para tirar dados del jugador 1
    document.getElementById("boton-tirar-dados-jugador-1").addEventListener("click", () => {
        if (turnoActual === 1) {
            socket.emit("tirar_dados", { jugador_id: turnoActual });
        } else {
            console.log("No es el turno del Jugador 1.");
        }
    });

    // Botón para tirar dados del jugador 2
    document.getElementById("boton-tirar-dados-jugador-2").addEventListener("click", () => {
        if (turnoActual === 2) {
            socket.emit("tirar_dados", { jugador_id: turnoActual });
        } else {
            console.log("No es el turno del Jugador 2.");
        }
    });

    // Evento para recibir los dados lanzados
    socket.on("dados_lanzados", (data) => {
        if (!data.dado1 || !data.dado2) {
            console.log("Error al recibir los valores de los dados.");
            return;
        }

        console.log("Dados lanzados", data);

        document.getElementById("dado-1").innerText = data.dado1 || "No-definido";
        document.getElementById("dado-2").innerText = data.dado2 || "No-definido";
    
        // Almacenar dados globalmente
        window.dados = { dado1: data.dado1, dado2: data.dado2, usados: [false, false] };
    });

    // Evento para actualizar los últimos tiros
    socket.on("actualizar_ultimos_tiros", (data) => {
        console.log("Últimos tiros:", data);
        mostrarUltimosTiros(data);
    });

    // Evento para cambiar de turno
    socket.on("cambiar_turno", (data) => {
        turnoActual = data.jugador_id;
        window.turnoActual = turnoActual;

        // Reiniciar los dados
        if (window.dados) {
            window.dados.usados = [false, false];
        }

        console.log(`Es el turno del Jugador ${turnoActual}`);
    });
}

// Mostrar los últimos tiros en la tabla
export function mostrarUltimosTiros(data) {
    const tablaTiros = document.querySelector("#tabla_tiros tbody");
    tablaTiros.innerHTML = ""; // Limpiar la tabla

    if (!data || !data.tiros || data.tiros.length === 0) {
        const fila = document.createElement("tr");
        fila.innerHTML = `<td colspan="3">No hay tiros recientes</td>`;
        tablaTiros.appendChild(fila);
        return;
    }
    
    // Llenar la tabla con los últimos tiros
    data.tiros.forEach((tiro) => {
        const fila = document.createElement("tr");
        fila.innerHTML = `
            <td>${ tiro.jugador || "Desconocido"}</td>
            <td>${tiro.dado1 || "-"}</td>
            <td>${tiro.dado2 || "-"}</td>
        `;
        tablaTiros.appendChild(fila);
    });
}

// Lógica para lanzar dados desde el backend
export async function tirarDados() {
    try {
        const respuesta = await fetch('/tirar_dados', { method: 'POST' });
        const data = await respuesta.json();

        if (data.success) {
            const { jugador_id, dado1, dado2 } = data;

            if (dado1 === undefined || dado2 === undefined) {
                console.error("Error: Dados no definidos en la respuesta.");
                return;
            }

            window.dados = { dado1, dado2, usados: [false, false] };
            console.log(`Jugador ${jugador_id} lanzó los dados: ${dado1}, ${dado2}`);
        } else {
            console.error("Error al tirar los dados:", data.error);
        }
    } catch (error) {
        console.error("Error en la solicitud para tirar los dados:", error);
    }
}

// Lógica para usar un dado específico
export async function usarDado(index) {
    if (!window.dados || window.dados.usados[index]) {
        console.log(`Dado ${index + 1} ya fue usado o no está inicializado.`);
        return;
    }

    try {
        const respuesta = await fetch('/usar_dado', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ index })
        });

        const data = await respuesta.json();

        if (data.success) {
            window.dados.usados[index] = true; // Marcar el dado como usado
            console.log(`Dado ${index + 1} usado con valor: ${data.valor}`);
            return data.valor; // Devolver el valor del dado
        } else {
            console.error("Error al usar el dado:", data.error);
        }
    } catch (error) {
        console.error("Error en la solicitud para usar el dado:", error);
    }
}