import smtplib, ssl, sys, os
from dotenv import load_dotenv

load_dotenv()
SENDER_EMAIL = "cyberhawkconfirm@gmail.com"
RECIEVER_EMAIL = sys.argv[1]
TOKEN = sys.argv[2]
PASSWORD = os.environ.get('EMAIL_PASSWORD')
IP = os.environ.get('IP')
PORT = 587
SMTP_SERVER = "smtp.gmail.com"
CONTEXT = ssl.create_default_context()

# Try to log in to server and send email
try:
    server = smtplib.SMTP(SMTP_SERVER,PORT)
    server.ehlo() # Can be omitted
    server.starttls(context=CONTEXT) # Secure the connection
    server.ehlo() # Can be omitted
    server.login(SENDER_EMAIL, PASSWORD)
    server.sendmail(SENDER_EMAIL, str(RECIEVER_EMAIL), "Here is the link to confirm you account, http://" + str(IP) + ":3000/" + str(TOKEN))

except Exception as e:
    # Print any error messages to stdout
    print(e)
finally:
    server.quit() 