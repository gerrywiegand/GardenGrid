import { useEffect, useMemo, useState } from "react";
import {
  getCompanionRules,
  createCompanionRule,
  deleteCompanionRule,
} from "../../api/client";

export default function CompanionRulesPanel({ plants = [] }) {
  const [rules, setRules] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  const [plantAId, setPlantAId] = useState("");
  const [plantBId, setPlantBId] = useState("");
  const [interaction, setinteraction] = useState("beneficial");
  const [description, setdescription] = useState("");

  const plantsById = useMemo(() => {
    const map = new Map();
    plants.forEach((p) => map.set(String(p.id), p));
    return map;
  }, [plants]);

  async function loadRules() {
    setLoading(true);
    setError("");
    try {
      const data = await getCompanionRules();
      setRules(data);
    } catch (e) {
      setError(e.message || "Failed to load companion rules");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadRules();
  }, []);

  async function handleCreate(e) {
    e.preventDefault();
    setError("");

    if (!plantAId || !plantBId) {
      setError("Pick two plants.");
      return;
    }
    if (plantAId === plantBId) {
      setError("Plants must be different.");
      return;
    }

    setSubmitting(true);
    try {
      await createCompanionRule({
        plant_a_id: Number(plantAId),
        plant_b_id: Number(plantBId),
        interaction,
        description: description || null,
      });
      setPlantAId("");
      setPlantBId("");
      setinteraction("beneficial");
      setdescription("");
      await loadRules();
    } catch (e) {
      setError(e.message || "Failed to create rule");
    } finally {
      setSubmitting(false);
    }
  }

  async function handleDelete(id) {
    setError("");
    try {
      await deleteCompanionRule(id);
      setRules((prev) => prev.filter((r) => r.id !== id));
    } catch (e) {
      setError(e.message || "Failed to delete rule");
    }
  }

  return (
    <section style={{ border: "1px solid #ddd", padding: 12, borderRadius: 8 }}>
      <h3 style={{ marginTop: 0 }}>Companion Rules</h3>
      <p style={{ marginTop: 4 }}>
        Add lightweight planting guidance (warnings) without blocking placement.
      </p>

      {error ? (
        <div style={{ marginBottom: 10, color: "crimson" }}>{error}</div>
      ) : null}

      <form onSubmit={handleCreate} style={{ display: "grid", gap: 8 }}>
        <div
          style={{ display: "grid", gap: 6, gridTemplateColumns: "1fr 1fr" }}
        >
          <label>
            Plant A
            <select
              value={plantAId}
              onChange={(e) => setPlantAId(e.target.value)}
              style={{ width: "100%" }}
            >
              <option value="">-- choose --</option>
              {plants.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.icon ? `${p.icon} ` : ""}
                  {p.name}
                </option>
              ))}
            </select>
          </label>

          <label>
            Plant B
            <select
              value={plantBId}
              onChange={(e) => setPlantBId(e.target.value)}
              style={{ width: "100%" }}
            >
              <option value="">-- choose --</option>
              {plants.map((p) => (
                <option
                  key={p.id}
                  value={p.id}
                  disabled={String(p.id) === plantAId}
                >
                  {p.icon ? `${p.icon} ` : ""}
                  {p.name}
                </option>
              ))}
            </select>
          </label>
        </div>

        <label>
          interaction
          <select
            value={interaction}
            onChange={(e) => setinteraction(e.target.value)}
            style={{ width: "100%" }}
          >
            <option value="beneficial">✅ Beneficial</option>
            <option value="neutral">➖ Neutral</option>
            <option value="detrimental">⚠️ Detrimental</option>
          </select>
        </label>

        <label>
          description (optional)
          <input
            value={description}
            onChange={(e) => setdescription(e.target.value)}
            placeholder="e.g., Basil improves tomato vigor"
            style={{ width: "100%" }}
          />
        </label>

        <button type="submit" disabled={submitting}>
          {submitting ? "Adding..." : "Add Rule"}
        </button>
      </form>

      <hr style={{ margin: "12px 0" }} />

      {loading ? <p>Loading rules...</p> : null}

      {!loading && rules.length === 0 ? <p>No companion rules yet.</p> : null}

      {!loading && rules.length > 0 ? (
        <ul
          style={{ listStyle: "none", paddingLeft: 0, display: "grid", gap: 6 }}
        >
          {rules.map((r) => {
            const a = plantsById.get(String(r.plant_a_id));
            const b = plantsById.get(String(r.plant_b_id));

            return (
              <li
                key={r.id}
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  gap: 8,
                  border: "1px solid #eee",
                  padding: 8,
                  borderRadius: 8,
                }}
              >
                <div>
                  <div style={{ fontWeight: 600 }}>
                    {(a?.icon ? `${a.icon} ` : "") +
                      (a?.name ?? `Plant ${r.plant_a_id}`)}{" "}
                    ↔{" "}
                    {(b?.icon ? `${b.icon} ` : "") +
                      (b?.name ?? `Plant ${r.plant_b_id}`)}
                  </div>
                  <div style={{ fontSize: 14 }}>
                    {r.interaction || "unknown"}
                    {r.description ? ` — ${r.description}` : ""}
                  </div>
                </div>

                <button onClick={() => handleDelete(r.id)}>Delete</button>
              </li>
            );
          })}
        </ul>
      ) : null}
    </section>
  );
}
