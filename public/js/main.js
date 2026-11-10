document.addEventListener("DOMContentLoaded", () => {
    const loginForm = document.getElementById("loginForm");

    if (loginForm) {
        const mensaje = document.getElementById("mensaje");
        const DOMINIO = "@certus.edu.pe";

        loginForm.addEventListener("submit", (e) => {
            e.preventDefault();
            mensaje.textContent = "";

            const email = document.getElementById("email").value.trim().toLowerCase();
            const password = document.getElementById("password").value;

            if (!email || !password) {
                mensaje.textContent = "Completa todos los campos.";
                return;
            }

            if (!email.endsWith(DOMINIO)) {
                mensaje.textContent = `Usa tu correo institucional (${DOMINIO}).`;
                return;
            }

            const rol = (email.includes("admin") || email.includes("gestor"))
                ? "admin"
                : "docente";

            localStorage.setItem("usuario", JSON.stringify({ email, rol }));

            window.location.href = rol === "admin"
                ? "dashboard-admin.html"
                : "dashboard-docente.html";
        });
    }

    // ---------- Filtro de búsqueda por docente (panel del gestor) ----------
    const buscador = document.getElementById("buscarDocente");
    const tabla = document.getElementById("tablaDocentes");

    if (buscador && tabla) {
        const contador = document.getElementById("contadorDocentes");
        const sinResultados = document.getElementById("sinResultados");

        // Quita tildes y pasa a minúsculas: "maria" encuentra "María"
        const normalizar = (texto) =>
            texto.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");

        function filtrarDocentes() {
            const termino = normalizar(buscador.value.trim());
            const filas = tabla.querySelectorAll("tbody tr");
            let visibles = 0;

            filas.forEach((fila) => {
                // Busca en la columna Docente y en la de Correo
                const docente = normalizar(fila.cells[0].textContent);
                const correo = normalizar(fila.cells[1].textContent);
                const coincide = docente.includes(termino) || correo.includes(termino);

                fila.hidden = !coincide;
                if (coincide) visibles++;
            });

            contador.textContent = `Mostrando ${visibles} de ${filas.length}`;
            sinResultados.hidden = visibles !== 0;
        }

        buscador.addEventListener("input", filtrarDocentes);
        filtrarDocentes();
    }
});

function descargarConstanciaDinamica(nombreCurso) {
    if (!window.jspdf) {
        alert("La librería de PDF aún se está cargando. Espera un segundo e inténtalo de nuevo.");
        return;
    }

    const datosUsuario = JSON.parse(localStorage.getItem("usuario"));
    const emailUsuario = datosUsuario ? datosUsuario.email : "invitado@certus.edu.pe";
    // Formatea el correo a un nombre legible (ej: juan.perez@certus.edu.pe -> JUAN PEREZ)
    const nombreLimpio = emailUsuario.split('@')[0].replace(/\./g, ' ').toUpperCase();

    const { jsPDF } = window.jspdf;
    const doc = new jsPDF();

    doc.setFont("helvetica", "bold");
    doc.setFontSize(22);
    doc.setTextColor(0, 64, 128); 
    doc.text("CERTIFICADO DE CAPACITACIÓN", 105, 40, null, null, "center");

    doc.setFont("helvetica", "normal");
    doc.setFontSize(14);
    doc.setTextColor(50, 50, 50);
    doc.text("Se otorga la presente constancia a:", 105, 60, null, null, "center");

    doc.setFontSize(18);
    doc.setFont("helvetica", "bold");
    // CORREGIDO: Usamos nombreLimpio en lugar de nombreDocente
    doc.text(nombreLimpio, 105, 75, null, null, "center");

    doc.setFontSize(11);
    doc.setFont("helvetica", "italic");
    doc.setTextColor(100, 100, 100);
    doc.text(`Correo institucional: ${emailUsuario}`, 105, 85, null, null, "center");

    doc.setFontSize(14);
    doc.setFont("helvetica", "normal");
    doc.setTextColor(50, 50, 50);
    doc.text(`Por haber completado satisfactoriamente el curso:`, 105, 105, null, null, "center");
    
    doc.setFontSize(16);
    doc.setFont("helvetica", "bold");
    doc.text(`"${nombreCurso}"`, 105, 120, null, null, "center");

    doc.setFontSize(10);
    doc.setFont("helvetica", "italic");
    doc.text("Emitido por la Escuela de Educación Superior CERTUS", 105, 150, null, null, "center");

    doc.save(`Constancia_${nombreLimpio.replace(/\s+/g, '_')}.pdf`);
}

function exportarTablaAExcel(tableID, filename = '') {
    if (!window.XLSX) {
        alert("La librería de Excel aún se está cargando. Espera un segundo e inténtalo de nuevo.");
        return;
    }
    const table = document.getElementById(tableID);
    if (!table) {
        alert("No se encontró la tabla para exportar.");
        return;
    }
    const wb = XLSX.utils.table_to_book(table, { sheet: "Reporte" });
    XLSX.writeFile(wb, filename ? filename + '.xlsx' : 'Reporte_Capacitaciones.xlsx');
}