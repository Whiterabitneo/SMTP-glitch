from flask import Flask, render_template, request, redirect, url_for
import smtplib
from email.mime.multipart import MIMEMultipart
from email.mime.text import MIMEText
import os
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

# Initialize Flask app
app = Flask(__name__)

# Your SMTP email (replace with your Gmail address)
SMTP_EMAIL = "cardonewhite081@gmail.com"

# Route for the form
@app.route("/", methods=["GET", "POST"])
def index():
    if request.method == "POST":
        sender_email = SMTP_EMAIL  # Use your SMTP email here
        sender_name = request.form["sender_name"]
        reply_to_email = request.form["reply_to_email"]
        recipients = request.form["recipients"]
        subject = request.form["subject"]
        body = request.form["body"]

        # Get SMTP server configuration from environment variables
        smtp_server = "smtp.gmail.com"  # Using Gmail's SMTP server
        smtp_port = 587
        smtp_password = os.getenv("SMTP_PASSWORD")  # Load SMTP password from environment variable

        send_email(sender_email, sender_name, reply_to_email, recipients, subject, body, smtp_server, smtp_port, smtp_password)
        return redirect(url_for("index"))  # Redirect to the same page after sending email

    return render_template("index.html")  # Render the HTML form when page is loaded

# Function to send email
def send_email(sender_email, sender_name, reply_to_email, recipients, subject, body, smtp_server, smtp_port, password):
    msg = MIMEMultipart()
    msg['From'] = f"{sender_name} <{sender_email}>"
    msg['To'] = recipients  # "To" is optional when using BCC
    msg['Subject'] = subject
    msg.add_header('Reply-To', reply_to_email)

    # Send as BCC so recipients can't see each other's emails
    bcc_list = recipients.split(",")  # Split recipients by commas
    msg['Bcc'] = ", ".join(bcc_list)

    # Attach the HTML body to the email (ensuring any formatting like bold, color, etc., will be preserved)
    msg.attach(MIMEText(body, 'html'))

    try:
        # Connect to the Gmail SMTP server
        server_obj = smtplib.SMTP(smtp_server, smtp_port)
        server_obj.starttls()
        server_obj.login(sender_email, password)
        text = msg.as_string()
        server_obj.sendmail(sender_email, bcc_list, text)  # Send to BCC recipients
        server_obj.quit()
    except Exception as e:
        print(f"Failed to send email: {e}")

if __name__ == "__main__":
    app.run(debug=True)

