import GardenRow from "./GardenRow";

export default function GardenList({
  gardens,
  onUpdated,
  onDelete,
  deletingId,
}) {
  if (!gardens.length) return <p>No gardens yet. Add one above.</p>;

  return (
    <ul style={{ listStyle: "none", padding: 0, margin: 0 }}>
      {gardens.map((garden) => (
        <GardenRow
          key={garden.id}
          garden={garden}
          onUpdated={onUpdated}
          onDelete={onDelete}
          deleting={deletingId === garden.id}
        />
      ))}
    </ul>
  );
}
