import Link from "next/link";
import { CycleRing } from "@/components/CycleRing";
import { FaqList } from "@/components/FaqList";
import { FAQ_ITEMS } from "@/lib/faq";
import { PHASE_META } from "@/lib/cycle";
import type { Phase } from "@/lib/types";

const FEATURES = [
  {
    title: "Predictions that learn you",
    body: "Lunara averages your real cycles instead of assuming 28 days, then forecasts the next six so you can plan holidays, workouts and big days.",
    icon: (
      <>
        <path d="M12 3v3M12 18v3M4.2 12H1.2M22.8 12h-3M5.6 5.6 3.5 3.5M20.5 20.5l-2.1-2.1M5.6 18.4 3.5 20.5M20.5 3.5l-2.1 2.1" />
        <circle cx="12" cy="12" r="4" />
      </>
    ),
  },
  {
    title: "A calendar that makes sense",
    body: "Logged days, predicted days, ovulation and your fertile window all sit on one colour-coded month view. Tap any day to log it.",
    icon: (
      <>
        <rect x="3" y="4.5" width="18" height="16.5" rx="3" />
        <path d="M3 9.5h18M8 2.5v4M16 2.5v4" />
        <path d="M8 14h3" />
      </>
    ),
  },
  {
    title: "Symptoms and mood",
    body: "Cramps, headaches, bloating, energy, irritability — tap what's true today. Lunara lines it up against your phases so patterns surface.",
    icon: (
      <path d="M12 20.3s-7.5-4.6-7.5-9.6a4.3 4.3 0 0 1 7.5-2.8 4.3 4.3 0 0 1 7.5 2.8c0 5-7.5 9.6-7.5 9.6z" />
    ),
  },
  {
    title: "Insights, not spreadsheets",
    body: "Cycle length trends, your most common symptoms and mood mix — rendered as simple charts you can read at a glance.",
    icon: (
      <>
        <path d="M4 20V10M10 20V4M16 20v-7M22 20H2" />
      </>
    ),
  },
  {
    title: "Private by default",
    body: "Everything lives in your own browser. No server, no tracking, no data brokers — and you can wipe it all in one click.",
    icon: (
      <>
        <rect x="4" y="10" width="16" height="11" rx="3" />
        <path d="M8 10V7.5a4 4 0 0 1 8 0V10" />
        <path d="M12 14.5v2.5" />
      </>
    ),
  },
  {
    title: "Gentle reminders",
    body: "A heads-up a couple of days before your period is predicted, so it's never a surprise. Turn it off whenever you like.",
    icon: (
      <>
        <path d="M6 9a6 6 0 0 1 12 0c0 4 1.5 5.5 1.5 5.5h-15S6 13 6 9z" />
        <path d="M10 18a2 2 0 0 0 4 0" />
      </>
    ),
  },
];

const STEPS = [
  {
    n: "01",
    title: "Log your last period",
    body: "Tell Lunara when it started and how long it usually lasts. That's the only setup — about twenty seconds.",
  },
  {
    n: "02",
    title: "Check in daily",
    body: "One tap for flow, a couple for symptoms and mood. Skip days freely; Lunara only needs the days you feel like sharing.",
  },
  {
    n: "03",
    title: "Watch the picture form",
    body: "Your predicted dates, fertile window and personal patterns sharpen with every cycle you log.",
  },
];

const PHASES: { key: Phase; emojiHint: string }[] = [
  { key: "menstrual", emojiHint: "Reset" },
  { key: "follicular", emojiHint: "Rise" },
  { key: "ovulation", emojiHint: "Peak" },
  { key: "luteal", emojiHint: "Wind down" },
];

const TESTIMONIALS = [
  {
    quote:
      "I've tried five period apps and this is the first one that didn't make me feel like a data entry clerk. Two taps and I'm done.",
    name: "Priya R.",
    role: "Used Lunara for 8 cycles",
  },
  {
    quote:
      "The symptom trends were the reveal for me. My headaches are almost always two days before my period — I'd never have spotted that myself.",
    name: "Maya T.",
    role: "Tracking since January",
  },
  {
    quote:
      "Knowing the fertile window and the next three start dates meant I could actually plan my wedding and my races. Genuinely useful.",
    name: "Elena K.",
    role: "Irregular cycle, 14 months",
  },
];

export default function HomePage() {
  return (
    <>
      {/* Hero */}
      <section className="relative overflow-hidden">
        <div className="pointer-events-none absolute -top-32 -left-24 h-80 w-80 rounded-full bg-blush-200/60 blur-3xl" />
        <div className="pointer-events-none absolute top-24 -right-20 h-96 w-96 rounded-full bg-lavender-100 blur-3xl" />

        <div className="container-page relative grid items-center gap-16 py-16 lg:grid-cols-2 lg:py-24">
          <div className="animate-fade-up">
            <span className="inline-flex items-center gap-2 rounded-full border border-blush-200 bg-white/80 px-4 py-1.5 text-xs font-semibold text-blush-700">
              <span className="h-1.5 w-1.5 rounded-full bg-blush-500" />
              Private by default · no server, ever
            </span>

            <h1 className="mt-6 text-4xl leading-[1.05] sm:text-5xl lg:text-6xl">
              Know your cycle.
              <br />
              <span className="text-blush-600">Own your month.</span>
            </h1>

            <p className="mt-6 max-w-xl text-lg leading-relaxed text-plum-500">
              Lunara turns a few taps a day into a clear picture of your period, your symptoms and what&apos;s coming
              next — predicted dates, ovulation and fertility window, all in one calm place.
            </p>

            <div className="mt-8 flex flex-wrap items-center gap-3">
              <Link href="/signup" className="btn-primary">
                Start tracking free
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
                  <path d="M3 8h10M9 4l4 4-4 4" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </Link>
              <Link href="/features" className="btn-secondary">
                See what&apos;s inside
              </Link>
            </div>

            <dl className="mt-12 grid max-w-lg grid-cols-3 gap-6">
              {[
                { k: "6", v: "cycles forecast ahead" },
                { k: "100%", v: "stored on your device" },
                { k: "20s", v: "to set up" },
              ].map((stat) => (
                <div key={stat.v}>
                  <dt className="font-display text-3xl font-semibold text-plum-900">{stat.k}</dt>
                  <dd className="mt-1 text-xs leading-snug text-plum-500">{stat.v}</dd>
                </div>
              ))}
            </dl>
          </div>

          {/* Hero card */}
          <div className="animate-fade-up lg:justify-self-end">
            <div className="card w-full max-w-md animate-float">
              <div className="flex items-center justify-between">
                <div>
                  <p className="eyebrow">Today</p>
                  <p className="mt-1 font-display text-xl font-semibold">Your cycle, at a glance</p>
                </div>
                <span className="rounded-full bg-mint-100 px-3 py-1 text-xs font-semibold text-mint-700">On track</span>
              </div>

              <div className="mt-6 flex justify-center">
                <CycleRing cycleDay={17} cycleLength={28} periodLength={5} phase="luteal" size={216} />
              </div>

              <div className="mt-6 grid grid-cols-2 gap-3">
                <div className="rounded-3xl bg-blush-50 p-4">
                  <p className="text-xs font-semibold text-plum-500">Next period</p>
                  <p className="mt-1 font-display text-lg font-semibold text-plum-900">in 11 days</p>
                </div>
                <div className="rounded-3xl bg-lavender-100 p-4">
                  <p className="text-xs font-semibold text-plum-500">Fertile window</p>
                  <p className="mt-1 font-display text-lg font-semibold text-plum-900">passed</p>
                </div>
              </div>

              <p className="mt-5 text-xs leading-relaxed text-plum-300">
                Illustrative preview. Your own dashboard fills in as you log.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="section bg-white">
        <div className="container-page">
          <div className="max-w-2xl">
            <p className="eyebrow">What you get</p>
            <h2 className="mt-3 text-3xl sm:text-4xl">Everything you need, nothing you don&apos;t</h2>
            <p className="mt-4 text-base leading-relaxed text-plum-500">
              No feeds, no ads, no wellness jargon. Just the handful of tools that make a cycle feel predictable.
            </p>
          </div>

          <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {FEATURES.map((f) => (
              <div key={f.title} className="card transition hover:-translate-y-1 hover:shadow-soft">
                <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-blush-100 text-blush-600">
                  <svg
                    width="22"
                    height="22"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.6"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    aria-hidden="true"
                  >
                    {f.icon}
                  </svg>
                </span>
                <h3 className="mt-5 text-lg font-semibold">{f.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-plum-500">{f.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How it works */}
      <section className="section">
        <div className="container-page grid gap-14 lg:grid-cols-2 lg:items-center">
          <div>
            <p className="eyebrow">How it works</p>
            <h2 className="mt-3 text-3xl sm:text-4xl">Three steps, then it runs itself</h2>
            <div className="mt-10 space-y-8">
              {STEPS.map((step) => (
                <div key={step.n} className="flex gap-5">
                  <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-plum-900 font-display text-sm font-semibold text-white">
                    {step.n}
                  </span>
                  <div>
                    <h3 className="text-lg font-semibold">{step.title}</h3>
                    <p className="mt-1.5 text-sm leading-relaxed text-plum-500">{step.body}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="card bg-gradient-to-br from-blush-50 via-white to-lavender-100">
            <p className="eyebrow">The four phases</p>
            <h3 className="mt-2 text-2xl">Your month has a rhythm</h3>
            <p className="mt-3 text-sm leading-relaxed text-plum-500">
              Lunara always tells you which phase you&apos;re in — and what tends to come with it.
            </p>
            <div className="mt-7 space-y-4">
              {PHASES.map((p) => {
                const meta = PHASE_META[p.key];
                return (
                  <div key={p.key} className="flex items-start gap-4 rounded-3xl bg-white/80 p-4">
                    <span className={`mt-1.5 h-3 w-3 shrink-0 rounded-full ${meta.dot}`} />
                    <div>
                      <p className="font-semibold text-plum-900">
                        {meta.label} <span className="text-xs font-medium text-plum-300">· {p.emojiHint}</span>
                      </p>
                      <p className="mt-0.5 text-sm text-plum-500">{meta.blurb}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="section bg-white">
        <div className="container-page">
          <div className="max-w-2xl">
            <p className="eyebrow">Reviews</p>
            <h2 className="mt-3 text-3xl sm:text-4xl">People keep it on their home screen</h2>
          </div>
          <div className="mt-12 grid gap-6 lg:grid-cols-3">
            {TESTIMONIALS.map((t) => (
              <figure key={t.name} className="card flex flex-col justify-between">
                <blockquote className="text-sm leading-relaxed text-plum-700">&ldquo;{t.quote}&rdquo;</blockquote>
                <figcaption className="mt-6 flex items-center gap-3 border-t border-blush-100 pt-5">
                  <span className="flex h-10 w-10 items-center justify-center rounded-full bg-blush-100 font-display text-sm font-semibold text-blush-700">
                    {t.name.charAt(0)}
                  </span>
                  <span>
                    <span className="block text-sm font-semibold text-plum-900">{t.name}</span>
                    <span className="block text-xs text-plum-300">{t.role}</span>
                  </span>
                </figcaption>
              </figure>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ preview */}
      <section className="section">
        <div className="container-page grid gap-10 lg:grid-cols-[0.8fr_1.2fr]">
          <div>
            <p className="eyebrow">Questions</p>
            <h2 className="mt-3 text-3xl sm:text-4xl">Good to know</h2>
            <p className="mt-4 text-sm leading-relaxed text-plum-500">
              The short version: it learns your cycle, it stays on your device, and it isn&apos;t a contraceptive.
            </p>
            <Link href="/faq" className="btn-secondary mt-6">
              Read all FAQs
            </Link>
          </div>
          <FaqList items={FAQ_ITEMS.slice(0, 4)} />
        </div>
      </section>

      {/* CTA */}
      <section className="container-page pb-24">
        <div className="relative overflow-hidden rounded-4xl bg-plum-900 px-8 py-14 text-center sm:px-16">
          <div className="pointer-events-none absolute -top-24 -left-16 h-64 w-64 rounded-full bg-blush-500/30 blur-3xl" />
          <div className="pointer-events-none absolute -bottom-24 -right-10 h-64 w-64 rounded-full bg-lavender-500/30 blur-3xl" />
          <div className="relative">
            <h2 className="text-3xl text-white sm:text-4xl">Your next cycle is already on its way</h2>
            <p className="mx-auto mt-4 max-w-xl text-base leading-relaxed text-blush-100">
              Set it up in twenty seconds. Log your last period and Lunara will map the rest.
            </p>
            <div className="mt-8 flex flex-wrap justify-center gap-3">
              <Link href="/signup" className="btn-primary">
                Create your free account
              </Link>
              <Link href="/login" className="btn inline-flex border border-white/25 text-white hover:bg-white/10">
                I already have one
              </Link>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
