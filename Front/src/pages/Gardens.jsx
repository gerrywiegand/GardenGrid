import { useEffect, useState } from "react";
import NavBar from "../components/NavBar";
import { createGarden, getGardens } from "../api/client";
import GardenForm from "../components/gardens/GardenForm";
import GardenList from "../components/gardens/GardenList";

export default function Gardens() {
  const [gardens, setGardens] = useState([]);
  const [loading, setLoading] = useState(true);
  const [creating, setCreating] = useState(false);
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
          {loading ? <p>Loading...</p> : <GardenList gardens={gardens} />}
        </div>
      </div>
    </div>
  );
}
