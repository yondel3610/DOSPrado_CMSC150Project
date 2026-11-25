// requirement (a): pick any or all plant groups, check all and reset

import { PLANT_GROUPS } from "../lib/data";

interface GroupSelectorProps {
    selectedKeys: string[];
    onToggle: (key: string) => void;
    onCheckAll: () => void;
    onReset: () => void;
}
export function GroupSelector({ selectedKeys, onToggle, onCheckAll, onReset }: GroupSelectorProps) {
    return (
        <section>
        <div className="panel-title flex items-center justify-between">
            <h2>Plant groups</h2>
            <div className="flex gap-1">
            <button type="button" onClick={onCheckAll} className="btn">
                Check All
            </button>
            <button type="button" onClick={onReset} className="btn">
                Reset
            </button>
            </div>
        </div>
        <ul>
            {PLANT_GROUPS.map((group) => (
            <li key={group.key} className="border-b border-line last:border-b-0">
                <label className="flex cursor-pointer items-center gap-2 px-3 py-1.5 hover:bg-zebra">
                <input
                    type="checkbox"
                    checked={selectedKeys.includes(group.key)}
                    onChange={() => onToggle(group.key)}
                    className="h-3.5 w-3.5 accent-black"
                />
                <span>{group.name}</span>
                </label>
            </li>
            ))}
        </ul>
        </section>
    );
}