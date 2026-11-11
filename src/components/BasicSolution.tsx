/// one tableau's basic solution

import { formatCell } from "../lib/format";

interface BasicSolutionProps {
    values: number[];
    columnLabels: string[];
}

export function BasicSolution({ values, columnLabels }: BasicSolutionProps) {
    const entries = values
        .map((value, j) => ({ label: columnLabels[j], value }))
        .filter((entry) => entry.value !== 0);

    if (entries.length === 0) {
        return <p className="text-sm text-slate-500">Every variable is nonbasic (all zero).</p>;
    }
    return (
        <div className="flex flex-wrap gap-2">
        {entries.map((entry) => (
            <span
            key={entry.label}
            className="rounded-md border border-slate-300 bg-slate-50 px-2 py-1 font-mono text-xs"
            >
            {entry.label} = {formatCell(entry.value)}
            </span>
        ))}
        </div>
    );
}