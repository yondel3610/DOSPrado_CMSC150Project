// requirement (c): iter-by-iter nav  and the final tableau

import { useState } from "react";
import type { SolveOutcome } from "../lib/solve";
import { BasicSolution } from "../components/BasicSolution";
import { StatusBanner } from "../components/StatusBanner";
import { TableauView } from "../components/TableauView";
import { BLOCKS } from "../lib/data";
import { formatMW, formatPeso } from "../lib/format";

const navButton =
    "rounded-md border border-slate-300 px-3 py-1.5 text-sm font-medium hover:bg-slate-100 disabled:cursor-not-allowed disabled:opacity-40 disabled:hover:bg-transparent";

export function TableauTab({ outcome }: { outcome: SolveOutcome }) {
    const { dual, result, primal, extracted } = outcome;
    const last = result.history.length - 1; // == result.iterations for every run
    const [k, setK] = useState(0);

    // a new solve produces a new result object: restart at the initial tableau
    const [seenResult, setSeenResult] = useState(result);
    if (seenResult !== result) {
        setSeenResult(result);
        setK(0);
    }

    const goTo = (value: number) => setK(Math.min(last, Math.max(0, Math.round(value))));
    const snapshot = result.history[Math.min(k, last)];
    const showFinal = k === last && extracted.status === "optimal";
    const rowLabels = [...Array.from({ length: dual.numVars }, (_, j) => `x${j + 1}`), "Z"];

    return (
        <div className="space-y-4">
        <StatusBanner status={result.status} iterations={result.iterations} />

        <section className="space-y-3 rounded-xl border border-slate-300 bg-white p-4 shadow-sm">
            <div className="flex flex-wrap items-center gap-2">
            <button type="button" className={navButton} onClick={() => goTo(0)} disabled={k === 0}>
                Initial
            </button>
            <button type="button" className={navButton} onClick={() => goTo(k - 1)} disabled={k === 0}>
                ← Prev
            </button>
            <button type="button" className={navButton} onClick={() => goTo(k + 1)} disabled={k === last}>
                Next →
            </button>
            <button type="button" className={navButton} onClick={() => goTo(last)} disabled={k === last}>
                Final
            </button>
            <label className="ml-auto flex items-center gap-2 text-sm text-slate-600">
                Go to
                <input
                type="number"
                min={0}
                max={last}
                value={k}
                onChange={(e) => {
                    if (Number.isFinite(e.target.valueAsNumber)) goTo(e.target.valueAsNumber);
                }}
                className="w-20 rounded-md border border-slate-300 px-2 py-1 text-right"
                />
            </label>
            </div>

            <input
            type="range"
            min={0}
            max={last}
            value={k}
            onChange={(e) => goTo(Number(e.target.value))}
            aria-label="Iteration"
            className="w-full"
            />

            <div className="flex flex-wrap items-baseline justify-between gap-1">
            <h2 className="text-sm font-semibold text-slate-700">
                {k === 0 ? "Initial tableau" : "Tableau"} · Iteration {k} of {result.iterations}
            </h2>
            <p className="text-xs text-slate-500">
                {dual.numConstraints} constraints × {dual.numVars} unknowns
                {snapshot.pivot !== undefined &&
                ` · pivot at row ${snapshot.pivot.row + 1}, column ${dual.columnLabels[snapshot.pivot.col]}`}
            </p>
            </div>

            <TableauView
            tableau={snapshot.tableau}
            columnLabels={dual.columnLabels}
            rowLabels={rowLabels}
            highlight={snapshot.pivot}
            />
        </section>

        <section className="space-y-2">
            <h2 className="text-sm font-semibold text-slate-700">Basic solution · iteration {k}</h2>
            <BasicSolution
            values={snapshot.basicSolution}
            columnLabels={dual.columnLabels.slice(0, dual.numConstraints + dual.numVars)}
            />
        </section>

        {showFinal && (
            <section className="space-y-3 rounded-xl border border-green-300 bg-green-50 p-4">
            <h2 className="text-sm font-semibold text-green-900">
                Final solution · iteration {result.iterations}
            </h2>
            <p className="text-sm text-green-900">
                Value of Z: <span className="text-lg font-bold tabular-nums">{formatPeso(extracted.Z!)}</span>
            </p>
            <div className="flex flex-wrap gap-2">
                {primal.groups.flatMap((group, gi) =>
                BLOCKS.map((b, t) => ({
                    label: `${group.name} ${b.label}`,
                    value: extracted.dispatch[gi * BLOCKS.length + t],
                })),
                )
                .filter((entry) => Math.abs(entry.value) >= 0.005)
                .map((entry) => (
                    <span
                    key={entry.label}
                    className="rounded-md border border-green-300 bg-white px-2 py-1 font-mono text-xs"
                    >
                    {entry.label} = {formatMW(entry.value)} MW
                    </span>
                ))}
            </div>
            <p className="text-xs text-green-800">
                Plants not listed produce 0 MW. The full table is in the Results tab.
            </p>
            </section>
        )}
        </div>
    );
}