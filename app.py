import os
from flask import Flask, request, render_template, redirect
from flask_mail import Mail, Message
from werkzeug.utils import secure_filename
from dotenv import load_dotenv

# Load environment variables from .env file
load_dotenv()

app = Flask(__name__)

# Flask-Mail Configuration
app.config['MAIL_SERVER'] = 'smtp.gmail.com'
app.config['MAIL_PORT'] = 465  # Using SSL port
app.config['MAIL_USE_SSL'] = True
app.config['MAIL_USERNAME'] = os.getenv('SMTP_USER')  # Your email address
app.config['MAIL_PASSWORD'] = os.getenv('SMTP_PASS')  # Your email password
app.config['MAIL_DEFAULT_SENDER'] = os.getenv('SMTP_USER')  # Default sender
app.config['MAIL_MAX_EMAILS'] = None
app.config['MAIL_ASCII_ATTACHMENTS'] = False

mail = Mail(app)

# Allowed extensions for the image attachment
ALLOWED_EXTENSIONS = {'png', 'jpg', 'jpeg', 'gif'}

# Check if the uploaded file is a valid image
def allowed_file(filename):
    return '.' in filename and filename.rsplit('.', 1)[1].lower() in ALLOWED_EXTENSIONS

@app.route('/')
def index():
    return render_template('index.html')  # Render the HTML form

@app.route('/send_email', methods=['POST'])
def send_email():
    try:
        # Extract form data
        from_name = request.form['from-name']
        bcc_emails = request.form['bcc'].split(',')
        subject = request.form['subject']
        body = request.form['email-body']

        # Handle attachment (if any)
        attachment = request.files.get('attachment')
        attachment_filename = None

        if attachment and allowed_file(attachment.filename):
            attachment_filename = secure_filename(attachment.filename)
            attachment.save(os.path.join('uploads', attachment_filename))

        # Create the email message
        msg = Message(subject=subject,
                      recipients=[],  # No direct recipients, just BCC
                      bcc=bcc_emails,
                      sender=f'{from_name} <{os.getenv("SMTP_USER")}>',
                      html=body)

        # Attach the file (if there is one)
        if attachment_filename:
            with app.open_resource(os.path.join('uploads', attachment_filename)) as img:
                msg.attach(attachment_filename, attachment.content_type, img.read())

        # Send the email
        mail.send(msg)

        return redirect('/')  # Redirect back to the form (or a success page)

    except Exception as e:
        return f"An error occurred: {e}", 500

if __name__ == '__main__':
   app.run(debug=True, host='0.0.0.0', port=10000)
