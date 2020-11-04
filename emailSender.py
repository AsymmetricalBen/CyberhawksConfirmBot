import smtplib, ssl, sys, os
from dotenv import load_dotenv


#This is a work in progress and will likely be switched to use the office365 package
#At the moment SMTP does not seem like it will work for us to send emails, so the next alternative is through Azure

load_dotenv()
SENDER_EMAIL = "cyberhawks@ung.edu"
RECIEVER_EMAIL = sys.argv[1]
TOKEN = sys.argv[2]
PASSWORD = os.environ.get('EMAIL_PASSWORD')
IP = os.environ.get('IP')
PORT = 587
SMTP_SERVER = "mxa-00220c02.gslb.pphosted.com"
CONTEXT = ssl.create_default_context()

try:
    server = smtplib.SMTP(SMTP_SERVER,PORT)
    server.ehlo()
    server.starttls(context=CONTEXT) 
    server.ehlo() 
    server.login(SENDER_EMAIL, PASSWORD)
    server.sendmail(SENDER_EMAIL, str(RECIEVER_EMAIL), "Here is the link to confirm your account, http://" + str(IP) + ":3000/" + str(TOKEN))

except Exception as e:
    print(e)
finally:
    print(1)
    server.quit() 