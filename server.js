require('dotenv').config();
const express = require('express');
const path = require('path');

const app = express();
const port = process.env.PORT || 5500;

// Middlewares para recibir datos en JSON y formularios
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Servir archivos estáticos desde la carpeta 'public'
app.use(express.static(path.join(__dirname, 'public')));

// Configurar cabeceras y CORS
app.use((_req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Headers', 'Authorization, X-API-KEY, Origin, X-Requested-With, Content-Type, Accept, Access-Control-Allow-Request-Method');
    res.header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, DELETE');
    res.header('Allow', 'GET, POST, OPTIONS, PUT, DELETE');
    next();
});

// Rutas principales de la API (controladores)
const clientesRouter = require('./controllers/clientes');
const productosRouter = require('./controllers/productos');

// Definición de rutas
function configurarRutas() {
    app.get("/api/test/", (_req, res) => {
        res.send("Bienvenido a API REST de ferremas");
    });

    app.use('/api/clientes', clientesRouter);
    app.use('/api/productos', productosRouter);
}

// Configurar rutas antes de levantar el servidor
configurarRutas();

// Iniciar servidor
app.listen(port, () => {
    console.log(`Servidor está corriendo en http://localhost:${port}/index.html`);
});