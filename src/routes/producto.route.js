const express = require('express');
const router = express.Router();
const productoControllers = require('../controllers/productoControllers');
const authMiddleware = require('../middleware/auth.middleware');
/**
 * @swagger
 * tags:
 *   name: Productos
 *   description: Product management
 */

/**
 * @swagger
 * /productos/crear:
 *   post:
 *     summary: Create a new product
 *     tags: [Productos]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               nombre:
 *                 type: string
 *               precio:
 *                 type: number
 *               categoriaId:
 *                 type: integer
 *     responses:
 *       201:
 *         description: Product created
 */
router.post('/crear', productoControllers.crearProductos);

/**
 * @swagger
 * /productos/listar:
 *   get:
 *     summary: List all products
 *     tags: [Productos]
 *     security:              # <--- Agrega esto para que Swagger sepa que lleva candado
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of products
 */
router.get('/listar', authMiddleware, productoControllers.obtenerProductos);

/**
 * @swagger
 * /productos/{id}:
 *   get:
 *     summary: Get product by ID
 *     tags: [Productos]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Product details
 *       404:
 *         description: Product not found
 */
router.get('/:id', productoControllers.obtenerProductoPorId);

/**
 * @swagger
 * /productos/actualizar/{id}:
 *   put:
 *     summary: Update a product
 *     tags: [Productos]
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
 *               precio:
 *                 type: number
 *     responses:
 *       200:
 *         description: Product updated
 */
router.put('/actualizar/:id', productoControllers.actualizarProducto);

/**
 * @swagger
 * /productos/eliminar/{id}:
 *   delete:
 *     summary: Delete a product
 *     tags: [Productos]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Product deleted
 */
router.delete('/eliminar/:id', productoControllers.eliminarProducto);
module.exports = router;