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
        return <p className="text-sm text-black">Every variable is nonbasic (all zero).</p>;
    }
    return (
        <ul className="list-disc columns-2 gap-8 pl-5 font-mono text-sm sm:columns-3 md:columns-4">
        {entries.map((entry) => (
            <li key={entry.label}>
            {entry.label} = {formatCell(entry.value)}
            </li>
        ))}
        </ul>
    );
}