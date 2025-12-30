from extensions.database import db
from flask import request
from flask_jwt_extended import get_jwt_identity, jwt_required
from flask_restful import Resource
from marshmallow import ValidationError
from models.plants import Plant, PlantSchema


class PlantsResource(Resource):
    @jwt_required()
    def get(self):
        user_id = int(get_jwt_identity())
        plants = Plant.query.filter_by(user_id=user_id).all()
        return PlantSchema(many=True).dump(plants), 200

    @jwt_required()
    def post(self):
        user_id = int(get_jwt_identity())
        payload = request.get_json() or {}
        try:
            data = PlantSchema().load(payload)
        except ValidationError as err:
            return {"message": "Validation errors", "errors": err.messages}, 400

        plant = Plant(user_id=user_id, **data)
        db.session.add(plant)
        db.session.commit()
        return PlantSchema().dump(plant), 201

    @jwt_required()
    def patch(self, plant_id):
        user_id = int(get_jwt_identity())
        plant = Plant.query.filter_by(id=plant_id, user_id=user_id).first()
        if not plant:
            return {"message": "Plant not found"}, 404

        payload = request.get_json() or {}
        try:
            data = PlantSchema(partial=True).load(payload)
        except ValidationError as err:
            return {"message": "Validation errors", "errors": err.messages}, 400

        for key, value in data.items():
            setattr(plant, key, value)

        db.session.commit()
        return PlantSchema().dump(plant), 200

    @jwt_required()
    def delete(self, plant_id):
        user_id = int(get_jwt_identity())
        plant = Plant.query.filter_by(id=plant_id, user_id=user_id).first()
        if not plant:
            return {"message": "Plant not found"}, 404

        db.session.delete(plant)
        db.session.commit()
        return {"message": "Plant deleted"}, 200
