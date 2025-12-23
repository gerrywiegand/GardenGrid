from database import db
from marshmallow import Schema, ValidationError, fields, pre_load, validate, validates

specials = "!@#$%^&*()-_=+[]{}|;:'\",.<>?/`~"


class User(db.Model):
    __tablename__ = "users"

    id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String(80), unique=True, nullable=False)
    password_hash = db.Column(db.String(128), nullable=False)

    plants = db.relationship(
        "Plant", back_populates="user", cascade="all, delete-orphan"
    )

    def __repr__(self):
        return f"<User {self.username}>"


class UserSchema(Schema):
    id = fields.Int(dump_only=True)
    username = fields.Str(required=True, validate=validate.Length(min=3, max=80))
    password = fields.Str(
        required=True, load_only=True, validate=validate.Length(min=6)
    )

    @validates("username")
    def validate_username(self, value):
        if not value.isalnum():
            raise ValidationError("Username must be alphanumeric.")

    @validates("password")
    def validate_password(self, value):
        if len(value) < 6:
            raise ValidationError("Password must be at least 6 characters long.")
        if " " in value:
            raise ValidationError("Password must not contain spaces.")
        if not any(char.isdigit() for char in value):
            raise ValidationError("Password must contain at least one digit.")
        if not any(char.isupper() for char in value):
            raise ValidationError(
                "Password must contain at least one uppercase letter."
            )
        if not any(char in specials for char in value):
            raise ValidationError(
                "Password must contain at least one special character."
            )

    @pre_load
    def process_input(self, data, **kwargs):
        data["username"] = data["username"].strip()
        return data

    @pre_load
    def process_password(self, data, **kwargs):
        data["password"] = data["password"].strip()
        return data
