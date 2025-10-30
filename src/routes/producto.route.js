const express = require('express');
const router = express.Router();
const productoControllers = require('../controllers/productoControllers');
router.post('/crear', productoControllers.crearProductos);
router.get('/listar', productoControllers.obtenerProductos);
router.get('/:id', productoControllers.obtenerProductoPorId);
router.put('/actualizar/:id', productoControllers.actualizarProducto);
router.delete('/eliminar/:id', productoControllers.eliminarProducto);
module.exports = router;