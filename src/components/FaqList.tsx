import type { FaqItem } from "@/lib/faq";

export function FaqList({ items }: { items: FaqItem[] }) {
  return (
    <div className="divide-y divide-blush-100 overflow-hidden rounded-4xl border border-blush-100 bg-white">
      {items.map((item) => (
        <details key={item.q} className="group px-6 py-5 [&_summary::-webkit-details-marker]:hidden">
          <summary className="flex cursor-pointer items-center justify-between gap-4 text-left">
            <span className="font-display text-lg font-semibold text-plum-900">{item.q}</span>
            <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-blush-100 text-blush-700 transition group-open:rotate-45">
              <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden="true">
                <path d="M7 1v12M1 7h12" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
              </svg>
            </span>
          </summary>
          <p className="mt-4 max-w-3xl text-sm leading-relaxed text-plum-500">{item.a}</p>
        </details>
      ))}
    </div>
  );
}
