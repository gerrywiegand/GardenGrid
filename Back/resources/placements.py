from extensions.database import db
from flask import request
from flask_jwt_extended import get_jwt_identity, jwt_required
from flask_restful import Resource
from marshmallow import ValidationError
from models.beds import Bed
from models.placements import Placement, PlacementSchema
from models.plants import Plant
from models.user import User


class PlacementsResource(Resource):
    @jwt_required()
    def get(self, bed_id):
        user_id = int(get_jwt_identity())
        bed = Bed.query.filter_by(id=bed_id).first()
        if not bed or bed.garden.user_id != user_id:
            return {"message": "Bed not found"}, 404

        placements = Placement.query.filter_by(bed_id=bed_id).all()
        return PlacementSchema(many=True).dump(placements), 200

    @jwt_required()
    def post(self, bed_id):
        user_id = int(get_jwt_identity())
        bed = Bed.query.filter_by(id=bed_id).first()
        if not bed or bed.garden.user_id != user_id:
            return {"message": "Bed not found"}, 404

        payload = request.get_json() or {}
        try:
            data = PlacementSchema().load(payload)
        except ValidationError as err:
            return {"message": "Validation errors", "errors": err.messages}, 400

        placement = Placement(bed_id=bed_id, **data)
        db.session.add(placement)
        db.session.commit()
        return PlacementSchema().dump(placement), 201


class PlacementResource(Resource):
    @jwt_required()
    def get(self, placement_id):
        user_id = int(get_jwt_identity())
        placement = Placement.query.filter_by(id=placement_id).first()
        if not placement or placement.bed.garden.user_id != user_id:
            return {"message": "Placement not found"}, 404
        return PlacementSchema().dump(placement), 200

    @jwt_required()
    def patch(self, placement_id):
        user_id = int(get_jwt_identity())
        placement = Placement.query.filter_by(id=placement_id).first()
        if not placement or placement.bed.garden.user_id != user_id:
            return {"message": "Placement not found"}, 404

        payload = request.get_json() or {}
        try:
            data = PlacementSchema(partial=True).load(payload)
        except ValidationError as err:
            return {"message": "Validation errors", "errors": err.messages}, 400

        for key, value in data.items():
            setattr(placement, key, value)

        db.session.commit()
        return PlacementSchema().dump(placement), 200

    @jwt_required()
    def delete(self, placement_id):
        user_id = int(get_jwt_identity())
        placement = Placement.query.filter_by(id=placement_id).first()
        if not placement or placement.bed.garden.user_id != user_id:
            return {"message": "Placement not found"}, 404

        db.session.delete(placement)
        db.session.commit()
        return {"message": "Placement deleted"}, 200
