const express = require('express');
const bodyParser = require('body-parser');
const https = require('https');
const http = require('http');

const app = express();
const PORT = process.env.PORT || 3000;
const MAILERLITE_API_KEY = process.env.MAILERLITE_API_KEY; // Retrieve MailerLite API key from environment variable

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Endpoint to handle email sending
app.post('/sendEmail', (req, res) => {
    const { senderName, senderEmail, recipientEmails, subject, message } = req.body;

    // Prepare email data
    const emailData = JSON.stringify({
        html: message,
        subject: subject,
        from: {
            name: senderName,
            email: senderEmail
        },
        to: recipientEmails.map(email => ({ email: email }))
    });

    // Configure the HTTP request options
    const options = {
        hostname: 'connect.mailerlite.com',
        path: '/api',
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Content-Length': emailData.length,
            'X-MailerLite-ApiKey': MAILERLITE_API_KEY
        }
    };

    // Choose the appropriate protocol based on the hostname
    const protocol = options.hostname.startsWith('https') ? https : http;

    // Make the HTTP request
    const request = protocol.request(options, response => {
        let responseData = '';
        response.on('data', chunk => {
            responseData += chunk;
        });
        response.on('end', () => {
            console.log('Email sent successfully:', responseData);
            res.status(200).send('Email sent successfully');
        });
    });

    request.on('error', error => {
        console.error('Error sending email:', error);
        res.status(500).send(`Failed to send email. Error: ${error.message}`);
    });

    // Send email data in the request body
    request.write(emailData);
    request.end();
});

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
