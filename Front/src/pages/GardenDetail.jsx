import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import NavBar from "../components/NavBar";
import {
  getGardens,
  getBeds,
  createBed,
  deleteBed,
  getPlants,
} from "../api/client";
import BedForm from "../components/beds/BedForm";
import BedList from "../components/beds/BedList";
import PlacementsPanel from "../components/placements/PlacementsPanel";

export default function GardenDetail() {
  const { id } = useParams();
  const gardenId = parseInt(id, 10);
  const [plants, setPlants] = useState([]);
  const [garden, setGarden] = useState(null);
  const [beds, setBeds] = useState([]);
  const [loading, setLoading] = useState(true);

  const [creating, setCreating] = useState(false);
  const [deletingId, setDeletingId] = useState(null);

  const [error, setError] = useState("");

  async function load() {
    setError("");
    setLoading(true);
    try {
      // Fetch gardens to get the current garden
      const gardensData = await getGardens();
      const foundGarden = gardensData.find((g) => g.id === gardenId);

      if (!foundGarden) {
        setError("Garden not found");
        setLoading(false);
        return;
      }

      setGarden(foundGarden);

      // Fetch all beds and filter by garden_id
      const bedsData = await getBeds();
      const filteredBeds = bedsData.filter((b) => b.garden_id === gardenId);
      setBeds(filteredBeds);
      const plantsData = await getPlants();
      setPlants(plantsData);
    } catch (err) {
      setError(err.message || "Failed to load garden");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    load();
  }, [gardenId]);

  async function handleCreate(payload) {
    setError("");
    setCreating(true);
    try {
      const newBed = await createBed(payload);
      setBeds((prev) => [newBed, ...prev]);
    } catch (err) {
      setError(err.message || "Failed to create bed");
      throw err;
    } finally {
      setCreating(false);
    }
  }

  async function handleDelete(bedId) {
    setError("");
    setDeletingId(bedId);
    try {
      await deleteBed(bedId);
      setBeds((prev) => prev.filter((b) => b.id !== bedId));
    } catch (err) {
      setError(err.message || "Failed to delete bed");
    } finally {
      setDeletingId(null);
    }
  }

  async function handleUpdated(updatedBed) {
    setBeds((prev) =>
      prev.map((b) => (b.id === updatedBed.id ? updatedBed : b))
    );
  }

  if (loading) {
    return (
      <div style={{ fontFamily: "system-ui" }}>
        <NavBar />
        <div style={{ maxWidth: 900, margin: "24px auto", padding: 12 }}>
          <p>Loading...</p>
        </div>
      </div>
    );
  }

  if (error && !garden) {
    return (
      <div style={{ fontFamily: "system-ui" }}>
        <NavBar />
        <div style={{ maxWidth: 900, margin: "24px auto", padding: 12 }}>
          <div style={{ color: "red", marginBottom: 12 }}>{error}</div>
          <Link to="/gardens">← Back to Gardens</Link>
        </div>
      </div>
    );
  }

  return (
    <div style={{ fontFamily: "system-ui" }}>
      <NavBar />
      <div style={{ maxWidth: 900, margin: "24px auto", padding: 12 }}>
        <Link
          to="/gardens"
          style={{ marginBottom: 12, display: "inline-block" }}
        >
          ← Back to Gardens
        </Link>

        <h2>{garden?.name}</h2>
        {garden?.location && (
          <p style={{ opacity: 0.8 }}>Location: {garden.location}</p>
        )}

        {error && (
          <div
            style={{ border: "1px solid #f00", padding: 10, marginBottom: 12 }}
          >
            Error: {error}
          </div>
        )}

        <BedForm
          gardenId={gardenId}
          onCreate={handleCreate}
          loading={creating}
        />

        <div style={{ marginTop: 20 }}>
          <h3>Beds in this Garden</h3>

          {beds.length === 0 ? (
            <p>No beds yet. Add one above.</p>
          ) : (
            beds.map((bed) => (
              <div key={bed.id} style={{ marginBottom: 18 }}>
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                  }}
                >
                  <div>
                    <strong>{bed.name}</strong>{" "}
                    <span style={{ opacity: 0.7 }}>
                      ({bed.rows} x {bed.columns})
                    </span>
                  </div>

                  <button
                    onClick={() => handleDelete(bed.id)}
                    disabled={deletingId === bed.id}
                  >
                    {deletingId === bed.id ? "Deleting..." : "Delete"}
                  </button>
                </div>

                <PlacementsPanel key={bed.id} bed={bed} plants={plants} />
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
