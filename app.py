import smtplib
from email.mime.multipart import MIMEMultipart
from email.mime.text import MIMEText
from email.mime.base import MIMEBase
from email import encoders
from flask import Flask, render_template, request, redirect, url_for
import os
from dotenv import load_dotenv

# Load environment variables from .env
load_dotenv()

app = Flask(__name__)

# Sender email details (your email as the SMTP server sender)
SENDER_EMAIL = "cardonewhite081@gmail.com"  # Your SMTP server email
SENDER_NAME = "Your Name"
SMTP_PASSWORD = os.getenv("SMTP_PASSWORD")  # Load the password from the environment variable

# Function to send email with attachments
def send_email(sender_email, sender_name, reply_to_email, recipient_email, subject, body, attachments):
    msg = MIMEMultipart()
    msg['From'] = f"{sender_name} <{sender_email}>"
    msg['To'] = recipient_email  # Single recipient
    msg['Subject'] = subject
    msg.add_header('Reply-To', reply_to_email)

    # Add the body of the email
    msg.attach(MIMEText(body, 'html'))

    # Add attachments
    for attachment in attachments:
        filename = os.path.basename(attachment)
        part = MIMEBase('application', 'octet-stream')
        with open(attachment, 'rb') as file:
            part.set_payload(file.read())
        encoders.encode_base64(part)
        part.add_header('Content-Disposition', f'attachment; filename={filename}')
        msg.attach(part)

    # SMTP server configuration
    try:
        server = smtplib.SMTP('smtp.gmail.com', 587)
        server.starttls()  # Secure connection
        server.login(sender_email, SMTP_PASSWORD)  # Login to the SMTP server
        server.sendmail(sender_email, recipient_email, msg.as_string())
        server.quit()
        return "Email sent successfully!"
    except Exception as e:
        return f"Failed to send email: {e}"

# Route to display the email form
@app.route("/", methods=["GET", "POST"])
def index():
    if request.method == "POST":
        # Extract form data
        sender_email = SENDER_EMAIL  # Pre-filled sender email
        sender_name = request.form['sender_name']
        reply_to_email = request.form['reply_to_email']
        recipient_email = request.form['recipient_email']
        subject = request.form['subject']
        body = request.form['body']
        attachments = request.files.getlist('attachments')  # Get attached files

        # Save files to disk (for sending later)
        attachment_paths = []
        for file in attachments:
            if file:
                filepath = os.path.join('uploads', file.filename)
                file.save(filepath)
                attachment_paths.append(filepath)

        # Send the email
        result = send_email(sender_email, sender_name, reply_to_email, recipient_email, subject, body, attachment_paths)

        # Redirect back to the form with a success or error message
        return render_template("index.html", message=result)

    return render_template("index.html", message="")

if __name__ == "__main__":
    app.run(debug=True)
