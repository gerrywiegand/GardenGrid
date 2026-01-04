import { useMemo } from "react";

export default function PlacementList({
  placements,
  plants,
  onDelete,
  loading,
}) {
  const plantsById = useMemo(() => {
    const map = {};
    (plants || []).forEach((p) => {
      map[p.id] = p;
    });
    return map;
  }, [plants]);

  if (!loading && placements.length === 0) {
    return <p>No placements yet.</p>;
  }

  return (
    <ul style={{ listStyle: "none", padding: 0, margin: 0 }}>
      {placements.map((p) => {
        const plant = plantsById[p.plant_id];
        return (
          <li
            key={p.id}
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              padding: "10px 0",
              borderBottom: "1px solid #eee",
            }}
          >
            <div>
              <div style={{ fontWeight: 600 }}>
                {plant?.icon ? `${plant.icon} ` : ""}
                {plant?.name ?? `Plant #${p.plant_id}`}{" "}
                <span style={{ fontWeight: 400, color: "#666" }}>
                  @ ({p.position_row}, {p.position_column})
                </span>
              </div>
              {p.notes ? (
                <div style={{ color: "#666", fontSize: 14 }}>
                  Notes: {p.notes}
                </div>
              ) : null}
            </div>

            <button onClick={() => onDelete(p.id)}>Delete</button>
          </li>
        );
      })}
    </ul>
  );
}
