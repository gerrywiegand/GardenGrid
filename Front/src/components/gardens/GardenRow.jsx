import { useState } from "react";
import { Link } from "react-router-dom";
import { updateGarden } from "../../api/client";

export default function GardenRow({ garden, onUpdated, onDelete, deleting }) {
  const [isEditing, setIsEditing] = useState(false);
  const [name, setName] = useState(garden.name || "");
  const [location, setLocation] = useState(garden.location || "");
  const [saving, setSaving] = useState(false);

  function startEdit() {
    setName(garden.name || "");
    setLocation(garden.location || "");
    setIsEditing(true);
  }

  function cancelEdit() {
    setIsEditing(false);
    setName(garden.name || "");
    setLocation(garden.location || "");
  }

  async function handleSave() {
    const trimmedName = name.trim();
    if (!trimmedName) return;

    setSaving(true);
    try {
      const payload = {
        name: trimmedName,
        location: location.trim() || "",
      };

      const updated = await updateGarden(garden.id, payload);
      onUpdated(updated);
      setIsEditing(false);
    } catch (err) {
      console.error("Failed to update garden:", err);
      alert(err.message || "Failed to update garden");
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
          </div>
        ) : (
          <>
            <div style={{ fontWeight: 700 }}>{garden.name}</div>
            <div style={{ opacity: 0.8 }}>
              Location: {garden.location || "—"}
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
            <Link to={`/gardens/${garden.id}`}>
              <button>View</button>
            </Link>
            <button onClick={startEdit} disabled={deleting}>
              Edit
            </button>
            <button onClick={() => onDelete(garden.id)} disabled={deleting}>
              {deleting ? "Deleting..." : "Delete"}
            </button>
          </>
        )}
      </div>
    </li>
  );
}
