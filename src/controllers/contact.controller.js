const sendMessage = async (req, res) => {
    try {
        const { name, email, message } = req.body;

        // Validación básica
        if (!name || !email || !message) {
            return res.status(400).json({ error: 'Todos los campos son requeridos' });
        }

        // Validar formato de email
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            return res.status(400).json({ error: 'Formato de email inválido' });
        }

        // Aquí puedes agregar múltiples métodos de notificación
        const notificationMethods = [];

        // 1. Webhook a Discord/Slack (más confiable)
        if (process.env.DISCORD_WEBHOOK_URL || process.env.SLACK_WEBHOOK_URL) {
            notificationMethods.push(sendWebhookNotification(name, email, message));
        }

        // 2. Email usando un servicio como Resend, SendGrid, etc.
        if (process.env.RESEND_API_KEY) {
            notificationMethods.push(sendEmailNotification(name, email, message));
        }

        // 3. Telegram Bot (opcional)
        if (process.env.TELEGRAM_BOT_TOKEN && process.env.TELEGRAM_CHAT_ID) {
            notificationMethods.push(sendTelegramNotification(name, email, message));
        }

        // Si no hay métodos de notificación configurados, solo hacer log
        if (notificationMethods.length === 0) {
            console.log('⚠️  No hay métodos de notificación configurados. Configurar webhook en .env');
            console.log('📩 Nuevo mensaje de contacto:', {
                name,
                email,
                message,
                timestamp: new Date().toISOString()
            });
        } else {
            const notificationResults = await Promise.allSettled(notificationMethods);

            // Log para debugging
            console.log('📩 Formulario de contacto enviado:', {
                name,
                email,
                message,
                timestamp: new Date().toISOString(),
                notificationResults: notificationResults.map(result => ({
                    status: result.status,
                    value: result.status === 'fulfilled' ? 'success' : result.reason?.message || 'error'
                }))
            });
        }

        return res.status(200).json({
            success: true,
            message: 'Mensaje enviado correctamente. Te contactaremos pronto.'
        });

    } catch (error) {
        console.error('Error en contacto API:', error);
        return res.status(500).json({ error: 'Error interno del servidor' });
    }
};

// Función para enviar notificación via Webhook (Discord/Slack)
async function sendWebhookNotification(name, email, message) {
    const WEBHOOK_URL = process.env.DISCORD_WEBHOOK_URL || process.env.SLACK_WEBHOOK_URL;

    if (!WEBHOOK_URL) {
        throw new Error('No webhook URL configured');
    }

    const payload = {
        content: '🔔 **Nuevo mensaje de contacto**',
        embeds: [{
            title: '📩 Nuevo Lead',
            color: 0x10B981, // Verde
            fields: [
                {
                    name: '👤 Nombre',
                    value: name,
                    inline: true
                },
                {
                    name: '📧 Email',
                    value: email,
                    inline: true
                },
                {
                    name: '💬 Mensaje',
                    value: message.length > 1000 ? message.substring(0, 1000) + '...' : message,
                    inline: false
                },
                {
                    name: '🕐 Fecha',
                    value: new Date().toLocaleString('es-ES'),
                    inline: true
                }
            ],
            footer: {
                text: 'Contact Form'
            }
        }]
    };

    const response = await fetch(WEBHOOK_URL, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload)
    });

    if (!response.ok) {
        throw new Error(`Webhook failed: ${response.status}`);
    }

    return 'Webhook notification sent';
}

// Función para enviar email (usando Resend como ejemplo)
async function sendEmailNotification(name, email, message) {
    const RESEND_API_KEY = process.env.RESEND_API_KEY;

    if (!RESEND_API_KEY) {
        throw new Error('No email API key configured');
    }

    const emailPayload = {
        from: process.env.FROM_EMAIL || 'Contact <onboarding@resend.dev>',
        to: [process.env.CONTACT_EMAIL],
        subject: `Nuevo mensaje de ${name}`,
        html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #10B981;">🔔 Nuevo mensaje de contacto</h2>
        <div style="background: #f8f9fa; padding: 20px; border-radius: 8px; margin: 20px 0;">
          <p><strong>Nombre:</strong> ${name}</p>
          <p><strong>Email:</strong> ${email}</p>
          <p><strong>Mensaje:</strong></p>
          <p style="background: white; padding: 15px; border-radius: 5px; border-left: 4px solid #10B981;">
            ${message.replace(/\n/g, '<br>')}
          </p>
          <p><strong>Fecha:</strong> ${new Date().toLocaleString('es-ES')}</p>
        </div>
      </div>
    `
    };

    const response = await fetch('https://api.resend.com/emails', {
        method: 'POST',
        headers: {
            'Authorization': `Bearer ${RESEND_API_KEY}`,
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(emailPayload)
    });

    if (!response.ok) {
        const errorData = await response.text();
        throw new Error(`Email failed: ${response.status} - ${errorData}`);
    }

    return 'Email notification sent';
}

// Función para enviar notificación a Telegram
async function sendTelegramNotification(name, email, message) {
    const BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN;
    const CHAT_ID = process.env.TELEGRAM_CHAT_ID;

    if (!BOT_TOKEN || !CHAT_ID) {
        throw new Error('Telegram credentials not configured');
    }

    const telegramMessage = `
🔔 *Nuevo mensaje de contacto*

👤 *Nombre:* ${name}
📧 *Email:* ${email}
💬 *Mensaje:*
${message}

🕐 *Fecha:* ${new Date().toLocaleString('es-ES')}
`;

    const response = await fetch(`https://api.telegram.org/bot${BOT_TOKEN}/sendMessage`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            chat_id: CHAT_ID,
            text: telegramMessage,
            parse_mode: 'Markdown'
        })
    });

    if (!response.ok) {
        throw new Error(`Telegram failed: ${response.status}`);
    }

    return 'Telegram notification sent';
}

module.exports = {
    sendMessage
};
