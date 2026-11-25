import type { SimplexStatus } from "../lib/simplex/types";

interface StatusBannerProps {
    status: SimplexStatus;
    iterations: number;
}

const base = "px-3 py-2 text-[13px] font-semibold";

export function StatusBanner({ status, iterations }: StatusBannerProps) {
    if (status === "optimal") {
        return (
        <p className={`${base} border border-line bg-zebra`}>
            Optimal solution found · {iterations} {iterations === 1 ? "iteration" : "iterations"}
        </p>
        );
    }
    if (status === "unbounded") {
        return (
        <p className={`${base} border-2 border-ink bg-surface`}>
            The problem is infeasible. · Number of iterations: {iterations}
        </p>
        );
    }
    return (
        <p className={`${base} border-2 border-ink bg-surface`}>
        Iteration limit reached without convergence — please report this case.
        </p>
    );
}