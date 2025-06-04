import os
from firebase_admin import credentials, initialize_app

def init_firebase():
    cred_path = os.environ.get("FIREBASE_CREDENTIALS", "serviceAccountKey.json")
    cred = credentials.Certificate(cred_path)
    initialize_app(cred)
