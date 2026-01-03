import { useState } from "react";
import { updateBed } from "../../api/client";

export default function BedRow({ bed, onUpdated, onDelete, deleting }) {
  const [isEditing, setIsEditing] = useState(false);
  const [name, setName] = useState(bed.name || "");
  const [rows, setRows] = useState(bed.rows || "");
  const [columns, setColumns] = useState(bed.columns || "");
  const [saving, setSaving] = useState(false);

  function startEdit() {
    setName(bed.name || "");
    setRows(bed.rows || "");
    setColumns(bed.columns || "");
    setIsEditing(true);
  }

  function cancelEdit() {
    setIsEditing(false);
    setName(bed.name || "");
    setRows(bed.rows || "");
    setColumns(bed.columns || "");
  }

  async function handleSave() {
    const trimmedName = name.trim();
    if (!trimmedName || !rows || !columns) return;

    setSaving(true);
    try {
      const payload = {
        name: trimmedName,
        rows: parseInt(rows, 10),
        columns: parseInt(columns, 10),
      };

      const updated = await updateBed(bed.id, payload);
      onUpdated(updated);
      setIsEditing(false);
    } catch (err) {
      console.error("Failed to update bed:", err);
      alert(err.message || "Failed to update bed");
    } finally {
      setSaving(false);
    }
  }

  return (
    <li
      style={{
        padding: "8px 0",
        borderBottom: "1px solid #eee",
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        gap: 12,
      }}
    >
      <div style={{ flex: 1 }}>
        {isEditing ? (
          <div style={{ display: "grid", gap: 8, maxWidth: 420 }}>
            <label>
              Bed Name *
              <input
                value={name}
                onChange={(e) => setName(e.target.value)}
                style={{ width: "100%", padding: 8 }}
              />
            </label>

            <label>
              Rows *
              <input
                type="number"
                min="1"
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
                value={columns}
                onChange={(e) => setColumns(e.target.value)}
                style={{ width: "100%", padding: 8 }}
              />
            </label>
          </div>
        ) : (
          <>
            <div style={{ fontWeight: 700 }}>{bed.name}</div>
            <div style={{ opacity: 0.8 }}>
              Grid: {bed.rows} × {bed.columns}
            </div>
          </>
        )}
      </div>

      <div style={{ display: "flex", gap: 8 }}>
        {isEditing ? (
          <>
            <button onClick={handleSave} disabled={saving}>
              {saving ? "Saving..." : "Save"}
            </button>
            <button onClick={cancelEdit} disabled={saving}>
              Cancel
            </button>
          </>
        ) : (
          <>
            <button onClick={startEdit} disabled={deleting}>
              Edit
            </button>
            <button onClick={() => onDelete(bed.id)} disabled={deleting}>
              {deleting ? "Deleting..." : "Delete"}
            </button>
          </>
        )}
      </div>
    </li>
  );
}
