// expectation (d): plotting library. Bar chart of the electricity price per block (₱/MWh),
// drawn with Recharts from the already-extracted prices — no extra computation here.

import { Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { BLOCKS } from "../lib/data";
import { formatPeso } from "../lib/format";

export function PriceChart({ prices }: { prices: number[] }) {
    const data = BLOCKS.map((block, t) => ({
        block: block.label,
        price: prices[t],
    }));

    return (
        <div className="h-72 w-full">
        <ResponsiveContainer width="100%" height="100%">
            <BarChart data={data} margin={{ top: 8, right: 16, bottom: 8, left: 8 }}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="block" />
            <YAxis
                width={64}
                tickFormatter={(v: number) => v.toLocaleString("en-PH")}
                label={{ value: "₱/MWh", angle: -90, position: "insideLeft" }}
            />
            <Tooltip formatter={(v) => [`${formatPeso(Number(v))} / MWh`, "Price"]} />
            <Bar dataKey="price" fill="#2563eb" radius={[4, 4, 0, 0]} />
            </BarChart>
        </ResponsiveContainer>
        </div>
    );
}