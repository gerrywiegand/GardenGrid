from blueprints.api import api_bp
from config import DevelopmentConfig
from extensions.database import db, migrate
from extensions.JWT import jwt
from flask import Flask
from flask_cors import CORS


def create_app():
    app = Flask(__name__)
    app.config.from_object(DevelopmentConfig)

    jwt(app)

    CORS(app, supports_credentials=False)
    db.init_app(app)
    migrate.init_app(app, db)
    jwt.init_app(app)

    @app.route("/health", methods=["GET"])
    def health_check():
        return ({"status": "healthy"}), 200

    app.register_blueprint(api_bp)

    return app


app = create_app()

if __name__ == "__main__":
    app.run(debug=True)
