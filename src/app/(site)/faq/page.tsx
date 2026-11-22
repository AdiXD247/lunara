import Link from "next/link";
import { FaqList } from "@/components/FaqList";
import { FAQ_ITEMS } from "@/lib/faq";

export default function FaqPage() {
  return (
    <>
      <section className="relative overflow-hidden border-b border-blush-100">
        <div className="pointer-events-none absolute -top-24 right-10 h-72 w-72 rounded-full bg-blush-100 blur-3xl" />
        <div className="container-page relative py-16 sm:py-20">
          <p className="eyebrow">FAQ</p>
          <h1 className="mt-4 max-w-3xl text-4xl sm:text-5xl">Everything people ask before their first log</h1>
          <p className="mt-5 max-w-2xl text-lg leading-relaxed text-plum-500">
            Predictions, privacy, accuracy and deleting your data — all in one place.
          </p>
        </div>
      </section>

      <section className="section">
        <div className="container-page grid gap-10 lg:grid-cols-[0.7fr_1.3fr] lg:items-start">
          <div className="lg:sticky lg:top-28">
            <h2 className="font-display text-2xl font-semibold">Still wondering something?</h2>
            <p className="mt-3 text-sm leading-relaxed text-plum-500">
              The fastest way to understand Lunara is to log one period and watch the calendar fill in. It takes about
              twenty seconds and nothing leaves your device.
            </p>
            <div className="mt-6 flex flex-wrap gap-3">
              <Link href="/signup" className="btn-primary">
                Try it now
              </Link>
              <Link href="/features" className="btn-secondary">
                Browse features
              </Link>
            </div>
            <div className="mt-8 rounded-3xl border border-blush-100 bg-white p-5">
              <p className="text-sm font-semibold text-plum-900">A note on medical advice</p>
              <p className="mt-2 text-xs leading-relaxed text-plum-500">
                Lunara is a tracking tool, not a clinician. Predictions are estimates. If something about your cycle
                worries you — very heavy bleeding, pain that stops your day, cycles shorter than 21 or longer than 35
                days — please talk to a healthcare professional.
              </p>
            </div>
          </div>

          <FaqList items={FAQ_ITEMS} />
        </div>
      </section>
    </>
  );
}
