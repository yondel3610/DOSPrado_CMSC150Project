import { useState } from "react";
import { PLANT_GROUPS, DEFAULT_CO2_CAP } from "./lib/data";
import { validateInput } from "./lib/validate";
import { runSolve, type SolveOutcome } from "./lib/solve";
import { Co2CapInput } from "./components/Co2CapInput";
import { GroupSelector } from "./components/GroupSelector";
import { ResultsTab } from "./tabs/ResultsTab";
import { TableauTab } from "./tabs/TableauTab";
import { TEST_CASE_PRESETS } from "./tabs/presets";
import type { SimplexStatus } from "./lib/simplex/types";

type TabId = "results" | "tableau";

const STATUS_LABEL: Record<SimplexStatus, string> = {
  optimal: "Optimal",
  unbounded: "Infeasible",
  infeasible: "Infeasible",
  "max-iterations": "Iteration limit",
};

export default function App() {
  // Inputs
  const [selectedKeys, setSelectedKeys] = useState<string[]>(PLANT_GROUPS.map((g) => g.key));
  const [co2CapOn, setCo2CapOn] = useState(false);
  const [co2CapText, setCo2CapText] = useState(String(DEFAULT_CO2_CAP));
  // Output + UI state
  const [activeTab, setActiveTab] = useState<TabId>("results");
  const [error, setError] = useState<string | null>(null);
  const [outcome, setOutcome] = useState<SolveOutcome | null>(null);
  const [solveMs, setSolveMs] = useState<number | null>(null);

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
    const started = performance.now();
    const next = runSolve({ selectedKeys, co2CapOn, co2Cap: co2CapValue });
    setSolveMs(performance.now() - started);
    setOutcome(next);
    setActiveTab("tableau"); // expectation (c): solving shows the initial tableau
  };

  const solveTime =
    solveMs === null ? "-" : solveMs < 1 ? "<1 ms" : `${solveMs.toFixed(1)} ms`;
  const statusItems: [string, string][] =
    outcome === null
      ? [["Status", error !== null ? "Input error" : "Ready"]]
      : [
          ["Status", STATUS_LABEL[outcome.extracted.status]],
          ["Iterations", String(outcome.extracted.iterations)],
          ["Size", `${outcome.dual.numConstraints} × ${outcome.dual.numVars}`],
          ["Solve time", solveTime],
        ];

  return (
    <div className="flex min-h-screen flex-col bg-app text-ink md:h-screen">
      <header className="shrink-0 border-b border-line bg-head px-3 py-1.5">
        <h1 className="text-[13px] font-bold">Luzon Grid Dispatch Simulator</h1>
      </header>

      <div className="flex flex-1 flex-col md:min-h-0 md:flex-row">
        <aside className="shrink-0 divide-y divide-line border-b border-line bg-surface md:w-72 md:overflow-y-auto md:border-b-0 md:border-r">
          <section>
            <h2 className="panel-title">Test cases</h2>
            <div className="flex flex-col gap-1 p-2">
              {TEST_CASE_PRESETS.map((preset) => (
                <button
                  key={preset.id}
                  type="button"
                  onClick={() => applyPreset(preset.id)}
                  className="btn text-left"
                >
                  {preset.label}
                </button>
              ))}
            </div>
          </section>

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

          <div className="space-y-2 p-2">
            {error !== null && (
              <p role="alert" className="border-2 border-ink p-2 text-xs font-semibold">
                {error}
              </p>
            )}
            <button type="button" onClick={handleSolve} className="btn btn-primary w-full py-2">
              Start Solving
            </button>
          </div>
        </aside>

        <main className="min-w-0 flex-1 bg-surface md:overflow-auto">
          {outcome === null ? (
            <p className="p-4 text-dim">No results yet. Select plant groups and press Start Solving.</p>
          ) : (
            <>
              <nav className="flex border-b border-line bg-head">
                {(["results", "tableau"] as TabId[]).map((tab) => (
                  <button
                    key={tab}
                    type="button"
                    onClick={() => setActiveTab(tab)}
                    className={
                      activeTab === tab
                        ? "-mb-px border-r border-b border-r-line border-b-surface bg-surface px-4 py-1.5 font-semibold"
                        : "border-r border-line px-4 py-1.5 hover:bg-zebra"
                    }
                  >
                    {tab === "results" ? "Results" : "Simplex Tableau"}
                  </button>
                ))}
              </nav>
              <div className="p-3">
                {activeTab === "results" ? <ResultsTab outcome={outcome} /> : <TableauTab outcome={outcome} />}
              </div>
            </>
          )}
        </main>
      </div>

      <footer className="flex shrink-0 flex-wrap gap-x-6 border-t border-line bg-head px-3 py-1 text-xs">
        {statusItems.map(([label, value]) => (
          <span key={label}>
            <span className="text-dim">{label}:</span> <span className="font-mono">{value}</span>
          </span>
        ))}
      </footer>
    </div>
  );
}