"use client";

import { FLOWS, type Flow } from "@/lib/types";

interface FlowPickerProps {
  value?: Flow;
  onChange: (flow: Flow | undefined) => void;
  allowClear?: boolean;
}

/** Row of tap-to-select flow buttons. Clicking the active one clears it. */
export function FlowPicker({ value, onChange, allowClear = true }: FlowPickerProps) {
  return (
    <div className="flex flex-wrap gap-2">
      {FLOWS.map((flow) => {
        const active = value === flow.value;
        return (
          <button
            key={flow.value}
            type="button"
            aria-pressed={active}
            onClick={() => onChange(active && allowClear ? undefined : flow.value)}
            className={`chip ${active ? "chip-active" : ""}`}
          >
            <span className="mr-2 flex items-center gap-0.5">
              {Array.from({ length: flow.dots }, (_, i) => (
                <span
                  key={i}
                  className={`h-1.5 w-1.5 rounded-full ${active ? "bg-white" : "bg-blush-400"}`}
                />
              ))}
            </span>
            {flow.label}
          </button>
        );
      })}
    </div>
  );
}
