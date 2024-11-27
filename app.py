from flask import Flask, render_template, request, redirect, url_for
from flask_mail import Mail, Message
import os
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

app = Flask(__name__)

# Setup the Flask-Mail extension
app.config['MAIL_SERVER'] = 'smtp.gmail.com'
app.config['MAIL_PORT'] = 587
app.config['MAIL_USE_TLS'] = True
app.config['MAIL_USERNAME'] = os.getenv('SMTP_USER')  # Your Gmail address
app.config['MAIL_PASSWORD'] = os.getenv('SMTP_PASSWORD')  # Your Gmail app password
app.config['MAIL_DEFAULT_SENDER'] = os.getenv('SMTP_USER')  # Default sender email

mail = Mail(app)

@app.route('/')
def index():
    return render_template('index.html')  # Render the email form

@app.route('/send-email', methods=['POST'])
def send_email():
    recipient = request.form['email-recipient']
    subject = request.form['email-subject']
    body = request.form['email-body']  # The body is the HTML content from Quill

    # Create a Message object
    msg = Message(subject=subject,
                  recipients=[recipient],
                  html=body)  # Set the body as HTML content

    # Send the email
    try:
        mail.send(msg)
        return f'Email successfully sent to {recipient}'
    except Exception as e:
        return f'Error sending email: {str(e)}'

if __name__ == "__main__":
    app.run(host='0.0.0.0', port=int(os.environ.get('PORT', 5000)))
