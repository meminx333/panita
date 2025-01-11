let draggedFicha = null;

// Inicializar eventos en las casillas
export function inicializarCasillas() {
    document.querySelectorAll(".casilla").forEach((casilla) => {
        casilla.addEventListener("click", () => {
            const id = casilla.id || "desconocido";
            const fila = casilla.dataset.fila || "Desconocido";
            const columna = casilla.dataset.columna || "Desconocido";

            console.log(
                `Casilla selccionada : ${id}
                \nFila: ${fila}, Columna: ${columna}`
            );
        });
    });
}

export function inicializarDragged(ficha) {
    // Manejo del evento `dragstart` para las fichas
    ficha.addEventListener('dragstart', (event) => {
      draggedFicha = event.target;
      event.dataTransfer.setData('text/plain', event.target.id); // Guarda el ID de la ficha
      setTimeout(() => (event.target.style.visibility = 'hidden'), 0); // Esconde la ficha mientras se arrastra
    });

    ficha.addEventListener('dragend', (event) => {
      event.target.style.visibility = 'visible'; // Vuelve a hacer visible la ficha
    });

  // Manejo del evento `dragover` en las casillas
  document.querySelectorAll('.casilla').forEach(casilla => {
    casilla.addEventListener('dragover', (event) => {
      event.preventDefault(); // Necesario para permitir el drop
    });

    // Manejo del evento `drop` en las casillas
    casilla.addEventListener('drop', (event) => {
      event.preventDefault();
      const fichaId = event.dataTransfer.getData('text/plain'); // Obtiene el ID de la ficha arrastrada
      const ficha = document.getElementById(fichaId);

      if (!casilla.hasChildNodes()) {
        casilla.appendChild(ficha);
      }   

    });
  });
}