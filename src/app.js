const express = require('express');
const path = require('path');
const cors = require('cors');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;

// Middlewares
app.use(cors());
app.use(express.json());

// Servir archivos estáticos (HTML, CSS, JS del cliente) desde la carpeta 'public'
app.use(express.static(path.join(__dirname, '../public')));

// Ruta de prueba del API
app.get('/api/status', (req, res) => {
    res.json({ status: "OK", mensaje: "Servidor de Capacitación CERTUS funcionando al 100%" });
});

// Iniciar servidor
app.listen(PORT, () => {
    console.log(`Servidor corriendo en http://localhost:${PORT}`);
});