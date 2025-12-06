const puppeteer = require('puppeteer');
const hbs = require('handlebars');
const fs = require('fs-extra');
const path = require('path');
const Producto = require('../models/producto.models');
const emailService = require('../services/email.service');

const generateProductReport = async (req, res) => {
    let browser;
    try {
        console.log('Generando reporte de productos...');

        // 1. Obtener datos de la Base de Datos
        const productos = await Producto.findAll();

        // Mapear los productos al formato que espera la plantilla bill.hbs
        const mappedProducts = productos.map(p => ({
            code: p.id,
            quantity: p.stock,
            description: p.nombre,
            additional_details: 'En Stock',
            unit_Price: p.precio.toFixed(2),
            discount: '0.00',
            total: (p.precio * p.stock).toFixed(2)
        }));

        const totalValue = mappedProducts.reduce((acc, curr) => acc + parseFloat(curr.total), 0).toFixed(2);

        const data = {
            serial: `REP-${Date.now()}`,
            key: 'REPORTE-PRODUCTOS-GENERAL',
            dateAut: new Date().toLocaleString(),
            ambiente: 'PRODUCCION',
            date: new Date().toLocaleDateString(),
            ruc: 'GENERICO',
            details: {
                nombreComercial: 'REPORTE DE INVENTARIO',
                ruc: '0000000000001',
                direccion: 'Sistema Central',
                email: 'system@admin.com',
                phone1: '0000000000',
                razonSocial: 'Empresa Demo'
            },
            customer: {
                email: process.env.CONTACT_EMAIL || 'admin@admin.com'
            },
            products: mappedProducts,
            subtotal: totalValue,
            tax: (totalValue * 0.12).toFixed(2),
            totalTax: (totalValue * 1.12).toFixed(2)
        };

        // 2. Generar PDF
        const templatePath = path.join(__dirname, '../template/bill.hbs');
        const templateHtml = await fs.readFile(templatePath, 'utf-8');
        const template = hbs.compile(templateHtml);
        const html = template(data);

        browser = await puppeteer.launch({
            headless: 'new',
            args: ['--no-sandbox']
        });
        const page = await browser.newPage();
        await page.setContent(html, { waitUntil: 'networkidle0' });

        const pdfBuffer = await page.pdf({
            format: 'A4',
            printBackground: true,
            margin: { top: '20px', bottom: '20px', left: '20px', right: '20px' }
        });

        const filename = `Reporte_Productos_${Date.now()}.pdf`;

        // 3. Enviar Email
        // Obtenemos el email destinatario del query param o usamos el del .env
        const recipientEmail = req.query.email || process.env.CONTACT_EMAIL;

        if (!recipientEmail) {
            throw new Error("No hay email destinatario configurado (CONTACT_EMAIL en .env o ?email= en la URL)");
        }

        console.log(`Enviando reporte a: ${recipientEmail}`);

        const emailResult = await emailService.sendEmail({
            to: recipientEmail,
            subject: '📊 Reporte de Productos e Inventario',
            html: `
                <h1>Reporte Generado</h1>
                <p>Adjunto encontrarás el reporte de productos actual.</p>
                <ul>
                    <li><strong>Total Productos:</strong> ${productos.length}</li>
                    <li><strong>Valor Total Inventario:</strong> $${totalValue}</li>
                </ul>
            `,
            attachments: [
                {
                    filename: filename,
                    content: pdfBuffer // Resend acepta Buffer directamente
                }
            ]
        });

        res.json({
            success: true,
            message: `Reporte generado y enviado a ${recipientEmail}`,
            emailId: emailResult.id
        });

    } catch (error) {
        console.error('Error en reporte:', error);
        res.status(500).json({ error: 'Error generando reporte', details: error.message });
    } finally {
        if (browser) await browser.close();
    }
};

module.exports = { generateProductReport };
