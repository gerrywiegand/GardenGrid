export default function PlantList({ plants }) {
  return (
    <pre style={{ padding: 12, border: "1px solid #ccc", overflowX: "auto" }}>
      {JSON.stringify(plants, null, 2)}
    </pre>
  );
}
