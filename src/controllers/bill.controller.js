const puppeteer = require('puppeteer');
const hbs = require('handlebars');
const fs = require('fs-extra');
const path = require('path');

const generateBill = async (req, res) => {
    try {
        // 1. Obtener datos (del body o usar datos por defecto para prueba)
        const data = req.body.products ? req.body : getMockData();

        // 2. Leer la plantilla HTML
        const templatePath = path.join(__dirname, '../template/bill.hbs');
        const templateHtml = await fs.readFile(templatePath, 'utf-8');

        // 3. Compilar plantilla con Handlebars
        const template = hbs.compile(templateHtml);
        const html = template(data);

        // 4. Iniciar Puppeteer
        const browser = await puppeteer.launch({
            headless: 'new',
            args: ['--no-sandbox']
        });
        const page = await browser.newPage();

        // 5. Configurar contenido de la página
        await page.setContent(html, { waitUntil: 'networkidle0' });

        // 6. Generar PDF
        const pdfBuffer = await page.pdf({
            format: 'A4',
            printBackground: true,
            margin: {
                top: '20px',
                bottom: '20px',
                left: '20px',
                right: '20px'
            }
        });

        await browser.close();

        // 7. Guardar en carpeta Documentospdf
        const pdfDir = path.join(__dirname, '../../Documentospdf');
        await fs.ensureDir(pdfDir); // Crea la carpeta si no existe

        const filename = `factura-${data.serial || 'default'}-${Date.now()}.pdf`;
        const filePath = path.join(pdfDir, filename);

        await fs.writeFile(filePath, pdfBuffer);
        console.log(`PDF guardado en: ${filePath}`);

        // 8. Enviar respuesta como PDF
        res.set({
            'Content-Type': 'application/pdf',
            'Content-Length': pdfBuffer.length,
            'Content-Disposition': `attachment; filename="${filename}"`
        });

        res.send(pdfBuffer);

    } catch (error) {
        console.error('Error generando PDF:', error);
        res.status(500).json({ error: 'Error al generar la factura PDF', details: error.message });
    }
};

// Datos por defecto para probar si no se envían datos
function getMockData() {
    return {
        serial: '001-001-123456789',
        key: '1234567890123456789012345678901234567890123456789',
        dateAut: new Date().toLocaleString(),
        ambiente: 'PRUEBAS',
        date: new Date().toLocaleDateString(),
        ruc: '0102030405001',
        details: {
            nombreComercial: 'MI TIENDA',
            ruc: '1799999999001',
            direccion: 'Calle Principal 123',
            email: 'info@mitienda.com',
            phone1: '0999999999',
            razonSocial: 'Cliente Ejemplo S.A.'
        },
        customer: {
            email: 'cliente@email.com'
        },
        products: [
            {
                code: 'P001',
                quantity: 2,
                description: 'Producto de prueba 1',
                additional_details: 'N/A',
                unit_Price: '10.00',
                discount: '0.00',
                total: '20.00'
            },
            {
                code: 'P002',
                quantity: 1,
                description: 'Producto de prueba 2',
                additional_details: 'Color Rojo',
                unit_Price: '15.00',
                discount: '5.00',
                total: '10.00'
            }
        ],
        subtotal: '30.00',
        tax: '3.60',
        totalTax: '33.60'
    };
}

module.exports = { generateBill };
