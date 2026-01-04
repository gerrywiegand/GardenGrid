import { useEffect, useMemo, useState } from "react";
import {
  createPlacement,
  deletePlacement,
  getPlacements,
} from "../../api/client";
import { getCompanionRules } from "../../api/client";
import PlacementForm from "./PlacementForm";
import PlacementGrid from "./PlacementGrid";
import PlacementList from "./PlacementList";

export default function PlacementsPanel({ bed, plants }) {
  const [placements, setPlacements] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [plantId, setPlantId] = useState(plants?.[0]?.id ?? "");
  const [rules, setRules] = useState([]);

  useEffect(() => {
    getCompanionRules().then(setRules).catch(console.error);
  }, []);

  const rulesByPairKey = useMemo(() => {
    const map = new Map();
    for (const r of rules) {
      const a = Math.min(r.plant_a_id, r.plant_b_id);
      const b = Math.max(r.plant_a_id, r.plant_b_id);
      map.set(`${a}-${b}`, r);
    }
    return map;
  }, [rules]);

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

  async function handleCreate({ plantId: pid, row: r, col: c, notes }) {
    setError("");

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
        notes,
      };

      const created = await createPlacement(bed.id, payload);
      setPlacements((prev) => [created, ...prev]);
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

      <PlacementForm
        bed={bed}
        plants={plants}
        plantId={plantId}
        setPlantId={setPlantId}
        onSubmit={handleCreate}
        submitting={submitting}
      />

      <div style={{ marginBottom: 16 }}>
        <h4 style={{ margin: "8px 0" }}>Bed Grid</h4>
        <PlacementGrid
          bed={bed}
          plants={plants}
          placements={placements}
          plantId={plantId}
          loading={loading}
          rulesByPairKey={rulesByPairKey}
        />
      </div>

      <div>
        <h4 style={{ margin: "8px 0" }}>Current Placements</h4>
        <PlacementList
          placements={placements}
          plants={plants}
          onDelete={handleDelete}
          loading={loading}
        />
      </div>
    </section>
  );
}
