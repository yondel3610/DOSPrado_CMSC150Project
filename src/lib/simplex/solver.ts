import type { Pivot, SimplexResult, Tableau, TableauSnapshot } from './types'

const MAX_ITERATIONS = 10_000; // safety net; the largest test case needs 39

export function solveSimplex(initialTableau: Tableau): SimplexResult {
    const t = initialTableau.map((row) => [...row]); // never mutate the caller's tableau
    if (t.length === 0 || t.some((row) => row.length !== t[0].length)) {
        throw new Error("Tableau must be a non-empty rectangular matrix.");
    }

    const history: TableauSnapshot[] = [snapshotOf(t, 0, undefined)];
    let iterations = 0;

    for (;;) {
        const pc = choosePivotColumn(t);
        if (pc === -1) break; // no negative in the objective row -> optimal

        const pr = choosePivotRow(t, pc);
        if (pr === -1) {
        return { status: "unbounded", iterations, history, basicSolution: null, Z: null };
        }

        pivot(t, pr, pc);
        iterations += 1;
        history.push(snapshotOf(t, iterations, { row: pr, col: pc }));

        if (iterations >= MAX_ITERATIONS) {
        return { status: "max-iterations", iterations, history, basicSolution: null, Z: null };
        }
    }

    const last = history[history.length - 1];
    return { status: "optimal", iterations, history, basicSolution: last.basicSolution, Z: last.Z };
}

// Most negative entry in the objective row, columns 0..m-3 (Z and Solution excluded)
function choosePivotColumn(t: Tableau): number {
    const objective = t[t.length - 1];
    let pc = -1;
    let min = 0;
    for (let j = 0; j <= objective.length - 3; j++) {
        if (objective[j] < min) {
        min = objective[j];
        pc = j;
        }
    }
    return pc;
}

// Most negative ratio of rhs / pivot col, rows 0..n-2 (objective row excluded)
function choosePivotRow(t: Tableau, pc: number): number {
    const rhs = t[0].length - 1;
    let pr = -1;
    let minRatio = Infinity;
    for (let i = 0; i < t.length - 1; i++) {
        if (t[i][pc] > 0) {
        const ratio = t[i][rhs] / t[i][pc];
        if (ratio < minRatio) {
            minRatio = ratio;
            pr = i;
        }
        }
    }
    return pr;
}

// normalize the pivot_row then Gauss-Jordan on the pivot col
// fromm ebery other row (from exer5)
function pivot(t: Tableau, pr: number, pc: number): void {
    const pe = t[pr][pc];
    const normalized = t[pr].map((v) => v / pe);
    for (let i = 0; i < t.length; i++) {
        if (i === pr) {
        t[i] = [...normalized];
        } else if (t[i][pc] !== 0) {
        const factor = t[i][pc];
        for (let j = 0; j < t[0].length; j++) {
            t[i][j] -= factor * normalized[j];
        }
        }
    }
}

// basic solution is the last column of the tableau, but only for rows that are unit vectors
function extractBasicSolution(t: Tableau): number[] {
    const n = t.length;
    const m = t[0].length;
    const solution = new Array<number>(m - 2).fill(0);
    for (let j = 0; j < m - 2; j++) {
        let oneRow = -1;
        let isUnit = true;
        for (let i = 0; i < n; i++) {
        const v = t[i][j];
        if (v === 1) {
            if (oneRow !== -1) {
            isUnit = false;
            break;
            }
            oneRow = i;
        } else if (v !== 0) {
            isUnit = false;
            break;
        }
        }
        if (isUnit && oneRow !== -1) {
        solution[j] = t[oneRow][m - 1];
        }
    }
    return solution;
}

// snapshot 
function snapshotOf(t: Tableau, iteration: number, pivotCell?: Pivot): TableauSnapshot {
    return {
        iteration,
        tableau: t.map((row) => [...row]),
        pivot: pivotCell,
        basicSolution: extractBasicSolution(t),
        Z: t[t.length - 1][t[0].length - 1],
    };
}