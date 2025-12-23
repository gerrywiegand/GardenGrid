from database import db
from marshmallow import Schema, ValidationError, fields, pre_load, validate, validates


class CompanionRule(db.Model):
    __tablename__ = "companion_rules"

    id = db.Column(db.Integer, primary_key=True)
    plant_a_id = db.Column(db.Integer, db.ForeignKey("plants.id"), nullable=False)
    plant_b_id = db.Column(db.Integer, db.ForeignKey("plants.id"), nullable=False)
    relationship = db.Column(
        db.String(50), nullable=False
    )  # e.g., "beneficial", "neutral", "detrimental"
    description = db.Column(db.String(255), nullable=True)

    plant_a = db.relationship("Plant", foreign_keys=[plant_a_id])
    plant_b = db.relationship("Plant", foreign_keys=[plant_b_id])

    def __repr__(self):
        return f"<CompanionRule {self.plant_a.name} - {self.relationship} - {self.plant_b.name}>"


class CompanionRuleSchema(Schema):
    id = fields.Int(dump_only=True)
    plant_a_id = fields.Int(required=True)
    plant_b_id = fields.Int(required=True)
    relationship = fields.Str(
        required=True, validate=validate.OneOf(["beneficial", "neutral", "detrimental"])
    )
    description = fields.Str(validate=validate.Length(max=255))
