import { useEffect, useState } from "react";
import NavBar from "../components/NavBar";
import { createPlant, deletePlant, getPlants } from "../api/client";
import PlantForm from "../components/plants/PlantForm";
import PlantList from "../components/plants/PlantList";

export default function Plants() {
  const [plants, setPlants] = useState([]);
  const [loading, setLoading] = useState(true);

  const [creating, setCreating] = useState(false);
  const [deletingId, setDeletingId] = useState(null);

  const [error, setError] = useState("");

  async function load() {
    setError("");
    setLoading(true);
    try {
      const data = await getPlants();
      setPlants(data);
    } catch (err) {
      setError(err.message || "Failed to load plants");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    load();
  }, []);

  async function handleCreate(payload) {
    setError("");
    setCreating(true);
    try {
      const newPlant = await createPlant(payload);

      setPlants((prev) => [newPlant, ...prev]);
    } catch (err) {
      setError(err.message || "Failed to create plant");
      throw err;
    } finally {
      setCreating(false);
    }
  }

  async function handleDelete(id) {
    setError("");
    setDeletingId(id);
    try {
      await deletePlant(id);
      setPlants((prev) => prev.filter((p) => p.id !== id));
    } catch (err) {
      setError(err.message || "Failed to delete plant");
    } finally {
      setDeletingId(null);
    }
  }

  async function handleUpdated(updatedPlant) {
    setPlants((prev) =>
      prev.map((p) => (p.id === updatedPlant.id ? updatedPlant : p))
    );
  }

  return (
    <div style={{ fontFamily: "system-ui" }}>
      <NavBar />
      <div style={{ maxWidth: 900, margin: "24px auto", padding: 12 }}>
        <h2>Plants</h2>

        {error && (
          <div
            style={{ border: "1px solid #f00", padding: 10, marginBottom: 12 }}
          >
            Error: {error}
          </div>
        )}

        <PlantForm onCreate={handleCreate} loading={creating} />

        <div style={{ marginTop: 20 }}>
          <h3>Your Plant Library</h3>
          {loading ? (
            <p>Loading...</p>
          ) : (
            <PlantList
              plants={plants}
              onDelete={handleDelete}
              deletingId={deletingId}
              onUpdated={handleUpdated}
            />
          )}
        </div>
      </div>
    </div>
  );
}
