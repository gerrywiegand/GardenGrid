import BedRow from "./BedRow";

export default function BedList({ beds, onUpdated, onDelete, deletingId }) {
  if (!beds.length) return <p>No beds yet. Add one above.</p>;

  return (
    <ul style={{ listStyle: "none", padding: 0, margin: 0 }}>
      {beds.map((bed) => (
        <BedRow
          key={bed.id}
          bed={bed}
          onUpdated={onUpdated}
          onDelete={onDelete}
          deleting={deletingId === bed.id}
        />
      ))}
    </ul>
  );
}
