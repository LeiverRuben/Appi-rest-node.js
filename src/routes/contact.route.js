const express = require('express');
const router = express.Router();
const contactController = require('../controllers/contact.controller');

/**
 * @swagger
 * tags:
 *   name: Contacto
 *   description: Endpoints para formulario de contacto
 */

/**
 * @swagger
 * /contact:
 *   post:
 *     summary: Enviar mensaje de contacto
 *     tags: [Contacto]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *               - email
 *               - message
 *             properties:
 *               name:
 *                 type: string
 *                 description: Nombre del remitente
 *               email:
 *                 type: string
 *                 format: email
 *                 description: Correo electrónico del remitente
 *               message:
 *                 type: string
 *                 description: Contenido del mensaje
 *     responses:
 *       200:
 *         description: Mensaje enviado correctamente
 *       400:
 *         description: Datos inválidos o faltantes
 *       500:
 *         description: Error interno del servidor
 */
router.post('/', contactController.sendMessage);

module.exports = router;
