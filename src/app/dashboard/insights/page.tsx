"use client";

import Link from "next/link";
import { useMemo } from "react";
import { useAuth } from "@/lib/auth";
import { PHASE_META, predict } from "@/lib/cycle";
import { formatMedium, fromKey, today } from "@/lib/date";

function Stat({ label, value, hint }: { label: string; value: string; hint: string }) {
  return (
    <div className="card">
      <p className="text-xs font-semibold uppercase tracking-wide text-plum-500">{label}</p>
      <p className="mt-2 font-display text-3xl font-semibold text-plum-900">{value}</p>
      <p className="mt-1 text-xs text-plum-500">{hint}</p>
    </div>
  );
}

function BarRow({ label, value, max, suffix }: { label: string; value: number; max: number; suffix?: string }) {
  const pct = max > 0 ? Math.max((value / max) * 100, 6) : 0;
  return (
    <li className="flex items-center gap-4">
      <span className="w-28 shrink-0 truncate text-sm text-plum-700">{label}</span>
      <span className="h-3 flex-1 overflow-hidden rounded-full bg-blush-50">
        <span className="block h-full rounded-full bg-blush-400" style={{ width: `${pct}%` }} />
      </span>
      <span className="w-14 shrink-0 text-right text-xs font-semibold text-plum-900">
        {value}
        {suffix ?? ""}
      </span>
    </li>
  );
}

export default function InsightsPage() {
  const { data } = useAuth();
  const reference = useMemo(() => today(), []);

  const prediction = useMemo(
    () => (data ? predict(data.logs, data.profile, reference) : null),
    [data, reference]
  );

  const derived = useMemo(() => {
    if (!data) return null;
    const logs = Object.values(data.logs);
    const symptomCounts = new Map<string, number>();
    const moodCounts = new Map<string, number>();

    logs.forEach((log) => {
      log.symptoms.forEach((s) => symptomCounts.set(s, (symptomCounts.get(s) ?? 0) + 1));
      log.moods.forEach((m) => moodCounts.set(m, (moodCounts.get(m) ?? 0) + 1));
    });

    const topSymptoms = [...symptomCounts.entries()].sort((a, b) => b[1] - a[1]).slice(0, 6);
    const topMoods = [...moodCounts.entries()].sort((a, b) => b[1] - a[1]).slice(0, 6);
    const periodLengths = prediction?.periods.map((p) => p.length) ?? [];

    const flowCounts = new Map<string, number>();
    logs.forEach((log) => {
      if (log.flow) flowCounts.set(log.flow, (flowCounts.get(log.flow) ?? 0) + 1);
    });

    return {
      logCount: logs.length,
      symptomDays: logs.filter((l) => l.symptoms.length > 0).length,
      topSymptoms,
      topMoods,
      periodLengths,
      flowCounts,
    };
  }, [data, prediction]);

  if (!data || !prediction || !derived) return null;

  if (derived.logCount === 0) {
    return (
      <div className="mx-auto max-w-2xl space-y-6">
        <div>
          <p className="eyebrow">Insights</p>
          <h1 className="mt-2 text-3xl sm:text-4xl">Patterns need a little data</h1>
        </div>
        <div className="card">
          <p className="text-sm leading-relaxed text-plum-500">
            Once you&apos;ve logged a few days, this page fills up with cycle length history, your most common symptoms
            and your mood mix. Start with today — it takes about ten seconds.
          </p>
          <Link href="/dashboard/log" className="btn-primary mt-6">
            Log today
          </Link>
        </div>
      </div>
    );
  }

  const cycleLengths = prediction.cycleLengths;
  const domainMin = cycleLengths.length > 0 ? Math.min(...cycleLengths) - 3 : 0;
  const domainMax = cycleLengths.length > 0 ? Math.max(...cycleLengths) + 3 : 1;
  const spread = cycleLengths.length > 1 ? Math.max(...cycleLengths) - Math.min(...cycleLengths) : 0;
  const maxSymptom = derived.topSymptoms[0]?.[1] ?? 1;
  const maxMood = derived.topMoods[0]?.[1] ?? 1;
  const meta = PHASE_META[prediction.phase];
  const recentPeriods = prediction.periods.slice().reverse();

  return (
    <div className="space-y-6">
      <div>
        <p className="eyebrow">Insights</p>
        <h1 className="mt-2 text-3xl sm:text-4xl">What your logs are saying</h1>
        <p className="mt-2 max-w-2xl text-sm leading-relaxed text-plum-500">
          Plain numbers from {derived.logCount} logged {derived.logCount === 1 ? "day" : "days"}. Everything here is
          calculated on your device.
        </p>
      </div>

      <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
        <Stat
          label="Average cycle"
          value={`${prediction.avgCycle} d`}
          hint={cycleLengths.length > 0 ? `From ${cycleLengths.length} recorded cycles` : "Still using your default"}
        />
        <Stat
          label="Average period"
          value={`${prediction.avgPeriod} d`}
          hint={`${prediction.periods.length} ${prediction.periods.length === 1 ? "period" : "periods"} logged`}
        />
        <Stat label="Days logged" value={`${derived.logCount}`} hint={`${derived.symptomDays} with symptoms`} />
        <Stat
          label="Cycle variability"
          value={cycleLengths.length > 1 ? `${spread} d` : "—"}
          hint={spread > 8 ? "Wider spread — cycles vary a lot" : "Fairly consistent cycles"}
        />
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="card lg:col-span-2">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold">Cycle length history</h2>
            <span className="text-xs text-plum-300">oldest → newest</span>
          </div>

          {cycleLengths.length === 0 ? (
            <p className="mt-4 text-sm text-plum-500">
              Log at least two periods and Lunara will chart how your cycle length is moving.
            </p>
          ) : (
            <>
              <div className="mt-6 flex h-44 items-end gap-3">
                {cycleLengths.map((len, i) => {
                  const pct = ((len - domainMin) / (domainMax - domainMin)) * 100;
                  return (
                    <div key={i} className="flex flex-1 flex-col items-center gap-2">
                      <span className="text-xs font-semibold text-plum-700">{len}</span>
                      <div className="flex w-full flex-1 items-end">
                        <div
                          className="w-full rounded-t-xl bg-gradient-to-t from-blush-400 to-blush-300"
                          style={{ height: `${Math.min(Math.max(pct, 8), 100)}%` }}
                        />
                      </div>
                      <span className="text-[10px] text-plum-300">#{i + 1}</span>
                    </div>
                  );
                })}
              </div>
              <p className="mt-4 text-xs text-plum-500">
                Longest {Math.max(...cycleLengths)} days · shortest {Math.min(...cycleLengths)} days
              </p>
            </>
          )}
        </div>

        <div className="card">
          <h2 className="text-lg font-semibold">Period length</h2>
          {derived.periodLengths.length === 0 ? (
            <p className="mt-4 text-sm text-plum-500">No periods logged yet.</p>
          ) : (
            <ul className="mt-5 space-y-4">
              {derived.periodLengths.slice(-6).map((len, i, arr) => (
                <BarRow
                  key={i}
                  label={`Period ${derived.periodLengths.length - arr.length + i + 1}`}
                  value={len}
                  max={Math.max(...derived.periodLengths, 10)}
                  suffix=" d"
                />
              ))}
            </ul>
          )}
          <div className={`mt-6 rounded-3xl ${meta.soft} p-4`}>
            <p className={`text-xs font-semibold uppercase tracking-wide ${meta.text}`}>You&apos;re in your {meta.label.toLowerCase()} phase</p>
            <p className="mt-1 text-sm text-plum-700">{meta.blurb}</p>
          </div>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <div className="card">
          <h2 className="text-lg font-semibold">Most logged symptoms</h2>
          {derived.topSymptoms.length === 0 ? (
            <p className="mt-4 text-sm text-plum-500">No symptoms logged yet — that&apos;s good news.</p>
          ) : (
            <ul className="mt-5 space-y-4">
              {derived.topSymptoms.map(([name, count]) => (
                <BarRow key={name} label={name} value={count} max={maxSymptom} />
              ))}
            </ul>
          )}
        </div>

        <div className="card">
          <h2 className="text-lg font-semibold">Mood mix</h2>
          {derived.topMoods.length === 0 ? (
            <p className="mt-4 text-sm text-plum-500">No moods logged yet.</p>
          ) : (
            <ul className="mt-5 space-y-4">
              {derived.topMoods.map(([name, count]) => (
                <BarRow key={name} label={name} value={count} max={maxMood} />
              ))}
            </ul>
          )}
        </div>
      </div>

      <div className="card">
        <h2 className="text-lg font-semibold">Recent periods</h2>
        {prediction.periods.length === 0 ? (
          <p className="mt-4 text-sm text-plum-500">Nothing logged yet.</p>
        ) : (
          <div className="mt-5 overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead>
                <tr className="text-xs uppercase tracking-wide text-plum-300">
                  <th className="pb-3 font-semibold">Started</th>
                  <th className="pb-3 font-semibold">Ended</th>
                  <th className="pb-3 font-semibold">Length</th>
                  <th className="pb-3 font-semibold">Gap to next</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-blush-100">
                {recentPeriods.slice(0, 6).map((period, index) => {
                  const previous = recentPeriods[index + 1];
                  const gap = previous
                    ? Math.round((fromKey(period.start).getTime() - fromKey(previous.start).getTime()) / 86400000)
                    : null;
                  return (
                    <tr key={period.start} className="text-plum-700">
                      <td className="py-3">{formatMedium(fromKey(period.start))}</td>
                      <td className="py-3">{formatMedium(fromKey(period.end))}</td>
                      <td className="py-3">{period.length} days</td>
                      <td className="py-3">{gap === null ? "—" : `${gap} days`}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      <p className="text-xs leading-relaxed text-plum-300">
        Lunara&apos;s predictions are estimates based on the days you log. They are for information only and are not a
        form of contraception or medical advice.
      </p>
    </div>
  );
}
