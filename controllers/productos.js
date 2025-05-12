const express = require('express');
const router = express.Router();
const connection = require('../config/config');

// GET: obtener todos los productos
router.get('/', (_req, res) => {
    const sql = `SELECT cod_producto, nombre_producto, stock, precio, descripcion FROM productos`;

    connection.query(sql, (err, results) => {
        if (err) {
            console.error('Error al obtener productos:', err); // Mostramos el error detallado
            return res.status(500).send('Error al obtener productos');
        }
        if (results.length > 0) {
            res.status(200).json(results);
        } else {
            res.status(204).send('Sin resultados');
        }
    });
});

// GET: producto por ID (usando `cod_producto`)
router.get('/:id', (req, res) => {
    const { id } = req.params;
    const sql = `SELECT * FROM productos WHERE cod_producto = ?`;

    connection.query(sql, [id], (err, results) => {
        if (err) {
            console.error('Error al obtener producto:', err);
            return res.status(500).send('Error al obtener producto');
        }
        if (results.length > 0) {
            res.status(200).json(results[0]);
        } else {
            res.status(404).send('Producto no encontrado');
        }
    });
});

// POST: agregar producto
router.post('/', (req, res) => {
    const { nombre_producto, stock, precio, descripcion } = req.body;
    const sql = `INSERT INTO productos (nombre_producto, stock, precio, descripcion) VALUES (?, ?, ?, ?)`;

    connection.query(sql, [nombre_producto, stock, precio, descripcion], (err, result) => {
        if (err) {
            console.error('Error al insertar producto:', err);
            return res.status(500).send('Error al insertar producto');
        }
        res.status(201).json({ cod_producto: result.insertId, nombre_producto, stock, precio, descripcion });
    });
});

// PUT: actualizar producto
router.put('/:id', (req, res) => {
    const { id } = req.params;
    const { nombre_producto, stock, precio, descripcion } = req.body;
    const sql = `UPDATE productos SET nombre_producto = ?, stock = ?, precio = ?, descripcion = ? WHERE cod_producto = ?`;

    connection.query(sql, [nombre_producto, stock, precio, descripcion, id], (err) => {
        if (err) {
            console.error('Error al actualizar producto:', err);
            return res.status(500).send('Error al actualizar producto');
        }
        res.status(200).send('Producto actualizado');
    });
});

// DELETE: eliminar producto
router.delete('/:id', (req, res) => {
    const { id } = req.params;
    const sql = `DELETE FROM productos WHERE cod_producto = ?`;

    connection.query(sql, [id], (err) => {
        if (err) {
            console.error('Error al eliminar producto:', err);
            return res.status(500).send('Error al eliminar producto');
        }
        res.status(200).send('Producto eliminado');
    });
});

module.exports = router;
