const express = require('express');
const router = express.Router();
const billController = require('../controllers/bill.controller');

/**
 * @swagger
 * tags:
 *   name: Facturas
 *   description: Generación de documentos PDF
 */

/**
 * @swagger
 * /bills:
 *   post:
 *     summary: Generar factura PDF
 *     tags: [Facturas]
 *     requestBody:
 *       required: false
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             description: Datos de la factura (opcional, usa mock si vacío)
 *     responses:
 *       200:
 *         description: Archivo PDF generado
 *         content:
 *           application/pdf:
 *             schema:
 *               type: string
 *               format: binary
 *       500:
 *         description: Error en el servidor
 */
router.post('/', billController.generateBill);

module.exports = router;
