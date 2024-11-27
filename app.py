from flask import Flask, render_template, request 
from flask_mail import Mail, Message
import re  # For stripping HTML tags

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

# Initialize Flask-Mail
mail = Mail(app)

@app.route('/')
def index():
    return render_template('index.html')

def strip_html_tags(html):
    """Remove HTML tags and return plain text."""
    clean = re.compile('<.*?>')  # Regex to match HTML tags
    return re.sub(clean, '', html)  # Remove tags using regex

@app.route('/send_email', methods=['POST'])
def send_email():
    try:
        # Get form data (plain text fields)
        from_name = request.form['from-name']
        bcc_emails = request.form['bcc'].split(',')  # Split comma-separated emails
        subject = request.form['subject']
        body = request.form['email-body']  # Get the email body (which could contain HTML)
        reply_to = request.form.get('reply-to')  # Get the "Reply-To" email address
        
        # Strip out any HTML tags from the email body to ensure it's plain text
        plain_text_body = strip_html_tags(body)

        # Create the email message with plain text only (no HTML part)
        msg = Message(
            subject=subject,
            recipients=[],  # No recipients because using BCC
            bcc=bcc_emails,
            body=plain_text_body,  # Plain text content (body)
            sender=app.config['MAIL_DEFAULT_SENDER'],  # Explicitly set the sender here
            reply_to=reply_to  # Set the "Reply-To" address
        )

        # Send the email
        mail.send(msg)
        return 'Email sent successfully!', 200
    except Exception as e:
        app.logger.error(f"Error while sending email: {e}")
        return f"An error occurred: {e}", 500

if __name__ == '__main__':
    app.run(debug=True, host='0.0.0.0', port=10000)  # Running on port 10000
