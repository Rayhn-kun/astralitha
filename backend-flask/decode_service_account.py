import os
import base64

def decode_service_account():
    b64 = os.environ.get('SERVICE_ACCOUNT_B64')
    if b64:
        with open('serviceAccountKey.json', 'wb') as f:
            f.write(base64.b64decode(b64))

decode_service_account()
