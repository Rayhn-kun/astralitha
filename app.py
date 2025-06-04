from flask import Flask
from flask_cors import CORS
import sys
import os
import importlib.util

sys.path.insert(0, os.path.join(os.path.dirname(__file__), 'backend-flask'))

spec_firebase = importlib.util.spec_from_file_location('firebase_admin_setup', os.path.join(os.path.dirname(__file__), 'backend-flask', 'firebase_admin_setup.py'))
firebase_admin_setup = importlib.util.module_from_spec(spec_firebase)
spec_firebase.loader.exec_module(firebase_admin_setup)

spec_routes = importlib.util.spec_from_file_location('routes', os.path.join(os.path.dirname(__file__), 'backend-flask', 'routes.py'))
routes_module = importlib.util.module_from_spec(spec_routes)
spec_routes.loader.exec_module(routes_module)

init_firebase = firebase_admin_setup.init_firebase
routes = routes_module.routes

app = Flask(__name__)
app.secret_key = os.environ.get('SECRET_KEY', 'your_secret_key_here')
CORS(app)

# Initialize Firebase Admin
init_firebase()

# Register blueprint for all API routes
app.register_blueprint(routes)

if __name__ == '__main__':
    app.run(debug=True)
