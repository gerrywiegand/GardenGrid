from marshmallow import Schema, ValidationError, fields, pre_load, validate, validates

from Back.extensions.database import db


class Beds(db.Model):
    __tablename__ = "beds"
    __table_args__ = (
        db.UniqueConstraint("garden_id", "name", name="unique_garden_bed_name"),
    )

    id = db.Column(db.Integer, primary_key=True)
    garden_id = db.Column(db.Integer, db.ForeignKey("gardens.id"), nullable=False)
    name = db.Column(db.String(100), nullable=False)
    rows = db.Column(db.Integer, nullable=False)
    columns = db.Column(db.Integer, nullable=False)
    created_at = db.Column(db.Date, nullable=True)

    garden = db.relationship("Gardens", back_populates="beds")
    placements = db.relationship(
        "Placements", back_populates="bed", cascade="all, delete-orphan"
    )


class BedsSchema(Schema):
    id = fields.Int(dump_only=True)
    garden_id = fields.Int(required=True)
    name = fields.Str(required=True, validate=validate.Length(min=1, max=100))
    rows = fields.Int(required=True, validate=validate.Range(min=1))
    columns = fields.Int(required=True, validate=validate.Range(min=1))
    created_at = fields.Date(dump_only=True)
