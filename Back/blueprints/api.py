from flask import Blueprint
from flask_restful import Api
from resources.auth import LoginResource, MeResource, SignupResource
from resources.beds import BedResource, BedsResource
from resources.companion_rules import CompanionRuleResource, CompanionRulesResource
from resources.gardens import GardenResource, GardensResource
from resources.placements import PlacementResource, PlacementsResource
from resources.plants import PlantResource, PlantsResource

api_bp = Blueprint("api", __name__, url_prefix="/api")
api = Api(api_bp)
# Register resources with their endpoints
api.add_resource(SignupResource, "/auth/signup")
api.add_resource(LoginResource, "/auth/login")
api.add_resource(MeResource, "/auth/me")
# garden resources
api.add_resource(GardensResource, "/gardens", endpoint="gardens")
api.add_resource(GardenResource, "/garden/<int:garden_id>", endpoint="garden")
# plant resources
api.add_resource(PlantsResource, "/plants", endpoint="plants")
api.add_resource(PlantResource, "/plant/<int:plant_id>", endpoint="plant")
# bed resources
api.add_resource(BedsResource, "/beds", endpoint="beds")
api.add_resource(BedResource, "/bed/<int:bed_id>", endpoint="bed")
# placement resources
api.add_resource(
    PlacementsResource, "/bed/<int:bed_id>/placements", endpoint="placements"
)
api.add_resource(
    PlacementResource, "/placement/<int:placement_id>", endpoint="placement"
)
# companion rules resources
api.add_resource(CompanionRulesResource, "/companion_rules", endpoint="companion_rules")
api.add_resource(
    CompanionRuleResource,
    "/companion_rule/<int:companion_rule_id>",
    endpoint="companion_rule",
)
