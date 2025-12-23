from database import db
from marshmallow import Schema, ValidationError, fields, pre_load, validate, validates


class Plant(db.Model):
    __tablename__ = "plants"
    __table_args__ = (
        db.UniqueConstraint("user_id", "name", name="_user_plant_name_uc"),
    )

    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey("users.id"), nullable=False)
    name = db.Column(db.String(100), nullable=False)
    species = db.Column(db.String(100), nullable=True)
    sunlight_requirements = db.Column(db.String(100), nullable=True)
    water_requirements = db.Column(db.String(100), nullable=True)
    plants_per_square = db.Column(db.Integer, nullable=False, default=1)
    sq_unit_req = db.Column(db.Integer, nullable=False, default=1)
    category = db.Column(db.String(100), nullable=True)
    days_to_harvest = db.Column(db.Integer, nullable=True)
    icon = db.Column(
        db.String(100),
        nullable=False,
    )

    user = db.relationship("User", back_populates="plants")

    def __repr__(self):
        return f"<Plant {self.name}>"


class PlantSchema(Schema):
    id = fields.Int(dump_only=True)
    name = fields.Str(required=True, validate=validate.Length(min=1, max=100))
    species = fields.Str(validate=validate.Length(max=100))
    sunlight_requirements = fields.Str(validate=validate.Length(max=100))
    water_requirements = fields.Str(validate=validate.Length(max=100))
    plants_per_sq = fields.Int(required=False, validate=validate.Range(min=1))
    sq_unit_req = fields.Int(required=False, validate=validate.Range(min=1))
    category = fields.Str(validate=validate.Length(max=100))
    days_to_harvest = fields.Int(validate=validate.Range(min=0))
    icon = fields.Str(required=False, validate=validate.Length(min=1, max=100))

    @pre_load
    def handle_icon(self, data, **kwargs):
        if not data.get("icon"):
            name = data.get("name", "").strip()
            if name:
                data["icon"] = f"🌱 {name}"
        return data

    @pre_load
    def empty_strings_to_none(self, data, **kwargs):
        for field in [
            "species",
            "sunlight_requirements",
            "water_requirements",
            "category",
        ]:
            if field in data and data[field] == "":
                data[field] = None
        return data

    @pre_load
    def strip_whitespace(self, data, **kwargs):
        for field in [
            "name",
            "species",
            "sunlight_requirements",
            "water_requirements",
            "category",
            "icon",
        ]:
            if field in data and isinstance(data[field], str):
                data[field] = data[field].strip()
        return data

    @validates("name")
    def validate_name(self, value):
        if not value.strip():
            raise ValidationError("Name cannot be empty or just whitespace.")
