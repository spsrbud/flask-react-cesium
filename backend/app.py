from flask import Flask, send_from_directory
from flask_restful import Resource, Api
from flask_cors import CORS
from flask_socketio import SocketIO, emit
import os
import logging

# Set up logging
logging.basicConfig(level=logging.INFO, format='%(asctime)s - %(levelname)s - %(message)s')

# Initialize Flask app
app = Flask(__name__, static_folder="../frontend/dist", static_url_path="/")
api = Api(app, prefix="/")
CORS(app, resources={r"/*": {"origins": "*"}})

# Set up SocketIO
socketio = SocketIO(app, cors_allowed_origins="*")

# REST API endpoint
class GlobeAPI(Resource):
    def get(self):
        return {"message": "Welcome to the Cesium Globe API", "status": "success"}, 200

api.add_resource(GlobeAPI, "/api/globe")

# Serve React frontend
@app.route("/", defaults={"path": ""})
@app.route("/<path:path>")
def serve(path):
    dist_dir = app.static_folder
    full_path = os.path.join(dist_dir, path)
    if path != "" and os.path.exists(full_path):
        return send_from_directory(dist_dir, path)
    return send_from_directory(dist_dir, "index.html")

# WebSocket events
@socketio.on("connect")
def handle_connect():
    logging.info("Client connected")
    emit("message", {"data": "Connected to Cesium Globe"})

@socketio.on("disconnect")
def handle_disconnect():
    logging.info("Client disconnected")

@socketio.on("client_message")
def handle_client_message(data):
    logging.info(f"Received message from client: {data}")
    emit("server_message", {"data": "Message received"}, broadcast=True)

# Entry point for local/dev (optional)
if __name__ == "__main__":
    socketio.run(app, host="0.0.0.0", port=5000, debug=True)

