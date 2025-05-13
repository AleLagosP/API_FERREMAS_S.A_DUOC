// controllers/ventas.js
const express = require('express');
const router = express.Router();
const db = require('../config/config');

// GET - Obtener ventas por cliente
router.get('/:id_cliente', (req, res) => {
  const idCliente = req.params.id_cliente;

  if (!idCliente) {
    return res.status(400).json({ mensaje: 'Falta el parámetro id_cliente' });
  }

  const sql = `
    SELECT V.COD_VENTA, V.ID_CLIENTE, V.TIPO_ENTREGA, V.FECHA_VENTA,
           DV.COD_PRODUCTO, DV.CANTIDAD, DV.PRECIO_UNITARIO, DV.TOTAL_PRODUCTO,
           P.NOMBRE_PRODUCTO
    FROM VENTAS V
    JOIN DETALLE_VENTA DV ON V.COD_VENTA = DV.COD_VENTA
    JOIN PRODUCTOS P ON DV.COD_PRODUCTO = P.COD_PRODUCTO
    WHERE V.ID_CLIENTE = ?
  `;

  db.query(sql, [idCliente], (err, ventas) => {
    if (err) {
      console.error('Error al obtener ventas:', err);
      return res.status(500).json({ mensaje: 'Error del servidor al obtener las ventas.' });
    }

    if (!ventas || ventas.length === 0) {
      return res.status(404).json({ mensaje: 'No se encontraron ventas para este cliente.' });
    }

    const ventasAgrupadas = {};

    ventas.forEach(v => {
      if (!ventasAgrupadas[v.COD_VENTA]) {
        ventasAgrupadas[v.COD_VENTA] = {
          cod_venta: v.COD_VENTA,
          id_cliente: v.ID_CLIENTE,
          tipo_entrega: v.TIPO_ENTREGA,
          fecha_venta: v.FECHA_VENTA,
          total_venta: 0,
          productos: []
        };
      }

      ventasAgrupadas[v.COD_VENTA].productos.push({
        cod_producto: v.COD_PRODUCTO,
        nombre_producto: v.NOMBRE_PRODUCTO,
        cantidad: v.CANTIDAD,
        precio_unitario: v.PRECIO_UNITARIO,
        total_producto: v.TOTAL_PRODUCTO
      });

      ventasAgrupadas[v.COD_VENTA].total_venta += parseFloat(v.TOTAL_PRODUCTO);
    });

    res.status(200).json(Object.values(ventasAgrupadas));
  });
});


// POST - Registrar nueva venta
router.post('/', (req, res) => {
  const { id_cliente, tipo_entrega, productos } = req.body;

  if (!id_cliente || !tipo_entrega || !productos || productos.length === 0) {
    return res.status(400).json({ mensaje: 'Datos incompletos' });
  }

    const connection = db;


    connection.beginTransaction(err => {
      if (err) return res.status(500).json({ mensaje: 'Error al iniciar transacción' });

      connection.query(
        'INSERT INTO VENTAS (ID_CLIENTE, TIPO_ENTREGA) VALUES (?, ?)',
        [id_cliente, tipo_entrega],
        (err, result) => {
          if (err) {
            return connection.rollback(() => {
              res.status(500).json({ mensaje: 'Error al insertar venta' });
            });
          }

          const codVenta = result.insertId;
          const detalleValues = [];

          const procesarProducto = (index) => {
            if (index >= productos.length) {
              // Insertar en detalle y actualizar stock
              connection.query(
                'INSERT INTO DETALLE_VENTA (COD_VENTA, COD_PRODUCTO, CANTIDAD, PRECIO_UNITARIO, TOTAL_PRODUCTO) VALUES ?',
                [detalleValues],
                (err) => {
                  if (err) {
                    return connection.rollback(() => {
                      res.status(500).json({ mensaje: 'Error al insertar detalle de venta' });
                    });
                  }

                  connection.commit(err => {
                    if (err) {
                      return connection.rollback(() => {
                        res.status(500).json({ mensaje: 'Error al confirmar transacción' });
                      });
                    }

                    res.status(201).json({ mensaje: 'Venta registrada correctamente', cod_venta: codVenta });
                  });
                }
              );
              return;
            }

            const p = productos[index];
            connection.query(
              'SELECT PRECIO FROM PRODUCTOS WHERE COD_PRODUCTO = ?',
              [p.cod_producto],
              (err, rows) => {
                if (err || rows.length === 0) {
                  return connection.rollback(() => {
                    res.status(500).json({ mensaje: 'Error al obtener precio del producto' });
                  });
                }

                const precio = rows[0].PRECIO;
                const total = precio * p.cantidad;
                detalleValues.push([codVenta, p.cod_producto, p.cantidad, precio, total]);

                connection.query(
                  'UPDATE PRODUCTOS SET STOCK = STOCK - ? WHERE COD_PRODUCTO = ?',
                  [p.cantidad, p.cod_producto],
                  (err) => {
                    if (err) {
                      return connection.rollback(() => {
                        res.status(500).json({ mensaje: 'Error al actualizar stock' });
                      });
                    }
                    procesarProducto(index + 1);
                  }
                );
              }
            );
          };

          procesarProducto(0); // inicia el bucle
        }
      );
    });
});


// PUT - Editar una venta
router.put('/:cod_venta', (req, res) => {
  const cod_venta = req.params.cod_venta;
  const { productos } = req.body;

  if (!cod_venta || !productos || productos.length === 0) {
    return res.status(400).json({ mensaje: 'Datos incompletos' });
  }

  db.getConnection((err, connection) => {
    if (err) return res.status(500).json({ mensaje: 'Error de conexión a la base de datos' });

    connection.beginTransaction(err => {
      if (err) return res.status(500).json({ mensaje: 'Error al iniciar transacción' });

      connection.query(
        'SELECT COD_PRODUCTO, CANTIDAD FROM DETALLE_VENTA WHERE COD_VENTA = ?',
        [cod_venta],
        (err, originales) => {
          if (err) {
            return connection.rollback(() => {
              res.status(500).json({ mensaje: 'Error al obtener venta original' });
            });
          }

          let i = 0;
          const devolverStock = () => {
            if (i >= originales.length) return borrarDetalle();
            const p = originales[i++];
            connection.query(
              'UPDATE PRODUCTOS SET STOCK = STOCK + ? WHERE COD_PRODUCTO = ?',
              [p.CANTIDAD, p.COD_PRODUCTO],
              (err) => {
                if (err) return connection.rollback(() => res.status(500).json({ mensaje: 'Error al devolver stock' }));
                devolverStock();
              }
            );
          };

          const borrarDetalle = () => {
            connection.query('DELETE FROM DETALLE_VENTA WHERE COD_VENTA = ?', [cod_venta], (err) => {
              if (err) return connection.rollback(() => res.status(500).json({ mensaje: 'Error al eliminar detalle anterior' }));

              insertarNuevoDetalle(0, []);
            });
          };

          const insertarNuevoDetalle = (index, detalleValues) => {
            if (index >= productos.length) {
              connection.query(
                'INSERT INTO DETALLE_VENTA (COD_VENTA, COD_PRODUCTO, CANTIDAD, PRECIO_UNITARIO, TOTAL_PRODUCTO) VALUES ?',
                [detalleValues],
                (err) => {
                  if (err) return connection.rollback(() => res.status(500).json({ mensaje: 'Error al insertar nuevo detalle' }));

                  connection.commit(err => {
                    if (err) return connection.rollback(() => res.status(500).json({ mensaje: 'Error al confirmar transacción' }));
                    res.status(200).json({ mensaje: 'Venta actualizada correctamente' });
                  });
                }
              );
              return;
            }

            const p = productos[index];
            connection.query('SELECT PRECIO FROM PRODUCTOS WHERE COD_PRODUCTO = ?', [p.cod_producto], (err, rows) => {
              if (err || rows.length === 0) return connection.rollback(() => res.status(500).json({ mensaje: 'Error al obtener precio del producto' }));

              const precio = rows[0].PRECIO;
              const total = precio * p.cantidad;
              detalleValues.push([cod_venta, p.cod_producto, p.cantidad, precio, total]);

              connection.query('UPDATE PRODUCTOS SET STOCK = STOCK - ? WHERE COD_PRODUCTO = ?', [p.cantidad, p.cod_producto], (err) => {
                if (err) return connection.rollback(() => res.status(500).json({ mensaje: 'Error al actualizar stock' }));
                insertarNuevoDetalle(index + 1, detalleValues);
              });
            });
          };

          devolverStock();
        }
      );
    });
  });
});


// DELETE - Eliminar una venta
router.delete('/:cod_venta', (req, res) => {
  const cod_venta = req.params.cod_venta;

  if (!cod_venta) {
    return res.status(400).json({ mensaje: 'ID de venta requerido' });
  }

  db.getConnection((err, connection) => {
    if (err) return res.status(500).json({ mensaje: 'Error de conexión a la base de datos' });

    connection.beginTransaction(err => {
      if (err) return res.status(500).json({ mensaje: 'Error al iniciar transacción' });

      connection.query(
        'SELECT COD_PRODUCTO, CANTIDAD FROM DETALLE_VENTA WHERE COD_VENTA = ?',
        [cod_venta],
        (err, productosVenta) => {
          if (err) return connection.rollback(() => res.status(500).json({ mensaje: 'Error al obtener productos de la venta' }));

          let i = 0;
          const devolverStock = () => {
            if (i >= productosVenta.length) return eliminarVenta();
            const p = productosVenta[i++];
            connection.query(
              'UPDATE PRODUCTOS SET STOCK = STOCK + ? WHERE COD_PRODUCTO = ?',
              [p.CANTIDAD, p.COD_PRODUCTO],
              (err) => {
                if (err) return connection.rollback(() => res.status(500).json({ mensaje: 'Error al devolver stock' }));
                devolverStock();
              }
            );
          };

          const eliminarVenta = () => {
            connection.query('DELETE FROM DETALLE_VENTA WHERE COD_VENTA = ?', [cod_venta], (err) => {
              if (err) return connection.rollback(() => res.status(500).json({ mensaje: 'Error al eliminar detalle' }));

              connection.query('DELETE FROM VENTAS WHERE COD_VENTA = ?', [cod_venta], (err) => {
                if (err) return connection.rollback(() => res.status(500).json({ mensaje: 'Error al eliminar venta' }));

                connection.commit(err => {
                  if (err) return connection.rollback(() => res.status(500).json({ mensaje: 'Error al confirmar transacción' }));
                  res.status(200).json({ mensaje: 'Venta eliminada correctamente' });
                });
              });
            });
          };

          devolverStock();
        }
      );
    });
  });
});


module.exports = router;
