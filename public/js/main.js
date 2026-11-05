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