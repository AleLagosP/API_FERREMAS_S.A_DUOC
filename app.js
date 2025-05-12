require('dotenv').config();
const express = require('express');

const app = express();
const port = process.env.port || 5500;

// configuración body parser para permitir json, y url encoded
const bodyParser = require('body-parser');
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

const connection = require('./config/config.js');

// Conexión a la base de datos - APIs:
const clientes = require('./controllers/clientes');

// Configurar cabeceras y cors
app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Headers', 'Authorization, X-API-KEY, Origin, X-Requested-With, Content-Type, Accept, Access-Control-Allow-Request-Method');
    res.header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, DELETE');
    res.header('Allow', 'GET, POST, OPTIONS, PUT, DELETE');
    next();
});

// Función controladores
function controladores() {
    // Rutas principales de la API
    app.get("/api/test/", function(request, response) {
        response.send("Bienvenido a API REST de ferremas");
    });

    // Usar el controlador 'buscar_todo' en la ruta '/api/clientes'
    app.get('/api/clientes/todos', clientes.buscar_todo);
}

// Se inicia servidor
app.listen(port, function () {
    console.log(`Servidor esta corriendo! http://localhost:${port}/api/test/`);
    controladores(); // Llamamos a la función controladores para definir rutas adicionales
});

