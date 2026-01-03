import PlantRow from "./PlantRow";

export default function PlantList({ plants, onUpdated, onDelete, deletingId }) {
  if (!plants.length) return <p>No plants yet. Add one above.</p>;

  return (
    <ul style={{ listStyle: "none", padding: 0, margin: 0 }}>
      {plants.map((plant) => (
        <PlantRow
          key={plant.id}
          plant={plant}
          onUpdated={onUpdated}
          onDelete={onDelete}
          deleting={deletingId === plant.id}
        />
      ))}
    </ul>
  );
}
