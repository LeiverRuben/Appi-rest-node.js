// Removed require('node-fetch') to use native fetch in Node 18+

async function testContact() {
    console.log('Testing Contact API...');
    try {
        const response = await fetch('http://localhost:3000/api/contact', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                name: 'Verification Bot',
                email: 'bot@example.com',
                message: 'This is a verification message from the agent.'
            })
        });

        const data = await response.json();
        console.log('Status:', response.status);
        console.log('Response:', data);

        if (response.status === 200 && data.success) {
            console.log('✅ Verification PASSED');
        } else {
            console.log('❌ Verification FAILED');
        }
    } catch (error) {
        console.error('❌ Error connecting to server:', error.message);
    }
}

testContact();
