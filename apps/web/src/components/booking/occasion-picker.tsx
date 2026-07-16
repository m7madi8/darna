"use client";

import { cn } from "@/lib/utils";
import { OCCASIONS, type OccasionId } from "@/lib/occasions";
import type { Locale } from "@/lib/i18n/messages";

type OccasionPickerProps = {
  value: OccasionId;
  onChange: (id: OccasionId) => void;
  locale: Locale;
  /** VIP mode shows celebration-first ordering and richer chips */
  vip?: boolean;
  className?: string;
  title?: string;
  hint?: string;
};

export function OccasionPicker({
  value,
  onChange,
  locale,
  vip = false,
  className,
  title,
  hint,
}: OccasionPickerProps) {
  const options = vip
    ? [...OCCASIONS].sort((a, b) => Number(b.featured) - Number(a.featured))
    : OCCASIONS;

  return (
    <div className={cn("space-y-3", className)}>
      {title ? (
        <div>
          <p
            className={cn(
              "text-[11px] tracking-[0.14em]",
              vip ? "text-cream-300/80" : "text-cream-400"
            )}
          >
            {title}
          </p>
          {hint ? (
            <p className="mt-1 text-sm text-cream-200/50">{hint}</p>
          ) : null}
        </div>
      ) : null}

      <div className="flex flex-wrap gap-2">
        {options.map((o) => {
          const active = value === o.id;
          return (
            <button
              key={o.id}
              type="button"
              onClick={() => onChange(o.id)}
              aria-pressed={active}
              className={cn(
                "rounded-full px-3.5 py-2 text-sm font-medium transition",
                active
                  ? vip
                    ? "bg-cream-200 text-forest-900 shadow-soft"
                    : "bg-cream-200 text-forest-800 shadow-soft"
                  : vip
                    ? "border border-cream-200/20 bg-black/20 text-cream-200/80 hover:border-cream-200/40"
                    : "border border-cream-200/10 bg-forest-800/45 text-cream-200/85 hover:border-cream-200/25",
                o.featured && !active && vip && "border-cream-200/30"
              )}
            >
              {o.label[locale]}
            </button>
          );
        })}
      </div>
    </div>
  );
}
