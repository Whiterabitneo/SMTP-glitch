document.getElementById('emailForm').addEventListener('submit', function(event) {
    event.preventDefault(); // Prevent default form submission

    // Show loading message
    document.getElementById('loadingMessage').style.display = 'block';

    // Collect form data
    const senderName = document.getElementById('senderName').value;
    const senderEmail = document.getElementById('senderEmail').value;
    const recipientEmails = document.getElementById('recipientEmails').value.split(',').map(email => email.trim());
    const subject = document.getElementById('subject').value;
    const message = document.getElementById('message').value;

    // Send data to server-side endpoint
    axios.post('/sendEmail', {
        senderName: senderName,
        senderEmail: senderEmail,
        recipientEmails: recipientEmails,
        subject: subject,
        message: message
    })
    .then(response => {
        console.log('Email sent successfully:', response.data);
        showSuccessMessage(); // Show success message
    })
    .catch(error => {
        console.error('Error sending email:', error);
        showErrorMessage(error); // Show error message with error details
    })
    .finally(() => {
        document.getElementById('loadingMessage').style.display = 'none'; // Hide loading message
    });
});

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
