document.addEventListener("DOMContentLoaded", function () {
  const asignaturas = document.querySelectorAll(".asignatura");

  asignaturas.forEach((asignatura) => {
    const checkbox = asignatura.querySelector("input[type='checkbox']");
    const nombre = asignatura.querySelector("span").textContent;
    const id = asignatura.getAttribute("id");

    // Evitar duplicar campo nota
    if (!asignatura.querySelector("input[type='number']")) {
      const notaInput = document.createElement("input");
      notaInput.type = "number";
      notaInput.min = "1.0";
      notaInput.max = "7.0";
      notaInput.step = "0.1";
      notaInput.placeholder = "Ingresa nota";
      notaInput.classList.add("nota-input");
      asignatura.appendChild(notaInput);

      // Mostrar aprobado/reprobado y guardar estado
      notaInput.addEventListener("input", function () {
        const nota = parseFloat(notaInput.value);
        if (!isNaN(nota)) {
          if (nota >= 5.0) {
            checkbox.checked = true;
            asignatura.classList.add("aprobado");
          } else if (nota >= 4.0) {
            checkbox.checked = true;
            asignatura.classList.remove("aprobado");
          } else {
            checkbox.checked = false;
            asignatura.classList.remove("aprobado");
          }
          saveState();
          updateDependencias(); // Actualizar restricciones
        }
      });

      // Restaurar nota si existe
      const savedNota = localStorage.getItem(`nota-${id}`);
      if (savedNota) {
        notaInput.value = savedNota;
        notaInput.dispatchEvent(new Event("input"));
      }
    }

    // Restaurar check
    const saved = localStorage.getItem(id);
    if (saved === "true") {
      checkbox.checked = true;
    }

    // Guardar cambios
    checkbox.addEventListener("change", function () {
      localStorage.setItem(id, checkbox.checked);
      saveState();
      updateDependencias();
    });
  });

  function saveState() {
    asignaturas.forEach((asignatura) => {
      const checkbox = asignatura.querySelector("input[type='checkbox']");
      const notaInput = asignatura.querySelector("input[type='number']");
      const id = asignatura.getAttribute("id");
      localStorage.setItem(id, checkbox.checked);
      if (notaInput) {
        localStorage.setItem(`nota-${id}`, notaInput.value);
      }
    });
  }

  function updateDependencias() {
    // Define aquí los requisitos entre ramos (ejemplo)
    const dependencias = {
      "contabilidad-ii": "contabilidad-i",
      "auditoria": "contabilidad-ii",
      "costos": "contabilidad-i",
    };

    Object.entries(dependencias).forEach(([rama, requisito]) => {
      const ramoElem = document.getElementById(rama);
      const requisitoElem = document.getElementById(requisito);

      if (ramoElem && requisitoElem) {
        const nota = parseFloat(localStorage.getItem(`nota-${requisito}`));
        const habilitado = !isNaN(nota) && nota >= 4.0;

        const checkbox = ramoElem.querySelector("input[type='checkbox']");
        checkbox.disabled = !habilitado;

        // Desmarcar si se deshabilita
        if (!habilitado) {
          checkbox.checked = false;
          localStorage.setItem(rama, false);
        }
      }
    });
  }

  updateDependencias(); // Inicial
});
