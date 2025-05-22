from flask import Flask, send_from_directory
from flask_restful import Resource, Api
from flask_cors import CORS
import os

app = Flask(__name__, static_folder="../frontend/dist")
api = Api(app, prefix="/firefly")  # Add /firefly prefix to API routes
CORS(app, resources={r"/firefly/*": {"origins": "*"}})  # Update CORS for /firefly

class GlobeAPI(Resource):
    def get(self):
        return {"message": "Welcome to the Cesium Globe API", "status": "success"}, 200

api.add_resource(GlobeAPI, "/api/globe")  # Accessible at /firefly/api/globe

# Serve React frontend under /firefly
@app.route("/firefly", defaults={"path": ""})
@app.route("/firefly/<path:path>")
def serve(path):
    if path != "" and os.path.exists(app.static_folder + "/" + path):
        return send_from_directory(app.static_folder, path)
    else:
        return send_from_directory(app.static_folder, "index.html")

if __name__ == "__main__":
    app.run(host="0.0.0.0", port=5000, debug=False)
