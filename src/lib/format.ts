// shared number formatting for tableau cells and final results

export function formatCell(value: number): string {
    if (!Number.isFinite(value)) return String(value);
    if (Number.isInteger(value)) return String(value);
    const s = value.toFixed(6).replace(/0+$/, "").replace(/\.$/, "");
    return s === "-0" ? "0" : s;
}

export function formatPeso(value: number): string {
    return `₱${value.toLocaleString("en-PH", { maximumFractionDigits: 2 })}`;
}

// power in MW, rounded to 2 decimal places, with -0 normalized to 0
export function formatMW(value: number): string {
    // normalize -0 / tiny float noise (e.g. -1e-12) so the table never shows "-0.00"
    const v = Math.abs(value) < 0.005 ? 0 : value;
    return v.toLocaleString("en-PH", { minimumFractionDigits: 2, maximumFractionDigits: 2 });
}