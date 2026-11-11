export interface SolverInput {
    selectedKeys: string[];
    co2CapOn: boolean;
    /** null represents a blank field. */
    co2Cap: number | null;
}

export function validateInput(input: SolverInput): string | null {
    if (input.selectedKeys.length === 0) {
        return "Select at least one plant group.";
    }
    if (input.co2CapOn && (input.co2Cap === null || !Number.isFinite(input.co2Cap) || input.co2Cap <= 0)) {
        return "CO₂ cap must be a positive number when the cap is switched on.";
    }
    return null;
}