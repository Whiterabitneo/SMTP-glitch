const axios = require('axios');
const dotenv = require('dotenv');
const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, 'public')));

// Route for sending email
app.post('/send-email', async (req, res) => {
    const { fromName, fromEmail, recipients, subject, content } = req.body;

    const emailData = {
        CampaignName: subject,
        fromemail: fromEmail,
        fromname: fromName,
        tofield: recipients,
        Message: content
    };

    try {
        const response = await axios.post('https://api.moosend.com/v3', emailData, {
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${process.env.MOOSEND_API_KEY}`
            }
        });

        console.log('Moosend API Response:', response.data);
        res.status(200).json({ message: 'Email sent successfully!' });
    } catch (error) {
        console.error('Error sending email:', error.message);
        res.status(500).json({ error: 'Failed to send email. Please try again later.' });
    }
});

// Start server
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
