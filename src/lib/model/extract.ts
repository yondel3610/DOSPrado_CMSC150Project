import type { SimplexResult } from "../simplex/types";
import { HOURS_PER_BLOCK } from "../data";
import type { PrimalModel } from "./build";

export interface DispatchResult {
    status: SimplexResult["status"];
    iterations: number;
    Z: number | null;
    dispatch: number[]; // x per primal variable (MW)
    shadowPrices: number[]; // S per constraint
    pricesPerBlock: number[]; // S1..S6 ÷ h (₱/MWh)
    costCheck: number | null; // Σ b_i·S_i — must equal Z (spec check, step 4)
}

export function extractResults(result: SimplexResult, primal: PrimalModel): DispatchResult {
    const m = primal.matrix.length;
    const n = primal.numVars;

    if (result.status !== "optimal" || result.basicSolution === null) {
        return {
        status: result.status,
        iterations: result.iterations,
        Z: null,
        dispatch: [],
        shadowPrices: [],
        pricesPerBlock: [],
        costCheck: null,
        };
    }

    const finalTableau = result.history[result.history.length - 1].tableau;
    const bottom = finalTableau[finalTableau.length - 1];

    const shadowPrices = result.basicSolution.slice(0, m);
    const dispatch = Array.from({ length: n }, (_, j) => bottom[m + j]);
    const pricesPerBlock = shadowPrices.slice(0, 6).map((s) => s / HOURS_PER_BLOCK);
    const costCheck = primal.rhs.reduce((acc, b, i) => acc + b * shadowPrices[i], 0);

    return {
        status: result.status,
        iterations: result.iterations,
        Z: result.Z,
        dispatch,
        shadowPrices,
        pricesPerBlock,
        costCheck,
    };
}