import { useState, useMemo } from "react";

export default function PlacementGrid({
  bed,
  plants,
  placements,
  plantId,
  loading,
  rulesByPairKey,
}) {
  const [hoveredCell, setHoveredCell] = useState(null);

  const plantsById = useMemo(() => {
    const map = {};
    (plants || []).forEach((p) => {
      map[p.id] = p;
    });
    return map;
  }, [plants]);

  const placementByPos = useMemo(() => {
    const m = new Map();
    placements.forEach((p) => {
      m.set(`${p.position_row}-${p.position_column}`, p);
    });
    return m;
  }, [placements]);

  const neighborEffectsByPos = useMemo(() => {
    const effects = new Map();

    if (!hoveredCell) return effects;

    // Helper functions
    function neighbors4(r, c) {
      return [
        { r: r - 1, c },
        { r: r + 1, c },
        { r, c: c - 1 },
        { r, c: c + 1 },
      ];
    }

    function getRule(plantId1, plantId2) {
      const a = Math.min(plantId1, plantId2);
      const b = Math.max(plantId1, plantId2);
      return rulesByPairKey.get(`${a}-${b}`) || null;
    }

    const hoveredPlacement = placementByPos.get(
      `${hoveredCell.r}-${hoveredCell.c}`
    );
    const hoveredPlantId = hoveredPlacement?.plant_id || Number(plantId);

    if (!hoveredPlantId) return effects;

    for (const nb of neighbors4(hoveredCell.r, hoveredCell.c)) {
      const placement = placementByPos.get(`${nb.r}-${nb.c}`);
      if (!placement) continue;

      const rule = getRule(hoveredPlantId, placement.plant_id);
      if (!rule) continue;

      const neighborPlant = plantsById[placement.plant_id];
      effects.set(`${nb.r}-${nb.c}`, {
        relationship: rule.interaction,
        notes: rule.description || "",
        neighborName: neighborPlant?.name || `Plant #${placement.plant_id}`,
      });
    }

    return effects;
  }, [hoveredCell, plantId, placementByPos, rulesByPairKey, plantsById]);

  if (loading) {
    return <p>Loading placements...</p>;
  }

  if (Number(bed.rows) * Number(bed.columns) > 2500) {
    return (
      <div
        style={{
          padding: 10,
          border: "1px solid orange",
          background: "#fff9e6",
        }}
      >
        ⚠️ Grid too large to display ({bed.rows}×{bed.columns}). Use the
        placement list below.
      </div>
    );
  }

  return (
    <div
      style={{
        display: "grid",
        gridTemplateColumns: `repeat(${Number(bed.columns)}, 44px)`,
        gap: 6,
        alignItems: "center",
      }}
    >
      {Array.from({ length: Number(bed.rows) }).map((_, r) =>
        Array.from({ length: Number(bed.columns) }).map((_, c) => {
          const placement = placementByPos.get(`${r}-${c}`);
          const plant = placement ? plantsById[placement.plant_id] : null;

          const effect = neighborEffectsByPos.get(`${r}-${c}`);
          const borderColor =
            effect?.relationship === "beneficial"
              ? "#22c55e"
              : effect?.relationship === "detrimental"
              ? "#ef4444"
              : "#ddd";

          const tooltipLines = [];
          if (plant) tooltipLines.push(`${plant.name} @ (${r},${c})`);
          else tooltipLines.push(`(${r},${c})`);

          if (hoveredCell?.r === r && hoveredCell?.c === c) {
            const hoveredPlacement = placementByPos.get(`${r}-${c}`);
            const hoveredPlantId =
              hoveredPlacement?.plant_id || Number(plantId);

            if (hoveredPlantId) {
              const hoveredPlantName = hoveredPlacement
                ? plantsById[hoveredPlacement.plant_id]?.name
                : plants?.find((p) => p.id === hoveredPlantId)?.name;

              if (!hoveredPlacement) {
                tooltipLines.push(`\nPlanning to place: ${hoveredPlantName}`);
              }

              tooltipLines.push("\nNeighbor companions:");

              const neighbors4Local = (r, c) => [
                { r: r - 1, c },
                { r: r + 1, c },
                { r, c: c - 1 },
                { r, c: c + 1 },
              ];

              const getRuleLocal = (plantId1, plantId2) => {
                const a = Math.min(plantId1, plantId2);
                const b = Math.max(plantId1, plantId2);
                return rulesByPairKey.get(`${a}-${b}`) || null;
              };

              let hasNeighbors = false;
              for (const nb of neighbors4Local(r, c)) {
                const nbPlacement = placementByPos.get(`${nb.r}-${nb.c}`);
                if (!nbPlacement) continue;

                hasNeighbors = true;
                const rule = getRuleLocal(hoveredPlantId, nbPlacement.plant_id);
                const nbPlant = plantsById[nbPlacement.plant_id];

                if (rule) {
                  const tag =
                    rule.interaction === "beneficial"
                      ? "✅"
                      : rule.interaction === "detrimental"
                      ? "⚠️"
                      : "➖";
                  tooltipLines.push(
                    `${tag} ${
                      nbPlant?.name || `Plant #${nbPlacement.plant_id}`
                    } @ (${nb.r},${nb.c})`
                  );
                  if (rule.description)
                    tooltipLines.push(`  ${rule.description}`);
                } else {
                  tooltipLines.push(
                    `❔ ${
                      nbPlant?.name || `Plant #${nbPlacement.plant_id}`
                    } @ (${nb.r},${nb.c}) - no rule`
                  );
                }
              }

              if (!hasNeighbors) {
                tooltipLines.push("  (no neighbors yet)");
              }
            }
          } else if (effect) {
            const tag =
              effect.relationship === "beneficial"
                ? "✅ Beneficial neighbor"
                : effect.relationship === "detrimental"
                ? "⚠️ Detrimental neighbor"
                : "➖ Neutral neighbor";
            tooltipLines.push(`${tag}: ${effect.neighborName}`);
            if (effect.notes) tooltipLines.push(effect.notes);
          }

          return (
            <div
              key={`${r}-${c}`}
              onMouseEnter={() => setHoveredCell({ r, c })}
              onMouseLeave={() => setHoveredCell(null)}
              title={tooltipLines.join("\n")}
              style={{
                width: 44,
                height: 44,
                border: `2px solid ${borderColor}`,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: 18,
                background: placement ? "#f6fff5" : "white",
                boxSizing: "border-box",
                cursor: "default",
              }}
            >
              {plant?.icon ?? (placement ? "🌱" : "")}
            </div>
          );
        })
      )}
    </div>
  );
}
