import { describe, expect, it } from "vitest";
import { solveSimplex } from "./solver";

// Sample tableau from the Simplex Method handout, as used in PradoEx05.R.
// Columns: x1, x2, s1, s2, s3, s4, Z, Solution
const EX05_TABLEAU: number[][] = [
    [7, 11, 1, 0, 0, 0, 0, 77],
    [10, 8, 0, 1, 0, 0, 0, 80],
    [1, 0, 0, 0, 1, 0, 0, 9],
    [0, 1, 0, 0, 0, 1, 0, 6],
    [-150, -175, 0, 0, 0, 0, 1, 0],
    ];

    describe("solveSimplex (Ex05 port)", () => {
    it("solves the Ex05 handout sample exactly as R did", () => {
        const result = solveSimplex(EX05_TABLEAU);

        expect(result.status).toBe("optimal");
        expect(result.Z).toBeCloseTo(1413.888889, 4);
        expect(result.basicSolution![0]).toBeCloseTo(4.888889, 4); // x1
        expect(result.basicSolution![1]).toBeCloseTo(3.888889, 4); // x2
        expect(result.basicSolution![2]).toBeCloseTo(0, 6); // s1
        expect(result.basicSolution![3]).toBeCloseTo(0, 6); // s2
        expect(result.basicSolution![4]).toBeCloseTo(4.111111, 4); // s3
        expect(result.basicSolution![5]).toBeCloseTo(2.111111, 4); // s4
    });

    it("reproduces the final tableau from the R output", () => {
        const final = solveSimplex(EX05_TABLEAU).history.at(-1)!.tableau;
        expect(final[0][0]).toBeCloseTo(1, 6);
        expect(final[0][2]).toBeCloseTo(-0.1481481, 6);
        expect(final[4][2]).toBeCloseTo(10.1851852, 6);
        expect(final[4][3]).toBeCloseTo(7.8703704, 6);
        expect(final[4][7]).toBeCloseTo(1413.888889, 4);
    });

    it("records one snapshot per iteration, starting with the initial tableau", () => {
        const result = solveSimplex(EX05_TABLEAU);
        expect(result.history).toHaveLength(result.iterations + 1);
        expect(result.history[0].pivot).toBeUndefined();
        expect(result.history[0].tableau).toEqual(EX05_TABLEAU); // solver must not mutate input
    });

    it("detects an unbounded objective instead of crashing", () => {
        // max x1 s.t. x1 - x2 <= 2  ->  increasing x2 forever raises Z
        const result = solveSimplex([
        [1, -1, 1, 2],
        [-1, 0, 0, 0],
        ]);
        expect(result.status).toBe("unbounded");
        expect(result.Z).toBeNull();
    });
});