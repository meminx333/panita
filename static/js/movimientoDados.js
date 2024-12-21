import { moverFichaAfuera } from "./fichas.js";
import { usarDado } from "./dados.js";
let keydownListener = null; // Referencia al evento actual

// Manejo del teclado para mover fichas en posiciones no iniciales
export function manejarTeclado(ficha, nuevaPosicion, dado1, dado2) {
    // Elimina el listener anterior si existe
    if (keydownListener) {
       document.removeEventListener("keydown", keydownListener);
       keydownListener = null;
       console.log("Listener de teclado eliminado.");
   }

   // Define un nuevo listener
   keydownListener = (event) => {
       let nuevaPosicionTemporal = nuevaPosicion; // Copia la posición actual

       console.log(`Ficha ID: ${ficha.id}, Posición actual: ${nuevaPosicionTemporal}`); // Depuración
       
       switch (event.key.toLowerCase()) {
           case 'a': // Usar dado 1
               nuevaPosicionTemporal += dado1;
               console.log(`A la posicion es ${nuevaPosicionTemporal}`);
               usarDado(0);
               break;
           case 'b': // Usar dado 2
               nuevaPosicionTemporal += dado2;
               console.log(`B la posicion es ${nuevaPosicionTemporal}`);
               usarDado(1);
               break;
           case 'c': // Usar ambos dados
               nuevaPosicionTemporal += dado1 + dado2;
               console.log(`C la posicion es ${nuevaPosicionTemporal}`);
               usarDado(0);
               usarDado(1);
               break;
           default:
               console.log("Tecla no válida:", event.key);
               return;
       }

       // Validar que la nueva posición esté dentro del rango permitido
       if (nuevaPosicionTemporal != null && nuevaPosicionTemporal >= 0 && nuevaPosicionTemporal <= 61) {
           moverFichaAfuera(ficha.id, nuevaPosicionTemporal).then(() => {
               ficha.dataset.posicion = nuevaPosicionTemporal; // Actualiza el atributo dataset
               console.log(`Ficha ${ficha.id} movida a la posición ${nuevaPosicionTemporal}.`);
           });
       } else {
           console.warn("Nueva posición fuera de rango:", nuevaPosicionTemporal);
       }
   };

   // Asocia el nuevo listener
   document.addEventListener("keydown", keydownListener);
   console.log("Nuevo listener de teclado asignado.");
}