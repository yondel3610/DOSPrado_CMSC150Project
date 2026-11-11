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