export default function PlantDetailsModal({ plant, onClose }) {
  if (!plant) return null;

  const fields = [
    ["Species", plant.species],
    ["Sunlight", plant.sunlight_requirements],
    ["Water", plant.water_requirements],
    ["Days to harvest", plant.days_to_harvest],
    ["Plants per sq", plant.plants_per_sq],
    ["Square units required", plant.sq_unit_req],
  ];

  return (
    <div
      onClick={onClose}
      style={{
        position: "fixed",
        inset: 0,
        background: "rgba(0,0,0,0.4)",
        display: "grid",
        placeItems: "center",
        padding: 16,
      }}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        style={{
          background: "#fff",
          borderRadius: 10,
          padding: 16,
          width: "min(520px, 95vw)",
        }}
      >
        <div
          style={{ display: "flex", justifyContent: "space-between", gap: 8 }}
        >
          <h3 style={{ margin: 0 }}>
            {plant.icon ? `${plant.icon} ` : ""}
            {plant.name}
          </h3>
          <button onClick={onClose}>Close</button>
        </div>

        <div style={{ marginTop: 10, display: "grid", gap: 6 }}>
          {fields.map(([label, value]) => (
            <div
              key={label}
              style={{
                display: "flex",
                justifyContent: "space-between",
                gap: 10,
              }}
            >
              <span style={{ fontWeight: 600 }}>{label}</span>
              <span>{value ?? "—"}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
