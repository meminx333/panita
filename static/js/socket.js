import { mostrarNotificacion } from './utils.js';
import { mostrarUltimosTiros } from './dados.js';
import { moverFichaAfuera  } from './fichas.js';
let socket = io();
let turnoActual = 1; // Turno inicial
window.turnoActual = turnoActual;

socket.on("connect", () => console.log("Conectado al servidor Socket.IO"));

socket.on('disconnect', () => console.log('Desconectado del servidor.'));

socket.on("mensaje", (data) => {
    console.log(data.mensaje);
});

socket.on("mover_ficha", (data) => {
    const fichaId=data.ficha_id;
    const nuevaPosicion=parseInt(data.posicion,10);

    if (!fichaId || isNaN(nuevaPosicion)) {
        console.error("Datos inválidos para mover la ficha.");
        return;
    }

    moverFichaAfuera(fichaId, nuevaPosicion);
});


// Evento para recibir los dados lanzados
socket.on("dados_lanzados", (data) => {
    if (!data.dado1 || !data.dado2) {
        console.log("Error al recibir los valores de los dados.");
        return;
    }

    console.log("Dados lanzados", data);

    // Actualiza los valores en el DOM
    document.getElementById("dado-1").innerText = data.dado1 || "No-definido";
    document.getElementById("dado-2").innerText = data.dado2 || "No-definido";

    // Almacenar dados globalmente
    window.dados = {
        dado1: data.dado1,
        dado2: data.dado2,
        usados: [false, false] // Reinicia el estado de los dados
    };
});

// Evento para actualizar los últimos tiros
socket.on("actualizar_ultimos_tiros", (data) => {
    console.log("Últimos tiros:", data);
    mostrarUltimosTiros(data); // Llama a la función modularizada
});

// Evento para cambiar de turno
socket.on("cambiar_turno", (data) => {
    document.getElementById("turno-actual").innerText = `Turno actual: Jugador ${data.jugador_id}`;
    mostrarNotificacion(`Es el turno del Jugador ${data.jugador_id}`);
    window.turnoActual = data.jugador_id; // Asegúrate de que el turno global se actualiza
    
    // No reiniciar dados hasta que hayan sido usados
    if (window.dados && window.dados.usados.every((usado) => usado)) {
        window.dados = { dado1: 0, dado2: 0, usados: [false, false] };
        console.log("Dados reiniciados para el siguiente turno.");
    }
    console.log(`Es el turno del Jugador ${window.turnoActual}`);
});


export default socket;