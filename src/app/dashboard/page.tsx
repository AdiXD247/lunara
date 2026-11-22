"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { CycleRing } from "@/components/CycleRing";
import { FlowPicker } from "@/components/FlowPicker";
import { useAuth } from "@/lib/auth";
import { PHASE_META, predict } from "@/lib/cycle";
import { addDays, formatLong, formatMedium, fromKey, relativeDays, today, toKey } from "@/lib/date";
import { FLOWS } from "@/lib/types";

function Stat({
  label,
  value,
  hint,
  tone = "blush",
}: {
  label: string;
  value: string;
  hint: string;
  tone?: "blush" | "lavender" | "mint";
}) {
  const tones = {
    blush: "bg-blush-50",
    lavender: "bg-lavender-100",
    mint: "bg-mint-100",
  } as const;

  return (
    <div className={`rounded-4xl ${tones[tone]} p-5`}>
      <p className="text-xs font-semibold uppercase tracking-wide text-plum-500">{label}</p>
      <p className="mt-2 font-display text-2xl font-semibold leading-tight text-plum-900">{value}</p>
      <p className="mt-1 text-xs text-plum-500">{hint}</p>
    </div>
  );
}

export default function DashboardHome() {
  const { data, user, saveLog, logPeriod, updateProfile } = useAuth();
  const reference = useMemo(() => today(), []);
  const [onboardingDate, setOnboardingDate] = useState(() => toKey(addDays(today(), -7)));
  const [onboardingLength, setOnboardingLength] = useState(5);

  const prediction = useMemo(
    () => (data ? predict(data.logs, data.profile, reference) : null),
    [data, reference]
  );

  if (!data || !prediction) return null;

  const todayKey = toKey(reference);
  const todayLog = data.logs[todayKey];
  const meta = PHASE_META[prediction.phase];
  const recent = Object.values(data.logs)
    .filter((log) => log.date <= todayKey)
    .sort((a, b) => (a.date < b.date ? 1 : -1))
    .slice(0, 5);

  if (!prediction.hasData) {
    return (
      <div className="mx-auto max-w-2xl">
        <p className="eyebrow">Getting started</p>
        <h1 className="mt-3 text-3xl sm:text-4xl">Let&apos;s find your rhythm</h1>
        <p className="mt-3 text-base leading-relaxed text-plum-500">
          Tell Lunara when your last period started and how long it usually lasts. Everything else builds from there —
          you can fine-tune the details any time.
        </p>

        <div className="card mt-8">
          <div className="grid gap-6 sm:grid-cols-2">
            <div>
              <label className="label" htmlFor="last-start">
                Last period started
              </label>
              <input
                id="last-start"
                type="date"
                max={todayKey}
                className="field"
                value={onboardingDate}
                onChange={(e) => setOnboardingDate(e.target.value)}
              />
            </div>
            <div>
              <label className="label" htmlFor="period-length">
                It usually lasts (days)
              </label>
              <input
                id="period-length"
                type="number"
                min={1}
                max={10}
                className="field"
                value={onboardingLength}
                onChange={(e) => setOnboardingLength(Number(e.target.value))}
              />
            </div>
          </div>

          <button
            type="button"
            className="btn-primary mt-6 w-full"
            onClick={() => {
              logPeriod(onboardingDate, onboardingLength);
              updateProfile({ periodLength: onboardingLength });
            }}
          >
            Start my cycle tracking
          </button>

          <p className="mt-4 text-xs leading-relaxed text-plum-300">
            This logs {onboardingLength} period days from {formatMedium(fromKey(onboardingDate))}. You can edit or
            delete any day from the calendar.
          </p>
        </div>

        <div className="card mt-6 bg-blush-50">
          <p className="text-sm font-semibold text-plum-900">Why Lunara asks this first</p>
          <p className="mt-2 text-sm leading-relaxed text-plum-500">
            Your cycle length is the single number that makes every prediction possible. After one entry Lunara can
            already forecast the next six cycles — and each period you log after that makes it sharper.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="eyebrow">{formatLong(reference)}</p>
          <h1 className="mt-2 text-3xl sm:text-4xl">
            Hello, {(data.profile.name || user?.name || "there").split(" ")[0]}
          </h1>
        </div>
        <Link href="/dashboard/log" className="btn-primary">
          Log today
        </Link>
      </div>

      {data.profile.reminders && prediction.daysUntilNextPeriod <= 3 && (
        <div className="flex items-start gap-3 rounded-4xl border border-blush-200 bg-blush-50 px-5 py-4">
          <span className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-blush-500 text-white">
            <svg width="12" height="12" viewBox="0 0 12 12" fill="none" aria-hidden="true">
              <path d="M6 1v5.5M6 9.2v.3" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
            </svg>
          </span>
          <p className="text-sm text-plum-700">
            Heads up — your period is predicted {relativeDays(prediction.daysUntilNextPeriod)} (
            {formatMedium(prediction.nextPeriodStart)}).
          </p>
        </div>
      )}

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="card flex flex-col items-center justify-center">
          <CycleRing
            cycleDay={prediction.cycleDay}
            cycleLength={prediction.avgCycle}
            periodLength={prediction.avgPeriod}
            phase={prediction.phase}
            size={232}
            caption={`Day ${prediction.cycleDay} of an average ${prediction.avgCycle}-day cycle`}
          />
          <div className={`mt-5 rounded-3xl ${meta.soft} px-4 py-3 text-center`}>
            <p className={`text-xs font-semibold uppercase tracking-wide ${meta.text}`}>How to feel about today</p>
            <p className="mt-1 text-sm text-plum-700">{meta.blurb}</p>
          </div>
        </div>

        <div className="grid gap-5 sm:grid-cols-2 lg:col-span-2 lg:content-start">
          <Stat
            label="Next period"
            value={formatMedium(prediction.nextPeriodStart)}
            hint={`${relativeDays(prediction.daysUntilNextPeriod)} · lasts ~${prediction.avgPeriod} days`}
          />
          <Stat
            label="Estimated ovulation"
            value={formatMedium(prediction.ovulationDate)}
            hint="Roughly 14 days before your next period"
            tone="lavender"
          />
          <Stat
            label="Fertile window"
            value={`${formatMedium(prediction.fertileStart)} – ${formatMedium(prediction.fertileEnd)}`}
            hint="A six-day estimate — not a contraceptive"
            tone="lavender"
          />
          <Stat
            label="Your average cycle"
            value={`${prediction.avgCycle} days`}
            hint={
              prediction.cycleLengths.length > 0
                ? `Based on ${prediction.cycleLengths.length} logged ${
                    prediction.cycleLengths.length === 1 ? "cycle" : "cycles"
                  }`
                : "Using your default setting"
            }
            tone="mint"
          />
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="card lg:col-span-1">
          <p className="text-sm font-semibold text-plum-900">Today&apos;s flow</p>
          <p className="mt-1 text-xs text-plum-500">Tap to log how heavy it is right now.</p>
          <div className="mt-4">
            <FlowPicker value={todayLog?.flow} onChange={(flow) => saveLog(todayKey, { flow })} />
          </div>
          {todayLog ? (
            <p className="mt-4 text-xs text-plum-500">
              Logged:{" "}
              <span className="font-semibold text-plum-900">
                {todayLog.flow ? FLOWS.find((f) => f.value === todayLog.flow)?.label : "no flow"}
              </span>
              {todayLog.symptoms.length > 0 && ` · ${todayLog.symptoms.length} symptoms`}
            </p>
          ) : (
            <p className="mt-4 text-xs text-plum-300">Nothing logged for today yet.</p>
          )}
          <Link href={`/dashboard/log?date=${todayKey}`} className="btn-secondary mt-5 w-full">
            Full check-in
          </Link>
        </div>

        <div className="card lg:col-span-2">
          <div className="flex items-center justify-between">
            <p className="text-sm font-semibold text-plum-900">Coming up</p>
            <Link href="/dashboard/calendar" className="text-xs font-semibold text-blush-600 hover:text-blush-700">
              Open calendar
            </Link>
          </div>
          <ul className="mt-4 divide-y divide-blush-100">
            {prediction.upcomingStarts.slice(0, 4).map((start, index) => (
              <li key={toKey(start)} className="flex items-center justify-between py-3">
                <span className="flex items-center gap-3">
                  <span className="flex h-9 w-9 items-center justify-center rounded-2xl bg-blush-100 font-display text-sm font-semibold text-blush-700">
                    {index + 1}
                  </span>
                  <span className="text-sm text-plum-700">
                    {index === 0 ? "Next period" : `Cycle ${index + 1} after that`}
                  </span>
                </span>
                <span className="text-sm font-semibold text-plum-900">{formatMedium(start)}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>

      <div className="card">
        <div className="flex items-center justify-between">
          <p className="text-sm font-semibold text-plum-900">Recent check-ins</p>
          <Link href="/dashboard/insights" className="text-xs font-semibold text-blush-600 hover:text-blush-700">
            See insights
          </Link>
        </div>

        {recent.length === 0 ? (
          <p className="mt-4 text-sm text-plum-500">
            No entries yet. Tap a day on the calendar or use &ldquo;Log today&rdquo; to start building your history.
          </p>
        ) : (
          <ul className="mt-4 divide-y divide-blush-100">
            {recent.map((log) => {
              const flowLabel = log.flow ? FLOWS.find((f) => f.value === log.flow)?.label : null;
              const tags = [...log.symptoms, ...log.moods];
              return (
                <li key={log.date} className="flex flex-wrap items-center justify-between gap-3 py-3">
                  <Link href={`/dashboard/log?date=${log.date}`} className="text-sm font-medium text-plum-900 hover:text-blush-600">
                    {formatMedium(fromKey(log.date))}
                  </Link>
                  <div className="flex flex-wrap items-center gap-2">
                    {flowLabel && (
                      <span className="rounded-full bg-blush-500 px-3 py-1 text-xs font-semibold text-white">
                        {flowLabel}
                      </span>
                    )}
                    {tags.slice(0, 4).map((tag) => (
                      <span key={tag} className="rounded-full bg-blush-50 px-3 py-1 text-xs text-plum-700">
                        {tag}
                      </span>
                    ))}
                    {tags.length > 4 && <span className="text-xs text-plum-300">+{tags.length - 4}</span>}
                    {!flowLabel && tags.length === 0 && <span className="text-xs text-plum-300">Note only</span>}
                  </div>
                </li>
              );
            })}
          </ul>
        )}
      </div>
    </div>
  );
}
