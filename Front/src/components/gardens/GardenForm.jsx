import { useState } from "react";

export default function GardenForm({ onCreate, loading }) {
  const [name, setName] = useState("");

  async function handleSubmit(e) {
    e.preventDefault();
    const trimmed = name.trim();
    if (!trimmed) return;

    await onCreate({ name: trimmed });
    setName("");
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

      <button disabled={loading} style={{ padding: 10 }}>
        {loading ? "Adding..." : "Add Garden"}
      </button>
    </form>
  );
}
