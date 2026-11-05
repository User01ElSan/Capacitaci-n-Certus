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
});

function descargarConstanciaPDF(nombreDocente, nombreCurso) {
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
    doc.text(nombreDocente, 105, 75, null, null, "center");

    doc.setFontSize(14);
    doc.setFont("helvetica", "normal");
    doc.text(`Por haber completado satisfactoriamente el curso:`, 105, 95, null, null, "center");
    
    doc.setFontSize(16);
    doc.setFont("helvetica", "bold");
    doc.text(`"${nombreCurso}"`, 105, 110, null, null, "center");

    doc.setFontSize(10);
    doc.setFont("helvetica", "italic");
    doc.text("Emitido por la Escuela de Educación Superior CERTUS", 105, 150, null, null, "center");

    
    doc.save(`Constancia_${nombreDocente.replace(/\s+/g, '_')}.pdf`);
}


function exportarTablaAExcel(tableID, filename = '') {
    const table = document.getElementById(tableID);
    const wb = XLSX.utils.table_to_book(table, { sheet: "Reporte" });
    XLSX.writeFile(wb, filename ? filename + '.xlsx' : 'Reporte_Capacitaciones.xlsx');
}