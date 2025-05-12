const express = require('express');
const router = express.Router();
const connection = require('../config/config');

router.get('/todos', (req, res) => {
    const sql = `
        SELECT 
            * 
        FROM ventas LIMIT 5
        `;

    connection.query(sql, (error, results) => {
        if (error) {
            console.error('Error al ejecutar la consulta:', error);
            return res.status(500).send('Error en la base de datos');
        }

        if (results.length > 0) {
            res.status(200).send(results);
        } else {
            res.status(204).send('Sin resultados');
        }
    });
});

module.exports = router;
