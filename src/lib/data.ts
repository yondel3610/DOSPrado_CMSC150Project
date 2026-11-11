// from table 1, table 2, and table 3

export const HOURS_PER_BLOCK = 4;
export const DEFAULT_CO2_CAP = 165_000; // t/day
export const HYDRO_DAILY_ENERGY = 8_000; // MWh/day (E, constraint 5)

export interface PlantGroup {
    key: string;
    name: string;
    capacity: number; // Cap_g (MW)
    emission: number; // e_g (t CO₂/MWh)
    /** Operating cost c_gt (₱/MWh) for B1..B6; fuel plants from Table 3, renewables flat. */
    costByBlock: number[];
    /** Fraction of capacity the group never runs below (coal only, constraint 3). */
    minFraction?: number;
    /** Max MW change between consecutive blocks (coal only, constraint 4). */
    ramp?: number;
}

// hardcoded table 3
export const PLANT_GROUPS: PlantGroup[] = [
    { key: "coal", name: "Coal", capacity: 7000, emission: 0.95,
        costByBlock: [3800, 3838, 3914, 3990, 3952, 3876], minFraction: 0.40, ramp: 1500 },
    { key: "natgas", name: "Natural Gas", capacity: 3300, emission: 0.40,
        costByBlock: [6500, 6565, 6695, 6825, 6760, 6630] },
    { key: "geothermal", name: "Geothermal", capacity: 800, emission: 0.10,
        costByBlock: [1500, 1515, 1545, 1575, 1560, 1530] },
    { key: "hydro", name: "Hydro", capacity: 2500, emission: 0,
        costByBlock: [300, 300, 300, 300, 300, 300] },
    { key: "oil", name: "Oil-based", capacity: 1500, emission: 0.75,
        costByBlock: [14000, 14140, 14420, 14700, 14560, 14280] },
    { key: "solar", name: "Solar", capacity: 2500, emission: 0,
        costByBlock: [40, 40, 40, 40, 40, 40] },
    { key: "wind", name: "Wind", capacity: 400, emission: 0,
        costByBlock: [60, 60, 60, 60, 60, 60] },
];

export interface Block {
    label: string; // "B1".."B6"
    hours: string;
    demand: number; // D_t (MW)
}

export const BLOCKS: Block[] = [
    { label: "B1", hours: "12–4 AM", demand: 6300 },
    { label: "B2", hours: "4–8 AM", demand: 8600 },
    { label: "B3", hours: "8 AM–12 NN", demand: 11800 },
    { label: "B4", hours: "12–4 PM", demand: 12300 },
    { label: "B5", hours: "4–8 PM", demand: 14000 },
    { label: "B6", hours: "8 PM–12 MN", demand: 10600 },
];

// Availability a_gt per block (Table 2); groups without a row always have a = 1.
export const AVAILABILITY: Record<string, number[]> = {
    solar: [0, 0.10, 0.60, 0.55, 0.08, 0],
    wind: [0.35, 0.30, 0.25, 0.25, 0.30, 0.35],
};

export function availabilityOf(groupKey: string, block: number): number {
    return AVAILABILITY[groupKey]?.[block] ?? 1;
}












