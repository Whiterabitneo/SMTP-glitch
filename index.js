const express = require('express');
const axios = require('axios');
const bodyParser = require('body-parser');
require('dotenv').config();

const app = express();
const port = process.env.PORT || 3000;

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

const API_KEY = process.env.MAILERLITE_API_KEY;
const BASE_URL = 'https://connect.mailerlite.com/api';

app.post('/send-email', async (req, res) => {
    const { fromName, fromEmail, recipients, subject, content } = req.body;

    try {
        const emailData = {
            type: 'regular',
            subject,
            html: content,
            recipients: {
                list_id: null,
                emails: recipients.split(',').map(email => ({ email }))
            }
        };

        const response = await axios.post(`${BASE_URL}/email`, emailData, {
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json',
                'X-MailerLite-ApiKey': API_KEY
            }
        });

        if (response.status === 200) {
            res.status(200).json({ message: 'Email sent successfully!' });
        } else {
            throw new Error('Failed to send email.');
        }
    } catch (error) {
        console.error('Error sending email:', error.response ? error.response.data : error.message);
        res.status(500).json({ error: 'Failed to send email.' });
    }
});

app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});
