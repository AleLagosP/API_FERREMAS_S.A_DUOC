const express = require('express');
const router = express.Router();
const connection = require('../config/config');

// GET: obtener todas las ventas
router.get('/', (_req, res) => {
    const sql = `SELECT cod_venta, id_cliente, tipo_entrega, fecha_venta FROM ventas`;

    connection.query(sql, (err, results) => {
        if (err) {
            console.error('Error al obtener ventas:', err); // Mostramos el error detallado
            return res.status(500).send('Error al obtener ventas');
        }
        if (results.length > 0) {
            res.status(200).json(results);
        } else {
            res.status(204).send('Sin resultados');
        }
    });
});

// GET: venta por ID (usando `cod_venta`)
router.get('/:id', (req, res) => {
    const { id } = req.params;
    const sql = `SELECT * FROM ventas WHERE cod_venta = ?`;

    connection.query(sql, [id], (err, results) => {
        if (err) {
            console.error('Error al obtener venta:', err);
            return res.status(500).send('Error al obtener venta');
        }
        if (results.length > 0) {
            res.status(200).json(results[0]);
        } else {
            res.status(404).send('Venta no encontrada');
        }
    });
});

// POST: registrar nueva venta
router.post('/', (req, res) => {
    const { id_cliente, tipo_entrega, fecha_venta } = req.body;
    const sql = `INSERT INTO ventas (id_cliente, tipo_entrega, fecha_venta) VALUES (?, ?, ?)`;

    connection.query(sql, [id_cliente, tipo_entrega, fecha_venta], (err, result) => {
        if (err) {
            console.error('Error al registrar venta:', err);
            return res.status(500).send('Error al registrar venta');
        }
        res.status(201).json({ cod_venta: result.insertId, id_cliente, tipo_entrega, fecha_venta });
    });
});

// PUT: actualizar venta
router.put('/:id', (req, res) => {
    const { id } = req.params;
    const { id_cliente, tipo_entrega, fecha_venta } = req.body;
    const sql = `UPDATE ventas SET id_cliente = ?, tipo_entrega = ?, fecha_venta = ? WHERE cod_venta = ?`;

    connection.query(sql, [id_cliente, tipo_entrega, fecha_venta, id], (err) => {
        if (err) {
            console.error('Error al actualizar venta:', err);
            return res.status(500).send('Error al actualizar venta');
        }
        res.status(200).send('Venta actualizada');
    });
});

// DELETE: eliminar venta
router.delete('/:id', (req, res) => {
    const { id } = req.params;
    const sql = `DELETE FROM ventas WHERE cod_venta = ?`;

    connection.query(sql, [id], (err) => {
        if (err) {
            console.error('Error al eliminar venta:', err);
            return res.status(500).send('Error al eliminar venta');
        }
        res.status(200).send('Venta eliminada');
    });
});

module.exports = router;

