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
    axios.post('https://api.mailerlite.com/api/v2/email', {
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
            'X-MailerLite-ApiKey': 'eyJ0eXAiOiJKV1QiLCJhbGciOiJSUzI1NiJ9.eyJhdWQiOiI0IiwianRpIjoiMGNmOTAzMmIyZTk0ZmMwNGIwMjY3N2QxZDY3NDc3ZTU5Y2M2Mjg4OTFiYzM0ZWE1ZTkyNzM4YTgyMGQ5ZjliNGMyNzEwMGIyOThmYWFjZmYiLCJpYXQiOjE3MzAwMzM1NTEuMzk5NzQzLCJuYmYiOjE3MzAwMzM1NTEuMzk5NzQ1LCJleHAiOjQ4ODU3MDcxNTEuMzk3MjA3LCJzdWIiOiIxMTczODI2Iiwic2NvcGVzIjpbXX0.NkTmtvy4cO9UgUU3V0S6AYvLpyoXN3xOKIHJCe4gciZY_uI1Ttq-1IFkJJftu1-k560c9asxJYlfqTlqQJ3p6CW9ntadisBPPSJJ1-IgStrUq2znkCtctpARQ2lHA3sT1v9pMcz764tdsabJUi6yvGOzSUhPV44h6kNmthz5tAmnjbamLC1qDmmH7c2OBjRv-Naq8uh0SUkoNYq_jPv-KCPgNrSs22YyPyfsWrsyS2mJvf03hBqTGPiBOR8N3CVP325Y6o7y7mIFjm_Y2ZWwEidj5wgnNAz8WVGpOIwk-VCgRy9TvhMzKWbv4LEMZlAJ6t-ACGWPbYd7O_XEqURuAuZ9gvYAVkKXUwLqiYDj2R2Q6bdv3iA7_SKTTv7az3d6ZYzLItbopDIOWs9iPcqbQhKsV5PtiQyfVRnV69rasAa4QPqo3Jv3J1shtGXgD0aFYX6rO2qQj933buvE5ERrJZKaiElGEJXFyWT1a9dmRT5AEyrP7ibmJKd4-C-8p0KNY7carrG1eTH77LlmwoaDRYK7WkYg21pzPQu5dbaoOJo5r-hBpOJj92Dq97rtpP3Nh_RtFW-eGi6Y82pRYSOKTMqm5b9u2YnmyDeaxBTjDnXmI_lQDE-7sGwR2mBjG7QXfioFwMw_O-qOCoT9jwclEE2lJjNSBV5voWijvmFoPng' // Replace with your MailerLite API key
        }
    })
    .then(response => {
        console.log('Email sent successfully:', response.data);
        res.status(200).send('Email sent successfully');
    })
    .catch(error => {
    console.error('Error sending email:', error.message); // Log the detailed error message
    res.status(500).send('Failed to send email. Error: ${error.message}');
});
});

app.listen(PORT, () => {
    console.log('Server is running on http://localhost:${PORT}');
});
