import Link from "next/link";
import { FaqList } from "@/components/FaqList";
import { FAQ_ITEMS } from "@/lib/faq";

const PLANS = [
  {
    name: "Free",
    price: "$0",
    cadence: "forever",
    blurb: "Everything you need to track a cycle properly.",
    cta: "Start tracking free",
    href: "/signup",
    highlight: false,
    features: [
      "Period logging and predictions",
      "Next 6 cycles forecast",
      "Colour-coded calendar",
      "Symptom and mood tracking",
      "Ovulation and fertile window",
      "Local, private storage",
    ],
  },
  {
    name: "Plus",
    price: "$4",
    cadence: "per month",
    blurb: "Deeper history and export for people who plan ahead.",
    cta: "Start tracking free",
    href: "/signup",
    highlight: true,
    features: [
      "Everything in Free",
      "Unlimited cycle history",
      "Export your data as CSV",
      "Symptom correlation insights",
      "Cycle length variability report",
      "Priority email support",
    ],
  },
  {
    name: "Lifetime",
    price: "$49",
    cadence: "one time",
    blurb: "Pay once, keep every current and future feature.",
    cta: "Start tracking free",
    href: "/signup",
    highlight: false,
    features: [
      "Everything in Plus",
      "All future features included",
      "Printable health summary for appointments",
      "Early access to new tools",
      "No subscription, ever",
    ],
  },
];

export default function PricingPage() {
  return (
    <>
      <section className="relative overflow-hidden border-b border-blush-100">
        <div className="pointer-events-none absolute -top-20 left-1/3 h-72 w-72 rounded-full bg-lavender-100 blur-3xl" />
        <div className="container-page relative py-16 text-center sm:py-20">
          <p className="eyebrow">Pricing</p>
          <h1 className="mx-auto mt-4 max-w-3xl text-4xl sm:text-5xl">Simple, and free where it matters</h1>
          <p className="mx-auto mt-5 max-w-2xl text-lg leading-relaxed text-plum-500">
            Tracking your cycle should never be paywalled. The essentials are free forever — the paid tiers are for
            history, export and reporting.
          </p>
        </div>
      </section>

      <section className="section pt-14">
        <div className="container-page grid gap-6 lg:grid-cols-3">
          {PLANS.map((plan) => (
            <div
              key={plan.name}
              className={`relative flex flex-col rounded-4xl border p-8 ${
                plan.highlight
                  ? "border-blush-300 bg-white shadow-soft ring-1 ring-blush-200"
                  : "border-blush-100 bg-white shadow-card"
              }`}
            >
              {plan.highlight && (
                <span className="absolute -top-3 left-8 rounded-full bg-blush-500 px-3 py-1 text-xs font-semibold text-white">
                  Most popular
                </span>
              )}
              <h2 className="font-display text-xl font-semibold">{plan.name}</h2>
              <p className="mt-2 text-sm leading-relaxed text-plum-500">{plan.blurb}</p>
              <p className="mt-6 flex items-baseline gap-2">
                <span className="font-display text-4xl font-semibold text-plum-900">{plan.price}</span>
                <span className="text-sm text-plum-300">{plan.cadence}</span>
              </p>
              <ul className="mt-7 flex-1 space-y-3">
                {plan.features.map((f) => (
                  <li key={f} className="flex items-start gap-3 text-sm text-plum-700">
                    <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-blush-100 text-blush-600">
                      <svg width="11" height="11" viewBox="0 0 12 12" fill="none" aria-hidden="true">
                        <path d="M2.5 6.2 5 8.5 9.5 3.5" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round" />
                      </svg>
                    </span>
                    {f}
                  </li>
                ))}
              </ul>
              <Link href={plan.href} className={`mt-8 ${plan.highlight ? "btn-primary" : "btn-secondary"}`}>
                {plan.cta}
              </Link>
            </div>
          ))}
        </div>

        <p className="container-page mt-8 text-center text-xs text-plum-300">
          Lunara is a demo build — no payment is processed and the paid tiers are illustrative.
        </p>
      </section>

      <section className="section bg-white pt-0">
        <div className="container-page">
          <div className="mx-auto max-w-2xl text-center">
            <p className="eyebrow">Common questions</p>
            <h2 className="mt-3 text-3xl">Billing and privacy, answered</h2>
          </div>
          <div className="mx-auto mt-10 max-w-3xl">
            <FaqList items={FAQ_ITEMS.slice(1, 6)} />
          </div>
        </div>
      </section>
    </>
  );
}
