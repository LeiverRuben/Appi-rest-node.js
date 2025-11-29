const express = require('express');
const router = express.Router();
const categoriaControllers = require('../controllers/categoria.controller');
/**
 * @swagger
 * tags:
 *   name: Categorias
 *   description: Category management
 */

/**
 * @swagger
 * /categorias/crear:
 *   post:
 *     summary: Create a new category
 *     tags: [Categorias]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               nombre:
 *                 type: string
 *     responses:
 *       201:
 *         description: Category created
 */
router.post('/crear', categoriaControllers.crearCategoria);

/**
 * @swagger
 * /categorias/listar:
 *   get:
 *     summary: List all categories
 *     tags: [Categorias]
 *     responses:
 *       200:
 *         description: List of categories
 */
router.get('/listar', categoriaControllers.obtenerCategorias);

/**
 * @swagger
 * /categorias/{id}:
 *   get:
 *     summary: Get category by ID
 *     tags: [Categorias]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Category details
 *       404:
 *         description: Category not found
 */
router.get('/:id', categoriaControllers.obtenerCategoriaPorId);

/**
 * @swagger
 * /categorias/actualizar/{id}:
 *   put:
 *     summary: Update a category
 *     tags: [Categorias]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               nombre:
 *                 type: string
 *     responses:
 *       200:
 *         description: Category updated
 */
router.put('/actualizar/:id', categoriaControllers.actualizarCategoria);

/**
 * @swagger
 * /categorias/eliminar/{id}:
 *   delete:
 *     summary: Delete a category
 *     tags: [Categorias]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Category deleted
 */
router.delete('/eliminar/:id', categoriaControllers.eliminarCategoria);
module.exports = router;