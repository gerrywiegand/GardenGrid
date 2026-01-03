from extensions.database import db
from marshmallow import (
    Schema,
    ValidationError,
    fields,
    pre_load,
    validate,
    validates,
    validates_schema,
)


class CompanionRule(db.Model):
    __tablename__ = "companion_rules"
    __table_args__ = (
        # Ensure unique companion rules per user and plant pair
        db.UniqueConstraint(
            "user_id", "plant_a_id", "plant_b_id", name="_user_plant_companion_rule_uc"
        ),
        # Ensure plant_a and plant_b are distinct and ordered to avoid duplicates
        db.CheckConstraint(
            "plant_a_id != plant_b_id", name="ck_companion_rule_distinct_plants"
        ),
        db.CheckConstraint(
            "plant_a_id < plant_b_id", name="ck_companion_rule_ordered_plants"
        ),
        # Ensure interaction is one of the predefined values
        db.CheckConstraint(
            "interaction IN ('beneficial', 'neutral', 'detrimental')",
            name="ck_companion_rule_valid_interaction",
        ),
    )

    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey("users.id"), nullable=False)
    plant_a_id = db.Column(
        db.Integer, db.ForeignKey("plants.id", ondelete="CASCADE"), nullable=False
    )
    plant_b_id = db.Column(
        db.Integer, db.ForeignKey("plants.id", ondelete="CASCADE"), nullable=False
    )
    interaction = db.Column(
        db.String(50), nullable=False
    )  # e.g., "beneficial", "neutral", "detrimental"
    description = db.Column(db.String(255), nullable=True)

    plant_a = db.relationship("Plant", foreign_keys=[plant_a_id])
    plant_b = db.relationship("Plant", foreign_keys=[plant_b_id])

    def __repr__(self):
        return f"<CompanionRule {self.plant_a.name} - {self.interaction} - {self.plant_b.name}>"


class CompanionRuleSchema(Schema):
    id = fields.Int(dump_only=True)
    plant_a_id = fields.Int(
        required=True,
    )
    plant_b_id = fields.Int(required=True)
    interaction = fields.Str(
        required=True, validate=validate.OneOf(["beneficial", "neutral", "detrimental"])
    )
    description = fields.Str(validate=validate.Length(max=255))

    @validates_schema
    def validate_plants(self, data, **kwargs):
        if data["plant_a_id"] == data["plant_b_id"]:
            raise ValidationError("plant_a_id and plant_b_id must be different.")
