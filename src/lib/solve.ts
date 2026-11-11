// The app's solve pipeline: validated input -> primal -> dual tableau ->
// simplex -> extracted answers. Kept in lib/ so it stays framework-free
// and unit-testable; the React layer only renders the outcome.

import { DEFAULT_CO2_CAP } from "./data";
import type { DispatchResult } from "./model/extract";
import { extractResults } from "./model/extract";
import type { PrimalModel } from "./model/build";
import { buildPrimal } from "./model/build";
import type { DualTableau } from "./model/dual";
import { buildDualTableau } from "./model/dual";
import type { SimplexResult } from "./simplex/types";
import { solveSimplex } from "./simplex/solver";

export interface SolveOutcome {
    primal: PrimalModel;
    dual: DualTableau;
    result: SimplexResult;
    extracted: DispatchResult;
}

export interface RunSolveInput {
    selectedKeys: string[];
    co2CapOn: boolean;
    /** Pre-validated by validateInput(); null only when the cap is off. */
    co2Cap: number | null;
}

export function runSolve(input: RunSolveInput): SolveOutcome {
    const primal = buildPrimal({
        selected: input.selectedKeys,
        co2CapOn: input.co2CapOn,
        co2Cap: input.co2CapOn ? (input.co2Cap ?? DEFAULT_CO2_CAP) : DEFAULT_CO2_CAP,
    });
    const dual = buildDualTableau(primal);
    const result = solveSimplex(dual.tableau);
    const extracted = extractResults(result, primal);
    return { primal, dual, result, extracted };
}