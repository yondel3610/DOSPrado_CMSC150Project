import { describe, expect, it } from "vitest";
import { PLANT_GROUPS } from "../data";
import { solveSimplex } from "../simplex/solver";
import { buildPrimal } from "./build";
import { buildDualTableau } from "./dual";
import { extractResults } from "./extract";

function runCase(selected: string[], co2CapOn: boolean, co2Cap = 165_000) {
    const primal = buildPrimal({ selected, co2CapOn, co2Cap });
    const dual = buildDualTableau(primal);
    return { primal, result: extractResults(solveSimplex(dual.tableau), primal) };
}

const TC1_GROUPS = ["coal", "natgas", "hydro", "oil", "solar", "wind"];
const TC23_GROUPS = ["coal", "natgas", "geothermal", "hydro", "oil", "wind"];

describe("Test Case #1 (no Geothermal, CO₂ off)", () => {
    const { primal, result } = runCase(TC1_GROUPS, false);

    it("matches the spec exactly", () => {
        expect(result.status).toBe("optimal");
        expect(result.iterations).toBe(34);
        expect(Math.abs(result.Z! - 1_149_843_800) / 1_149_843_800).toBeLessThan(1e-9);
        [3800, 6565, 6695, 14700, 14700, 14280].forEach((p, t) =>
        expect(result.pricesPerBlock[t]).toBeCloseTo(p, 2),
        );
    });

    it("reproduces the spec dispatch table", () => {
        const x = (groupKey: string, block: number) => {
        const gi = primal.groups.findIndex((g) => g.key === groupKey);
        return result.dispatch[gi * 6 + block];
        };
        expect(x("coal", 0)).toBeCloseTo(6160, 2);
        expect(x("natgas", 1)).toBeCloseTo(1230, 2);
        expect(x("hydro", 3)).toBeCloseTo(120, 2);
        expect(x("hydro", 4)).toBeCloseTo(1880, 2);
        expect(x("oil", 3)).toBeCloseTo(405, 2);
        expect(x("oil", 5)).toBeCloseTo(160, 2);
        expect(x("solar", 2)).toBeCloseTo(1500, 2);
        expect(x("wind", 4)).toBeCloseTo(120, 2);
    });

    it("passes the spec's Σ bᵢ·Sᵢ = Z check", () => {
        expect(Math.abs(result.costCheck! - result.Z!) / result.Z!).toBeLessThan(1e-9);
    });
});

describe("Test Case #2 (no Solar, CO₂ on at 180,000 t)", () => {
    const { primal, result } = runCase(TC23_GROUPS, true, 180_000);

    it("matches the spec exactly", () => {
        expect(result.status).toBe("optimal");
        expect(result.iterations).toBe(39);
        expect(Math.abs(result.Z! - 1_181_240_745.45) / 1_181_240_745.45).toBeLessThan(1e-9);
        [8473.45, 8538.45, 18120.23, 18400.23, 18400.23, 8603.45].forEach((p, t) =>
        expect(result.pricesPerBlock[t]).toBeCloseTo(p, 2),
        );
    });

    it("reproduces the spec dispatch table", () => {
        const x = (groupKey: string, block: number) => {
        const gi = primal.groups.findIndex((g) => g.key === groupKey);
        return result.dispatch[gi * 6 + block];
        };
        expect(x("coal", 0)).toBeCloseTo(4540.91, 2);
        expect(x("natgas", 0)).toBeCloseTo(819.09, 2);
        expect(x("geothermal", 3)).toBeCloseTo(800, 2);
        expect(x("oil", 2)).toBeCloseTo(600, 2);
        expect(x("hydro", 4)).toBeCloseTo(1280, 2);
    });

    it("passes the spec's Σ bᵢ·Sᵢ = Z check", () => {
        expect(Math.abs(result.costCheck! - result.Z!) / result.Z!).toBeLessThan(1e-9);
    });
});

describe("Test Case #3 (no Solar, CO₂ on at 165,000 t — infeasible)", () => {
    const { result } = runCase(TC23_GROUPS, true, 165_000);

    it("reports infeasibility after 37 iterations", () => {
        // Dual unbounded ⟺ primal infeasible; the solver stops at a pivot column
        // with no positive entry — exactly the spec's failure signature.
        expect(result.status).toBe("unbounded");
        expect(result.iterations).toBe(37);
        expect(result.Z).toBeNull();
    });
});

describe("Milestone 1 setup sanity", () => {
    it("all 7 groups + CO₂ gives 42 unknowns and 66 constraints", () => {
        const primal = buildPrimal({
        selected: PLANT_GROUPS.map((g) => g.key),
        co2CapOn: true,
        co2Cap: 165_000,
        });
        expect(primal.numVars).toBe(42);
        expect(primal.matrix.length).toBe(66);
    });
});