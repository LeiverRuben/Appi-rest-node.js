const express = require('express');
const router = express.Router();
const productoControllers = require('../controllers/productoControllers');
router.post('/productos', productoControllers.crearProductos);
router.get('/productos', productoControllers.obtenerProductos);
router.get('/productos/:id', productoControllers.obtenerProductoPorId);
module.exports = router;