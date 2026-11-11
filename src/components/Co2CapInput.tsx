// requirement (b): the CO₂ cap can be toggled on/off and its value edited

interface Co2CapInputProps {
    enabled: boolean;
    value: string;
    onToggle: (enabled: boolean) => void;
    onChange: (value: string) => void;
}

export function Co2CapInput({ enabled, value, onToggle, onChange }: Co2CapInputProps) {
    return (
        <section className="space-y-2">
        <h2 className="text-sm font-semibold text-black">CO₂ cap</h2>
        <label className="flex w-fit cursor-pointer items-center gap-2 text-sm">
            <input
            type="checkbox"
            checked={enabled}
            onChange={(e) => onToggle(e.target.checked)}
            className="h-4 w-4"
            />
            <span>Limit daily CO₂</span>
        </label>
        <div className="flex items-center gap-2">
            <input
            type="number"
            min={0}
            disabled={!enabled}
            value={value}
            placeholder="e.g. 165000"
            onChange={(e) => onChange(e.target.value)}
            className="w-40 border border-neutral-400 px-3 py-2 text-sm disabled:bg-neutral-100 disabled:text-black"
            />
            <span className="text-sm text-black">t/day</span>
        </div>
        </section>
    );
}