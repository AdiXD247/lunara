import Link from "next/link";
import { LogoMark } from "@/components/Logo";

const POINTS = [
  "Predictions for the next six cycles",
  "A calendar you can actually read",
  "Symptom and mood patterns over time",
  "Everything stored privately on your device",
];

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="grid min-h-screen lg:grid-cols-2">
      <aside className="relative hidden overflow-hidden bg-plum-900 p-12 lg:flex lg:flex-col lg:justify-between">
        <div className="pointer-events-none absolute -top-24 -left-20 h-80 w-80 rounded-full bg-blush-500/40 blur-3xl" />
        <div className="pointer-events-none absolute -bottom-24 -right-16 h-80 w-80 rounded-full bg-lavender-500/40 blur-3xl" />

        <Link href="/" className="relative flex items-center gap-2.5 text-white">
          <LogoMark className="h-9 w-9" />
          <span className="font-display text-xl font-semibold">Lunara</span>
        </Link>

        <div className="relative">
          <h2 className="max-w-md text-4xl leading-tight text-white">
            Your cycle, finally predictable.
          </h2>
          <ul className="mt-8 space-y-4">
            {POINTS.map((p) => (
              <li key={p} className="flex items-center gap-3 text-sm text-blush-100">
                <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-white/15">
                  <svg width="12" height="12" viewBox="0 0 12 12" fill="none" aria-hidden="true">
                    <path d="M2.5 6.2 5 8.5 9.5 3.5" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </span>
                {p}
              </li>
            ))}
          </ul>
        </div>

        <p className="relative text-xs leading-relaxed text-blush-200/70">
          Not a contraceptive and not medical advice. Predictions are estimates based on the cycles you log.
        </p>
      </aside>

      <main className="flex items-center justify-center bg-cream px-6 py-14">
        <div className="w-full max-w-md">{children}</div>
      </main>
    </div>
  );
}
