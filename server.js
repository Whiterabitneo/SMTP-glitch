const express = require('express');
const bodyParser = require('body-parser');
const axios = require('axios');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Endpoint to handle email sending
app.post('/sendEmail', (req, res) => {
    const { senderName, senderEmail, recipientEmails, subject, message } = req.body;

    // Example using Axios to send email via MailerSend API
    axios.post('https://api.mailersend.com/v1/email', {
        recipients: recipientEmails.map(email => ({ email: email })),
        subject: subject,
        from: {
            name: senderName,
            email: senderEmail
        },
        html: message
    }, {
        headers: {
            'Content-Type': 'application/json',
            'Authorization': Bearer mlsn.733b5957649ba4f32a8500439a1c7cb41c47d9fb3c0a09f7ca9575c184639a8e // Replace with your MailerSend API key
        }
    })
    .then(response => {
        console.log('Email sent successfully:', response.data);
        res.status(200).send('Email sent successfully');
    })
    .catch(error => {
        console.error('Error sending email:', error.message); // Log the detailed error message
        res.status(500).send(Failed to send email. Error: ${error.message});
    });
});

app.listen(PORT, () => {
    console.log(Server is running on http://localhost:${PORT});
});
