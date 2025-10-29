const express = require('express');
const router = express.Router();
const productoControllers = require('../controllers/productoControllers');
router.post('/crear', productoControllers.crearProductos);
router.get('/listar', productoControllers.obtenerProductos);
module.exports = router;