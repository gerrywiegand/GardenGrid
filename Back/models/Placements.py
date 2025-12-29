from extensions.database import db
from marshmallow import Schema, ValidationError, fields, pre_load, validate, validates


class Placements(db.Model):
    __tablename__ = "placements"
    __table_args__ = (
        db.UniqueConstraint(
            "bed_id", "position_row", "position_column", name="unique_bed_position"
        ),
    )

    id = db.Column(db.Integer, primary_key=True)
    bed_id = db.Column(db.Integer, db.ForeignKey("beds.id"), nullable=False)
    plant_id = db.Column(db.Integer, db.ForeignKey("plants.id"), nullable=False)
    position_row = db.Column(db.Integer, nullable=False)
    position_column = db.Column(db.Integer, nullable=False)
    planted_at = db.Column(db.Date, nullable=True)
    notes = db.Column(db.String(500), nullable=True)

    bed = db.relationship("Beds", back_populates="placements")
    plant = db.relationship("Plant", back_populates="placements")


class PlacementsSchema(Schema):
    id = fields.Int(dump_only=True)
    plant_id = fields.Int(required=True)
    position_row = fields.Int(required=True, validate=validate.Range(min=0))
    position_column = fields.Int(required=True, validate=validate.Range(min=0))
    planted_at = fields.Date(required=False, allow_none=True)
    notes = fields.Str(allow_none=True, validate=validate.Length(max=500))
