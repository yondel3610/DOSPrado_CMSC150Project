// requirement (c): iter-by-iter nav  and the final tableau

import type { SolveOutcome } from "../lib/solve";
import { BasicSolution } from "../components/BasicSolution";
import { StatusBanner } from "../components/StatusBanner";
import { TableauView } from "../components/TableauView";

export function TableauTab({ outcome }: { outcome: SolveOutcome }) {
    const { dual, result } = outcome;
    const initial = result.history[0];
    const rowLabels = [...Array.from({ length: dual.numVars }, (_, j) => `x${j + 1}`), "Z"];

    return (
        <div className="space-y-4">
        <StatusBanner status={result.status} iterations={result.iterations} />

        <section className="space-y-2">
            <div className="flex items-baseline justify-between">
            <h2 className="text-sm font-semibold text-slate-700">Initial tableau</h2>
            <p className="text-xs text-slate-500">
                Iteration 0 of {result.iterations} · {dual.numConstraints} constraints ×{" "}
                {dual.numVars} unknowns
            </p>
            </div>
            <TableauView tableau={initial.tableau} columnLabels={dual.columnLabels} rowLabels={rowLabels} />
        </section>

        <section className="space-y-2">
            <h2 className="text-sm font-semibold text-slate-700">Basic solution · iteration 0</h2>
            <BasicSolution
            values={initial.basicSolution}
            columnLabels={dual.columnLabels.slice(0, dual.numConstraints + dual.numVars)}
            />
        </section>
        </div>
    );
}