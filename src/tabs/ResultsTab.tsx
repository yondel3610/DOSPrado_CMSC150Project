// Results tab: total cost Z, iteration count, dispatch table x_gt (MW),
// price per block (S_t / h, ₱/MWh), a price chart, and the LP setup summary.

import type { SolveOutcome } from "../lib/solve";
import { BLOCKS, HOURS_PER_BLOCK } from "../lib/data";
import { formatMW, formatPeso } from "../lib/format";
import { StatusBanner } from "../components/StatusBanner";
import { PriceChart } from "../components/PriceChart";

const card = "rounded-xl border border-slate-300 bg-white p-4 shadow-sm";
const th = "border-b border-r bg-slate-100 px-3 py-1.5 text-right font-semibold";
const td = "border-b border-r px-3 py-1.5 text-right tabular-nums";

export function ResultsTab({ outcome }: { outcome: SolveOutcome }) {
    const { extracted, primal } = outcome;
    const optimal = extracted.status === "optimal";

    return (
        <div className="space-y-4">
        <StatusBanner status={extracted.status} iterations={extracted.iterations} />

        {optimal && (
            <section className={card}>
            <h2 className="text-sm font-semibold text-slate-600">Total minimum cost, Z</h2>
            <p className="mt-1 text-3xl font-bold tabular-nums">{formatPeso(extracted.Z!)}</p>
            <p className="mt-1 text-sm text-slate-600">Number of iterations: {extracted.iterations}</p>
            </section>
        )}

        {optimal && (
            <section className={`${card} space-y-2`}>
            <h2 className="text-sm font-semibold text-slate-600">Unknowns x<sub>gt</sub> (MW)</h2>
            <div className="overflow-x-auto rounded-lg border border-slate-300">
                <table className="w-full border-collapse text-sm">
                <thead>
                    <tr>
                    <th className={`${th} text-left`}>Plant group</th>
                    {BLOCKS.map((b) => (
                        <th key={b.label} className={th}>{b.label}</th>
                    ))}
                    </tr>
                </thead>
                <tbody>
                    {primal.groups.map((group, gi) => (
                    <tr key={group.key} className="odd:bg-white even:bg-slate-50">
                        <th className="border-b border-r bg-slate-100 px-3 py-1.5 text-left font-semibold">
                        {group.name}
                        </th>
                        {BLOCKS.map((b, t) => (
                        <td key={b.label} className={td}>
                            {formatMW(extracted.dispatch[gi * BLOCKS.length + t])}
                        </td>
                        ))}
                    </tr>
                    ))}
                </tbody>
                </table>
            </div>
            </section>
        )}

        {optimal && (
            <section className={`${card} space-y-3`}>
            <h2 className="text-sm font-semibold text-slate-600">
                Price of electricity per block (price<sub>t</sub> = S<sub>t</sub> / {HOURS_PER_BLOCK})
            </h2>
            <div className="overflow-x-auto rounded-lg border border-slate-300">
                <table className="w-full border-collapse text-sm">
                <thead>
                    <tr>
                    <th className={`${th} text-left`}>Block</th>
                    {BLOCKS.map((b) => (
                        <th key={b.label} className={th}>{b.label}</th>
                    ))}
                    </tr>
                </thead>
                <tbody>
                    <tr className="bg-white">
                    <th className="border-b border-r bg-slate-100 px-3 py-1.5 text-left font-semibold">
                        Price (₱/MWh)
                    </th>
                    {BLOCKS.map((b, t) => (
                        <td key={b.label} className={`${td} font-semibold`}>
                        {formatMW(extracted.pricesPerBlock[t])}
                        </td>
                    ))}
                    </tr>
                    <tr className="bg-slate-50 text-slate-600">
                    <th className="border-b border-r bg-slate-100 px-3 py-1.5 text-left font-semibold">
                        Shadow price S<sub>t</sub>
                    </th>
                    {BLOCKS.map((b, t) => (
                        <td key={b.label} className={td}>
                        {formatMW(extracted.shadowPrices[t])}
                        </td>
                    ))}
                    </tr>
                </tbody>
                </table>
            </div>
            <PriceChart prices={extracted.pricesPerBlock} />
            </section>
        )}

        <section className={card}>
            <h2 className="text-sm font-semibold text-slate-600">Linear programming setup</h2>
            <dl className="mt-2 grid grid-cols-2 gap-2 text-sm sm:grid-cols-4">
            <div>
                <dt className="text-slate-500">Unknowns</dt>
                <dd className="font-semibold">{primal.numVars}</dd>
            </div>
            <div>
                <dt className="text-slate-500">Constraints</dt>
                <dd className="font-semibold">{primal.matrix.length}</dd>
            </div>
            </dl>
        </section>
        </div>
    );
}