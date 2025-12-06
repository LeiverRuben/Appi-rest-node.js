async function testEmailReport() {
    console.log('Testing Product Report via Email...');

    // Cambia esto por tu email real para ver el resultado
    const email = 'lzamoramoyano@gmail.com';

    try {
        console.log(`Sending request to /api/reports/products/email?email=${email}`);
        const response = await fetch(`http://localhost:3000/api/reports/products/email?email=${email}`, {
            method: 'GET'
        });

        const data = await response.json();

        if (response.status === 200) {
            console.log('✅ Report sent successfully');
            console.log('Response:', data);
        } else {
            console.log('❌ Failed to send report');
            console.log('Status:', response.status);
            console.log('Error:', data);
        }
    } catch (error) {
        console.error('❌ Error connecting to server:', error.message);
    }
}

testEmailReport();
