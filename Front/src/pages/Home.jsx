import { useState, useEffect, use } from "react";
import NavBar from "../components/NavBar";
import PlantList from "../components/plants/PlantList";
import { getPlants } from "../api/client";

export default function Home() {
  const [plants, setPlants] = useState([]);
  const [error, setError] = useState("");
  const [status, setStatus] = useState("");

  async function loadPlants() {
    setError("");
    setStatus("Loading plants...");
    try {
      const data = await getPlants();
      setPlants(data);
      setStatus(`Loaded ${Array.isArray(data) ? data.length : 0} plants.`);
    } catch (err) {
      setStatus("");
      setError(err.message || "Failed to load plants");
    }
  }
  useEffect(() => {
    loadPlants();
  }, []);

  return (
    <div style={{ fontFamily: "system-ui" }}>
      <NavBar />
      <div style={{ maxWidth: 900, margin: "24px auto", padding: 12 }}>
        <h2>Home</h2>

        {status && <p>{status}</p>}
        {error && (
          <div style={{ border: "1px solid #f00", padding: 10 }}>
            Error: {error}
          </div>
        )}

        <h3 style={{ marginTop: 16 }}>Plants</h3>
        <PlantList plants={plants} />
      </div>
    </div>
  );
}
