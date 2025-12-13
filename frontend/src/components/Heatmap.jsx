import { useMemo, useState } from "react";

export default function Heatmap({ data }) {
  const [hovered, setHovered] = useState(null);

  // Unique values
  const testSizes = useMemo(
    () => [...new Set(data.map((d) => d.test_size))].sort((a, b) => a - b),
    [data]
  );

  const randomStates = useMemo(
    () => [...new Set(data.map((d) => d.random_state))].sort((a, b) => a - b),
    [data]
  );

  // Build a matrix: [{ random_state, [test_size]: RMSE }]
  const grid = useMemo(() => {
    return randomStates.map((rs) => {
      const row = { random_state: rs };
      testSizes.forEach((ts) => {
        const entry = data.find(
          (d) => d.random_state === rs && d.test_size === ts
        );
        row[ts] = entry ? entry.rmse : null;
      });
      return row;
    });
  }, [data, randomStates, testSizes]);

  // Find min & max RMSE for scaling
  const { minRMSE, maxRMSE } = useMemo(() => {
    const values = data.map((d) => d.rmse);
    return {
      minRMSE: Math.min(...values),
      maxRMSE: Math.max(...values),
    };
  }, [data]);

  // Color scale: green (good) → yellow → red (bad)
  const getColor = (value) => {
    if (value === null) return "#eee";

    const ratio = (value - minRMSE) / (maxRMSE - minRMSE); // 0 to 1

    // interpolate color
    const r = Math.floor(255 * ratio);
    const g = Math.floor(200 * (1 - ratio));
    const b = 0;

    return `rgb(${r}, ${g}, ${b})`;
  };

  return (
    <div className="bg-white p-6 rounded shadow">
      <h3 className="text-xl font-semibold mb-4">RMSE Heatmap</h3>

      <div className="overflow-x-auto">
        <table className="border-collapse">
          <thead>
            <tr>
              <th className="border p-2 bg-gray-100">RS \\ TS</th>
              {testSizes.map((ts) => (
                <th key={ts} className="border p-2 bg-gray-100">
                  {ts}
                </th>
              ))}
            </tr>
          </thead>

          <tbody>
            {grid.map((row) => (
              <tr key={row.random_state}>
                <td className="border p-2 font-semibold bg-gray-100 text-center">
                  {row.random_state}
                </td>

                {testSizes.map((ts) => {
                  const value = row[ts];
                  const color = getColor(value);

                  return (
                    <td
                      key={ts}
                      className="border p-2 text-center cursor-pointer relative"
                      style={{ backgroundColor: color }}
                      onMouseEnter={() =>
                        setHovered({ rs: row.random_state, ts, value })
                      }
                      onMouseLeave={() => setHovered(null)}
                    >
                      <span className="font-medium text-white text-sm">
                        {value ? value.toFixed(1) : "-"}
                      </span>

                      {/* Tooltip */}
                      {hovered &&
                        hovered.rs === row.random_state &&
                        hovered.ts === ts && (
                          <div className="absolute -top-12 left-1/2 -translate-x-1/2 bg-gray-900 text-white text-sm px-3 py-1 rounded shadow z-10 whitespace-nowrap">
                            <div>RMSE: {hovered.value.toFixed(3)}</div>
                            <div>RS: {hovered.rs}</div>
                            <div>Test Size: {hovered.ts}</div>
                          </div>
                        )}
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>

        {/* Color Legend */}
        <div className="mt-6 flex items-center gap-4">
          <div className="flex items-center gap-2">
            <div
              className="w-6 h-6"
              style={{ backgroundColor: getColor(minRMSE) }}
            ></div>
            <span className="text-sm">Best ({minRMSE.toFixed(1)})</span>
          </div>

          <div className="flex items-center gap-2">
            <div
              className="w-6 h-6"
              style={{ backgroundColor: getColor(maxRMSE) }}
            ></div>
            <span className="text-sm">Worst ({maxRMSE.toFixed(1)})</span>
          </div>
        </div>
      </div>
    </div>
  );
}
