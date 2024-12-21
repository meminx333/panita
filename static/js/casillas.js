// Inicializar eventos en las casillas
export function inicializarCasillas() {
    document.querySelectorAll(".casilla").forEach((casilla) => {
        casilla.addEventListener("click", () => {
            const id = casilla.id || "desconocido";
            const esp1 = casilla.dataset.esp1 || "Desconocido";
            const numero = casilla.dataset.numero || "Desconocido";
            const re1 = casilla.dataset.re1 || "Desconocido";
            const re2 = casilla.dataset.re2 || "Desconocido";
            const esp2 = casilla.dataset.esp2 || "Desconocido";
            const fila = casilla.dataset.fila || "Desconocido";
            const tipo = casilla.dataset.tipo || "Desconocido";
            const columna = casilla.dataset.columna || "Desconocido";

            console.log(
                `Casilla selccionada : ${id}
                \nesp1: ${esp1}, esp2: ${esp2}
                \nFila: ${fila}, Columna: ${columna}
                \nnumero: ${numero}, tipo: ${tipo}
                \nre1: ${re1}, re2: ${re2}`
            );
        });
    });
}