export type Tableau = number[][];

export interface Pivot {
    row: number;
    col: number;
}

export interface TableauSnapshot {
    // init tableau as handed to the solver
    iteration: number;
    tableau: Tableau;

    // undefined at iter 0
    pivot?: Pivot;
    basicSolution: number[];
    Z: number;
}

export type SimplexStatus = "optimal" | "unbounded" | "infeasible" | "max-iterations";

export interface SimplexResult {
    status: SimplexStatus;
    iterations: number;
    history: TableauSnapshot[];

    // one value per variable + slack col 
    // null unless optimal
    basicSolution: number[] | null;
    Z: number | null;
}   






