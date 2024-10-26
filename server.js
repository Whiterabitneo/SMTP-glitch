// public/script.js

document.getElementById('emailForm').addEventListener('submit', async function(event) {
    event.preventDefault(); // Prevent form submission

    const senderName = document.getElementById('senderName').value;
    const senderEmail = document.getElementById('senderEmail').value;
    const recipientEmails = document.getElementById('recipientEmails').value.split(',').map(email => email.trim());
    const subject = document.getElementById('subject').value;
    const message = document.getElementById('message').value;

    // Segnivo API endpoint
    const apiUrl = 'https://api.getresponse.com/v3/send-email'; // Replace with your GetResponse API endpoint

    // GetResponse API key
    const apiKey = '<Your GetResponse API Key>'; // Replace with your actual GetResponse API key

    // Construct email data object
    const emailData = {
        subject: subject,
        from_name: senderName,
        from_email: senderEmail,
        to: recipientEmails,
        body: message
        // Add more fields as needed based on GetResponse API documentation
    };

    // Display loading message
    showLoadingMessage();

    try {
        // Send POST request using Axios
        const response = await axios.post(apiUrl, emailData, {
            headers: {
                'Content-Type': 'application/json',
                'X-API-KEY': apiKey
            }
        });

        console.log('Email sent successfully:', response.data);
        showSuccessMessage(); // Show success message
    } catch (error) {
        console.error('Error sending email:', error);
        showErrorMessage(error); // Show error message with error details
    }
});

// Function to show loading message
function showLoadingMessage() {
    const loadingMessage = document.getElementById('loadingMessage');
    loadingMessage.textContent = 'Sending email...';
    loadingMessage.style.display = 'block';
}

// Function to show success message
function showSuccessMessage() {
    const loadingMessage = document.getElementById('loadingMessage');
    loadingMessage.textContent = 'Email sent successfully!';
    setTimeout(() => {
        loadingMessage.style.display = 'none';
    }, 3000); // Hide message after 3 seconds
}

// Function to show error message
function showErrorMessage(error) {
    const loadingMessage = document.getElementById('loadingMessage');
    loadingMessage.textContent = `Failed to send email. Error: ${error.message}`;
    setTimeout(() => {
        loadingMessage.style.display = 'none';
    }, 5000); // Hide message after 5 seconds
}