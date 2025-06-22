from flask import Flask, send_from_directory
from flask_restful import Resource, Api
from flask_cors import CORS
import os
import logging
# Set up logging
logging.basicConfig(level=logging.INFO, format='%(asctime)s - %(levelname)s - %(message)s')
# Initialize Flask app and API  

app = Flask(__name__, static_folder="../frontend/dist", static_url_path="/")
api = Api(app, prefix="/")
CORS(app, resources={r"/*": {"origins": "*"}})

class GlobeAPI(Resource):
    def get(self):
        return {"message": "Welcome to the Cesium Globe API", "status": "success"}, 200

api.add_resource(GlobeAPI, "/api/globe")

# Serve React frontend and Cesium assets under /firefly
@app.route("/", defaults={"path": ""})
@app.route("/<path:path>")
def serve(path):
    dist_dir = app.static_folder
    full_path = os.path.join(dist_dir, path)
    
    if path != "" and os.path.exists(full_path):
        return send_from_directory(dist_dir, path)
        
    return send_from_directory(dist_dir, "index.html")

if __name__ == "__main__":
    app.run(host="0.0.0.0", port=5000, debug=True)
