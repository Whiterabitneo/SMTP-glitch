import express from 'express';
import bodyParser from 'body-parser';
import fetch from 'node-fetch';
import dotenv from 'dotenv';
import path from 'path';

dotenv.config();

const app = express();
app.use(bodyParser.json());

// Serve static files from the 'public' directory
const __dirname = path.dirname(new URL(import.meta.url).pathname);
app.use(express.static(path.join(__dirname, 'public')));

function handleEmailRequest(req, res) {
    console.log('Received POST request to /send');

    const { from_email, reply_to, recipients, content } = req.body;

    const raw = {
        apiKey: process.env.SYSTEMEIO_API_KEY,
        email: recipients,
        fromName: 'Jane Doe',
        fromEmail: from_email,
        subject: 'Relay Transactional Email',
        htmlContent: content,
        replyTo: reply_to
    };

    const requestOptions = {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(raw)
    };

    fetch('https://api.systeme.io/emails/send', requestOptions)
        .then(response => response.json())
        .then(result => {
            console.log('Email sent successfully:', result);
            res.status(200).json(result);
        })
        .catch(error => {
            console.error('Error sending email:', error);
            res.status(500).json({ error: 'Failed to send email' });
        });
}

app.post('/send', handleEmailRequest);

app.get('/', (req, res) => {
    res.send('Welcome to the Systeme.io Email Sender API');
});

app.use((req, res) => {
    console.log(`Received request for ${req.url} but no matching route found.`);
    res.status(404).json({ error: 'Not found' });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
