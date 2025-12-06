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

        // Generar tabla HTML para el correo
        const productsTableRows = mappedProducts.map(p => `
            <tr>
                <td style="padding: 8px; border-bottom: 1px solid #ddd;">${p.code}</td>
                <td style="padding: 8px; border-bottom: 1px solid #ddd;">${p.description}</td>
                <td style="padding: 8px; border-bottom: 1px solid #ddd;">${p.quantity}</td>
                <td style="padding: 8px; border-bottom: 1px solid #ddd;">$${p.unit_Price}</td>
                <td style="padding: 8px; border-bottom: 1px solid #ddd;">$${p.total}</td>
            </tr>
        `).join('');

        const emailResult = await emailService.sendEmail({
            to: recipientEmail,
            subject: '📊 Reporte de Productos e Inventario',
            html: `
                <div style="font-family: Arial, sans-serif; color: #333;">
                    <h1 style="color: #2c3e50;">Reporte Generado</h1>
                    <p>Adjunto encontrarás el reporte oficial en PDF.</p>
                    
                    <h3 style="margin-top: 20px;">Resumen Rápido:</h3>
                    <table style="width: 100%; border-collapse: collapse; margin-bottom: 20px;">
                        <thead>
                            <tr style="background-color: #f8f9fa; text-align: left;">
                                <th style="padding: 10px; border-bottom: 2px solid #dee2e6;">ID</th>
                                <th style="padding: 10px; border-bottom: 2px solid #dee2e6;">Producto</th>
                                <th style="padding: 10px; border-bottom: 2px solid #dee2e6;">Cant.</th>
                                <th style="padding: 10px; border-bottom: 2px solid #dee2e6;">P. Unit</th>
                                <th style="padding: 10px; border-bottom: 2px solid #dee2e6;">Total</th>
                            </tr>
                        </thead>
                        <tbody>
                            ${productsTableRows}
                        </tbody>
                        <tfoot>
                            <tr style="font-weight: bold; background-color: #f8f9fa;">
                                <td colspan="4" style="padding: 10px; text-align: right;">Valor Total Inventario:</td>
                                <td style="padding: 10px;">$${totalValue}</td>
                            </tr>
                        </tfoot>
                    </table>

                    <p style="font-size: 12px; color: #777;">
                        Total Productos: ${productos.length}
                    </p>
                </div>
            `,
            attachments: [
                {
                    filename: filename,
                    content: pdfBuffer
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
