document.addEventListener("DOMContentLoaded", () => {
    const loginForm = document.getElementById("loginForm");
    
    if (loginForm) {
        loginForm.addEventListener("submit", (e) => {
            e.preventDefault();
            const email = document.getElementById("email").value;

           
            if (email.includes("admin") || email.includes("gestor")) {
                window.location.href = "dashboard-admin.html";
            } else {
                window.location.href = "dashboard-docente.html";
            }
        });
    }
});