import type { Tableau } from "../simplex/types";
import type { PrimalModel } from "./build";

export interface DualTableau {
    tableau: Tableau;
    numConstraints: number; // m — number of dual variables S
    numVars: number; // n — primal variables, one slack each
    columnLabels: string[]; // "S1".."Sm", "x1".."xn", "Z", "Sol"
}

export function buildDualTableau(primal: PrimalModel): DualTableau {
    const m = primal.matrix.length;
    const n = primal.numVars;
    const width = m + n + 2;

    const tableau: Tableau = Array.from({ length: n + 1 }, () => new Array<number>(width).fill(0));
    for (let j = 0; j < n; j++) {
        // Dual constraint j: Σ_i A[i][j]·S_i ≤ c_j
        for (let i = 0; i < m; i++) tableau[j][i] = primal.matrix[i][j]; // Aᵀ = transpose
        tableau[j][m + j] = 1; // slack belonging to x_j
        tableau[j][width - 1] = primal.objective[j]; // RHS = c_j
    }
    // Objective row, Ex05 convention: negated coefficients of max bᵀS
    for (let i = 0; i < m; i++) tableau[n][i] = -primal.rhs[i];
    tableau[n][m + n] = 1; // Z column

    const columnLabels = [
        ...primal.constraintNames,
        ...Array.from({ length: n }, (_, j) => `x${j + 1}`),
        "Z",
        "Sol",
    ];
    return { tableau, numConstraints: m, numVars: n, columnLabels };
}