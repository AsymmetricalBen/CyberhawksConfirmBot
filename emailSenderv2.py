import sys, os
from O365 import Account
from dotenv import load_dotenv
from O365.connection import MSGraphProtocol

load_dotenv()
CLIENT_ID = os.environ.get('EMAIL_ID')
CLIENT_SECRET = os.environ.get('EMAIL_SECRET')
TENANT_ID = os.environ.get('TENANT_ID')
SERVER_IP = os.environ.get('SERVER_IP')
EMAIL_ADDRESS = os.environ.get('EMAIL_ADDRESS')

credentials = (CLIENT_ID, CLIENT_SECRET)
account = Account(credentials, tenant_id=TENANT_ID, auth_flow_type='credentials') 
if account.authenticate(scopes=['https://graph.microsoft.com/.default']): 
    
    while True:
        email, token = input().split()
        mailbox = account.mailbox(EMAIL_ADDRESS)
        m = mailbox.new_message()
        m.to.add(email)
        m.subject = 'Cyberhawks Email Confirmation Test!'
        m.body = """
                <html>
                    <body>
                        Please <a href=\"http://""" + str(SERVER_IP) + "/" + str(token) + """\">follow this link</a> to confirm your discord account.</p>
                    </body>
                </html>
                """
        m.send()