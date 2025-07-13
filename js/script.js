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
// Función que revisa y bloquea ramos si sus prerrequisitos no están aprobados/eximidos
function actualizarBloqueos() {
  const ramos = document.querySelectorAll('.ramo');

  ramos.forEach(ramo => {
    const prereqs = ramo.dataset.prerrequisitos;
    if (!prereqs) {
      ramo.classList.remove('bloqueado');
      return; // Si no tiene prerrequisitos, siempre desbloqueado
    }

    // Prerrequisitos separados por coma y espacio si hay más de uno
    const prereqArray = prereqs.split(',').map(p => p.trim());

    // Verificar si TODOS los prerrequisitos están aprobados o eximidos
    const todosAprobados = prereqArray.every(nombrePrerreq => {
      // Buscar ramo que tenga ese nombre exacto
      const ramoPrereq = Array.from(ramos).find(r => r.textContent.trim() === nombrePrerreq);
      if (!ramoPrereq) return false; // Si no existe ese ramo, no desbloquear
      return ramoPrereq.classList.contains('aprobado') || ramoPrereq.classList.contains('eximido');
    });

    if (todosAprobados) {
      ramo.classList.remove('bloqueado');
    } else {
      ramo.classList.add('bloqueado');
    }
  });
}

// Modificar la función toggleAprobado para que no funcione si el ramo está bloqueado
function toggleAprobado(elem) {
  if (elem.classList.contains('bloqueado')) {
    alert('Debes aprobar los prerrequisitos antes de marcar este ramo.');
    return;
  }
  elem.classList.toggle('aprobado');
  guardarEstado();
  actualizarBloqueos();
}

// Modificar el listener para poner nota con clic derecho también bloquea si está bloqueado
document.addEventListener("contextmenu", function (e) {
  if (e.target.classList.contains("ramo")) {
    if (e.target.classList.contains("bloqueado")) {
      alert("Debes aprobar los prerrequisitos antes de modificar este ramo.");
      e.preventDefault();
      return;
    }
  }
});

// Llamar actualizarBloqueos después de cargar el estado guardado
document.addEventListener("DOMContentLoaded", () => {
  cargarEstado();
  actualizarBloqueos();
});
