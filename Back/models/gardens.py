from extensions.database import db
from marshmallow import Schema, ValidationError, fields, pre_load, validate, validates


class Garden(db.Model):
    __tablename__ = "gardens"
    __table_args__ = (
        db.UniqueConstraint("user_id", "name", name="unique_user_garden_name"),
    )

    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey("users.id"), nullable=False)
    name = db.Column(db.String(100), nullable=False)
    location = db.Column(
        db.String(200),
    )
    created_at = db.Column(db.Date, default=db.func.current_date())

    user = db.relationship("User", back_populates="gardens")
    beds = db.relationship("Bed", back_populates="garden", cascade="all, delete-orphan")


class GardenSchema(Schema):
    id = fields.Int(dump_only=True)
    user_id = fields.Int(dump_only=True)
    name = fields.Str(required=True, validate=validate.Length(min=1, max=100))
    location = fields.Str(validate=validate.Length(min=1, max=200))
    created_at = fields.Date(dump_only=True)
