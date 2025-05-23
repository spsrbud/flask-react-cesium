from flask import Flask, send_from_directory, Response
from flask_restful import Resource, Api
from flask_cors import CORS
import os

app = Flask(__name__, static_folder="../frontend/dist")
api = Api(app, prefix="/firefly")
CORS(app, resources={r"/firefly/*": {"origins": "*"}})

class GlobeAPI(Resource):
    def get(self):
        return {"message": "Welcome to the Cesium Globe API", "status": "success"}, 200

api.add_resource(GlobeAPI, "/api/globe")

# Serve React frontend and Cesium assets under /firefly
@app.route("/firefly", defaults={"path": ""})
@app.route("/firefly/<path:path>")
def serve(path):
    file_path = os.path.join(app.static_folder, path)
    if path.startswith("cesium/") and os.path.exists(file_path):
        # Explicitly set MIME type for JavaScript files
        if path.endswith(".js"):
            with open(file_path, "rb") as f:
                return Response(f.read(), mimetype="application/javascript")
        return send_from_directory(app.static_folder, path)
    if path != "" and os.path.exists(file_path):
        return send_from_directory(app.static_folder, path)
    return send_from_directory(app.static_folder, "index.html")

if __name__ == "__main__":
    app.run(host="0.0.0.0", port=5000, debug=False)
