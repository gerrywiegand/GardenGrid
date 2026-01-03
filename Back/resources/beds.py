from extensions.database import db
from flask import request
from flask_jwt_extended import get_jwt_identity, jwt_required
from flask_restful import Resource
from marshmallow import ValidationError
from models.beds import Bed, BedSchema
from models.gardens import Garden, GardenSchema


class BedsResource(Resource):
    @jwt_required()
    def get(self):
        user_id = int(get_jwt_identity())
        beds = Bed.query.join(Bed.garden).filter(Garden.user_id == user_id).all()
        return BedSchema(many=True).dump(beds), 200

    @jwt_required()
    def post(self):

        user_id = int(get_jwt_identity())
        payload = request.get_json() or {}
        try:
            data = BedSchema().load(payload)
        except ValidationError as err:
            return {"message": "Validation errors", "errors": err.messages}, 400

        garden = Garden.query.filter_by(id=data["garden_id"], user_id=user_id).first()
        if not garden:
            return {"message": "Garden not found"}, 404

        bed = Bed(**data)
        db.session.add(bed)
        db.session.commit()
        return BedSchema().dump(bed), 201


class BedResource(Resource):
    @jwt_required()
    def get(self, bed_id):
        user_id = int(get_jwt_identity())
        bed = (
            Bed.query.join(Bed.garden)
            .filter(Bed.id == bed_id, Garden.user_id == user_id)
            .first()
        )
        if not bed:
            return {"message": "Bed not found"}, 404
        return BedSchema().dump(bed), 200

    @jwt_required()
    def patch(self, bed_id):
        user_id = int(get_jwt_identity())
        bed = (
            Bed.query.join(Bed.garden)
            .filter(Bed.id == bed_id, Garden.user_id == user_id)
            .first()
        )
        if not bed:
            return {"message": "Bed not found"}, 404

        payload = request.get_json() or {}
        try:
            data = BedSchema(partial=True).load(payload)
        except ValidationError as err:
            return {"message": "Validation errors", "errors": err.messages}, 400

        for key, value in data.items():
            setattr(bed, key, value)

        db.session.commit()
        return BedSchema().dump(bed), 200

    @jwt_required()
    def delete(self, bed_id):
        user_id = int(get_jwt_identity())
        bed = (
            Bed.query.join(Bed.garden)
            .filter(Bed.id == bed_id, Garden.user_id == user_id)
            .first()
        )
        if not bed:
            return {"message": "Bed not found"}, 404

        db.session.delete(bed)
        db.session.commit()
        return {"message": "Bed deleted"}, 200
