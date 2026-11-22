import Link from "next/link";
import { LogoMark } from "./Logo";

const COLUMNS = [
  {
    title: "Product",
    links: [
      { href: "/features", label: "Features" },
      { href: "/pricing", label: "Pricing" },
      { href: "/faq", label: "FAQ" },
      { href: "/signup", label: "Create account" },
    ],
  },
  {
    title: "Learn",
    links: [
      { href: "/faq", label: "Cycle basics" },
      { href: "/features", label: "Predictions" },
      { href: "/features", label: "Symptom tracking" },
      { href: "/features", label: "Insights" },
    ],
  },
  {
    title: "Account",
    links: [
      { href: "/login", label: "Sign in" },
      { href: "/signup", label: "Sign up" },
      { href: "/dashboard", label: "Dashboard" },
    ],
  },
];

export function SiteFooter() {
  return (
    <footer className="border-t border-blush-100 bg-white">
      <div className="container-page grid gap-10 py-14 sm:grid-cols-2 lg:grid-cols-4">
        <div>
          <div className="flex items-center gap-2.5">
            <LogoMark className="h-9 w-9" />
            <span className="font-display text-xl font-semibold text-plum-900">Lunara</span>
          </div>
          <p className="mt-4 max-w-xs text-sm leading-relaxed text-plum-500">
            Cycle tracking that respects your time and your body. Private by default — your data stays on your device.
          </p>
        </div>

        {COLUMNS.map((col) => (
          <div key={col.title}>
            <h4 className="text-sm font-semibold text-plum-900">{col.title}</h4>
            <ul className="mt-4 space-y-3">
              {col.links.map((link, i) => (
                <li key={`${link.href}-${i}`}>
                  <Link href={link.href} className="text-sm text-plum-500 transition hover:text-blush-600">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>

      <div className="border-t border-blush-100">
        <div className="container-page flex flex-col gap-3 py-6 text-xs text-plum-500 sm:flex-row sm:items-center sm:justify-between">
          <p>© {new Date().getFullYear()} Lunara. All rights reserved.</p>
          <p className="max-w-xl leading-relaxed">
            Lunara offers cycle predictions for information only. It is not a contraceptive and not a substitute for
            medical advice.
          </p>
        </div>
      </div>
    </footer>
  );
}
