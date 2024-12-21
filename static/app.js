import {  mostrarNotificacion } from './js/utils.js';
import { inicializarDados } from './js/dados.js';
import socket from './js/socket.js';
import "./js/array.js";
import { actualizarContadores } from './js/contadorInicial.js';
import inicializarTablero from './js/tablero.js';


document.addEventListener("DOMContentLoaded", async () => {
    actualizarContadores();
    inicializarTablero();
    inicializarDados(socket);
    mostrarNotificacion();
});
