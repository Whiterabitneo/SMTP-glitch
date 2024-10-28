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

// Moosend API credentials
const API_KEY = process.env.MOOSEND_API_KEY;
const API_URL = 'https://api.moosend.com/v3';

// Route to send email
app.post('/send-email', async (req, res) => {
    const { fromName, fromEmail, recipients, subject, content } = req.body;

    try {
        // Prepare email data
        const emailData = {
            CampaignName: subject,
            FromEmail: fromEmail,
            FromName: fromName,
            ToField: recipients,
            Message: content
        };

        // Send email using Moosend API
        const response = await axios.post(`${API_URL}/campaigns/email`, emailData, {
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${API_KEY}`
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
