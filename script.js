document.getElementById('emailForm').addEventListener('submit', async function(event) {
    event.preventDefault(); // Prevent form submission

    const senderName = document.getElementById('senderName').value;
    const senderEmail = document.getElementById('senderEmail').value;
    const recipientEmails = document.getElementById('recipientEmails').value.split(',').map(email => email.trim());
    const subject = document.getElementById('subject').value;
    const message = document.getElementById('message').value;

    // GetResponse API endpoint
    const apiUrl = 'https://api.getresponse.com/v3/email-campaigns/{campaignId}/send-newsletter'; // Replace {campaignId} with your campaign ID
    
    // GetResponse API key
    const apiKey = 'your_api_key'; // Replace with your actual GetResponse API key

    // Construct email data object
    const emailData = {
        messageId: 'your_message_id', // Replace with your message ID
        recipients: {
            listIds: [
                'your_list_id' // Replace with your recipient list ID
            ]
        },
        fromField: 'your_from_field_id', // Replace with your sender email ID
        subject: subject,
        contents: [
            {
                type: 'html',
                body: `<p>${message}</p>`
            }
        ]
    };

    // Display loading message
    showLoadingMessage();

    try {
        // Send POST request using Axios
        const response = await axios.post(apiUrl, emailData, {
            headers: {
                'Content-Type': 'application/json',
                'X-Auth-Token': `api-key ${apiKey}`
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
    loadingMessage.style.display = 'block';
}

// Function to hide loading message and show success message
function showSuccessMessage() {
    const loadingMessage = document.getElementById('loadingMessage');
    loadingMessage.textContent = 'Email sent successfully!';
    setTimeout(() => {
        loadingMessage.style.display = 'none';
    }, 3000); // Hide message after 3 seconds
}

// Function to hide loading message and show error message
function showErrorMessage(error) {
    const loadingMessage = document.getElementById('loadingMessage');
    loadingMessage.textContent = `Failed to send email. Error: ${error.message}`;
    setTimeout(() => {
        loadingMessage.style.display = 'none';
    }, 5000); // Hide message after 5 seconds
}