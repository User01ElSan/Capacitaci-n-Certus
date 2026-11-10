const express = require('express');
const path = require('path');
const cors = require('cors');
const mongoose = require('mongoose');
const dns = require('node:dns');
require('dotenv').config();

// Forzar DNS públicos (soluciona el error querySrv ECONNREFUSED)
dns.setServers(['8.8.8.8', '1.1.1.1']);

const app = express();
const PORT = process.env.PORT || 3000;

// Middlewares
app.use(cors());
app.use(express.json());

// Servir archivos estáticos (HTML, CSS, JS del cliente) desde la carpeta 'public'
app.use(express.static(path.join(__dirname, '../public')));

// Ruta de prueba del API
app.get('/api/status', (req, res) => {
    res.json({
        status: "OK",
        mensaje: "Servidor de Capacitación CERTUS funcionando al 100%",
        baseDeDatos: mongoose.connection.readyState === 1 ? "conectada" : "desconectada"
    });
});

// Conectar a MongoDB y luego iniciar el servidor
mongoose.connect(process.env.MONGODB_URI)
    .then(() => {
        console.log('Conectado a MongoDB Atlas');
        app.listen(PORT, () => {
            console.log(`Servidor corriendo en http://localhost:${PORT}`);
        });
    })
    .catch((err) => {
        console.error('Error al conectar con MongoDB:', err.message);
        process.exit(1);
    });