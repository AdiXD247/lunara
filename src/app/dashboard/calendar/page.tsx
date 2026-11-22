import { CalendarView } from "@/components/CalendarView";

export default function CalendarPage() {
  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="eyebrow">Calendar</p>
          <h1 className="mt-2 text-3xl sm:text-4xl">Your month, mapped</h1>
          <p className="mt-2 max-w-2xl text-sm leading-relaxed text-plum-500">
            Tap any day to log flow, symptoms and mood. Dashed squares are predicted, the diamond marks estimated
            ovulation.
          </p>
        </div>
      </div>

      <CalendarView />

      <div className="grid gap-6 sm:grid-cols-3">
        {[
          {
            t: "Predictions update live",
            d: "Log a period on a day you didn't expect and Lunara instantly recalculates your next six cycles.",
          },
          {
            t: "Past days are editable",
            d: "Forgot to log last Tuesday? Tap it and fill it in — your history and averages will update.",
          },
          {
            t: "Estimates, not guarantees",
            d: "The fertile window is a six-day estimate based on your next predicted period. It is not a contraceptive.",
          },
        ].map((item) => (
          <div key={item.t} className="card">
            <p className="text-sm font-semibold text-plum-900">{item.t}</p>
            <p className="mt-2 text-sm leading-relaxed text-plum-500">{item.d}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
