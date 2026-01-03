import PlantItem from "./PlantItem";

export default function PlantList({ plants, onDelete, deletingId }) {
  if (!plants.length) return <p>No plants yet. Add one above.</p>;

  return (
    <ul style={{ listStyle: "none", padding: 0, margin: 0 }}>
      {plants.map((p) => (
        <PlantItem
          key={p.id}
          plant={p}
          onDelete={onDelete}
          deleting={deletingId === p.id}
        />
      ))}
    </ul>
  );
}
