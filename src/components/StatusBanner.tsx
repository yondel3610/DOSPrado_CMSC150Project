import type { SimplexStatus } from "../lib/simplex/types";

interface StatusBannerProps {
    status: SimplexStatus;
    iterations: number;
}

export function StatusBanner({ status, iterations }: StatusBannerProps) {
    if (status === "optimal") {
        return (
        <p className="rounded-md border border-green-300 bg-green-50 px-4 py-3 text-sm font-medium text-green-800">
            Optimal solution found · {iterations} {iterations === 1 ? "iteration" : "iterations"}
        </p>
        );
    }
    if (status === "unbounded") {
        return (
        <p className="rounded-md border border-amber-300 bg-amber-50 px-4 py-3 text-sm font-medium text-amber-800">
            The problem is infeasible. · Number of iterations: {iterations}
        </p>
        );
    }
    return (
        <p className="rounded-md border border-red-300 bg-red-50 px-4 py-3 text-sm font-medium text-red-800">
        Iteration limit reached without convergence — please report this case.
        </p>
    );
}