import { useState } from "react";

export default function BedForm({ gardenId, onCreate, loading }) {
  const [name, setName] = useState("");
  const [rows, setRows] = useState("");
  const [columns, setColumns] = useState("");

  async function handleSubmit(e) {
    e.preventDefault();
    if (!name.trim() || !rows || !columns) return;

    const payload = {
      name: name.trim(),
      rows: parseInt(rows, 10),
      columns: parseInt(columns, 10),
      garden_id: gardenId,
    };

    await onCreate(payload);

    setName("");
    setRows("");
    setColumns("");
  }

  return (
    <form
      onSubmit={handleSubmit}
      style={{ display: "grid", gap: 10, maxWidth: 420 }}
    >
      <h3>Add Bed</h3>

      <label>
        Bed Name *
        <input
          value={name}
          onChange={(e) => setName(e.target.value)}
          style={{ width: "100%", padding: 8 }}
          placeholder="e.g., North Bed"
        />
      </label>

      <label>
        Rows *
        <input
          type="number"
          min="1"
          max="50"
          value={rows}
          onChange={(e) => setRows(e.target.value)}
          style={{ width: "100%", padding: 8 }}
        />
      </label>

      <label>
        Columns *
        <input
          type="number"
          min="1"
          max="50"
          value={columns}
          onChange={(e) => setColumns(e.target.value)}
          style={{ width: "100%", padding: 8 }}
        />
      </label>

      <button disabled={loading} style={{ padding: 10 }}>
        {loading ? "Adding..." : "Add Bed"}
      </button>

      <p style={{ opacity: 0.7, margin: 0, fontSize: 14 }}>
        Max 50×50 grid (larger grids may cause performance issues)
      </p>
    </form>
  );
}
