const express = require('express');
const bodyParser = require('body-parser');
const nodemailer = require('nodemailer');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Endpoint to handle email sending
app.post('/sendEmail', async (req, res) => {
    const { senderName, senderEmail, recipientEmails, subject, message } = req.body;

    // Create a nodemailer transporter using SMTP transport
    let transporter = nodemailer.createTransport({
        host: 'smtp.example.com',  // Replace with your SMTP host
        port: 587,                  // Replace with your SMTP port
        secure: false,              // false for TLS; true for SSL
        auth: {
            user: 'your_email@example.com', // Replace with your email address
            pass: 'your_password'            // Replace with your email password
        }
    });

    // Send mail with defined transport object
    try {
        let info = await transporter.sendMail({
            from: `${senderName} <${senderEmail}>`,
            to: recipientEmails.join(','),
            subject: subject,
            text: message
        });

        console.log('Message sent: %s', info.messageId);
        res.status(200).send('Email sent successfully');
    } catch (error) {
        console.error('Error sending email:', error);
        res.status(500).send(`Failed to send email. Error: ${error.message}`);
    }
});

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
