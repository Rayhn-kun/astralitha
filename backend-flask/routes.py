from flask import Blueprint, request, jsonify, session, flash, render_template, send_from_directory
from werkzeug.utils import secure_filename
from flask_cors import cross_origin
from firebase_admin import auth
from .cloudflare_r2 import upload_to_r2, delete_from_r2
import os, json, datetime

routes = Blueprint('routes', __name__)

# ... (You can move your route functions here, e.g. upload, delete, etc.)

# Example upload endpoint
@routes.route('/upload', methods=['POST'])
@cross_origin()
def upload_file():
    token = request.headers.get("Authorization", "").split("Bearer ")[-1]
    try:
        decoded = auth.verify_id_token(token)
        user_id = decoded['uid']
    except Exception:
        return jsonify({'error': 'Unauthorized'}), 401
    if 'file' not in request.files:
        return jsonify({'error': 'No file part'}), 400
    file = request.files['file']
    if file.filename == '':
        return jsonify({'error': 'No selected file'}), 400
    filename = secure_filename(file.filename)
    url = upload_to_r2(file, filename, file.content_type)
    # Optionally save metadata here
    return jsonify({'url': url, 'filename': filename})

# Example delete endpoint
@routes.route('/delete_model', methods=['POST'])
@cross_origin()
def delete_model():
    token = request.headers.get("Authorization", "").split("Bearer ")[-1]
    try:
        decoded = auth.verify_id_token(token)
        user_id = decoded['uid']
    except Exception:
        return jsonify({'error': 'Unauthorized'}), 401
    filename = request.json.get('filename')
    if not filename:
        return jsonify({'error': 'Missing filename'}), 400
    try:
        delete_from_r2(filename)
    except Exception as e:
        return jsonify({'error': 'Failed to delete from R2', 'details': str(e)}), 500
    return jsonify({'success': True})
