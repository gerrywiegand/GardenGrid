from extensions.database import db
from flask import request
from flask_jwt_extended import get_jwt_identity, jwt_required
from flask_restful import Resource
from marshmallow import ValidationError
from models.gardens import Garden, GardenSchema


class GardensResource(Resource):
    @jwt_required()
    def get(self):
        user_id = int(get_jwt_identity())
        gardens = Garden.query.filter_by(user_id=user_id).all()
        return GardenSchema(many=True).dump(gardens), 200

    @jwt_required()
    def post(self):
        user_id = int(get_jwt_identity())
        payload = request.get_json() or {}
        try:
            data = GardenSchema().load(payload)
        except ValidationError as err:
            return {"message": "Validation errors", "errors": err.messages}, 400

        garden = Garden(user_id=user_id, **data)
        db.session.add(garden)
        db.session.commit()
        return GardenSchema().dump(garden), 201


class GardenResource(Resource):
    @jwt_required()
    def get(self, garden_id):
        user_id = int(get_jwt_identity())
        garden = Garden.query.filter_by(id=garden_id, user_id=user_id).first()
        if not garden:
            return {"message": "Garden not found"}, 404
        return GardenSchema().dump(garden), 200

    @jwt_required()
    def patch(self, garden_id):
        user_id = int(get_jwt_identity())
        garden = Garden.query.filter_by(id=garden_id, user_id=user_id).first()
        if not garden:
            return {"message": "Garden not found"}, 404

        payload = request.get_json() or {}
        try:
            data = GardenSchema(partial=True).load(payload)
        except ValidationError as err:
            return {"message": "Validation errors", "errors": err.messages}, 400

        for key, value in data.items():
            setattr(garden, key, value)

        db.session.commit()
        return GardenSchema().dump(garden), 200

    @jwt_required()
    def delete(self, garden_id):
        user_id = int(get_jwt_identity())
        garden = Garden.query.filter_by(id=garden_id, user_id=user_id).first()
        if not garden:
            return {"message": "Garden not found"}, 404

        db.session.delete(garden)
        db.session.commit()
        return {"message": "Garden deleted"}, 200
