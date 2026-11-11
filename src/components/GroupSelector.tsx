// requirement (a): pick any or all plant groups, check all and reset

import { PLANT_GROUPS } from "../lib/data";

interface GroupSelectorProps {
    selectedKeys: string[];
    onToggle: (key: string) => void;
    onCheckAll: () => void;
    onReset: () => void;
}
const smallButton =
    "rounded-md border border-slate-300 px-3 py-1.5 text-xs font-medium hover:bg-slate-100";

export function GroupSelector({ selectedKeys, onToggle, onCheckAll, onReset }: GroupSelectorProps) {
    return (
        <section className="space-y-2">
        <div className="flex items-center justify-between gap-2">
            <h2 className="text-sm font-semibold text-slate-700">Plant groups</h2>
            <div className="flex gap-2">
            <button type="button" onClick={onCheckAll} className={smallButton}>
                Check All
            </button>
            <button type="button" onClick={onReset} className={smallButton}>
                Reset
            </button>
            </div>
        </div>
        <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
            {PLANT_GROUPS.map((group) => (
            <label
                key={group.key}
                className="flex cursor-pointer items-center gap-2 rounded-md border border-slate-300 px-3 py-2 text-sm hover:bg-slate-50"
            >
                <input
                type="checkbox"
                checked={selectedKeys.includes(group.key)}
                onChange={() => onToggle(group.key)}
                className="h-4 w-4"
                />
                <span>{group.name}</span>
            </label>
            ))}
        </div>
        </section>
    );
}