"use client";

import { useState } from "react";

type JudicaResult = {
  category: string;
  overall_strength: string;
  criteria_scores: Record<string, number>;
  verdict_rationale: string;
};

export default function HomePage() {
  const [category, setCategory] = useState<"EB1A" | "NIW" | "O1">("EB1A");
  const [text, setText] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<JudicaResult | null>(null);
  const [raw, setRaw] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setResult(null);
    setRaw(null);

    try {
      const res = await fetch("/api/judge", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text, category }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || "Unknown error");
        return;
      }

      if (data.result) {
        setResult(data.result);
      } else {
        setRaw(data);
      }
    } catch (err: any) {
      setError(String(err?.message ?? err));
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="min-h-screen bg-slate-950 text-slate-100 flex flex-col items-center px-4 py-10">
      <div className="w-full max-w-3xl space-y-6">
        <header className="space-y-2">
          <h1 className="text-3xl font-semibold">Judica.dev</h1>
          <p className="text-slate-300 text-sm">
            AI-powered, <strong>strict</strong> critique for EB-1A, NIW, and O-1
            petition writing. Not legal advice – feedback only.
          </p>
        </header>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="flex flex-wrap gap-3 items-center">
            <label className="text-sm font-medium">Category</label>
            <select
              value={category}
              onChange={(e) =>
                setCategory(e.target.value as "EB1A" | "NIW" | "O1")
              }
              className="bg-slate-900 border border-slate-700 rounded px-3 py-1 text-sm"
            >
              <option value="EB1A">EB-1A (Extraordinary Ability)</option>
              <option value="NIW">NIW (National Interest Waiver)</option>
              <option value="O1">O-1 (Extraordinary Ability)</option>
            </select>
          </div>

          <div className="space-y-1">
            <label className="text-sm font-medium">
              Petition letter / summary
            </label>
            <textarea
              value={text}
              onChange={(e) => setText(e.target.value)}
              className="w-full h-64 bg-slate-900 border border-slate-700 rounded px-3 py-2 text-sm resize-vertical"
              placeholder="Paste your petition cover letter, RFE response, or a detailed summary here..."
            />
            <p className="text-xs text-slate-500">
              Do not paste confidential info you’re not comfortable sharing with
              an AI model. This tool is for feedback only and does not replace a
              licensed attorney.
            </p>
          </div>

          <button
            type="submit"
            disabled={loading || !text.trim()}
            className="inline-flex items-center justify-center rounded bg-emerald-500 px-4 py-2 text-sm font-medium text-slate-950 disabled:opacity-50"
          >
            {loading ? "Evaluating…" : "Evaluate with Judica"}
          </button>
        </form>

        {error && (
          <div className="border border-red-500/60 bg-red-950/30 rounded p-3 text-sm text-red-200">
            Error: {error}
          </div>
        )}

        {result && (
          <section className="border border-slate-700 rounded p-4 space-y-3">
            <h2 className="text-lg font-semibold">Judica’s Evaluation</h2>
            <p className="text-sm">
              <span className="font-medium">Category:</span> {result.category}
            </p>
            <p className="text-sm">
              <span className="font-medium">Overall strength:</span>{" "}
              <span className="uppercase tracking-wide">
                {result.overall_strength}
              </span>
            </p>

            <div className="space-y-1">
              <p className="text-sm font-medium">Criterion scores (0–10):</p>
              <ul className="grid grid-cols-2 gap-1 text-sm">
                {Object.entries(result.criteria_scores || {}).map(
                  ([k, v]) => (
                    <li key={k}>
                      <span className="capitalize">{k.replace(/_/g, " ")}:</span>{" "}
                      <span className="font-mono">{v}</span>
                    </li>
                  )
                )}
              </ul>
            </div>

            <div className="space-y-1">
              <p className="text-sm font-medium">Rationale</p>
              <p className="text-sm text-slate-200">
                {result.verdict_rationale}
              </p>
            </div>
          </section>
        )}

        {raw && !result && (
          <section className="border border-amber-500/60 bg-amber-950/30 rounded p-4 space-y-2">
            <p className="text-sm font-medium">
              Model did not return clean JSON. Raw output:
            </p>
            <pre className="text-xs whitespace-pre-wrap">
              {JSON.stringify(raw, null, 2)}
            </pre>
          </section>
        )}

        <footer className="pt-6 border-t border-slate-800 mt-6 text-xs text-slate-500">
          This is an experimental tool. It does not provide legal advice and
          does not predict case outcomes. Always consult a qualified immigration
          attorney for your petition strategy.
        </footer>
      </div>
    </main>
  );
}
