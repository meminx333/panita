export function inicializarDados(socket) {
    // Botón para tirar dados del jugador 1
    document.getElementById("boton-tirar-dados-jugador-1").addEventListener("click", () => {
        if (window.turnoActual === 1) {
            socket.emit("tirar_dados", { jugador_id: 1 });
        } else {
            console.log("No es el turno del Jugador 1.");
        }
    });

    // Botón para tirar dados del jugador 2
    document.getElementById("boton-tirar-dados-jugador-2").addEventListener("click", () => {
        if (window.turnoActual === 2) {
            socket.emit("tirar_dados", { jugador_id: 2 });
        } else {
            console.log("No es el turno del Jugador 2.");
        }
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
        console.log(data, respuesta);

        if (!data.success) {
            console.error("Error al tirar los dados:", data.error);
            return;
        }

        window.dados = {
            dado1: data.dado1,
            dado2: data.dado2,
            usados: [false, false]
        };

        console.log(`Dados lanzados: dado1=${data.dado1}, dado2=${data.dado2}`);

        
    } catch (error) {
        console.error("Error en la solicitud para tirar los dados:", error);
    }
}

// Lógica para usar un dado específico
export async function usarDado(index) {
    if (!window.dados || window.dados.usados[index]) {
        console.log(`Dado ${index + 1} ya fue usado o no está inicializado.`);
        return 0; // Devuelve 0 si el dado ya fue usado o no está inicializado
    }

    try {
        const respuesta = await fetch('/usar_dado', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ index })
        });

        if (!respuesta.ok) {
            console.error(`Error al usar el dado: ${await respuesta.text()}`);
            return;
        }

        const data = await respuesta.json();
        if (!data.success) {
            console.error(`Error al usar el dado: ${data.error || "Error desconocido"}`);
            return 0; // Devuelve 0 como valor predeterminado en caso de error
        }

        // Usa el valor correcto y marca el dado como usado
        const valorDado = index === 0 ? window.dados.dado1 : window.dados.dado2;
        window.dados.usados[index] = true;

        console.log(`Dado ${index + 1} usado con valor: ${valorDado}`);
        return valorDado;

    } catch (error) {
        console.error("Error en la solicitud para usar el dado:", error);
        return 0;
    }
}

export async function verificarDadosDisponibles() {
    try {
        const respuesta = await fetch('/dados_disponibles', {method: 'GET' });
        
        if (!respuesta.ok) {
            console.error(`Error al verificar dados disponibles: ${await respuesta.text()}`);
            return false;
        }
        
        const data = await respuesta.json();
        console.log(`Estado de los dados actualizado: ${JSON.stringify(window.dados)}`);
        return data.disponibles; // Retorna si hay dados disponibles
    } catch (error) {
        console.error("Error al verificar dados disponibles:", error);
        return false;
    }
}
