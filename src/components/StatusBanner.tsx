import type { SimplexStatus } from "../lib/simplex/types";

interface StatusBannerProps {
    status: SimplexStatus;
    iterations: number;
}

export function StatusBanner({ status, iterations }: StatusBannerProps) {
    if (status === "optimal") {
        return (
        <p className="border border-neutral-400 bg-neutral-100 px-4 py-3 text-sm font-medium text-black">
            Optimal solution found · {iterations} {iterations === 1 ? "iteration" : "iterations"}
        </p>
        );
    }
    if (status === "unbounded") {
        return (
        <p className="border border-neutral-400 bg-neutral-100 px-4 py-3 text-sm font-medium text-black">
            The problem is infeasible. · Number of iterations: {iterations}
        </p>
        );
    }
    return (
        <p className="border-2 border-black bg-white px-4 py-3 text-sm font-medium text-black">
        Iteration limit reached without convergence — please report this case.
        </p>
    );
}