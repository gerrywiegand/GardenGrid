import { useEffect, useState } from "react";
import NavBar from "../components/NavBar";
import { createGarden, getGardens, deleteGarden } from "../api/client";
import GardenForm from "../components/gardens/GardenForm";
import GardenList from "../components/gardens/GardenList";

export default function Gardens() {
  const [gardens, setGardens] = useState([]);
  const [loading, setLoading] = useState(true);

  const [creating, setCreating] = useState(false);
  const [deletingId, setDeletingId] = useState(null);

  const [error, setError] = useState("");

  async function load() {
    setError("");
    setLoading(true);
    try {
      const data = await getGardens();
      setGardens(data);
    } catch (err) {
      setError(err.message || "Failed to load gardens");
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
      const newGarden = await createGarden(payload);
      setGardens((prev) => [newGarden, ...prev]);
    } catch (err) {
      setError(err.message || "Failed to create garden");
      throw err;
    } finally {
      setCreating(false);
    }
  }

  async function handleDelete(id) {
    setError("");
    setDeletingId(id);
    try {
      await deleteGarden(id);
      setGardens((prev) => prev.filter((g) => g.id !== id));
    } catch (err) {
      setError(err.message || "Failed to delete garden");
    } finally {
      setDeletingId(null);
    }
  }

  async function handleUpdated(updatedGarden) {
    setGardens((prev) =>
      prev.map((g) => (g.id === updatedGarden.id ? updatedGarden : g))
    );
  }

  return (
    <div style={{ fontFamily: "system-ui" }}>
      <NavBar />
      <div style={{ maxWidth: 900, margin: "24px auto", padding: 12 }}>
        <h2>Gardens</h2>

        {error && (
          <div
            style={{ border: "1px solid #f00", padding: 10, marginBottom: 12 }}
          >
            Error: {error}
          </div>
        )}

        <GardenForm onCreate={handleCreate} loading={creating} />

        <div style={{ marginTop: 20 }}>
          <h3>Your Gardens</h3>
          {loading ? (
            <p>Loading...</p>
          ) : (
            <GardenList
              gardens={gardens}
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
