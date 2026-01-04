import { useState } from "react";

export default function PlantForm({ onCreate, loading }) {
  const [name, setName] = useState("");
  const [category, setCategory] = useState("");

  const [species, setSpecies] = useState("");
  const [sunlight, setSunlight] = useState("");
  const [water, setWater] = useState("");
  const [plantsPerSq, setPlantsPerSq] = useState("");
  const [sqUnitReq, setSqUnitReq] = useState("");
  const [daysToHarvest, setDaysToHarvest] = useState("");
  const [icon, setIcon] = useState("");

  function cleanStr(v) {
    const s = (v ?? "").trim();
    return s ? s : undefined;
  }

  function cleanNum(v) {
    if (v === "" || v == null) return undefined;
    const n = Number(v);
    return Number.isFinite(n) ? n : undefined;
  }

  async function handleSubmit(e) {
    e.preventDefault();

    const trimmedName = name.trim();
    if (!trimmedName) return;

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

    await onCreate(payload);

    // reset
    setName("");
    setCategory("");
    setSpecies("");
    setSunlight("");
    setWater("");
    setPlantsPerSq("");
    setSqUnitReq("");
    setDaysToHarvest("");
    setIcon("");
  }

  return (
    <form
      onSubmit={handleSubmit}
      style={{ display: "grid", gap: 10, maxWidth: 420 }}
    >
      <h3>Add Plant</h3>

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
          placeholder="e.g., Full sun / Partial shade"
          style={{ width: "100%", padding: 8 }}
        />
      </label>

      <label>
        Water requirements (optional)
        <input
          value={water}
          onChange={(e) => setWater(e.target.value)}
          placeholder="e.g., Low / Moderate / High"
          style={{ width: "100%", padding: 8 }}
        />
      </label>

      <label>
        Plants per square (optional)
        <input
          type="number"
          min="0"
          step="1"
          value={plantsPerSq}
          onChange={(e) => setPlantsPerSq(e.target.value)}
          style={{ width: "100%", padding: 8 }}
        />
      </label>

      <label>
        Square units required (optional)
        <input
          type="number"
          min="0"
          step="1"
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
          step="1"
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

      <button disabled={loading} style={{ padding: 10 }}>
        {loading ? "Adding..." : "Add Plant"}
      </button>
    </form>
  );
}
