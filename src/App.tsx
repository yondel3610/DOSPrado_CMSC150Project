import { useState } from "react";
import { PLANT_GROUPS, DEFAULT_CO2_CAP } from "./lib/data";
import { validateInput } from "./lib/validate";
import { runSolve, type SolveOutcome } from "./lib/solve";
import { Co2CapInput } from "./components/Co2CapInput";
import { GroupSelector } from "./components/GroupSelector";
import { ResultsTab } from "./tabs/ResultsTab";
import { TableauTab } from "./tabs/TableauTab";
import { TEST_CASE_PRESETS } from "./tabs/presets";

type TabId = "results" | "tableau";

const presetButton =
  "border border-neutral-400 px-3 py-1.5 text-xs font-medium hover:bg-neutral-100";

export default function App() {
  // Inputs
  const [selectedKeys, setSelectedKeys] = useState<string[]>(PLANT_GROUPS.map((g) => g.key));
  const [co2CapOn, setCo2CapOn] = useState(false);
  const [co2CapText, setCo2CapText] = useState(String(DEFAULT_CO2_CAP));
  // Output + UI state
  const [activeTab, setActiveTab] = useState<TabId>("results");
  const [error, setError] = useState<string | null>(null);
  const [outcome, setOutcome] = useState<SolveOutcome | null>(null);

  const co2CapValue = co2CapText.trim() === "" ? null : Number(co2CapText);

  const toggleGroup = (key: string) =>
    setSelectedKeys((keys) =>
      keys.includes(key) ? keys.filter((k) => k !== key) : [...keys, key],
    );

  const applyPreset = (presetId: number) => {
    const preset = TEST_CASE_PRESETS.find((p) => p.id === presetId)!;
    setSelectedKeys(preset.selectedKeys);
    setCo2CapOn(preset.co2CapOn);
    setCo2CapText(String(preset.co2Cap));
    setError(null);
  };

  const handleSolve = () => {
    const validationError = validateInput({ selectedKeys, co2CapOn, co2Cap: co2CapValue });
    if (validationError !== null) {
      setError(validationError);
      setOutcome(null);
      return;
    }
    setError(null);
    setOutcome(runSolve({ selectedKeys, co2CapOn, co2Cap: co2CapValue }));
    setActiveTab("tableau"); // expectation (c): solving shows the initial tableau
  };

  return (
    <main className="mx-auto max-w-5xl space-y-6 px-4 py-6">
      <header className="space-y-1">
        <h1 className="text-2xl font-bold text-slate-900">Luzon Grid Dispatch Simulator</h1>
      </header>

      <section className="space-y-4 border border-neutral-400 bg-white p-4">
        <div className="flex flex-wrap items-center gap-2">
          <span className="text-xs font-semibold text-black">Load test case:</span>
          {TEST_CASE_PRESETS.map((preset) => (
            <button
              key={preset.id}
              type="button"
              onClick={() => applyPreset(preset.id)}
              className={presetButton}
            >
              {preset.label}
            </button>
          ))}
        </div>

        <GroupSelector
          selectedKeys={selectedKeys}
          onToggle={toggleGroup}
          onCheckAll={() => setSelectedKeys(PLANT_GROUPS.map((g) => g.key))}
          onReset={() => setSelectedKeys([])}
        />

        <Co2CapInput
          enabled={co2CapOn}
          value={co2CapText}
          onToggle={setCo2CapOn}
          onChange={setCo2CapText}
        />

        {error !== null && (
          <p
            role="alert"
            className="border-2 border-black bg-white px-4 py-3 text-sm font-medium text-black"
          >
            {error}
          </p>
        )}

        <button
          type="button"
          onClick={handleSolve}
          className="w-full bg-black px-4 py-2.5 font-semibold text-white hover:bg-neutral-800"
        >
          Start Solving
        </button>
      </section>

      {outcome !== null && (
        <section className="space-y-3">
          <nav className="flex gap-1 border-b border-neutral-400">
            {(["results", "tableau"] as TabId[]).map((tab) => (
              <button
                key={tab}
                type="button"
                onClick={() => setActiveTab(tab)}
                className={
                  activeTab === tab
                    ? "-mb-px border-x border-t border-neutral-400 bg-white px-4 py-2 text-sm font-semibold text-black"
                    : "px-4 py-2 text-sm text-black hover:bg-neutral-100"
                }
              >
                {tab === "results" ? "Results" : "Simplex Tableau"}
              </button>
            ))}
          </nav>
          {activeTab === "results" ? <ResultsTab outcome={outcome} /> : <TableauTab outcome={outcome} />}
        </section>
      )}
    </main>
  );
}