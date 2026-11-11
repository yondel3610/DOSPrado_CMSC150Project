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
  "rounded-full border border-slate-300 px-3 py-1.5 text-xs font-medium hover:bg-slate-100";

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
        <h1 className="text-2xl font-bold text-slate-900">Luzon Grid Dispatch &amp; Price Simulator</h1>
        <p className="text-sm text-slate-600">
          CMSC 150 Final Project · cheapest one-day dispatch and the price of electricity per block
        </p>
      </header>

      <section className="space-y-4 rounded-xl border border-slate-300 bg-white p-4 shadow-sm">
        <div className="flex flex-wrap items-center gap-2">
          <span className="text-xs font-semibold text-slate-500">Load test case:</span>
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
            className="rounded-md border border-red-300 bg-red-50 px-4 py-3 text-sm font-medium text-red-700"
          >
            {error}
          </p>
        )}

        <button
          type="button"
          onClick={handleSolve}
          className="w-full rounded-md bg-blue-600 px-4 py-2.5 font-semibold text-white hover:bg-blue-700"
        >
          Start Solving
        </button>
      </section>

      {outcome !== null && (
        <section className="space-y-3">
          <nav className="flex gap-1 border-b border-slate-300">
            {(["results", "tableau"] as TabId[]).map((tab) => (
              <button
                key={tab}
                type="button"
                onClick={() => setActiveTab(tab)}
                className={
                  activeTab === tab
                    ? "-mb-px rounded-t-md border-x border-t border-slate-300 bg-white px-4 py-2 text-sm font-semibold text-blue-700"
                    : "px-4 py-2 text-sm text-slate-600 hover:text-slate-900"
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