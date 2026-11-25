// renders the simplex tableau and the extracted answers from the solve pipeline. The React layer is
// kept separate from the solve pipeline so the latter can be unit-tested framework-free.
import { useEffect, useRef } from "react";
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
    const wrapRef = useRef<HTMLDivElement>(null);
    const pivotRef = useRef<HTMLTableCellElement>(null);

    // bring the pivot cell into view when stepping, keeping it clear of the sticky header and first column
    // honestly yeah i had to use ai for this bcs i couldn't find a proper tutorial
    useEffect(() => {
        const wrap = wrapRef.current;
        const cell = pivotRef.current;
        if (wrap === null || cell === null) return;
        const headH = wrap.querySelector("thead")?.getBoundingClientRect().height ?? 0;
        const headW = wrap.querySelector("tbody th")?.getBoundingClientRect().width ?? 0;
        const w = wrap.getBoundingClientRect();
        const c = cell.getBoundingClientRect();
        if (c.left < w.left + headW) wrap.scrollLeft -= w.left + headW - c.left;
        else if (c.right > w.right) wrap.scrollLeft += c.right - w.right;
        if (c.top < w.top + headH) wrap.scrollTop -= w.top + headH - c.top;
        else if (c.bottom > w.bottom) wrap.scrollTop += c.bottom - w.bottom;
    }, [highlight]);

    return (
        <div ref={wrapRef} className="max-h-[70vh] overflow-auto border border-line">
        <table className="w-max border-collapse font-mono text-xs tabular-nums">
            <thead>
            <tr>
                <th className="sticky left-0 top-0 z-30 border-b border-r bg-head px-2 py-1" />
                {columnLabels.map((label, j) => (
                <th
                    key={label}
                    className={`sticky top-0 z-20 border-b border-r px-2 py-1 font-semibold ${highlight?.col === j ? "bg-mark" : "bg-head"}`}
                >
                    {label}
                </th>
                ))}
            </tr>
            </thead>
            <tbody>
            {tableau.map((row, i) => (
                <tr key={i} className="odd:bg-surface even:bg-zebra">
                <th
                    className={`sticky left-0 z-10 border-b border-r px-2 py-1 font-semibold ${highlight?.row === i ? "bg-mark" : "bg-head"}`}
                >
                    {rowLabels[i]}
                </th>
                {row.map((value, j) => {
                    const highlighted = highlight !== undefined && highlight.row === i && highlight.col === j;
                    const text = formatCell(value);
                    const isZero = text === "0" && !highlighted
                    const inCross = highlight !== undefined && (highlight.row === i || highlight.col === j); // the pivot row and column are lightly shaded, the pivot cell itself more strongly
                    // 0 gets grayed outt to highlight other values
                    // sir binabasa mo ba talaga commits ko
                    return (
                    <td
                        key={j}
                        ref={highlighted ? pivotRef : undefined}
                        className={`border-b border-r px-2 py-1 text-right ${highlighted ? "bg-mark font-bold" : inCross ? "bg-cross" : ""} ${isZero ? "cell-zero" : ""}`}
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