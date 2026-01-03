import { useState } from "react";
import { updatePlant } from "../../api/client";

export default function PlantRow({ plant, onUpdated, onDelete, deleting }) {
  const [isEditing, setIsEditing] = useState(false);
  const [name, setName] = useState(plant.name || "");
  const [category, setCategory] = useState(plant.category || "");
  const [saving, setSaving] = useState(false);

  function startEdit() {
    setName(plant.name || "");
    setCategory(plant.category || "");
    setIsEditing(true);
  }

  function cancelEdit() {
    setIsEditing(false);
    setName(plant.name || "");
    setCategory(plant.category || "");
  }

  async function handleSave() {
    const trimmedName = name.trim();
    if (!trimmedName) return;

    setSaving(true);
    try {
      const payload = {
        name: trimmedName,
        category: category.trim() || "",
      };

      const updated = await updatePlant(plant.id, payload);
      onUpdated(updated);
      setIsEditing(false);
    } catch (err) {
      console.error("Failed to update plant:", err);
      alert(err.message || "Failed to update plant");
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
              Category (optional)
              <input
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                style={{ width: "100%", padding: 8 }}
              />
            </label>
          </div>
        ) : (
          <>
            <div style={{ fontWeight: 700 }}>
              {plant.icon ? `${plant.icon} ` : ""}
              {plant.name}
            </div>
            <div style={{ opacity: 0.8 }}>
              Category: {plant.category ? plant.category : "—"}
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
            <button onClick={() => onDelete(plant.id)} disabled={deleting}>
              {deleting ? "Deleting..." : "Delete"}
            </button>
          </>
        )}
      </div>
    </li>
  );
}
