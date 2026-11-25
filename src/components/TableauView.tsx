// renders the simplex tableau and the extracted answers from the solve pipeline. The React layer is
// kept separate from the solve pipeline so the latter can be unit-tested framework-free.

import type { Pivot, Tableau } from "../lib/simplex/types";
import { formatCell } from "../lib/format";

interface TableauViewProps {
    tableau: Tableau;
    columnLabels: string[];
    rowLabels: string[];
    /** Cell that was pivoted to produce this tableau (undefined for iteration 0). */
    highlight?: Pivot;
}

export function TableauView({ tableau, columnLabels, rowLabels, highlight }: TableauViewProps) {
    return (
        <div className="max-h-[70vh] overflow-auto border border-line">
        <table className="w-max border-collapse font-mono text-xs tabular-nums">
            <thead>
            <tr>
                <th className="sticky left-0 top-0 z-30 border-b border-r bg-head px-2 py-1" />
                {columnLabels.map((label) => (
                <th
                    key={label}
                    className="sticky top-0 z-20 border-b border-r bg-head px-2 py-1 font-semibold"
                >
                    {label}
                </th>
                ))}
            </tr>
            </thead>
            <tbody>
            {tableau.map((row, i) => (
                <tr key={i} className="odd:bg-surface even:bg-zebra">
                <th className="sticky left-0 z-10 border-b border-r bg-head px-2 py-1 font-semibold">
                    {rowLabels[i]}
                </th>
                {row.map((value, j) => {
                    const highlighted = highlight !== undefined && highlight.row === i && highlight.col === j;
                    const text = formatCell(value);
                    const isZero = text === "0" && !highlighted
                    // 0 gets grayed outt to highlight other values
                    // sir binabasa mo ba talaga commits ko
                    return (
                    <td
                        key={j}
                        className={`border-b border-r px-2 py-1 text-right ${highlighted ? "bg-mark font-bold" : ""} ${isZero ? "cell-zero" : ""}`}
                    >
                        {text}
                    </td>
                    );
                })}
                </tr>
            ))}
            </tbody>
        </table>
        </div>
    );
}