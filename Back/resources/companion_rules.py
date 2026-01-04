from extensions.database import db
from flask import request
from flask_jwt_extended import get_jwt_identity, jwt_required
from flask_restful import Resource
from marshmallow import ValidationError
from models.companion_rules import CompanionRule, CompanionRuleSchema
from models.gardens import Garden, GardenSchema


class CompanionRulesResource(Resource):
    @jwt_required()
    def get(self):
        user_id = int(get_jwt_identity())
        CompanionRules = CompanionRule.query.filter_by(user_id=user_id).all()
        return CompanionRuleSchema(many=True).dump(CompanionRules), 200

    @jwt_required()
    def post(self):
        user_id = int(get_jwt_identity())
        payload = request.get_json() or {}
        try:
            data = CompanionRuleSchema().load(payload)
            a = data.get("plant_a_id")
            b = data.get("plant_b_id")
            if a is not None and b is not None:
                if a == b:
                    return {
                        "message": "plant_a_id and plant_b_id must be different"
                    }, 400
                if a > b:
                    data["plant_a_id"], data["plant_b_id"] = b, a

        except ValidationError as err:
            return {"message": "Validation errors", "errors": err.messages}, 400

        companion_rule = CompanionRule(user_id=user_id, **data)
        db.session.add(companion_rule)
        db.session.commit()
        return CompanionRuleSchema().dump(companion_rule), 201


class CompanionRuleResource(Resource):
    @jwt_required()
    def get(self, companion_rule_id):
        user_id = int(get_jwt_identity())
        companion_rule = CompanionRule.query.filter_by(id=companion_rule_id).first()
        if not companion_rule or companion_rule.user_id != user_id:
            return {"message": "Companion Rule not found"}, 404
        return CompanionRuleSchema().dump(companion_rule), 200

    @jwt_required()
    def delete(self, companion_rule_id):
        user_id = int(get_jwt_identity())
        companion_rule = CompanionRule.query.filter_by(id=companion_rule_id).first()
        if not companion_rule or companion_rule.user_id != user_id:
            return {"message": "Companion Rule not found"}, 404

        db.session.delete(companion_rule)
        db.session.commit()
        return {"message": "Companion Rule deleted"}, 200

    @jwt_required()
    def patch(self, companion_rule_id):
        user_id = int(get_jwt_identity())
        companion_rule = CompanionRule.query.filter_by(id=companion_rule_id).first()
        if not companion_rule or companion_rule.user_id != user_id:
            return {"message": "Companion Rule not found"}, 404

        payload = request.get_json() or {}
        try:
            data = CompanionRuleSchema(partial=True).load(payload)
            a = data.get("plant_a_id")
            b = data.get("plant_b_id")
            if a is not None and b is not None:
                if a == b:
                    return {
                        "message": "plant_a_id and plant_b_id must be different"
                    }, 400
                if a > b:
                    data["plant_a_id"], data["plant_b_id"] = b, a

        except ValidationError as err:
            return {"message": "Validation errors", "errors": err.messages}, 400

        for key, value in data.items():
            setattr(companion_rule, key, value)

        db.session.commit()
        return CompanionRuleSchema().dump(companion_rule), 200
