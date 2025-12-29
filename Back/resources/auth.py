from extensions.database import db
from flask import request
from flask_jwt_extended import create_access_token, get_jwt_identity, jwt_required
from flask_restful import Resource
from models.User import User, UserSchema
from werkzeug.security import check_password_hash, generate_password_hash


class SignupResource(Resource):
    def post(self):
        payload = request.get_json() or {}
        data = UserSchema().load(payload)

        username = data.get("username")
        password = data.get("password")

        if User.query.filter_by(username=username).first():
            return {"message": "Username already exists"}, 400

        user = User(username=username, password_hash=generate_password_hash(password))
        db.session.add(user)
        db.session.commit()
        return {"message": "User created successfully"}, 201


class LoginResource(Resource):
    def post(self):
        payload = request.get_json() or {}
        username = payload.get("username")
        password = payload.get("password")

        user = User.query.filter_by(username=username).first()
        if not user or not check_password_hash(user.password_hash, password):
            return {"message": "Invalid credentials"}, 401

        token = create_access_token(identity=user.id)
        return {"access_token": token}, 200
    
class MeResource(Resource):
    @jwt_required()
    def get(self):
        user_id = get_jwt_identity()
        return {"user_id": user_id}, 200
