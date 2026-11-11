export interface Preset {
    id: number;
    label: string;
    selectedKeys: string[];
    co2CapOn: boolean;
    co2Cap: number;
}

export const TEST_CASE_PRESETS: Preset[] = [
    {
        id: 1,
        label: "TC #1 · no Geothermal · CO₂ off",
        selectedKeys: ["coal", "natgas", "hydro", "oil", "solar", "wind"],
        co2CapOn: false,
        co2Cap: 165_000,
    },
    {
        id: 2,
        label: "TC #2 · no Solar · CO₂ 180,000 t",
        selectedKeys: ["coal", "natgas", "geothermal", "hydro", "oil", "wind"],
        co2CapOn: true,
        co2Cap: 180_000,
    },
    {
        id: 3,
        label: "TC #3 · no Solar · CO₂ 165,000 t (infeasible)",
        selectedKeys: ["coal", "natgas", "geothermal", "hydro", "oil", "wind"],
        co2CapOn: true,
        co2Cap: 165_000,
    },
];