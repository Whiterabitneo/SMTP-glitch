// Importing modules with `import`
import express from 'express';
import bodyParser from 'body-parser';
import fetch from 'node-fetch'; // Import fetch for making HTTP requests

const app = express();
app.use(bodyParser.json());

// Handle incoming request, assuming you use Express or another framework
function handleEmailRequest(req, res) {
    console.log('Received POST request to /send'); // Log when request is received

    // Extract data from request body (assuming it's sent as JSON)
    const { from_email, reply_to, recipients, content } = req.body;

    // Construct the request to Segnivo API
    const raw = {
        subject: 'Relay Transactional Email',
        from_name: 'Jane Doe', // Example, adjust as needed
        from_email,
        content_type: 'html',
        reply_to,
        recipients: [recipients],
        content,
        sign_dkim: true,
        track_open: true,
        track_click: true,
        is_transactional: false,
        custom_headers: {
            'x-custom-header': 'demo-header'
        },
        delivery_at: 1720311502, // Example, adjust as needed
        attachments: [
            'https://media.macphun.com/img/uploads/customer/how-to/608/15542038745ca344e267fb80.28757312.jpg',
            'https://img.freepik.com/free-photo/abstract-autumn-beauty-multi-colored-leaf-vein-pattern-generated-by-ai_188544-9871.jpg'
        ],
        preheader: 'Awesome Email'
    };

    const requestOptions = {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json',
            'X-API-KEY': '6938f850cdfe8d41bc954f819643afd2c52edacb'
        },
        body: JSON.stringify(raw)
    };

    // Make request to Segnivo API using fetch
    fetch('https://api.segnivo.com/v1/relay/send', requestOptions)
        .then(response => {
            console.log('Received response from Segnivo API:', response.status); // Log response status
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
