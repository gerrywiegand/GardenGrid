export default function GardenList({ gardens }) {
  if (!gardens.length) return <p>No gardens yet. Add one above.</p>;

  return (
    <ul style={{ listStyle: "none", padding: 0, margin: 0 }}>
      {gardens.map((g) => (
        <li
          key={g.id}
          style={{ padding: "8px 0", borderBottom: "1px solid #eee" }}
        >
          <div style={{ fontWeight: 600 }}>{g.name}</div>
        </li>
      ))}
    </ul>
  );
}
