const express = require('express');
const axios = require('axios');
const bodyParser = require('body-parser');
require('dotenv').config();

const app = express();
const port = process.env.PORT || 3000;

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

const API_KEY = process.env.MAILERLITE_API_KEY;
const API_URL = 'https://api.mailerlite.com/api/v2';

app.post('/send-email', async (req, res) => {
    const { fromName, fromEmail, recipients, subject, content } = req.body;

    try {
        const emailData = {
            subject,
            html: content,
            recipients: {
                email: recipients.split(',').map(email => ({ email }))
            },
            options: {
                unsubscribe_url: true
            }
        };

        const response = await axios.post(`${API_URL}/campaigns`, emailData, {
            headers: {
                'Content-Type': 'application/json',
                'X-MailerLite-ApiKey': API_KEY
            }
        });

        res.status(200).json({ message: 'Email sent successfully!' });
    } catch (error) {
        console.error('Error sending email:', error.response.data);
        res.status(500).json({ error: 'Failed to send email.' });
    }
});

app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});
