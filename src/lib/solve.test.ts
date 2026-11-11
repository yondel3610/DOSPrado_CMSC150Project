// e2e test of the app's solve pipeline against test case #1.

import { describe, expect, it } from "vitest";
import { runSolve } from "./solve";

describe("runSolve (App pipeline)", () => {
    it("solves Test Case #1 end to end", () => {
        const outcome = runSolve({
        selectedKeys: ["coal", "natgas", "hydro", "oil", "solar", "wind"],
        co2CapOn: false,
        co2Cap: 165_000,
        });

        expect(outcome.extracted.status).toBe("optimal");
        expect(outcome.extracted.iterations).toBe(34);
        expect(outcome.result.history).toHaveLength(35); // initial + 34 pivots
        expect(outcome.dual.columnLabels).toHaveLength(
        outcome.dual.numConstraints + outcome.dual.numVars + 2,
        );
    });
});