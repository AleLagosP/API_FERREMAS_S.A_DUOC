const express = require('express');
const router = express.Router();
const connection = require('../config/config');

// GET: obtener todos los clientes
router.get('/', (_req, res) => {
    const sql = `SELECT id_cliente, nombre, domicilio FROM clientes`;

    connection.query(sql, (error, results) => {
        if (error) return res.status(500).send('Error en la base de datos');
        if (results.length > 0) {
            res.status(200).json(results);
        } else {
            res.status(204).send('Sin resultados');
        }
    });
});

// GET por ID
router.get('/:id', (req, res) => {
    const { id } = req.params;
    const sql = `SELECT * FROM clientes WHERE id_cliente = ?`;

    connection.query(sql, [id], (error, results) => {
        if (error) return res.status(500).send('Error en la base de datos');
        if (results.length > 0) {
            res.status(200).json(results[0]);
        } else {
            res.status(404).send('Cliente no encontrado');
        }
    });
});

// POST: agregar cliente
router.post('/', (req, res) => {
    const { nombre, domicilio } = req.body;
    const sql = `INSERT INTO clientes (nombre, domicilio) VALUES (?, ?)`;

    connection.query(sql, [nombre, domicilio], (error, result) => {
        if (error) return res.status(500).send('Error al insertar cliente');
        res.status(201).json({ id_cliente: result.insertId, nombre, domicilio });
    });
});

// PUT: actualizar cliente
router.put('/:id', (req, res) => {
    const { id } = req.params;
    const { nombre, domicilio } = req.body;
    const sql = `UPDATE clientes SET nombre = ?, domicilio = ? WHERE id_cliente = ?`;

    connection.query(sql, [nombre, domicilio, id], (error) => {
        if (error) return res.status(500).send('Error al actualizar cliente');
        res.status(200).send('Cliente actualizado correctamente');
    });
});

// DELETE: eliminar cliente
router.delete('/:id', (req, res) => {
    const { id } = req.params;
    const sql = `DELETE FROM clientes WHERE id_cliente = ?`;

    connection.query(sql, [id], (error) => {
        if (error) return res.status(500).send('Error al eliminar cliente');
        res.status(200).send('Cliente eliminado correctamente');
    });
});

module.exports = router;
