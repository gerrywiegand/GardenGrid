from extensions.database import db
from flask import request
from flask_jwt_extended import create_access_token, get_jwt_identity, jwt_required
from flask_restful import Resource
from models.user import User, UserSchema
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
        token = create_access_token(identity=str(user.id))
        return {"message": "User created successfully", "access_token": token}, 201


class LoginResource(Resource):
    def post(self):
        payload = request.get_json() or {}
        username = payload.get("username")
        password = payload.get("password")

        user = User.query.filter_by(username=username).first()
        if not user or not check_password_hash(user.password_hash, password):
            return {"message": "Invalid credentials"}, 401

        token = create_access_token(identity=str(user.id))
        return {"access_token": token}, 200


class MeResource(Resource):
    @jwt_required()
    def get(self):
        user_id = int(get_jwt_identity())
        user = User.query.get(user_id)
        if not user:
            return {"message": "User not found"}, 404
        return UserSchema(only=("id", "username")).dump(user), 200


class logoutResource(Resource):
    @jwt_required()
    def post(self):
        # In a real application, you would add the token to a blocklist to invalidate it
        return {"message": "User logged out successfully"}, 200
