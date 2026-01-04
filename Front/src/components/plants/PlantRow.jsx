import { useState } from "react";
import { updatePlant } from "../../api/client";
import PlantDetailsModal from "./PlantDetails";

export default function PlantRow({ plant, onUpdated, onDelete, deleting }) {
  const [isEditing, setIsEditing] = useState(false);
  const [showDetails, setShowDetails] = useState(false);
  const [name, setName] = useState(plant.name || "");
  const [category, setCategory] = useState(plant.category || "");
  const [species, setSpecies] = useState(plant.species || "");
  const [sunlight, setSunlight] = useState(plant.sunlight_requirements || "");
  const [water, setWater] = useState(plant.water_requirements || "");
  const [plantsPerSq, setPlantsPerSq] = useState(plant.plants_per_sq || "");
  const [sqUnitReq, setSqUnitReq] = useState(plant.sq_unit_req || "");
  const [daysToHarvest, setDaysToHarvest] = useState(
    plant.days_to_harvest || ""
  );
  const [icon, setIcon] = useState(plant.icon || "");
  const [saving, setSaving] = useState(false);

  function startEdit() {
    setName(plant.name || "");
    setCategory(plant.category || "");
    setSpecies(plant.species || "");
    setSunlight(plant.sunlight_requirements || "");
    setWater(plant.water_requirements || "");
    setPlantsPerSq(plant.plants_per_sq || "");
    setSqUnitReq(plant.sq_unit_req || "");
    setDaysToHarvest(plant.days_to_harvest || "");
    setIcon(plant.icon || "");
    setIsEditing(true);
  }

  function cancelEdit() {
    setIsEditing(false);
    setName(plant.name || "");
    setCategory(plant.category || "");
    setSpecies(plant.species || "");
    setSunlight(plant.sunlight_requirements || "");
    setWater(plant.water_requirements || "");
    setPlantsPerSq(plant.plants_per_sq || "");
    setSqUnitReq(plant.sq_unit_req || "");
    setDaysToHarvest(plant.days_to_harvest || "");
    setIcon(plant.icon || "");
  }

  function cleanStr(v) {
    const s = (v ?? "").trim();
    return s ? s : undefined;
  }

  function cleanNum(v) {
    if (v === "" || v == null) return undefined;
    const n = Number(v);
    return Number.isFinite(n) ? n : undefined;
  }

  async function handleSave() {
    const trimmedName = name.trim();
    if (!trimmedName) return;

    setSaving(true);
    try {
      const payload = {
        name: trimmedName,
        category: category.trim() || "",
        species: cleanStr(species),
        sunlight_requirements: cleanStr(sunlight),
        water_requirements: cleanStr(water),
        plants_per_sq: cleanNum(plantsPerSq),
        sq_unit_req: cleanNum(sqUnitReq),
        days_to_harvest: cleanNum(daysToHarvest),
        icon: cleanStr(icon),
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

            <label>
              Species (optional)
              <input
                value={species}
                onChange={(e) => setSpecies(e.target.value)}
                style={{ width: "100%", padding: 8 }}
              />
            </label>

            <label>
              Sunlight requirements (optional)
              <input
                value={sunlight}
                onChange={(e) => setSunlight(e.target.value)}
                style={{ width: "100%", padding: 8 }}
              />
            </label>

            <label>
              Water requirements (optional)
              <input
                value={water}
                onChange={(e) => setWater(e.target.value)}
                style={{ width: "100%", padding: 8 }}
              />
            </label>

            <label>
              Plants per square (optional)
              <input
                type="number"
                min="1"
                value={plantsPerSq}
                onChange={(e) => setPlantsPerSq(e.target.value)}
                style={{ width: "100%", padding: 8 }}
              />
            </label>

            <label>
              Square units required (optional)
              <input
                type="number"
                min="1"
                value={sqUnitReq}
                onChange={(e) => setSqUnitReq(e.target.value)}
                style={{ width: "100%", padding: 8 }}
              />
            </label>

            <label>
              Days to harvest (optional)
              <input
                type="number"
                min="0"
                value={daysToHarvest}
                onChange={(e) => setDaysToHarvest(e.target.value)}
                style={{ width: "100%", padding: 8 }}
              />
            </label>

            <label>
              Icon (optional)
              <input
                value={icon}
                onChange={(e) => setIcon(e.target.value)}
                placeholder="e.g., 🍅 or 🌿 (leave blank to auto-generate as 🌱+ plant name )"
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
            <button onClick={() => setShowDetails(true)}>Detail</button>
            <button onClick={startEdit} disabled={deleting}>
              Edit
            </button>
            <button onClick={() => onDelete(plant.id)} disabled={deleting}>
              {deleting ? "Deleting..." : "Delete"}
            </button>
          </>
        )}
      </div>

      {showDetails && (
        <PlantDetailsModal
          plant={plant}
          onClose={() => setShowDetails(false)}
        />
      )}
    </li>
  );
}
