export default function PlantItem({ plant, onDelete, deleting }) {
  return (
    <li
      style={{
        display: "flex",
        gap: 12,
        alignItems: "center",
        padding: "8px 0",
        borderBottom: "1px solid #eee",
      }}
    >
      <div style={{ flex: 1 }}>
        <div style={{ fontWeight: 600 }}>{plant.icon || "🌱"}</div>
        {plant.category && (
          <div style={{ opacity: 0.75 }}>Category: {plant.category}</div>
        )}
      </div>

      <button
        onClick={() => onDelete(plant.id)}
        disabled={deleting}
        style={{ padding: "8px 10px" }}
      >
        {deleting ? "Deleting..." : "Delete"}
      </button>
    </li>
  );
}
