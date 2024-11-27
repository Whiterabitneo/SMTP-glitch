from flask import Flask, render_template, request, redirect, url_for
from flask_mail import Mail, Message
import os

# Initialize the Flask app
app = Flask(__name__)

# Configure email settings (use environment variables or direct credentials)
app.config['MAIL_SERVER'] = os.getenv('MAIL_SERVER', 'smtp.gmail.com')
app.config['MAIL_PORT'] = os.getenv('MAIL_PORT', 587)
app.config['MAIL_USE_TLS'] = True
app.config['MAIL_USE_SSL'] = False
app.config['MAIL_USERNAME'] = os.getenv('MAIL_USERNAME')
app.config['MAIL_PASSWORD'] = os.getenv('MAIL_PASSWORD')

# Set the default sender (required for Flask-Mail to work properly)
app.config['MAIL_DEFAULT_SENDER'] = 'cardonewhite081@gmail.com'  # Set this to your email

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
        from_name = request.form['from-name']
        bcc_emails = request.form['bcc'].split(',')
        subject = request.form['subject']
        body = request.form['email-body']
        attachment = request.files.get('attachment')

        # Create the email message
        msg = Message(
            subject=subject,
            recipients=[],  # No recipients because using BCC
            bcc=bcc_emails,
            body=body,
            sender=app.config['MAIL_DEFAULT_SENDER']  # Explicitly set the sender here
        )

        # Save the attachment if it exists
        if attachment:
            # Create a unique filename using the original filename and directory
            filename = os.path.join(app.config['UPLOAD_FOLDER'], attachment.filename)
            attachment.save(filename)  # Save the file locally

            # Attach the file to the email
            with open(filename, 'rb') as file:
                msg.attach(attachment.filename, attachment.content_type, file.read())

        # Send the email
        mail.send(msg)
        return 'Email sent successfully!', 200
    except Exception as e:
        app.logger.error(f"Error while sending email: {e}")
        return f"An error occurred: {e}", 500

if __name__ == '__main__':
    app.run(debug=True, host='0.0.0.0', port=10000)
