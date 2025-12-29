from flask import Blueprint
from flask_restful import Api
from resources.auth import LoginResource, MeResource, SignupResource

api_bp = Blueprint("api", __name__, url_prefix="/api")
api = Api(api_bp)

api.add_resource(SignupResource, "/auth/signup")
api.add_resource(LoginResource, "/auth/login")
api.add_resource(MeResource, "/auth/me")
