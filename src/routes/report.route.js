const express = require('express');
const router = express.Router();
const reportController = require('../controllers/report.controller');

/**
 * @swagger
 * tags:
 *   name: Reportes
 *   description: Generación y envío de reportes
 */

/**
 * @swagger
 * /reports/products/email:
 *   get:
 *     summary: Generar y enviar reporte de productos por email
 *     tags: [Reportes]
 *     parameters:
 *       - in: query
 *         name: email
 *         schema:
 *           type: string
 *         description: Email destinatario (opcional, usa CONTACT_EMAIL del .env por defecto)
 *     responses:
 *       200:
 *         description: Reporte enviado correctamente
 *       500:
 *         description: Error al generar o enviar
 */
router.get('/products/email', reportController.generateProductReport);

module.exports = router;
