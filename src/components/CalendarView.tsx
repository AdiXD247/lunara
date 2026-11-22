
"use client";

import Link from "next/link";
import { useState } from "react";
import { useAuth } from "@/lib/auth";
import { predict } from "@/lib/cycle";
import {
  MONTHS,
  WEEKDAYS,
  addMonths,
  monthGrid,
  startOfMonth,
  today,
  toKey,
} from "@/lib/date";

export function CalendarView() {
  const { data } = useAuth();

  const [currentMonth, setCurrentMonth] = useState(
    startOfMonth(today())
  );

  if (!data) return null;

  const prediction = predict(
    data.logs,
    data.profile,
    today()
  );

  const dates = monthGrid(currentMonth);
  const todayKey = toKey(today());

  return (
    <div className="rounded-2xl bg-white p-6 shadow-sm">

      {/* Calendar Header */}
      <div className="mb-6 flex items-center justify-between">

        <h2 className="text-xl font-bold text-gray-800">
          {MONTHS[currentMonth.getMonth()]}{" "}
          {currentMonth.getFullYear()}
        </h2>

        <div className="flex gap-3">

          <button
            onClick={() =>
              setCurrentMonth(addMonths(currentMonth, -1))
            }
            className="rounded-lg bg-pink-50 px-3 py-2 text-pink-600"
          >
            ←
          </button>

          <button
            onClick={() =>
              setCurrentMonth(startOfMonth(today()))
            }
            className="rounded-lg bg-pink-50 px-3 py-2 text-pink-600"
          >
            Today
          </button>

          <button
            onClick={() =>
              setCurrentMonth(addMonths(currentMonth, 1))
            }
            className="rounded-lg bg-pink-50 px-3 py-2 text-pink-600"
          >
            →
          </button>

        </div>
      </div>

      {/* Weekday Names */}
      <div className="mb-3 grid grid-cols-7 text-center">

        {WEEKDAYS.map((day) => (
          <div
            key={day}
            className="text-sm font-semibold text-gray-400"
          >
            {day.slice(0, 3)}
          </div>
        ))}

      </div>

      {/* Calendar Dates */}
      <div className="grid grid-cols-7 gap-2">

        {dates.map((date) => {

          const dateKey = toKey(date);

          const isToday = dateKey === todayKey;
          const isActual = prediction.actualPeriodDays.has(dateKey);
          const isPredicted = prediction.predictedPeriodDays.has(dateKey);
          const isOvulation = prediction.ovulationDays.has(dateKey);
          const isFertile = prediction.fertileDays.has(dateKey);

          let color = "bg-gray-50 text-gray-700";

          if (isActual) {
            color = "bg-pink-500 text-white";
          } else if (isPredicted) {
            color = "border-2 border-dashed border-pink-400 text-pink-600";
          } else if (isOvulation) {
            color = "bg-purple-500 text-white";
          } else if (isFertile) {
            color = "bg-purple-100 text-purple-700";
          }

          return (
            <Link
              key={dateKey}
              href={`/dashboard/log?date=${dateKey}`}
              className={`
                flex aspect-square items-center justify-center
                rounded-xl text-sm font-medium
                transition hover:scale-105
                ${color}
                ${date.getMonth() !== currentMonth.getMonth()
                  ? "opacity-30"
                  : ""}
                ${isToday
                  ? "ring-2 ring-gray-800 ring-offset-2"
                  : ""}
              `}
            >
              {date.getDate()}
            </Link>
          );

        })}

      </div>

      {/* Calendar Legend */}
      <div className="mt-6 flex flex-wrap gap-4 border-t pt-5 text-xs text-gray-600">

        <span className="flex items-center gap-2">
          <span className="h-3 w-3 rounded-full bg-pink-500" />
          Period
        </span>

        <span className="flex items-center gap-2">
          <span className="h-3 w-3 rounded-full border-2 border-dashed border-pink-400" />
          Predicted
        </span>

        <span className="flex items-center gap-2">
          <span className="h-3 w-3 rounded-full bg-purple-500" />
          Ovulation
        </span>

        <span className="flex items-center gap-2">
          <span className="h-3 w-3 rounded-full bg-purple-100" />
          Fertile window
        </span>

        <span className="flex items-center gap-2">
          <span className="h-3 w-3 rounded-full border-2 border-gray-800" />
          Today
        </span>

      </div>

    </div>
  );
}
