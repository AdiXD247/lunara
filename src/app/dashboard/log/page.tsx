"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { FlowPicker } from "@/components/FlowPicker";
import { useAuth } from "@/lib/auth";
import { predict } from "@/lib/cycle";
import { addDays, diffDays, formatLong, fromKey, relativeDays, today, toKey } from "@/lib/date";
import { MOODS, SYMPTOMS } from "@/lib/types";

const DATE_PATTERN = /^\d{4}-\d{2}-\d{2}$/;

function toggle(list: string[], value: string): string[] {
  return list.includes(value) ? list.filter((v) => v !== value) : [...list, value];
}

export default function LogDayPage() {
  const { data, saveLog, deleteLog } = useAuth();
  const [dateKey, setDateKey] = useState<string | null>(null);

  // Read ?date= after mount (keeps the page statically renderable, no Suspense needed).
  useEffect(() => {
    const param = new URLSearchParams(window.location.search).get("date");
    setDateKey(param && DATE_PATTERN.test(param) ? param : toKey(today()));
  }, []);

  const activeKey = dateKey ?? toKey(today());

  const prediction = useMemo(
    () => (data ? predict(data.logs, data.profile, fromKey(activeKey)) : null),
    [data, activeKey]
  );

  if (!data || !prediction || dateKey === null) return null;

  const log = data.logs[dateKey];
  const symptoms = log?.symptoms ?? [];
  const moods = log?.moods ?? [];
  const date = fromKey(dateKey);

  const flags: string[] = [];
  if (prediction.actualPeriodDays.has(dateKey)) flags.push("Logged period day");
  if (prediction.predictedPeriodDays.has(dateKey)) flags.push("Predicted period day");
  if (prediction.ovulationDays.has(dateKey)) flags.push("Estimated ovulation");
  if (prediction.fertileDays.has(dateKey)) flags.push("Fertile window");

  function shift(days: number) {
    setDateKey(toKey(addDays(date, days)));
  }

  return (
    <div className="mx-auto max-w-3xl space-y-6">
      <div>
        <p className="eyebrow">Daily check-in</p>
        <h1 className="mt-2 text-3xl sm:text-4xl">Log your day</h1>
      </div>

      <div className="card flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => shift(-1)}
            aria-label="Previous day"
            className="flex h-10 w-10 items-center justify-center rounded-full border border-blush-200 text-plum-700 transition hover:bg-blush-50"
          >
            <svg width="15" height="15" viewBox="0 0 14 14" fill="none" aria-hidden="true">
              <path d="M9 3 4.5 7 9 11" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </button>
          <div className="px-1">
            <p className="font-display text-lg font-semibold leading-tight">{formatLong(date)}</p>
            <p className="text-xs text-plum-300">
              {relativeDays(diffDays(today(), date))}
              {prediction.hasData ? ` · day ${prediction.cycleDay} of your cycle` : ""}
            </p>
          </div>
          <button
            type="button"
            onClick={() => shift(1)}
            aria-label="Next day"
            className="flex h-10 w-10 items-center justify-center rounded-full border border-blush-200 text-plum-700 transition hover:bg-blush-50"
          >
            <svg width="15" height="15" viewBox="0 0 14 14" fill="none" aria-hidden="true">
              <path d="M5 3l4.5 4L5 11" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </button>
        </div>

        <div className="flex items-center gap-3">
          <input
            type="date"
            className="field w-auto py-2"
            value={dateKey}
            onChange={(e) => e.target.value && setDateKey(e.target.value)}
          />
          {dateKey !== toKey(today()) && (
            <button type="button" onClick={() => setDateKey(toKey(today()))} className="btn-ghost px-4 py-2 text-sm">
              Today
            </button>
          )}
        </div>
      </div>

      {flags.length > 0 && (
        <div className="flex flex-wrap gap-2">
          {flags.map((flag) => (
            <span key={flag} className="rounded-full bg-lavender-100 px-3.5 py-1.5 text-xs font-semibold text-lavender-700">
              {flag}
            </span>
          ))}
        </div>
      )}

      <section className="card">
        <h2 className="text-lg font-semibold">Flow</h2>
        <p className="mt-1 text-sm text-plum-500">Tap the option that matches today. Tap again to clear it.</p>
        <div className="mt-4">
          <FlowPicker value={log?.flow} onChange={(flow) => saveLog(dateKey, { flow })} />
        </div>
      </section>

      <section className="card">
        <h2 className="text-lg font-semibold">Symptoms</h2>
        <p className="mt-1 text-sm text-plum-500">Pick everything that applies.</p>
        <div className="mt-4 flex flex-wrap gap-2">
          {SYMPTOMS.map((symptom) => {
            const active = symptoms.includes(symptom);
            return (
              <button
                key={symptom}
                type="button"
                aria-pressed={active}
                onClick={() => saveLog(dateKey, { symptoms: toggle(symptoms, symptom) })}
                className={`chip ${active ? "chip-active" : ""}`}
              >
                {symptom}
              </button>
            );
          })}
        </div>
      </section>

      <section className="card">
        <h2 className="text-lg font-semibold">Mood</h2>
        <p className="mt-1 text-sm text-plum-500">However you&apos;d describe it — no wrong answers.</p>
        <div className="mt-4 flex flex-wrap gap-2">
          {MOODS.map((mood) => {
            const active = moods.includes(mood);
            return (
              <button
                key={mood}
                type="button"
                aria-pressed={active}
                onClick={() => saveLog(dateKey, { moods: toggle(moods, mood) })}
                className={`chip ${active ? "chip-active" : ""}`}
              >
                {mood}
              </button>
            );
          })}
        </div>
      </section>

      <section className="card">
        <h2 className="text-lg font-semibold">Notes</h2>
        <p className="mt-1 text-sm text-plum-500">Anything worth remembering — medication, sleep, a big event.</p>
        <textarea
          className="field mt-4 min-h-[120px] resize-y"
          placeholder="Slept badly, started a new workout plan…"
          value={log?.notes ?? ""}
          onChange={(e) => saveLog(dateKey, { notes: e.target.value })}
        />
      </section>

      <div className="flex flex-wrap items-center justify-between gap-4">
        <p className="text-xs text-plum-300">
          {log ? "Saved automatically to this browser." : "Nothing logged for this day yet."}
        </p>
        <div className="flex items-center gap-3">
          {log && (
            <button
              type="button"
              onClick={() => deleteLog(dateKey)}
              className="btn-ghost px-4 py-2 text-sm text-blush-700 hover:bg-blush-50"
            >
              Clear this day
            </button>
          )}
          <Link href="/dashboard/calendar" className="btn-secondary">
            Back to calendar
          </Link>
        </div>
      </div>
    </div>
  );
}
