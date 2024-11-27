from flask import Flask, render_template, request, redirect, url_for
import os
from dotenv import load_dotenv
import smtplib
from email.mime.multipart import MIMEMultipart
from email.mime.text import MIMEText
from email.mime.base import MIMEBase
from email import encoders

# Load environment variables from .env file
load_dotenv()

app = Flask(__name__)

# Send email function
def send_email(to_email, subject, body, attachments):
    # SMTP Server configuration
    sender_email = "cardonewhite081@gmail.com"  # Sender email (fixed)
    sender_name = "Your Name"  # Sender's name, can modify as needed
    reply_to_email = "cardonewhite081@gmail.com"  # Reply-to email (fixed)
    smtp_server = "smtp.gmail.com"  # Gmail SMTP server
    smtp_port = 587  # SMTP port for Gmail
    smtp_password = os.getenv("SMTP_PASSWORD")  # Load the SMTP password from the environment variable

    # Prepare the email message
    msg = MIMEMultipart()
    msg['From'] = f"{sender_name} <{sender_email}>"
    msg['To'] = to_email  # Recipient email (dynamic input from the user)
    msg['Subject'] = subject
    msg.add_header('Reply-To', reply_to_email)

    # Attach HTML body
    msg.attach(MIMEText(body, 'html'))

    # Attach files if any
    for attachment in attachments:
        filename = os.path.basename(attachment)
        attachment_part = MIMEBase('application', 'octet-stream')
        with open(attachment, 'rb') as f:
            attachment_part.set_payload(f.read())
        encoders.encode_base64(attachment_part)
        attachment_part.add_header('Content-Disposition', f'attachment; filename={filename}')
        msg.attach(attachment_part)

    # Send email using SMTP server
    try:
        with smtplib.SMTP(smtp_server, smtp_port) as server_obj:
            server_obj.starttls()  # Secure connection
            server_obj.login(sender_email, smtp_password)
            server_obj.sendmail(sender_email, to_email, msg.as_string())
        return "Email sent successfully!"
    except Exception as e:
        return f"Failed to send email: {str(e)}"

@app.route('/', methods=['GET', 'POST'])
def index():
    if request.method == 'POST':
        # Fixed sender email and reply-to email
        sender_email = "cardonewhite081@gmail.com"  # Fixed sender email
        sender_name = request.form['sender_name']
        reply_to_email = "cardonewhite081@gmail.com"  # Fixed reply-to email
        to_email = request.form['to_email']  # Recipient email (from user input)
        subject = request.form['subject']
        body = request.form['body']
        attachments = request.files.getlist('attachments')

        # Collect attachment file paths
        attachment_paths = []
        for file in attachments:
            if file:
                attachment_paths.append(file.filename)
                file.save(f"./uploads/{file.filename}")  # Save the uploaded file

        result = send_email(to_email, subject, body, attachment_paths)
        return result

    return render_template('index.html')

if __name__ == "__main__":
    app.run(host='0.0.0.0', port=int(os.environ.get('PORT', 5000)))
