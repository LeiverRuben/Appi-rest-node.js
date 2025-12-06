// Native fetch is available in Node 18+

class EmailService {
    constructor() {
        this.apiKey = process.env.RESEND_API_KEY;
        this.fromEmail = process.env.FROM_EMAIL || 'onboarding@resend.dev';
    }

    async sendEmail({ to, subject, html, attachments = [] }) {
        if (!this.apiKey) {
            console.error('❌ RESEND_API_KEY is missing in .env');
            throw new Error('Email service not configured');
        }

        const payload = {
            from: this.fromEmail,
            to: Array.isArray(to) ? to : [to],
            subject,
            html,
            attachments
        };

        try {
            const response = await fetch('https://api.resend.com/emails', {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${this.apiKey}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(payload)
            });

            if (!response.ok) {
                const errorText = await response.text();
                throw new Error(`Resend API Error: ${response.status} - ${errorText}`);
            }

            const data = await response.json();
            return data;
        } catch (error) {
            console.error('Error sending email:', error);
            throw error;
        }
    }
}

module.exports = new EmailService();
