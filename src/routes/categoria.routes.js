const categoria = require('../models/categoria.models');
const express = require('express');
const router = express.Router();
const categoriaControllers = require('../controllers/categoriaControllers');
router.post('/crear', categoriaControllers.crearCategoria);
router.get('/listar', categoriaControllers.obtenerCategorias);
module.exports = router;