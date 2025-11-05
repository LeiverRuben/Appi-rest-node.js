const express = require('express');
const router = express.Router();
const categoriaControllers = require('../controllers/categoria.controller');
router.post('/crear', categoriaControllers.crearCategoria);
router.get('/listar', categoriaControllers.obtenerCategorias);
router.get('/:id', categoriaControllers.obtenerCategoriaPorId);
router.put('/actualizar/:id', categoriaControllers.actualizarCategoria);
router.delete('/eliminar/:id', categoriaControllers.eliminarCategoria);
module.exports = router;