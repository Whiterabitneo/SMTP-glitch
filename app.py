from flask import Flask, render_template, request, redirect, url_for
from flask_mail import Mail, Message
import os
from werkzeug.utils import secure_filename

# Initialize the Flask app
app = Flask(__name__)

# Configure email settings (use environment variables or direct credentials)
app.config['MAIL_SERVER'] = 'smtp.gmail.com'  # SMTP server for Gmail
app.config['MAIL_PORT'] = 587  # Port for sending emails using TLS
app.config['MAIL_USE_TLS'] = True  # Use TLS for encryption
app.config['MAIL_USE_SSL'] = False  # Do not use SSL
app.config['MAIL_USERNAME'] = 'hewlettpackardenterprise01@gmail.com'  # Your Gmail address
app.config['MAIL_PASSWORD'] = 'fahyzamnsbcwlqjh'  # Use the generated App Password here

# Set the default sender (required for Flask-Mail to work properly)
app.config['MAIL_DEFAULT_SENDER'] = 'hewlettpackardenterprise01@gmail.com'  # Set this to your email

# Configure upload folder (create the directory dynamically)
UPLOAD_FOLDER = 'uploads/'  # Directory where files will be saved
if not os.path.exists(UPLOAD_FOLDER):  # Check if the directory exists
    os.makedirs(UPLOAD_FOLDER)  # Create the directory if it doesn't exist
app.config['UPLOAD_FOLDER'] = UPLOAD_FOLDER

# Initialize Flask-Mail
mail = Mail(app)

@app.route('/')
def index():
    return render_template('index.html')

@app.route('/send_email', methods=['POST'])
def send_email():
    try:
        # Get form data (plain text fields)
        from_name = request.form['from-name']
        bcc_emails = request.form['bcc'].split(',')
        subject = request.form['subject']
        body = request.form['email-body']  # This will be plain text

        # Create the email message with plain text only (no HTML part)
        msg = Message(
            subject=subject,
            recipients=[],  # No recipients because using BCC
            bcc=bcc_emails,
            body=body,  # Plain text content (body)
            sender=app.config['MAIL_DEFAULT_SENDER']  # Explicitly set the sender here
        )

        # Send the email
        mail.send(msg)
        return 'Email sent successfully!', 200
    except Exception as e:
        app.logger.error(f"Error while sending email: {e}")
        return f"An error occurred: {e}", 500

if __name__ == '__main__':
    app.run(debug=True, host='0.0.0.0', port=10000)  # Running on port 10000

