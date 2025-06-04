import os
import json
from flask import Flask, render_template, request, redirect, url_for, send_from_directory, flash

DATA_FILE = 'characters.json'
UPLOAD_FOLDER = 'uploads'

app = Flask(__name__, static_folder='static')
app.config['UPLOAD_FOLDER'] = UPLOAD_FOLDER
app.secret_key = 'supersecretkey'  # Needed for flashing messages

# Ensure uploads directory exists
os.makedirs(UPLOAD_FOLDER, exist_ok=True)

# Load characters data
if os.path.exists(DATA_FILE):
    with open(DATA_FILE, 'r', encoding='utf-8') as f:
        characters = json.load(f)
else:
    characters = []

def save_characters():
    with open(DATA_FILE, 'w', encoding='utf-8') as f:
        json.dump(characters, f, indent=4, ensure_ascii=False)

@app.route('/')
def index():
    return render_template('index.html', characters=characters)

@app.route('/upload', methods=['POST'])
def upload():
    if 'file' not in request.files:
        flash('No file part')
        return redirect(url_for('index'))
    file = request.files['file']
    if file.filename == '':
        flash('No selected file')
        return redirect(url_for('index'))
    filename = file.filename
    filepath = os.path.join(app.config['UPLOAD_FOLDER'], filename)
    file.save(filepath)
    # Add character info from form data
    nama = request.form.get('nama', '')
    asal_anime = request.form.get('asal_anime', '')
    software = request.form.get('software', '')
    status_rigging = request.form.get('status_rigging', '')
    character = {
        "nama": nama,
        "asal_anime": asal_anime,
        "software": software,
        "file_model": filename,
        "status_rigging": status_rigging
    }
    characters.append(character)
    save_characters()
    flash('File uploaded and character added successfully.')
    return redirect(url_for('index'))

@app.route('/uploads/<path:filename>')
def uploaded_file(filename):
    return send_from_directory(app.config['UPLOAD_FOLDER'], filename)

if __name__ == '__main__':
    app.run(debug=True)
