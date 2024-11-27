import os
from flask import Flask, request, render_template, redirect, url_for
from flask_mail import Mail, Message
from werkzeug.utils import secure_filename

app = Flask(__name__)

# Setup the mail configuration (make sure your SMTP credentials are correct)
app.config['MAIL_SERVER'] = 'smtp.gmail.com'
app.config['MAIL_PORT'] = 465
app.config['MAIL_USERNAME'] = os.getenv('SMTP_USER')  # Your Gmail address
app.config['MAIL_PASSWORD'] = os.getenv('SMTP_PASS')  # Your Gmail password or app-specific password
app.config['MAIL_USE_TLS'] = False
app.config['MAIL_USE_SSL'] = True
app.config['MAIL_DEFAULT_SENDER'] = os.getenv('SMTP_USER')  # Default sender email address

mail = Mail(app)

@app.route('/')
def index():
    return render_template('index.html')

@app.route('/send_email', methods=['POST'])
def send_email():
    from_name = request.form['from-name']
    bcc = request.form['bcc'].split(',')  # Get the list of emails from the BCC field
    subject = request.form['subject']
    body = request.form['email-body']  # The body from Quill (HTML content)

    # Handling the attachment (image)
    attachment = request.files.get('attachment')
    if attachment:
        filename = secure_filename(attachment.filename)
        attachment.save(os.path.join('uploads', filename))

    # Create the email message
    msg = Message(subject=subject, recipients=[], bcc=bcc, sender=f'{from_name} <{os.getenv("SMTP_USER")}>', html=body)

    # Attach the image if there is one
    if attachment:
        with app.open_resource(os.path.join('uploads', filename)) as img:
            msg.attach(filename, 'image/jpeg', img.read())

    # Send the email
    try:
        mail.send(msg)
        return 'Email sent successfully!', 200
    except Exception as e:
        return f"An error occurred: {e}", 500

if __name__ == "__main__":
    app.run(host='0.0.0.0', port=int(os.environ.get('PORT', 5000)))
