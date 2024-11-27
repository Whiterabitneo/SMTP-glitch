import os
from flask import Flask, render_template, request
from flask_mail import Mail, Message
import re

app = Flask(__name__)

# Configure email settings (use environment variables or direct credentials)
app.config['MAIL_SERVER'] = 'smtp.gmail.com'  
app.config['MAIL_PORT'] = 587  
app.config['MAIL_USE_TLS'] = True  
app.config['MAIL_USE_SSL'] = False  

# Use environment variables to keep sensitive credentials secure
app.config['MAIL_USERNAME'] = os.getenv('MAIL_USERNAME', 'paulmotil235@gmail.com')  
app.config['MAIL_PASSWORD'] = os.getenv('MAIL_PASSWORD', 'pvsrvdvheqeeedid')  

app.config['MAIL_DEFAULT_SENDER'] = os.getenv('MAIL_DEFAULT_SENDER', 'paulmotil235@gmail.com')  

# Initialize Flask-Mail
mail = Mail(app)

@app.route('/')
def index():
    return render_template('index.html')

def strip_html_tags(html):
    """Remove HTML tags and return plain text."""
    clean = re.compile('<.*?>')
    return re.sub(clean, '', html)

@app.route('/send_email', methods=['POST'])
def send_email():
    try:
        from_name = request.form['from-name']
        bcc_emails = request.form['bcc'].split(',')  
        subject = request.form['subject']
        body = request.form['email-body']  
        reply_to = request.form.get('reply-to')  # Retrieve the 'reply-to' email

        # Get the plain text version of the email body
        plain_text_body = strip_html_tags(body)

        if not plain_text_body.strip():
            return 'Email body cannot be empty.', 400

        # Create the email message with both HTML and plain text content
        msg = Message(
            subject=subject,
            recipients=[],  
            bcc=bcc_emails,
            body=plain_text_body,  # Plain text content
            html=body,  # HTML content
            sender=app.config['MAIL_DEFAULT_SENDER'],  
            reply_to=reply_to  # Set the 'Reply-to' email
        )

        # Handle file attachments (if any)
        if 'attachment' in request.files:
            attachment = request.files['attachment']
            if attachment:
                msg.attach(attachment.filename, attachment.content_type, attachment.read())

        # Send the email
        mail.send(msg)
        return 'Email sent successfully!', 200

    except Exception as e:
        app.logger.error(f"Error while sending email: {e}")
        return f"An error occurred: {e}", 500

if __name__ == '__main__':
    app.run(debug=True, host='0.0.0.0', port=10000)
