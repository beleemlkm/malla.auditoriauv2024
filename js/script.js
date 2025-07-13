// Función para marcar un ramo según la nota ingresada con clic derecho
document.addEventListener("contextmenu", function (e) {
  if (e.target.classList.contains("ramo")) {
    e.preventDefault();

    const ramo = e.target;
    const nota = prompt("Ingresa tu nota final para este ramo (ej: 4.5)");

    if (nota === null || nota.trim() === "") return;

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
    guardarEstado(); // Guardar al ingresar nota
  }
});

// Función para marcar/desmarcar aprobado con clic normal
function toggleAprobado(elem) {
  elem.classList.toggle('aprobado');
  guardarEstado(); // Guardar al marcar/desmarcar
}

// Guardar estado en localStorage
function guardarEstado() {
  const estados = [];
  document.querySelectorAll(".ramo").forEach((ramo) => {
    estados.push({
      clases: Array.from(ramo.classList),
      estadoTexto: ramo.querySelector(".estado")?.textContent || ""
    });
  });
  localStorage.setItem("estadoMalla", JSON.stringify(estados));
}

// Cargar estado al iniciar
function cargarEstado() {
  const estadoGuardado = localStorage.getItem("estadoMalla");
  if (!estadoGuardado) return;

  const estados = JSON.parse(estadoGuardado);
  document.querySelectorAll(".ramo").forEach((ramo, i) => {
    if (!estados[i]) return;

    // Restaurar clases
    ramo.className = "ramo"; // reset
    estados[i].clases.forEach(clase => {
      if (clase !== "ramo") ramo.classList.add(clase);
    });

    // Restaurar etiqueta estado
    if (estados[i].estadoTexto) {
      const estado = document.createElement("div");
      estado.classList.add("estado");
      estado.textContent = estados[i].estadoTexto;
      ramo.appendChild(estado);
    }
  });
}

document.addEventListener("DOMContentLoaded", cargarEstado);
