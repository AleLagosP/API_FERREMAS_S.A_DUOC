require('dotenv').config();
const express = require('express');
const path = require('path');  // Asegúrate de importar 'path'

const app = express();
const port = process.env.PORT || 5500;

// configuración body parser para permitir json, y url encoded
const bodyParser = require('body-parser');
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Servir archivos estáticos desde la carpeta 'public'
app.use(express.static(path.join(__dirname, 'public')));

// Conexión a la base de datos - APIs:
const clientesRouter = require('../controllers/clientes');
const productosRouter = require('../controllers/productos');
const ventasRouter = require('../controllers/ventas');

// Configurar cabeceras y cors
app.use((_req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Headers', 'Authorization, X-API-KEY, Origin, X-Requested-With, Content-Type, Accept, Access-Control-Allow-Request-Method');
    res.header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, DELETE');
    res.header('Allow', 'GET, POST, OPTIONS, PUT, DELETE');
    next();
});

// Función controladores
function controladores() {
    // Rutas principales de la API
    app.get("/api/test/", function(_request, response) {
        response.send("Bienvenido a API REST de ferremas");
    });

    // Usar el controlador 'buscar_todo' en la ruta
    app.use('/api/clientes', clientesRouter);
    app.use('/api/productos', productosRouter);
    app.use('/api/ventas', ventasRouter);
}

// Iniciar servidor
app.listen(port, function () {
    console.log(`Servidor está corriendo en http://localhost:${port}/api/test/`);
    controladores(); // Llamamos a la función controladores para definir rutas adicionales
});
