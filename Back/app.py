from config import Config
from database import db, migrate
from flask import Flask, jsonify, request
from flask_cors import CORS
from flask_restful import Api

api = Api()


def create_app():
    app = Flask(__name__)
    app.config.from_object(Config)

    CORS(app)
    db.init_app(app)
    migrate.init_app(app, db)
    api.init_app(app)

    @app.route("/health", methods=["GET"])
    def health_check():
        return jsonify({"status": "healthy"}), 200

    return app


app = create_app()

if __name__ == "__main__":
    app.run(debug=True)
