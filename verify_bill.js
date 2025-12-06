const fs = require('fs');
const path = require('path');

async function testBillGeneration() {
    console.log('Testing Bill PDF Generation...');
    try {
        const response = await fetch('http://localhost:3000/api/bills', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({}) // Enviar vacío para usar datos mock
        });

        if (response.status === 200) {
            const buffer = await response.arrayBuffer();
            const pdfPath = path.join(__dirname, 'test_invoice.pdf');
            fs.writeFileSync(pdfPath, Buffer.from(buffer));
            console.log(`✅ PDF downloaded successfully: ${pdfPath}`);
            console.log(`ℹ️  Check the 'Documentospdf' folder in the project for the server-side copy.`);
            console.log(`Size: ${buffer.byteLength} bytes`);
        } else {
            console.log('❌ Failed to generate PDF');
            const text = await response.text();
            console.log('Status:', response.status);
            console.log('Response:', text);
        }
    } catch (error) {
        console.error('❌ Error connecting to server:', error.message);
    }
}

testBillGeneration();
