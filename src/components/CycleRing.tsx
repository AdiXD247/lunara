"use client";

import { PHASE_META } from "@/lib/cycle";
import type { Phase } from "@/lib/types";

interface CycleRingProps {
  cycleDay: number;
  cycleLength: number;
  periodLength: number;
  phase: Phase;
  size?: number;
  caption?: string;
}

interface Segment {
  start: number;
  length: number;
  color: string;
  label: string;
}

/** Donut chart of a full cycle split into its four phases, with a "you are here" dot. */
export function CycleRing({
  cycleDay,
  cycleLength,
  periodLength,
  phase,
  size = 240,
  caption,
}: CycleRingProps) {
  const stroke = size * 0.11;
  const radius = (size - stroke) / 2;
  const center = size / 2;
  const ovulationDay = Math.max(10, cycleLength - 14);
  const gap = 1.2;

  const rawSegments: Segment[] = [
    {
      start: 0,
      length: periodLength,
      color: "#E55D8E",
      label: "Menstrual",
    },
    {
      start: periodLength,
      length: Math.max(0, ovulationDay - 1 - periodLength),
      color: "#5FC3A6",
      label: "Follicular",
    },
    {
      start: ovulationDay - 1,
      length: 3,
      color: "#9B7FD4",
      label: "Ovulation",
    },
    {
      start: ovulationDay + 2,
      length: Math.max(0, cycleLength - (ovulationDay + 2)),
      color: "#BFA5B6",
      label: "Luteal",
    },
  ];

  const segments = rawSegments
    .filter((s) => s.length > 0)
    .map((s) => ({ ...s, pct: (s.length / cycleLength) * 100, pctStart: (s.start / cycleLength) * 100 }));

  const markerAngle = ((Math.min(cycleDay, cycleLength) - 1) / cycleLength) * Math.PI * 2 - Math.PI / 2;
  const markerX = center + radius * Math.cos(markerAngle);
  const markerY = center + radius * Math.sin(markerAngle);
  const meta = PHASE_META[phase];

  return (
    <div className="flex flex-col items-center">
      <div className="relative" style={{ width: size, height: size }}>
        <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} role="img" aria-label={`Cycle day ${cycleDay}`}>
          <circle cx={center} cy={center} r={radius} fill="none" stroke="#FDE9F0" strokeWidth={stroke} />
          <g transform={`rotate(-90 ${center} ${center})`}>
            {segments.map((s) => (
              <circle
                key={s.label}
                cx={center}
                cy={center}
                r={radius}
                pathLength={100}
                fill="none"
                stroke={s.color}
                strokeWidth={stroke}
                strokeLinecap="butt"
                strokeDasharray={`${Math.max(s.pct - gap, 0.5)} ${100 - Math.max(s.pct - gap, 0.5)}`}
                strokeDashoffset={-s.pctStart}
              />
            ))}
          </g>
          <circle cx={markerX} cy={markerY} r={stroke * 0.42} fill="#FFFFFF" stroke="#42243A" strokeWidth={2.5} />
        </svg>

        <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
          <span className="text-xs font-semibold uppercase tracking-[0.18em] text-plum-300">Cycle day</span>
          <span className="font-display text-5xl font-semibold leading-none text-plum-900">{cycleDay}</span>
          <span className={`mt-2 rounded-full px-3 py-1 text-xs font-semibold ${meta.soft} ${meta.text}`}>
            {meta.label}
          </span>
        </div>
      </div>
      {caption ? <p className="mt-4 max-w-xs text-center text-sm text-plum-500">{caption}</p> : null}
    </div>
  );
}
