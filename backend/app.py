from flask import Flask, request, jsonify
import os
from flask_cors import CORS

#default host: http://127.0.0.1:5000/

app = Flask(__name__)
CORS(app)  # Enable CORS for all routes

@app.route('/', methods = ['GET'])
def get_message():
    return jsonify({"Hola": "Mundo"})
# The app.route('/') decorator maps the URL path '/' to the get_message() function. 
# When a client makes an HTTP GET request to the root URL ("/") of the server, Flask will call the get_message() function 
#  e.g: if you type http://127.0.0.1:5000/ in the address bar and press Enter, the browser will make a GET request to the root URL

# Endpoint to handle file upload
@app.route('/', methods=['POST'])
def upload_file():
    if 'jsonFile' not in request.files:
        return jsonify({"error": "No file part"}), 400

    file = request.files['jsonFile']

    if file.filename == '':
        return jsonify({"error": "No selected file"}), 400

    if file and allowed_file(file.filename):
        desktop_path = os.path.join(os.path.expanduser("~"), "Desktop")
        upload_dir = os.path.join(desktop_path, "JSON_Files")

        if not os.path.exists(upload_dir):
            os.makedirs(upload_dir)
     
        file.save(os.path.join(upload_dir, file.filename))

        return jsonify({"message": "File uploaded successfully"}), 200

    return jsonify({"error": "Invalid file format. Only JSON files are allowed."}), 400

def allowed_file(filename):
    return '.' in filename and filename.rsplit('.', 1)[1].lower() == 'json'


if __name__ == "__main__":
    app.run()