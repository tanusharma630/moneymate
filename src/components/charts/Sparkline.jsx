import { LineChart, Line, ResponsiveContainer } from "recharts";

/**
 * Tiny inline trend line used inside summary cards. Takes a plain array of
 * numbers rather than a full dataset since it never needs axes or a legend.
 * @param {Object} props
 * @param {number[]} props.data
 * @param {string} props.color
 * @param {number} [props.height=36]
 */
export default function Sparkline({ data, color, height = 36 }) {
  const points = data.map((v) => ({ v }));
  return (
    <ResponsiveContainer width="100%" height={height}>
      <LineChart data={points}>
        <Line
          type="monotone"
          dataKey="v"
          stroke={color}
          strokeWidth={2}
          dot={false}
          isAnimationActive
          animationDuration={900}
        />
      </LineChart>
    </ResponsiveContainer>
  );
}
