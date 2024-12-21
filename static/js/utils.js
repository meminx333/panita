// Mostrar notificaciones al usuario
export function mostrarNotificacion(mensaje) {
    const notificacion = document.createElement("div");
    notificacion.className = "notificacion";
    notificacion.innerText = mensaje;
    document.body.appendChild(notificacion);
    setTimeout(() => notificacion.remove(), 3000);
}
