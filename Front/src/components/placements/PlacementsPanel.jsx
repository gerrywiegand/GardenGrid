import { useEffect, useMemo, useState } from "react";
import {
  createPlacement,
  deletePlacement,
  getPlacements,
} from "../../api/client";

export default function PlacementsPanel({ bed, plants }) {
  const [placements, setPlacements] = useState([]);
  const [loading, setLoading] = useState(true);

  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  const [plantId, setPlantId] = useState(plants?.[0]?.id ?? "");
  const [row, setRow] = useState(0);
  const [col, setCol] = useState(0);
  const [notes, setNotes] = useState("");

  const plantsById = useMemo(() => {
    const map = {};
    (plants || []).forEach((p) => {
      map[p.id] = p;
    });
    return map;
  }, [plants]);

  const placementByPos = useMemo(() => {
    const m = new Map();
    placements.forEach((p) => {
      m.set(`${p.position_row}-${p.position_column}`, p);
    });
    return m;
  }, [placements]);

  useEffect(() => {
    let cancelled = false;

    async function load() {
      setError("");
      setLoading(true);
      try {
        const data = await getPlacements(bed.id);
        if (!cancelled) setPlacements(data);
      } catch (err) {
        if (!cancelled) setError(err?.message || "Failed to load placements");
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    load();
    return () => {
      cancelled = true;
    };
  }, [bed.id]);

  useEffect(() => {
    if (!plantId && plants?.length) setPlantId(plants[0].id);
  }, [plants, plantId]);

  function boundsError(r, c) {
    const rows = Number(bed.rows);
    const cols = Number(bed.columns);
    if (Number.isNaN(rows) || Number.isNaN(cols))
      return "Bed dimensions missing.";
    if (r < 0 || c < 0) return "Row/Col must be 0 or greater.";
    if (r >= rows || c >= cols)
      return `Out of bounds. Valid rows: 0–${rows - 1}, cols: 0–${cols - 1}.`;
    return "";
  }

  async function handleCreate(e) {
    e.preventDefault();
    setError("");

    const r = Number(row);
    const c = Number(col);
    const pid = Number(plantId);

    if (!pid) return setError("Pick a plant.");
    if (Number.isNaN(r) || Number.isNaN(c))
      return setError("Row and Col must be numbers.");

    const bErr = boundsError(r, c);
    if (bErr) return setError(bErr);

    setSubmitting(true);
    try {
      const payload = {
        plant_id: pid,
        position_row: r,
        position_column: c,
        notes: notes?.trim() ? notes.trim() : null,
      };

      const created = await createPlacement(bed.id, payload);

      setPlacements((prev) => [created, ...prev]);

      setNotes("");
    } catch (err) {
      setError(err?.message || "Failed to create placement");
    } finally {
      setSubmitting(false);
    }
  }

  async function handleDelete(placementId) {
    setError("");
    try {
      await deletePlacement(placementId);
      setPlacements((prev) => prev.filter((p) => p.id !== placementId));
    } catch (err) {
      setError(err?.message || "Failed to delete placement");
    }
  }

  return (
    <section
      style={{ marginTop: 18, paddingTop: 12, borderTop: "1px solid #eee" }}
    >
      <h3 style={{ marginBottom: 8 }}>Placements</h3>

      {error ? (
        <div style={{ border: "1px solid red", padding: 10, marginBottom: 12 }}>
          Error: {error}
        </div>
      ) : null}

      <div style={{ marginBottom: 12, fontSize: 14, color: "#666" }}>
        Rows: <strong>{bed.rows}</strong> • Columns:{" "}
        <strong>{bed.columns}</strong> • Coordinates are{" "}
        <strong>0-based</strong>.
      </div>

      {/* Create placement */}
      <form onSubmit={handleCreate} style={{ marginBottom: 16 }}>
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

      {/* Grid preview */}
      <div style={{ marginBottom: 16 }}>
        <h4 style={{ margin: "8px 0" }}>Bed Grid</h4>

        {loading ? (
          <p>Loading placements...</p>
        ) : (
          <div
            style={{
              display: "grid",
              gridTemplateColumns: `repeat(${Number(bed.columns)}, 44px)`,
              gap: 6,
              alignItems: "center",
            }}
          >
            {Array.from({ length: Number(bed.rows) }).map((_, r) =>
              Array.from({ length: Number(bed.columns) }).map((_, c) => {
                const placement = placementByPos.get(`${r}-${c}`);
                const plant = placement ? plantsById[placement.plant_id] : null;

                return (
                  <div
                    key={`${r}-${c}`}
                    title={
                      plant ? `${plant.name} @ (${r},${c})` : `(${r},${c})`
                    }
                    style={{
                      width: 44,
                      height: 44,
                      border: "1px solid #ddd",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      fontSize: 18,
                      background: placement ? "#f6fff5" : "white",
                    }}
                  >
                    {plant?.icon ?? (placement ? "🌱" : "")}
                  </div>
                );
              })
            )}
          </div>
        )}
      </div>

      {/* Placement list */}
      <div>
        <h4 style={{ margin: "8px 0" }}>Current Placements</h4>

        {!loading && placements.length === 0 ? <p>No placements yet.</p> : null}

        <ul style={{ listStyle: "none", padding: 0, margin: 0 }}>
          {placements.map((p) => {
            const plant = plantsById[p.plant_id];
            return (
              <li
                key={p.id}
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  padding: "10px 0",
                  borderBottom: "1px solid #eee",
                }}
              >
                <div>
                  <div style={{ fontWeight: 600 }}>
                    {plant?.icon ? `${plant.icon} ` : ""}
                    {plant?.name ?? `Plant #${p.plant_id}`}{" "}
                    <span style={{ fontWeight: 400, color: "#666" }}>
                      @ ({p.position_row}, {p.position_column})
                    </span>
                  </div>
                  {p.notes ? (
                    <div style={{ color: "#666", fontSize: 14 }}>
                      Notes: {p.notes}
                    </div>
                  ) : null}
                </div>

                <button onClick={() => handleDelete(p.id)}>Delete</button>
              </li>
            );
          })}
        </ul>
      </div>
    </section>
  );
}
