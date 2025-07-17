document.addEventListener("DOMContentLoaded", () => {

  // Lista completa de ramos con prerrequisitos separados por coma (si no tiene, cadena vacía)
  const ramosData = [
    {nombre: "Introducción a la contabilidad", prereq: ""},
    {nombre: "Normativa empresarial I", prereq: ""},
    {nombre: "Gestión de organizaciones I", prereq: ""},
    {nombre: "Lengua materna y autorregulación", prereq: ""},
    {nombre: "Matemáticas I", prereq: ""},
    
    {nombre: "Contabilidad financiera", prereq: "Introducción a la contabilidad"},
    {nombre: "Normativa empresarial II", prereq: "Normativa empresarial I"},
    {nombre: "Gestión de organizaciones II", prereq: "Gestión de organizaciones I"},
    {nombre: "Introducción a la auditoría", prereq: ""},
    {nombre: "Economía I", prereq: "Matemáticas I"},
    {nombre: "Matemáticas II", prereq: "Matemáticas I"},

    {nombre: "Normativa contable IFRS", prereq: "Contabilidad financiera"},
    {nombre: "Normativa tributaria", prereq: "Normativa empresarial II"},
    {nombre: "TIC para los negocios", prereq: ""},
    {nombre: "Economía II", prereq: "Economía I"},
    {nombre: "Estadística", prereq: "Matemáticas II"},
    {nombre: "Control interno y gestión de riesgos", prereq: "Introducción a la auditoría"},

    {nombre: "Fundamentos de auditoría", prereq: "Control interno y gestión de riesgos"},
    {nombre: "Normativa contable NIC SP", prereq: "Normativa contable IFRS"},
    {nombre: "Impuestos I", prereq: "Normativa tributaria"},
    {nombre: "Costos para la toma de decisiones I", prereq: "Economía I"},
    {nombre: "Estadística para los negocios", prereq: "Estadística"},
    {nombre: "Inglés I", prereq: ""},

    {nombre: "Bases y aplicación de ciencias de datos", prereq: "Estadística para los negocios"},
    {nombre: "Tributación aplicada I", prereq: "Impuestos I"},
    {nombre: "Gestión de capital humano", prereq: "Gestión de organizaciones II"},
    {nombre: "Costos para la toma de decisiones II", prereq: "Costos para la toma de decisiones I"},
    {nombre: "Inglés II", prereq: "Inglés I"},
    {nombre: "Taller de integración perfil UV I", prereq: ""},

    {nombre: "Contabilidad avanzada I", prereq: "Normativa contable NIC SP"},
    {nombre: "Impuestos II", prereq: "Tributación aplicada I"},
    {nombre: "Gestión comercial", prereq: "Gestión de capital humano"},
    {nombre: "Introducción a las finanzas", prereq: "Costos para la toma de decisiones II"},
    {nombre: "Inglés III", prereq: "Inglés II"},
    {nombre: "Taller de integración perfil UV II", prereq: "Taller de integración perfil UV I"},
    {nombre: "Ejecución de proyectos de auditoría", prereq: "Bases y aplicación de ciencias de datos"},

    {nombre: "Contabilidad avanzada II", prereq: "Contabilidad avanzada I"},
    {nombre: "Tributación aplicada II", prereq: "Impuestos II"},
    {nombre: "Gestión de operaciones", prereq: "Gestión comercial"},
    {nombre: "Auditoría de sistemas", prereq: "Control interno y gestión de riesgos"},
    {nombre: "Finanzas corporativas", prereq: "Introducción a las finanzas"},
    {nombre: "Inglés IV", prereq: "Inglés III"},
    {nombre: "Proyecto de investigación", prereq: "Taller de integración perfil UV I"},
    {nombre: "Práctica temprana", prereq: "Fundamentos de auditoría"},

    {nombre: "Contabilidad avanzada III", prereq: "Contabilidad avanzada II"},
    {nombre: "Gestión tributaria", prereq: "Tributación aplicada II"},
    {nombre: "Planificación y control de gestión", prereq: "Gestión de operaciones"},
    {nombre: "Auditoría de estados financieros", prereq: "Auditoría de sistemas"},
    {nombre: "Gestión financiera", prereq: "Introducción a las finanzas"},
    {nombre: "Investigación aplicada", prereq: "Proyecto de investigación"},

    {nombre: "Electivo 1 profesional", prereq: "Contabilidad avanzada III, Gestión tributaria"},
    {nombre: "Electivo 2 profesional", prereq: "Contabilidad avanzada III, Gestión tributaria"},
    {nombre: "Electivo 3 profesional", prereq: "Contabilidad avanzada III, Gestión tributaria"},
    {nombre: "Formulación y evaluación de proyectos de inversión", prereq: "Finanzas corporativas"},
    {nombre: "Dirección gerencial", prereq: "Finanzas corporativas"},
    {nombre: "Práctica profesional", prereq: "Práctica temprana, Auditoría de estados financieros"},

    {nombre: "Taller de integración profesional", prereq: "Contabilidad avanzada III, Gestión tributaria, Planificación y control de gestión, Auditoría de estados financieros, Gestión financiera, Investigación aplicada"},
  ];

  const contenedor = document.getElementById("contenedor");

  // Crear elementos ramo
  ramosData.forEach(ramo => {
    const div = document.createElement("div");
    div.classList.add("ramo");
    div.textContent = ramo.nombre;
    if (ramo.prereq) div.dataset.prerrequisitos = ramo.prereq;
    contenedor.appendChild(div);
  });

  // Después de crear, inicializamos notas, bloqueo y avance
  inicializarRamos();

  function inicializarRamos() {
    const ramos = document.querySelectorAll(".ramo");

    ramos.forEach(ramo => {
      const nombre = ramo.textContent.trim();

      // Evitar duplicar input
      if (!ramo.querySelector("input")) {
        const input = document.createElement("input");
        input.type = "number";
        input.min = "1.0";
        input.max = "7.0";
        input.step = "0.1";
        input.placeholder = "Nota (1.0 - 7.0)";
        input.classList.add("nota-input");

        // Cargar nota guardada
        const notaGuardada = localStorage.getItem(`nota-${nombre}`);
        if (notaGuardada) input.value = notaGuardada;

        // Evento input
        input.addEventListener("input", () => {
          const val = parseFloat(input.value);
          if (!isNaN(val) && val >= 1 && val <= 7) {
            localStorage.setItem(`nota-${nombre}`, val);
          } else {
            localStorage.removeItem(`nota-${nombre}`);
          }
          actualizarEstadoRamo(ramo);
          actualizarBloqueos();
          calcularAvance();
        });

        ramo.appendChild(input);
      }

      actualizarEstadoRamo(ramo);
    });

    actualizarBloqueos();
    calcularAvance();
  }

  // Actualiza colores y tachado según nota
  function actualizarEstadoRamo(ramo) {
    const input = ramo.querySelector("input");
    if (!input) return;
    const val = parseFloat(input.value);

    ramo.classList.remove("aprobado", "eximido", "reprobado");

    if (!isNaN(val)) {
      if (val >= 5.0) {
        ramo.classList.add("eximido");
      } else if (val >= 4.0) {
        ramo.classList.add("aprobado");
      } else {
        ramo.classList.add("reprobado");
      }
    }
  }

  // Bloquea ramos si prerrequisitos no están aprobados o eximidos
  function actualizarBloqueos() {
    const ramos = document.querySelectorAll(".ramo");

    ramos.forEach(ramo => {
      const prereqs = ramo.dataset.prerrequisitos;
      const input = ramo.querySelector("input");
      if (!input) return;

      if (!prereqs) {
        // Sin prereqs, desbloqueado
        ramo.classList.remove("bloqueado");
        input.disabled = false;
        return;
      }

      const prereqNombres = prereqs.split(",").map(s => s.trim());

      // Chequear si todos los prereqs están aprobados o eximidos (nota >= 4.0)
      const cumple = prereqNombres.every(nombreReq => {
        const nota = parseFloat(localStorage.getItem(`nota-${nombreReq}`));
        return !isNaN(nota) && nota >= 4.0;
      });

      if (cumple) {
        ramo.classList.remove("bloqueado");
        input.disabled = false;
      } else {
        ramo.classList.add("bloqueado");
        input.disabled = true;
        input.value = "";
        localStorage.removeItem(`nota-${ramo.textContent.trim()}`);
        // Además removemos clases para evitar mostrar colores erróneos
        ramo.classList.remove("aprobado", "eximido", "reprobado");
      }
    });
  }

  // Calcula avance global y actualiza barra y texto
  function calcularAvance() {
    const ramos = document.querySelectorAll(".ramo");
    const total = ramos.length;
    let aprobados = 0;

    ramos.forEach(ramo => {
      if (ramo.classList.contains("aprobado") || ramo.classList.contains("eximido")) {
        aprobados++;
      }
    });

    const porcentaje = total ? Math.round((aprobados / total) * 100) : 0;
    const texto = `${aprobados} de ${total} ramos avanzados (${porcentaje}%)`;

    const barra = document.getElementById("progreso-barra");
    const textoEl = document.getElementById("progreso-texto");
    if (barra && textoEl) {
      barra.value = porcentaje;
      textoEl.textContent = texto;
    }
  }

});
