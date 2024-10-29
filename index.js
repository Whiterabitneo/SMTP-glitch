// Importing modules with `import`
import express from 'express';
import bodyParser from 'body-parser';
import fetch from 'node-fetch'; // Import fetch for making HTTP requests
import dotenv from 'dotenv'; // Import dotenv to load environment variables
import path from 'path'; // Import path module

dotenv.config(); // Load environment variables from .env file

const app = express();
app.use(bodyParser.json());

// Serve static files from the 'public' directory
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

// Endpoint to handle email sending
app.post('/send', handleEmailRequest);

// Route to handle requests to the root URL '/'
app.get('/', (req, res) => {
    res.send('Welcome to the Systeme.io Email Sender API'); // Example response for the root URL
});

// Handle unknown routes with a 404 response
app.use((req, res) => {
    console.log(`Received request for ${req.url} but no matching route found.`);
    res.status(404).json({ error: 'Not found' });
});

// Start the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
