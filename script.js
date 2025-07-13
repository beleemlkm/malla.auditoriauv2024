function toggleAprobado(elem) {
  elem.classList.toggle('aprobado');
}

// Permite ingresar nota con clic derecho (context menu)
document.addEventListener("contextmenu", function (e) {
  if (e.target.classList.contains("ramo")) {
    e.preventDefault();

    const ramo = e.target;
    const nota = prompt("Ingresa tu nota final para este ramo (ej: 4.5)");

    if (nota === null || nota.trim() === "") return; // Cancelado o vacío

    const notaNum = parseFloat(nota);

    if (isNaN(notaNum) || notaNum < 1 || notaNum > 7) {
      alert("Por favor ingresa una nota válida entre 1.0 y 7.0");
      return;
    }

    // Limpiar clases y etiquetas previas
    ramo.classList.remove("aprobado", "eximido", "reprobado");
    ramo.querySelector(".estado")?.remove();

    // Crear etiqueta visual
    const estado = document.createElement("div");
    estado.classList.add("estado");

    if (notaNum >= 5.0) {
      ramo.classList.add("eximido");
      estado.textContent = `Eximido (${notaNum})`;
    } else if (notaNum >= 4.0) {
      ramo.classList.add("aprobado");
      estado.textContent = `Aprobado (${notaNum})`;
    } else {
      ramo.classList.add("reprobado");
      estado.textContent = `Reprobado (${notaNum})`;
    }

    ramo.appendChild(estado);
  }
});
