# GardenGrid

# GardenGrid

GardenGrid is a full-stack, grid-based garden planning application designed to help users visually plan gardens, beds, and plant placements using deterministic spatial rules.

The core goal of the project is to model **real-world garden planning constraints** (space, placement, ownership) in a clear, structured way — prioritizing correctness, clarity, and extensibility over premature optimization or visual complexity.

---

## Features

### Core Functionality

- User authentication with JWT
- Per-user data isolation
- Full CRUD support for:
  - Gardens
  - Beds
  - Plants
  - Placements
- Grid-based placement system for visual spatial planning
- Simple, deterministic UI for interacting with garden layouts

### Spatial Planning

- Gardens define a grid (rows × columns)
- Plants are placed within that grid
- Placements represent a plant occupying a specific grid coordinate
- Grid view renders placements visually instead of abstract lists

---

## Tech Stack

### Backend

- Python
- Flask
- Flask-RESTful
- Flask-JWT-Extended
- Flask-SQLAlchemy
- Marshmallow / Marshmallow-SQLAlchemy
- SQLite (development)

### Frontend

- React
- JavaScript (ES6+)
- Fetch API
- Simple CSS for grid visualization

---

## Data Model Overview

- **User**
  - Owns gardens, plants, beds, and placements
- **Garden**
  - Contains list of beds
- **Bed**
  - Logical subdivision within a garden consisting of rows and columns
- **Plant**
  - User-owned plant definitions
- **Placement**
  - Joins a plant to a specific `(row, column)` position in a bed

Each model supports full CRUD operations via RESTful endpoints.

---

## Why This Design

GardenGrid was designed with the following principles:

- Clear ownership boundaries (per-user data)
- Deterministic rules before UI polish
- Explicit modeling of spatial relationships

The architecture allows for future enhancements such as:

- Companion planting rules
- Conflict detection
- Smarter placement constraints
- Visual drag-and-drop grid interaction

---

## Setup Instructions

### Backend

```bash
cd Back
pipenv install
pipenv shell
flask db upgrade
flask run
```

### Frontend

```bash
cd Front
npm install
npm run dev
```

### Future improvements

- Companion plant rules
- visual feedback on companion interactions (positve, negative)
- Drag and drop UI
- More data options on plants (sunlight, water,plants per sq foot )
