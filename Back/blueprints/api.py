from flask import Blueprint
from flask_restful import Api
from resources.auth import LoginResource, MeResource, SignupResource
from resources.beds import BedResource, BedsResource
from resources.gardens import GardenResource, GardensResource
from resources.plants import PlantResource, PlantsResource

api_bp = Blueprint("api", __name__, url_prefix="/api")
api = Api(api_bp)

api.add_resource(SignupResource, "/auth/signup")
api.add_resource(LoginResource, "/auth/login")
api.add_resource(MeResource, "/auth/me")
api.add_resource(GardensResource, "/gardens", endpoint="gardens")
api.add_resource(GardenResource, "/garden/<int:garden_id>", endpoint="garden")
api.add_resource(PlantsResource, "/plants", endpoint="plants")
api.add_resource(PlantResource, "/plant/<int:plant_id>", endpoint="plant")
api.add_resource(BedsResource, "/beds", endpoint="beds")
api.add_resource(BedResource, "/bed/<int:bed_id>", endpoint="bed")
