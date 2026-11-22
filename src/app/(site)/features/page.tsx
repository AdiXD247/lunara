import Link from "next/link";
import { CycleRing } from "@/components/CycleRing";

const BLOCKS = [
  {
    eyebrow: "Predictions",
    title: "Forecasts that get sharper every cycle",
    body: "Lunara measures the real gap between your cycle starts and averages them, so a 31-day cycle is treated as 31 days — not squeezed into a textbook 28. Every new period you log refines the next six predictions.",
    bullets: [
      "Next period start and end dates",
      "Ovulation estimate and six-day fertile window",
      "Average cycle and period length, recalculated live",
    ],
    visual: "ring" as const,
  },
  {
    eyebrow: "Calendar",
    title: "One calendar, every kind of day",
    body: "Logged period days, forecast days, ovulation and your fertile window all live on the same month view, each with its own colour and pattern. Tap any square to open that day's log.",
    bullets: [
      "Solid marks for what you logged",
      "Dashed outline for what's predicted",
      "Diamond marker for estimated ovulation",
    ],
    visual: "calendar" as const,
  },
  {
    eyebrow: "Symptoms & mood",
    title: "Notice what your body keeps telling you",
    body: "Cramps, headaches, bloating, back pain, fatigue, acne — plus a mood check. It takes seconds, and over a few cycles Lunara shows you which days tend to bring which symptoms.",
    bullets: [
      "Ten common symptoms, one tap each",
      "Eight mood states, including brain fog",
      "Free-text notes for anything unusual",
    ],
    visual: "chips" as const,
  },
  {
    eyebrow: "Insights",
    title: "Patterns, without the spreadsheet",
    body: "Cycle length over time, your most frequent symptoms, how your mood is distributed across phases. Simple charts, honest numbers, no shaming language.",
    bullets: [
      "Cycle length history and variability",
      "Top symptoms ranked by frequency",
      "Mood distribution across your logs",
    ],
    visual: "chart" as const,
  },
];

const SYMPTOM_CHIPS = ["Cramps", "Headache", "Bloating", "Fatigue", "Acne", "Cravings"];
const MOOD_CHIPS = ["Calm", "Energetic", "Anxious", "Irritable"];

function Visual({ kind }: { kind: "ring" | "calendar" | "chips" | "chart" }) {
  if (kind === "ring") {
    return (
      <div className="card flex items-center justify-center bg-gradient-to-br from-blush-50 to-white">
        <CycleRing cycleDay={7} cycleLength={31} periodLength={5} phase="follicular" size={200} />
      </div>
    );
  }

  if (kind === "calendar") {
    const days = Array.from({ length: 21 }, (_, i) => i + 1);
    return (
      <div className="card">
        <p className="font-display text-lg font-semibold">March</p>
        <div className="mt-4 grid grid-cols-7 gap-1.5 text-center">
          {["S", "M", "T", "W", "T", "F", "S"].map((d, i) => (
            <span key={`${d}-${i}`} className="text-[10px] font-semibold uppercase text-plum-300">
              {d}
            </span>
          ))}
          {days.map((d) => {
            const logged = d >= 4 && d <= 8;
            const ovulation = d === 17;
            const fertile = d >= 15 && d <= 19;
            const predicted = d >= 20;
            return (
              <span
                key={d}
                className={`flex aspect-square items-center justify-center rounded-xl text-xs font-medium ${
                  logged
                    ? "bg-blush-500 text-white"
                    : ovulation
                      ? "bg-lavender-500 text-white"
                      : fertile
                        ? "bg-lavender-100 text-lavender-700"
                        : predicted
                          ? "border border-dashed border-blush-400 text-blush-600"
                          : "text-plum-500"
                }`}
              >
                {d}
              </span>
            );
          })}
        </div>
        <div className="mt-4 flex flex-wrap gap-3 text-[11px] text-plum-500">
          <span className="flex items-center gap-1.5">
            <span className="h-2.5 w-2.5 rounded-full bg-blush-500" /> Logged
          </span>
          <span className="flex items-center gap-1.5">
            <span className="h-2.5 w-2.5 rounded-full bg-lavender-500" /> Ovulation
          </span>
          <span className="flex items-center gap-1.5">
            <span className="h-2.5 w-2.5 rounded-full border border-dashed border-blush-400" /> Predicted
          </span>
        </div>
      </div>
    );
  }

  if (kind === "chips") {
    return (
      <div className="card">
        <p className="text-sm font-semibold text-plum-900">How are you feeling?</p>
        <div className="mt-4 flex flex-wrap gap-2">
          {SYMPTOM_CHIPS.map((s, i) => (
            <span key={s} className={`chip ${i < 2 ? "chip-active" : ""}`}>
              {s}
            </span>
          ))}
        </div>
        <p className="mt-6 text-sm font-semibold text-plum-900">And your mood</p>
        <div className="mt-4 flex flex-wrap gap-2">
          {MOOD_CHIPS.map((m, i) => (
            <span key={m} className={`chip ${i === 1 ? "chip-active" : ""}`}>
              {m}
            </span>
          ))}
        </div>
        <div className="mt-6 rounded-2xl bg-blush-50 p-4 text-xs leading-relaxed text-plum-500">
          Lunara lines this up against your phase, so &ldquo;tired and irritable three days before my period&rdquo;
          stops being a mystery.
        </div>
      </div>
    );
  }

  const bars = [29, 28, 30, 27, 31, 29];
  const max = 34;
  return (
    <div className="card">
      <p className="text-sm font-semibold text-plum-900">Cycle length history</p>
      <div className="mt-6 flex h-40 items-end justify-between gap-3">
        {bars.map((b, i) => (
          <div key={i} className="flex flex-1 flex-col items-center gap-2">
            <div className="flex w-full flex-1 items-end">
              <div
                className="w-full rounded-t-xl bg-gradient-to-t from-blush-400 to-blush-300"
                style={{ height: `${(b / max) * 100}%` }}
              />
            </div>
            <span className="text-[10px] text-plum-300">{b}d</span>
          </div>
        ))}
      </div>
      <p className="mt-4 text-xs text-plum-500">
        Average <span className="font-semibold text-plum-900">29 days</span> · range 27–31 · 6 cycles logged
      </p>
    </div>
  );
}

export default function FeaturesPage() {
  return (
    <>
      <section className="relative overflow-hidden border-b border-blush-100">
        <div className="pointer-events-none absolute -top-24 right-0 h-72 w-72 rounded-full bg-blush-100 blur-3xl" />
        <div className="container-page relative py-16 sm:py-20">
          <p className="eyebrow">Features</p>
          <h1 className="mt-4 max-w-3xl text-4xl sm:text-5xl">
            Built for the question everyone actually asks: <span className="text-blush-600">when is it coming?</span>
          </h1>
          <p className="mt-5 max-w-2xl text-lg leading-relaxed text-plum-500">
            Four things, done properly — predictions, a colour-coded calendar, daily symptom tracking and plain-language
            insights.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Link href="/signup" className="btn-primary">
              Start tracking free
            </Link>
            <Link href="/pricing" className="btn-secondary">
              See pricing
            </Link>
          </div>
        </div>
      </section>

      {BLOCKS.map((block, index) => (
        <section key={block.title} className={index % 2 === 0 ? "section" : "section bg-white"}>
          <div
            className={`container-page grid items-center gap-12 lg:grid-cols-2 ${
              index % 2 === 1 ? "lg:[&>*:first-child]:order-2" : ""
            }`}
          >
            <div>
              <p className="eyebrow">{block.eyebrow}</p>
              <h2 className="mt-3 text-3xl sm:text-4xl">{block.title}</h2>
              <p className="mt-4 text-base leading-relaxed text-plum-500">{block.body}</p>
              <ul className="mt-7 space-y-3">
                {block.bullets.map((b) => (
                  <li key={b} className="flex items-start gap-3 text-sm text-plum-700">
                    <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-blush-500 text-white">
                      <svg width="11" height="11" viewBox="0 0 12 12" fill="none" aria-hidden="true">
                        <path d="M2.5 6.2 5 8.5 9.5 3.5" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round" />
                      </svg>
                    </span>
                    {b}
                  </li>
                ))}
              </ul>
            </div>
            <Visual kind={block.visual} />
          </div>
        </section>
      ))}

      <section className="section">
        <div className="container-page">
          <div className="rounded-4xl border border-blush-100 bg-gradient-to-br from-white via-blush-50 to-lavender-100 p-10 sm:p-14">
            <div className="grid gap-10 lg:grid-cols-2 lg:items-center">
              <div>
                <p className="eyebrow">Privacy</p>
                <h2 className="mt-3 text-3xl">Your data never leaves your browser</h2>
                <p className="mt-4 text-base leading-relaxed text-plum-500">
                  Lunara has no server and no database. Your logs are saved in this browser&apos;s local storage and
                  nowhere else. No analytics, no ad networks, no &ldquo;trusted partners&rdquo;. You can delete
                  everything from Settings in one click.
                </p>
              </div>
              <ul className="grid gap-4 sm:grid-cols-2">
                {[
                  { t: "No account server", d: "Sign-in happens locally on the device." },
                  { t: "No third-party scripts", d: "Nothing phones home while you use it." },
                  { t: "No selling data", d: "There is no data to sell — we never have it." },
                  { t: "One-click wipe", d: "Clear logs instantly, whenever you want." },
                ].map((item) => (
                  <li key={item.t} className="rounded-3xl bg-white/80 p-5">
                    <p className="text-sm font-semibold text-plum-900">{item.t}</p>
                    <p className="mt-1 text-xs leading-relaxed text-plum-500">{item.d}</p>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>

      <section className="container-page pb-24">
        <div className="rounded-4xl bg-plum-900 px-8 py-12 text-center sm:px-14">
          <h2 className="text-3xl text-white">Ready when you are</h2>
          <p className="mx-auto mt-3 max-w-lg text-sm leading-relaxed text-blush-100">
            No credit card, no email confirmation, no downloads. Just log your last period and go.
          </p>
          <Link href="/signup" className="btn-primary mt-7">
            Create your free account
          </Link>
        </div>
      </section>
    </>
  );
}
