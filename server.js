const express = require('express');
const bodyParser = require('body-parser');
const https = require('https');

const app = express();
const PORT = process.env.PORT || 3000;
const MAILERLITE_API_KEY = process.env.MAILERLITE_API_KEY;

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Endpoint to handle email sending
app.post('/sendEmail', (req, res) => {
    const { senderName, senderEmail, recipientEmails, subject, message } = req.body;

    // Prepare the email data
    const postData = JSON.stringify({
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
        port: 443,
        path: '/api',
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Content-Length': postData.length,
            'X-MailerLite-ApiKey': MAILERLITE_API_KEY
        }
    };

    // Send the HTTP request
    const request = https.request(options, response => {
        let data = '';

        response.on('data', chunk => {
            data += chunk;
        });

        response.on('end', () => {
            console.log('Email sent successfully:', data);
            res.status(200).send('Email sent successfully');
        });
    });

    request.on('error', error => {
        console.error('Error sending email:', error);
        res.status(500).send(`Failed to send email. Error: ${error.message}`);
    });

    request.write(postData);
    request.end();
});

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
