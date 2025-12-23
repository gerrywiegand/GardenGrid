from config import Config
from database import db, migrate
from flask import Flask, jsonify, request
from flask_cors import CORS
from flask_restful import Api

api = Api()


app = create_app()

if __name__ == "__main__":
    app.run(debug=True)
