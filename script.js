document.getElementById('emailForm').addEventListener('submit', function(event) {
    event.preventDefault(); // Prevent default form submission

    const senderName = document.getElementById('senderName').value;
    const senderEmail = document.getElementById('senderEmail').value;
    const recipientEmails = document.getElementById('recipientEmails').value.split(',').map(email => email.trim());
    const subject = document.getElementById('subject').value;
    const message = document.getElementById('message').value;

    // Send data to server-side endpoint
    axios.post('https://connect.mailerlite.com/api', {
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
            'Accept': 'application/json'
        }
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
    document.getElementById('loadingMessage').style.display = 'none';
    document.getElementById('successPopup').style.display = 'block';
}

// Function to show error message
function showErrorMessage(error) {
    document.getElementById('loadingMessage').style.display = 'none';
    document.getElementById('errorPopup').style.display = 'block';
    document.getElementById('errorMessage').textContent = `Failed to send email. Error: ${error.message}`;
}
