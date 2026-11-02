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

            // Rol según el correo (lógica del avance, luego se valida con base de datos)
            const rol = (email.includes("admin") || email.includes("gestor"))
                ? "admin"
                : "docente";

            // Guardamos la sesión para usarla en los dashboards
            localStorage.setItem("usuario", JSON.stringify({ email, rol }));

            window.location.href = rol === "admin"
                ? "dashboard-admin.html"
                : "dashboard-docente.html";
        });
    }
});