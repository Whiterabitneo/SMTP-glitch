// Importing modules with `import`
import express from 'express';
import bodyParser from 'body-parser';
import fetch from 'node-fetch'; // Import fetch for making HTTP requests
import dotenv from 'dotenv'; // Import dotenv to load environment variables
import path from 'path';

dotenv.config(); // Load environment variables from .env file

const app = express();
app.use(bodyParser.json());

// Serve static files from the 'public' directory (for index.html and related files)
const __dirname = path.dirname(new URL(import.meta.url).pathname);
app.use(express.static(path.join(__dirname, 'public')));

// Handle incoming request, assuming you use Express or another framework
function handleEmailRequest(req, res) {
    console.log('Received POST request to /send'); // Log when request is received

    // Extract data from request body (assuming it's sent as JSON)
    const { from_email, reply_to, recipients, content } = req.body;

    // Construct the request to Systeme.io API
    const raw = {
        apiKey: process.env.SYSTEMEIO_API_KEY, // Use Systeme.io API key from environment variable
        email: recipients,
        fromName: 'Jane Doe', // Example, adjust as needed
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

    // Make request to Systeme.io API using fetch
    fetch('https://api.systeme.io/emails/send', requestOptions)
        .then(response => {
            console.log('Received response from Systeme.io API:', response.status); // Log response status
            
            // Check if response is successful (status 200-299)
            if (!response.ok) {
                throw new Error('Failed to send email: ' + response.statusText);
            }

            return response.json();
        })
        .then(result => {
            console.log('Email sent successfully:', result);
            res.status(200).json(result); // Send success response to client
        })
        .catch(error => {
            console.error('Error sending email:', error);
            res.status(500).json({ error: 'Failed to send email' }); // Send error response to client
        });
}
