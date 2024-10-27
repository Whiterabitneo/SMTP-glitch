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

    // Example using Axios to send email via MailerLite API
    axios.post('https://api.mailerlite.com/api/v2/send', {
        groupId: YOUR_GROUP_ID_HERE, // Replace with your MailerLite group ID
        subject: subject,
        from: senderEmail,
        body: message,
        recipients: recipientEmails.join(','),
    }, {
        headers: {
            'Content-Type': 'application/json',
            'X-MailerLite-ApiKey': 'YOUR_API_KEY_HERE' // Replace with your MailerLite API key
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
