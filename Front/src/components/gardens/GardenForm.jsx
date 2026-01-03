import { useState } from "react";

export default function GardenForm({ onCreate, loading }) {
  const [name, setName] = useState("");
  const [location, setLocation] = useState("");

  async function handleSubmit(e) {
    e.preventDefault();
    if (!name.trim()) return;

    const payload = { name: name.trim() };
    const loc = location.trim();
    if (loc) payload.location = loc;

    await onCreate(payload);

    setName("");
    setLocation("");
  }

  return (
    <form
      onSubmit={handleSubmit}
      style={{ display: "grid", gap: 10, maxWidth: 420 }}
    >
      <h3>Add Garden</h3>

      <label>
        Name *
        <input
          value={name}
          onChange={(e) => setName(e.target.value)}
          style={{ width: "100%", padding: 8 }}
        />
      </label>

      <label>
        Location (optional)
        <input
          value={location}
          onChange={(e) => setLocation(e.target.value)}
          style={{ width: "100%", padding: 8 }}
        />
      </label>

      <button disabled={loading} style={{ padding: 10 }}>
        {loading ? "Adding..." : "Add Garden"}
      </button>
    </form>
  );
}
