import { useState, useEffect } from "react";

export default function PlacementForm({
  bed,
  plants,
  plantId,
  setPlantId,
  onSubmit,
  submitting,
}) {
  const [row, setRow] = useState(0);
  const [col, setCol] = useState(0);
  const [notes, setNotes] = useState("");

  useEffect(() => {
    if (!plantId && plants?.length) setPlantId(plants[0].id);
  }, [plants, plantId, setPlantId]);

  async function handleSubmit(e) {
    e.preventDefault();
    await onSubmit({
      plantId: Number(plantId),
      row: Number(row),
      col: Number(col),
      notes: notes?.trim() ? notes.trim() : null,
    });
    setNotes("");
  }

  return (
    <form onSubmit={handleSubmit} style={{ marginBottom: 16 }}>
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "1fr 120px 120px",
          gap: 10,
          maxWidth: 720,
        }}
      >
        <label style={{ display: "grid", gap: 6 }}>
          Plant
          <select
            value={plantId}
            onChange={(e) => setPlantId(e.target.value)}
            disabled={!plants?.length}
          >
            {!plants?.length ? <option value="">No plants yet</option> : null}
            {(plants || []).map((p) => (
              <option key={p.id} value={p.id}>
                {p.icon ? `${p.icon} ` : ""}
                {p.name}
              </option>
            ))}
          </select>
        </label>

        <label style={{ display: "grid", gap: 6 }}>
          Row (0–{Number(bed.rows) - 1})
          <input
            type="number"
            value={row}
            onChange={(e) => setRow(e.target.value)}
            min={0}
            step={1}
          />
        </label>

        <label style={{ display: "grid", gap: 6 }}>
          Col (0–{Number(bed.columns) - 1})
          <input
            type="number"
            value={col}
            onChange={(e) => setCol(e.target.value)}
            min={0}
            step={1}
          />
        </label>
      </div>

      <div style={{ display: "grid", gap: 6, maxWidth: 720, marginTop: 10 }}>
        <label style={{ display: "grid", gap: 6 }}>
          Notes (optional)
          <input
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            placeholder="e.g., 'north edge', 'needs trellis'"
          />
        </label>
      </div>

      <button
        type="submit"
        disabled={submitting || !plants?.length}
        style={{ marginTop: 10 }}
      >
        {submitting ? "Placing..." : "Place Plant"}
      </button>
    </form>
  );
}
