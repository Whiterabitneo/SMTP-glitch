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

    // Example using Axios to send email via SendPulse API
    axios.post('https://api.sendpulse.com/smtp/emails', {
        html: message,
        text: message, // optional: if you want to send text version of the email
        subject: subject,
        from: {
            name: senderName,
            email: senderEmail
        },
        to: recipientEmails.map(email => ({ email: email }))
    }, {
        headers: {
            'Content-Type': 'application/json',
            'Authorization': 'Bearer e28d8b979c3ab137d51ecde50ad91d95' // Replace with your SendPulse API key
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
