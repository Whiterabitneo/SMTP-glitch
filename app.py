import smtplib
from email.mime.multipart import MIMEMultipart
from email.mime.text import MIMEText
from email.mime.base import MIMEBase
from email import encoders
import tkinter as tk
from tkinter import messagebox, filedialog
from tkinter.colorchooser import askcolor
import os
from dotenv import load_dotenv  # Import dotenv to load environment variables

# Load the environment variables from the .env file
load_dotenv()

# Function to send email with attachments
def send_email(sender_email, sender_name, reply_to_email, recipients, subject, body, attachments, server, port, password):
    # Prepare the email
    msg = MIMEMultipart()
    msg['From'] = f"{sender_name} <{sender_email}>"
    msg['To'] = recipients  # We can leave this empty if we use BCC
    msg['Subject'] = subject
    msg.add_header('Reply-To', reply_to_email)

    # Send as BCC so recipients can't see each other's emails
    bcc_list = recipients.split(',')
    msg['Bcc'] = ', '.join(bcc_list)

    # Attach the HTML body to the email
    msg.attach(MIMEText(body, 'html'))

    # Attach files if provided
    for attachment in attachments:
        filename = os.path.basename(attachment)
        attachment_part = MIMEBase('application', 'octet-stream')
        with open(attachment, 'rb') as f:
            attachment_part.set_payload(f.read())
        encoders.encode_base64(attachment_part)
        attachment_part.add_header('Content-Disposition', f'attachment; filename={filename}')
        msg.attach(attachment_part)

    # Connect to the SMTP server and send the email
    try:
        server_obj = smtplib.SMTP(server, port)
        server_obj.starttls()
        server_obj.login(sender_email, password)
        text = msg.as_string()
        server_obj.sendmail(sender_email, bcc_list, text)
        server_obj.quit()
        messagebox.showinfo("Success", "Email sent successfully!")
    except Exception as e:
        messagebox.showerror("Error", f"Failed to send email: {e}")

# Function to choose color for text
def choose_color():
    color = askcolor()[1]  # Get the hex color
    if color:
        return f'color:{color};'
    return ''


# UI setup with Tkinter
def setup_ui():
    # Create the main window
    window = tk.Tk()
    window.title("Email Sender with Attachment")
    window.geometry("600x700")

    # Set your email as the default value for the sender email field
    default_sender_email = "cardonewhite081@gmail.com"  # Your email address

    tk.Label(window, text="Sender Email:").grid(row=0, column=0)
    sender_email_entry = tk.Entry(window, width=40)
    sender_email_entry.insert(0, default_sender_email)  # Set the default email in the entry field
    sender_email_entry.grid(row=0, column=1)

    tk.Label(window, text="Sender Name:").grid(row=1, column=0)
    sender_name_entry = tk.Entry(window, width=40)
    sender_name_entry.grid(row=1, column=1)

    tk.Label(window, text="Reply-To Email:").grid(row=2, column=0)
    reply_to_email_entry = tk.Entry(window, width=40)
    reply_to_email_entry.grid(row=2, column=1)

    tk.Label(window, text="Recipients (comma separated):").grid(row=3, column=0)
    recipients_entry = tk.Entry(window, width=40)
    recipients_entry.grid(row=3, column=1)

    tk.Label(window, text="Subject:").grid(row=4, column=0)
    subject_entry = tk.Entry(window, width=40)
    subject_entry.grid(row=4, column=1)

    # Email body
    tk.Label(window, text="Email Body (HTML):").grid(row=5, column=0)
    body_entry = tk.Text(window, height=10, width=40)
    body_entry.grid(row=5, column=1)

    # File attachment handling
    attachments = []

    def attach_file():
        file_path = filedialog.askopenfilename()
        if file_path:
            attachments.append(file_path)
            messagebox.showinfo("Attachment", f"File {os.path.basename(file_path)} attached!")

    # Formatting Buttons
    def apply_bold():
        body_entry.insert(tk.END, '<b></b>')

    def apply_italic():
        body_entry.insert(tk.END, '<i></i>')

    def apply_color():
        color_style = choose_color()
        if color_style:
            body_entry.insert(tk.END, f'<span style="{color_style}">Your text here</span>')

    # Formatting buttons for bold, italic, color
    tk.Button(window, text="Bold", command=apply_bold).grid(row=6, column=0)
    tk.Button(window, text="Italic", command=apply_italic).grid(row=6, column=1)
    tk.Button(window, text="Text Color", command=apply_color).grid(row=7, column=0, columnspan=2)
    
    # Button to add file attachment
    tk.Button(window, text="Attach File", command=attach_file).grid(row=8, column=0, columnspan=2)

    # Send button to trigger the email sending
    def send_button_action():
        sender_email = sender_email_entry.get()  # This will now default to your email if not changed
        sender_name = sender_name_entry.get()
        reply_to_email = reply_to_email_entry.get()
        recipients = recipients_entry.get()
        subject = subject_entry.get()
        body = body_entry.get("1.0", tk.END)

        # SMTP server configuration (you may need to replace these with your server's details)
        smtp_server = "smtp.gmail.com"  # Replace with your SMTP server (Gmail as example)
        smtp_port = 587  # SMTP port for Gmail
        smtp_password = os.getenv("SMTP_PASSWORD")  # Load SMTP password from environment variable

        if not sender_email or not recipients or not subject or not body:
            messagebox.showwarning("Input Error", "Please fill in all fields before sending.")
            return
        
        send_email(sender_email, sender_name, reply_to_email, recipients, subject, body, attachments, smtp_server, smtp_port, smtp_password)

    tk.Button(window, text="Send Email", command=send_button_action).grid(row=9, column=0, columnspan=2)

    # Run the Tkinter event loop
    window.mainloop()

# Run the UI setup
if __name__ == "__main__":
    setup_ui()
