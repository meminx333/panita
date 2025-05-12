import { mostrarNotificacion, sincronizarEstadoInicial } from './utils.js';
import { mostrarUltimosTiros } from './dados.js';
import { moverFichaAfuera,  } from './fichas.js';
var socket = io();

socket.on("connect", () => console.log("Conectado al servidor Socket.IO"));

socket.on('disconnect', () => console.log('Desconectado del servidor.'));

socket.on("mensaje", (data) => {
    console.log(data.mensaje);
});

// Eventos relacionados con el tablero
socket.on('estado_tablero', (data) => {
    mostrarNotificacion("El tablero ha sido actualizado");
    sincronizarEstadoInicial();
    console.log(`Tablero actualizado ${data}`); 
    });
socket.on("mover_ficha", (data) => {
    fichaId=data.ficha_id;
    nuevaPosicion=data.posicion;
    moverFichaAfuera(fichaId, nuevaPosicion);
    });

socket.on("actualizar_ultimos_tiros", (data) => {
    mostrarUltimosTiros(data); // Llama a la función modularizada
    });
    
socket.on("cambiar_turno", (data) => {
    document.getElementById("turno-actual").innerText = `Turno actual: Jugador ${data.jugador_id}`;
    mostrarNotificacion(`Es el turno del Jugador ${data.jugador_id}`);
    if (data.jugador_id === 2) {  // ID de la CPU
        setTimeout(() => {
            fetch("/turno_cpu", { method: "POST" })
            .then(response => response.json())
            .then(data => {
                if (!data.success) console.error(data.mensaje);
            });
        }, 2000);  // Simula "pensamiento" de 2 segundos
    }
});


export default socket;