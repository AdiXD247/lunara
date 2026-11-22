import { addDays, diffDays, fromKey, today, toKey } from "./date";
import type { DayLog, Phase, Profile } from "./types";

export interface Period {
  /** YYYY-MM-DD of the first logged flow day */
  start: string;
  /** YYYY-MM-DD of the last logged flow day */
  end: string;
  length: number;
}

export interface Prediction {
  hasData: boolean;
  periods: Period[];
  lastPeriodStart: Date | null;
  avgCycle: number;
  avgPeriod: number;
  cycleLengths: number[];
  cycleDay: number;
  phase: Phase;
  nextPeriodStart: Date;
  nextPeriodEnd: Date;
  daysUntilNextPeriod: number;
  ovulationDate: Date;
  fertileStart: Date;
  fertileEnd: Date;
  /** Actual logged flow days */
  actualPeriodDays: Set<string>;
  /** Forecast flow days (not including actual) */
  predictedPeriodDays: Set<string>;
  /** Forecast ovulation days */
  ovulationDays: Set<string>;
  /** Forecast fertile-window days */
  fertileDays: Set<string>;
  /** Predicted cycle start dates, oldest first, 6 cycles ahead */
  upcomingStarts: Date[];
}

export const PHASE_META: Record<
  Phase,
  { label: string; blurb: string; dot: string; soft: string; text: string }
> = {
  menstrual: {
    label: "Menstrual",
    blurb: "Rest, iron-rich food, gentle movement.",
    dot: "bg-blush-500",
    soft: "bg-blush-100",
    text: "text-blush-700",
  },
  follicular: {
    label: "Follicular",
    blurb: "Energy is rebuilding — good time to start things.",
    dot: "bg-mint-500",
    soft: "bg-mint-100",
    text: "text-mint-700",
  },
  ovulation: {
    label: "Ovulation",
    blurb: "Peak energy and libido. Most fertile days.",
    dot: "bg-lavender-500",
    soft: "bg-lavender-100",
    text: "text-lavender-700",
  },
  luteal: {
    label: "Luteal",
    blurb: "Wind down: steadier pace, more sleep, less caffeine.",
    dot: "bg-plum-500",
    soft: "bg-plum-100",
    text: "text-plum-700",
  },
};

/** Group logged flow days into periods (a gap of up to 2 days stays one period). */
export function getPeriods(logs: Record<string, DayLog>): Period[] {
  const flowDays = Object.values(logs)
    .filter((log) => Boolean(log.flow))
    .map((log) => log.date)
    .sort();

  const periods: Period[] = [];
  let run: string[] = [];

  for (const date of flowDays) {
    if (run.length === 0) {
      run = [date];
      continue;
    }
    const gap = diffDays(fromKey(run[run.length - 1]), fromKey(date));
    if (gap <= 2) {
      run.push(date);
    } else {
      periods.push(toPeriod(run));
      run = [date];
    }
  }
  if (run.length > 0) periods.push(toPeriod(run));

  return periods;
}

function toPeriod(days: string[]): Period {
  const start = days[0];
  const end = days[days.length - 1];
  return { start, end, length: diffDays(fromKey(start), fromKey(end)) + 1 };
}

export function average(nums: number[], fallback: number): number {
  if (nums.length === 0) return fallback;
  const total = nums.reduce((sum, n) => sum + n, 0);
  return Math.round(total / nums.length);
}

/** Cycle lengths (first day of period → first day of next period). */
export function getCycleLengths(periods: Period[]): number[] {
  const lengths: number[] = [];
  for (let i = 1; i < periods.length; i += 1) {
    lengths.push(diffDays(fromKey(periods[i - 1].start), fromKey(periods[i].start)));
  }
  return lengths.filter((n) => n >= 15 && n <= 60);
}

function phaseForCycleDay(cycleDay: number, avgCycle: number, avgPeriod: number): Phase {
  const ovulationDay = Math.max(10, avgCycle - 14);
  if (cycleDay <= avgPeriod) return "menstrual";
  if (Math.abs(cycleDay - ovulationDay) <= 1) return "ovulation";
  if (cycleDay > ovulationDay + 1) return "luteal";
  return "follicular";
}

export function predict(
  logs: Record<string, DayLog>,
  profile: Profile,
  reference: Date = today()
): Prediction {
  const periods = getPeriods(logs);
  const cycleLengths = getCycleLengths(periods);

  const avgCycle = average(cycleLengths, profile.cycleLength);
  const periodLengths = periods.map((p) => Math.min(p.length, 10));
  const avgPeriod = average(periodLengths, profile.periodLength);

  const actualPeriodDays = new Set<string>();
  periods.forEach((p) => {
    const span = diffDays(fromKey(p.start), fromKey(p.end));
    for (let i = 0; i <= span; i += 1) {
      actualPeriodDays.add(toKey(addDays(fromKey(p.start), i)));
    }
  });

  const predictedPeriodDays = new Set<string>();
  const ovulationDays = new Set<string>();
  const fertileDays = new Set<string>();
  const upcomingStarts: Date[] = [];

  if (periods.length === 0) {
    return {
      hasData: false,
      periods,
      lastPeriodStart: null,
      avgCycle,
      avgPeriod,
      cycleLengths,
      cycleDay: 0,
      phase: "follicular",
      nextPeriodStart: reference,
      nextPeriodEnd: reference,
      daysUntilNextPeriod: 0,
      ovulationDate: reference,
      fertileStart: reference,
      fertileEnd: reference,
      actualPeriodDays,
      predictedPeriodDays,
      ovulationDays,
      fertileDays,
      upcomingStarts,
    };
  }

  const lastPeriodStart = fromKey(periods[periods.length - 1].start);

  // First future cycle start (roll forward past any overrun cycle).
  let nextPeriodStart = addDays(lastPeriodStart, avgCycle);
  while (diffDays(nextPeriodStart, reference) > 0) {
    nextPeriodStart = addDays(nextPeriodStart, avgCycle);
  }

  // Forecast the next 6 cycles.
  for (let i = 0; i < 6; i += 1) {
    const start = addDays(nextPeriodStart, i * avgCycle);
    upcomingStarts.push(start);

    for (let d = 0; d < avgPeriod; d += 1) {
      predictedPeriodDays.add(toKey(addDays(start, d)));
    }

    const ovulation = addDays(start, -14);
    ovulationDays.add(toKey(ovulation));
    for (let d = -5; d <= 1; d += 1) {
      fertileDays.add(toKey(addDays(ovulation, d)));
    }
  }

  const ovulationDate = addDays(nextPeriodStart, -14);
  const fertileStart = addDays(ovulationDate, -5);
  const fertileEnd = addDays(ovulationDate, 1);

  const cycleDay = Math.max(1, diffDays(lastPeriodStart, reference) + 1);

  return {
    hasData: true,
    periods,
    lastPeriodStart,
    avgCycle,
    avgPeriod,
    cycleLengths,
    cycleDay,
    phase: phaseForCycleDay(cycleDay, avgCycle, avgPeriod),
    nextPeriodStart,
    nextPeriodEnd: addDays(nextPeriodStart, avgPeriod - 1),
    daysUntilNextPeriod: diffDays(reference, nextPeriodStart),
    ovulationDate,
    fertileStart,
    fertileEnd,
    actualPeriodDays,
    predictedPeriodDays,
    ovulationDays,
    fertileDays,
    upcomingStarts,
  };
}
