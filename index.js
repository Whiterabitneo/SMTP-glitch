const express = require('express');
const axios = require('axios');
const bodyParser = require('body-parser');
const path = require('path');
require('dotenv').config();

const app = express();
const port = process.env.PORT || 3000;

// Serve static files (like index.html) from the 'public' directory
app.use(express.static(path.join(__dirname, 'public')));

// Middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// MailerLite API credentials
const API_KEY = process.env.MAILERLITE_API_KEY;
const API_URL = 'https://connect.mailerlite.com/api/v2'; // Updated API URL

// Route to send email
app.post('/send-email', async (req, res) => {
    const { fromName, fromEmail, recipients, subject, content } = req.body;

    try {
        // Prepare email data
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

        // Send email using MailerLite API
        const response = await axios.post(`${API_URL}/campaigns`, emailData, {
            headers: {
                'Content-Type': 'application/json',
                'X-MailerLite-ApiKey': API_KEY
            }
        });

        res.status(200).json({ message: 'Email sent successfully!' });
    } catch (error) {
        console.error('Error sending email:', error);
        res.status(500).json({ error: 'Failed to send email.' });
    }
});

// Start server
app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});
