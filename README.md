# GardenGrid

GardenGrid is a full-stack Flask + React app for planning gardens with a grid-based bed layout. Users can create gardens/beds, build a personal plant library (with growing metadata), place plants on a grid, and define companion-planting relationships that show **visual warnings** on the grid.

## Features

- JWT authentication + per-user data isolation
- Full CRUD for:
  - Gardens
  - Beds (rows × cols grid, size capped)
  - Plants (optional icon + growing metadata)
  - Placements (plant → bed coordinate)
  - Companion Rules (beneficial / neutral / detrimental)

### Grid view + feedback

- Beds render as a grid with emoji plant icons
- Hover tooltips show coordinates and companion context
- When placing a plant, neighboring placements highlight:
  - **Green border** = beneficial relationship
  - **Red border** = detrimental relationship
- Companion rules are **advisory** (warnings), not hard restrictions

## Tech Stack

**Backend**

- Python, Flask, Flask-RESTful
- Flask-JWT-Extended
- Flask-SQLAlchemy, Marshmallow
- Alembic migrations
- SQLite (dev)

**Frontend**

- React + React Router
- Vite
- Fetch API

## Setup

### Backend

```bash
cd Back
pipenv install
pipenv shell
flask db upgrade
flask run
```

Backend runs at http://localhost:5000

### Frontend

```bash
cd Front
npm install
npm run dev
```

Frontend runs at http://localhost:5173

### Design Notes & Limitations

- Placements enforce uniqueness at the database level; the UI formats errors into readable messages.

- Companion rules provide guidance (warnings) rather than blocking placement.

- Bed grid size is capped to avoid performance issues with extremely large grids.
