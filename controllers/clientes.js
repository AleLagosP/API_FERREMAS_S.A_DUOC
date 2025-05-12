// controllers/clientes.js
const connection = require('../config/config'); // Conexión a la base de datos

// Exportar la función que maneja la consulta
module.exports.buscar_todo = (req, res) => {
    const sql = `
        SELECT
            id_cliente,
            nombre,
            domicilio
        FROM clientes
    `;
    
    connection.query(sql, (error, results) => {
        if (error) {
            console.error('Error al ejecutar la consulta:', error);
            return res.status(500).send('Error en la base de datos');
        }
        
        if (results.length > 0) {
            return res.status(200).send(results);
        } else {
            return res.status(204).send('Sin resultado');
        }
    });
};
