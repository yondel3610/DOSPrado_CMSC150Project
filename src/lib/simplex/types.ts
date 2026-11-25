// Types shared by the simplex solver and the UI
// All indices are 0-based; the UI adds 1 when it prints a row or column number
export type Tableau = number[][];

// Position of a pivot element in a tableau (0-based)
export interface Pivot {
    row: number;
    col: number;
}

export interface TableauSnapshot {
    // init tableau as handed to the solver
    iteration: number; // number of pivots performed. Equals history.length - 1.\
    tableau: Tableau;  // A copy of the whole tableau at this iteration

    // undefined at iter 0
    pivot?: Pivot;
    basicSolution: number[];
    Z: number;
}

export type SimplexStatus = "optimal" | "unbounded" | "infeasible" | "max-iterations";

// everything the solver returns for one run
export interface SimplexResult {
    status: SimplexStatus;
    iterations: number;
    history: TableauSnapshot[]; // history[0] is the init tableau

    // one value per variable + slack col 
    basicSolution: number[] | null;
    
    // null unless optimal
    Z: number | null;
}   






