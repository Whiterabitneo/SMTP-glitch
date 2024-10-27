const express = require('express');
const bodyParser = require('body-parser');
const axios = require('axios');
const nodemailer = require('nodemailer');

const app = express();
const PORT = process.env.PORT || 3000;

// Body parser middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Serve static files (if any)
app.use(express.static('public'));

// Endpoint to handle email sending
app.post('/sendEmail', (req, res) => {
    const { senderName, senderEmail, recipientEmails, subject, message } = req.body;

    // Example using Axios to send email via external API (replace with your API and logic)
    axios.post('https://api.segnivo.com/v1/relay/send', {
        subject: subject,
        from_name: senderName,
        from_email: senderEmail,
        recipients: recipientEmails,
        content_type: 'html',
        content: message,
        // Add more options as needed
    }, {
        headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json',
            'X-API-KEY': 'mlsn.733b5957649ba4f32a8500439a1c7cb41c47d9fb3c0a09f7ca9575c184639a8e'
            // Replace with your actual API key or credentials
        }
    })
    .then(response => {
        console.log('Email sent successfully:', response.data);
        res.status(200).send('Email sent successfully');
    })
    .catch(error => {
        console.error('Error sending email:', error);
        res.status(500).send('Failed to send email');
    });
});

// Start server
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
