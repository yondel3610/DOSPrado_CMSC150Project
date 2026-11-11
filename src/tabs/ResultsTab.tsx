// add documentation for the Results tab

import type { SolveOutcome } from "../lib/solve";
import { formatPeso } from "../lib/format";
import { StatusBanner } from "../components/StatusBanner";

export function ResultsTab({ outcome }: { outcome: SolveOutcome }) {
    const { extracted, primal } = outcome;

    return (
        <div className="space-y-4">
        <StatusBanner status={extracted.status} iterations={extracted.iterations} />

        {extracted.status === "optimal" && (
            <section className="rounded-xl border border-slate-300 bg-white p-4 shadow-sm">
            <h2 className="text-sm font-semibold text-slate-600">Total minimum cost, Z</h2>
            <p className="mt-1 text-3xl font-bold tabular-nums">{formatPeso(extracted.Z!)}</p>
            <p className="mt-1 text-sm text-slate-600">Number of iterations: {extracted.iterations}</p>
            </section>
        )}

        <section className="rounded-xl border border-slate-300 bg-white p-4 shadow-sm">
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