import {
    PLANT_GROUPS,
    BLOCKS,
    HOURS_PER_BLOCK,
    HYDRO_DAILY_ENERGY,
    availabilityOf,
    type PlantGroup,
} from "../data";

export interface SolveOptions {
    /** Keys of the selected plant groups. */
    selected: string[]; // keys of the selected plant groups
    co2CapOn: boolean; // Whether the CO₂ constraint is included
    co2Cap: number; // Daily CO₂ cap in t/day. Only used when co2CapOn is true
}

export interface PrimalModel {
    groups: PlantGroup[]; // selected groups, in spec (Table 1) order
    numVars: number; // 6 per selected group
    objective: number[]; // h·c_gt, one entry per variable
    matrix: number[][]; // m × n, every row in ≥ form
    rhs: number[];
    /** x_j -> which selected group (index into groups) and block it belongs to. */
    varMeta: { groupIndex: number; block: number }[];
    constraintNames: string[]; // "S1".."Sm"
}

export function buildPrimal(opts: SolveOptions): PrimalModel {
    const groups = PLANT_GROUPS.filter((g) => opts.selected.includes(g.key));

    // Variables are numbered group-major: x1..x6 = first group's B1..B6, etc.
    const varMeta: { groupIndex: number; block: number }[] = [];
    groups.forEach((_, gi) => {
        for (let t = 0; t < 6; t++) varMeta.push({ groupIndex: gi, block: t });
    });
    const n = varMeta.length;
    const objective = varMeta.map((v) => HOURS_PER_BLOCK * groups[v.groupIndex].costByBlock[v.block]);

    const idx = (gi: number, t: number) => gi * 6 + t;

    const rows: { coeffs: number[]; rhs: number; name: string }[] = [];
    const addRow = (entries: [number, number][], rhs: number) => {
        const coeffs = new Array<number>(n).fill(0);
        for (const [j, v] of entries) coeffs[j] += v;
        rows.push({ coeffs, rhs, name: `S${rows.length + 1}` });
    };

    // (1) Demand: Σ_g x_gt ≥ D_t  ->  S1..S6
    for (let t = 0; t < 6; t++) {
        addRow(groups.map((_, gi) => [idx(gi, t), 1] as [number, number]), BLOCKS[t].demand);
    }

    // (2) Capacity: −x_gt ≥ −Cap_g·a_gt
    groups.forEach((g, gi) => {
        for (let t = 0; t < 6; t++) {
        addRow([[idx(gi, t), -1]], -g.capacity * availabilityOf(g.key, t));
        }
    });

    // (3) Coal minimum: x_Coal,t ≥ 0.40·Cap_Coal  (only when coal is selected)
    const coalGi = groups.findIndex((g) => g.key === "coal");
    if (coalGi !== -1) {
        const minMW = groups[coalGi].minFraction! * groups[coalGi].capacity; // 2,800 MW
        for (let t = 0; t < 6; t++) addRow([[idx(coalGi, t), 1]], minMW);
    }

    // (4) Coal ramping: |x_t − x_{t−1}| ≤ R, as forward-then-backward ≥ pairs
    //     per t (S55: x2−x1 ≥ −R, S56: x1−x2 ≥ −R, …) — Milestone 1 order.
    if (coalGi !== -1) {
        const R = groups[coalGi].ramp!;
        for (let t = 1; t < 6; t++) {
        addRow([[idx(coalGi, t), 1], [idx(coalGi, t - 1), -1]], -R);
        addRow([[idx(coalGi, t - 1), 1], [idx(coalGi, t), -1]], -R);
        }
    }

    // (5) Hydro water: −h·Σ_t x_Hydro,t ≥ −E  (only when hydro is selected)
    const hydroGi = groups.findIndex((g) => g.key === "hydro");
    if (hydroGi !== -1) {
        const entries: [number, number][] = [];
        for (let t = 0; t < 6; t++) entries.push([idx(hydroGi, t), -HOURS_PER_BLOCK]);
        addRow(entries, -HYDRO_DAILY_ENERGY);
    }

    // (6) CO₂ cap: −Σ_g Σ_t h·e_g·x_gt ≥ −cap  (only when toggled on)
    if (opts.co2CapOn) {
        const entries: [number, number][] = [];
        groups.forEach((g, gi) => {
        if (g.emission === 0) return;
        for (let t = 0; t < 6; t++) entries.push([idx(gi, t), -HOURS_PER_BLOCK * g.emission]);
        });
        addRow(entries, -opts.co2Cap);
    }

    return {
        groups,
        numVars: n,
        objective,
        matrix: rows.map((r) => r.coeffs),
        rhs: rows.map((r) => r.rhs),
        varMeta,
        constraintNames: rows.map((r) => r.name),
    };
}