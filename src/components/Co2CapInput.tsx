// requirement (b): the CO₂ cap can be toggled on/off and its value edited

interface Co2CapInputProps {
    enabled: boolean;
    value: string;
    onToggle: (enabled: boolean) => void;
    onChange: (value: string) => void;
}

export function Co2CapInput({ enabled, value, onToggle, onChange }: Co2CapInputProps) {
    return (
        <section>
        <h2 className="panel-title">CO₂ cap</h2>
        <div className="space-y-2 p-3">
            <label className="flex w-fit cursor-pointer items-center gap-2">
            <input
                type="checkbox"
                checked={enabled}
                onChange={(e) => onToggle(e.target.checked)}
                className="h-3.5 w-3.5 accent-ink"
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
                className="field w-32 text-right"
            />
            <span className="text-dim">t/day</span>
            </div>
        </div>
        </section>
    );
}