// Stacked bar per block (MW per selected plant group) with the electricity price as a line on a
// secondary axis (₱/MWh). Built from the already-extracted dispatch and prices; no extra computation.

import {
    Bar,
    CartesianGrid,
    ComposedChart,
    Legend,
    Line,
    ResponsiveContainer,
    Tooltip,
    XAxis,
    YAxis,
} from "recharts";
import { BLOCKS } from "../lib/data";
import { formatMW, formatPeso } from "../lib/format";

// fixed color per plant group so a group keeps its color whatever the selection
const GROUP_COLORS: Record<string, string> = {
    coal: "var(--coal)",
    natgas: "#4e79a7",
    geothermal: "#FF2400",
    hydro: "#76b7b2",
    oil: "#9c755f",
    solar: "#edc948",
    wind: "#59a14f",
};

interface DispatchChartProps {
    groups: { key: string; name: string }[];
    dispatch: number[]; // x per primal variable, index = groupIndex * BLOCKS.length + block
    prices: number[]; // ₱/MWh per block
}

const tick = { fill: "var(--dim)", fontSize: 11 };

export function DispatchChart({ groups, dispatch, prices }: DispatchChartProps) {
    const data = BLOCKS.map((block, t) => {
        const row: Record<string, number | string> = { block: block.label, price: prices[t] };
        groups.forEach((group, gi) => {
            const mw = dispatch[gi * BLOCKS.length + t];
            row[group.key] = Math.abs(mw) < 0.005 ? 0 : mw;
        });
        return row;
    });

    return (
        <div className="h-96 w-full">
        <ResponsiveContainer width="100%" height="100%">
            <ComposedChart data={data} margin={{ top: 8, right: 8, bottom: 8, left: 8 }}>
            <CartesianGrid stroke="var(--line)" strokeDasharray="2 3" vertical={false} />
            <XAxis dataKey="block" tick={tick} stroke="var(--line)" />
            <YAxis
                yAxisId="mw"
                width={64}
                tick={tick}
                stroke="var(--line)"
                tickFormatter={(v: number) => v.toLocaleString("en-PH")}
                label={{ value: "Dispatch (MW)", angle: -90, position: "insideLeft", fill: "var(--dim)", fontSize: 11 }}
            />
            <YAxis
                yAxisId="price"
                orientation="right"
                width={64}
                tick={tick}
                stroke="var(--line)"
                tickFormatter={(v: number) => v.toLocaleString("en-PH")}
                label={{ value: "Price (₱/MWh)", angle: 90, position: "insideRight", fill: "var(--dim)", fontSize: 11 }}
            />
            <Tooltip
                cursor={{ fill: "var(--zebra)" }}
                contentStyle={{
                    background: "var(--surface)",
                    border: "1px solid var(--line)",
                    borderRadius: 0,
                    fontSize: 12,
                    color: "var(--ink)",
                }}
                formatter={(value, name) =>
                    name === "Price"
                        ? [`${formatPeso(Number(value))} / MWh`, name]
                        : [`${formatMW(Number(value))} MW`, name]
                }
            />
            <Legend 
                iconType="square" 
                wrapperStyle={{ fontSize: 12 }}
                formatter={(value) => <span style={{color: "var(--ink"}} >{value}</span>}
            />
            {groups.map((group) => (
                <Bar
                key={group.key}
                yAxisId="mw"
                dataKey={group.key}
                name={group.name}
                stackId="dispatch"
                fill={GROUP_COLORS[group.key] ?? "#999999"}
                isAnimationActive={false}
                />
            ))}
            <Line
                yAxisId="price"
                dataKey="price"
                name="Price"
                type="linear"
                stroke="var(--ink)"
                strokeWidth={2}
                dot={{ r: 3, fill: "var(--ink)", stroke: "var(--ink)" }}
                isAnimationActive={false}
            />
            </ComposedChart>
        </ResponsiveContainer>
        </div>
    );
}