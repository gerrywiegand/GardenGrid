from database import db
from flask_jwt_extended import get_jwt_identity, jwt_required
from models.Beds import Beds
from models.Gardens import Gardens
from models.Placements import Placements
from models.Plants import Plant
from models.User import User

current_user_id = get_jwt_identity()

require_garden_ownership = jwt_required()(
    lambda garden_id: _check_garden_ownership(garden_id)
)
require_bed_ownership = jwt_required()(lambda bed_id: _check_bed_ownership(bed_id))
require_plant_ownership = jwt_required()(
    lambda plant_id: _check_plant_ownership(plant_id)
)
require_placement_ownership = jwt_required()(
    lambda placement_id: _check_placement_ownership(placement_id)
)


def _check_garden_ownership(garden_id):
    garden = Gardens.query.get(garden_id)
    if garden is None or garden.user_id != current_user_id:
        return False
    return True


def _check_bed_ownership(bed_id):
    bed = Beds.query.get(bed_id)
    if bed is None:
        return False
    garden = Gardens.query.get(bed.garden_id)
    if garden is None or garden.user_id != current_user_id:
        return False
    return True


def _check_plant_ownership(plant_id):
    plant = Plant.query.get(plant_id)
    if plant is None or plant.user_id != current_user_id:
        return False
    return True


def _check_placement_ownership(placement_id):
    placement = Placements.query.get(placement_id)
    if placement is None:
        return False
    bed = Beds.query.get(placement.bed_id)
    if bed is None:
        return False
    garden = Gardens.query.get(bed.garden_id)
    if garden is None or garden.user_id != current_user_id:
        return False
    return True
