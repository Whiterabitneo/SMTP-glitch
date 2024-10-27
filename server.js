const express = require('express');
const bodyParser = require('body-parser');
const axios = require('axios');

const app = express();
const PORT = process.env.PORT || 3000;
const MAILERLITE_API_KEY = process.env.MAILERLITE_API_KEY; // Retrieve API key from environment variable

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Endpoint to handle email sending
app.post('/sendEmail', (req, res) => {
    const { senderName, senderEmail, recipientEmails, subject, message } = req.body;

    // Example using Axios to send email via MailerLite API
    axios.post('https://connect.mailerlite.com/api', {
        html: message,
        subject: subject,
        from: {
            name: senderName,
            email: senderEmail
        },
        to: recipientEmails.map(email => ({ email: email }))
    }, {
        headers: {
            'Content-Type': 'application/json',
            'X-MailerLite-ApiKey': process.env.MAILERLITE_API_KEY // Use the API key from environment variable
        }
    })
    .then(response => {
        console.log('Email sent successfully:', response.data);
        res.status(200).send('Email sent successfully');
    })
    .catch(error => {
        console.error('Error sending email:', error.message); // Log the detailed error message
        res.status(500).send(`Failed to send email. Error: ${error.message}`);
    });
});

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
