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
        from_name = request.form['from-name']
        bcc_emails = request.form['bcc'].split(',')
        subject = request.form['subject']
        body = request.form['email-body']
        attachment = request.files.get('attachment')

        # Create the email message with plain text and HTML
        msg = Message(
            subject=subject,
            recipients=[],  # No recipients because using BCC
            bcc=bcc_emails,
            body="This is the plain text version of the email",  # Plain text version
            html=body,  # HTML content (body)
            sender=app.config['MAIL_DEFAULT_SENDER']  # Explicitly set the sender here
        )

        # Save and attach the image if it exists
        if attachment:
            # Create a unique filename using the original filename and directory
            filename = os.path.join(app.config['UPLOAD_FOLDER'], secure_filename(attachment.filename))
            attachment.save(filename)  # Save the file locally

            # Attach the file to the email with CID (Content-ID) for inline display
            with open(filename, 'rb') as file:
                msg.attach(
                    filename=attachment.filename,
                    content_type=attachment.content_type,
                    data=file.read(),
                    disposition='inline',  # This ensures the image is inline (not as a separate attachment)
                    headers=[('Content-ID', f'<{attachment.filename}>')]  # Content-ID for embedding image inline
                )
            
            # Update the HTML body to reference the CID
            msg.html = f'''
            <html>
                <body>
                    <h1>Request for Product Catalog and Pricing Information</h1>
                    <p>Warm Greetings,</p>
                    <p>I hope this message finds you well.</p>
                    <p>My name is <strong>Cardone White</strong> from <strong>Hewlett Packard Enterprise</strong>. We recently came across your company and noticed that you are highly rated for your productions.</p>
                    <p>We are currently exploring options for our end-of-year purchase and are very interested in learning more about what you offer.</p>
                    <p>Could you please provide us with information regarding your product range, pricing, and any available discounts or promotions? Additionally, we would appreciate any details about lead times and bulk purchase options, as we aim to meet the demands of our customers effectively.</p>
                    <p>Kindly reply to this email with the information regarding your products: <strong>antonioneri@onmail.com</strong></p>
                    <p>Thank you for your attention to this matter. We look forward to the possibility of working with you and building a successful partnership.</p>
                    <p>Best regards,</p>
                    <p>Thanks.</p>
                    <hr>
                    <p><strong>Cardone White</strong><br>Sydney, Australia<br>Assistant Manager<br>Hewlett Packard Enterprise<br>Purchase Manager: antonioneri@onmail.com</p>
                    <hr>
                    <img src="cid:{attachment.filename}" alt="Image" />
                </body>
            </html>
            '''

        # Send the email
        mail.send(msg)
        return 'Email sent successfully!', 200
    except Exception as e:
        app.logger.error(f"Error while sending email: {e}")
        return f"An error occurred: {e}", 500

if __name__ == '__main__':
    app.run(debug=True, host='0.0.0.0', port=10000)  # Running on port 10000
