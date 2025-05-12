import {  mostrarNotificacion } from './js/utils.js';
import { inicializarDados } from './js/dados.js';
import "./js/socket.js";
import "./js/array.js";
import "./js/tablero.js";
import "./js/utils.js";
import { actualizarContadores, actualizarFichas } from './js/fichas.js';

document.addEventListener("DOMContentLoaded", async () => {
    const socket = io();
    let turnoActual = 1;
    actualizarFichas();
    actualizarContadores();
    inicializarDados(socket, turnoActual);
    mostrarNotificacion();
});
