"use client";

import { useSettings } from "@/contexts/SettingsContext";
import { resolveIcon } from "@/shared/ui/icons/resolveIcon";

export default function StatsBoard() {
  const { settings } = useSettings();
  const stats = settings.stats || [];

  return (
    <div className="relative mt-4 overflow-hidden rounded-[40px] border border-white/15 bg-primary-600 px-8 py-12 shadow-[0_30px_100px_rgba(105,1,2,0.35)] before:absolute before:inset-0 before:bg-white/[0.06] before:content-['']">
      {/* Background Numbers */}
      <div className="pointer-events-none absolute -right-10 -top-24 text-[220px] font-black leading-none text-white/10">
        120
      </div>
      <div className="pointer-events-none absolute -left-10 -bottom-22 text-[220px] font-black leading-none text-white/10">
        99%
      </div>

      <div className="relative grid gap-8 md:grid-cols-4 grid-cols-2">
        {stats.map(({ value, label, icon }) => {
          const Icon = resolveIcon(icon);
          return (
            <div
              key={label}
              className="
                group/stat
                relative
                text-center
                md:border-l
                md:border-white/10
                first:border-none
              "
            >
              {/* Icon */}
              <div
                className="
                  mx-auto
                  mb-5
                  flex
                  h-12
                  w-12
                  items-center
                  justify-center
                  rounded-2xl
                  border
                  border-white/20
                  bg-white/15
                  text-white
                  transition-all
                  duration-300
                  group-hover/stat:-translate-y-1
                  group-hover/stat:bg-white
                  group-hover/stat:text-primary-600
                "
              >
                <Icon size={22} />
              </div>

              {/* Number */}
              <h3 className="text-5xl font-black tracking-tight text-white">
                {value}
              </h3>

              {/* Label */}
              <p className="mt-3 text-sm font-medium text-white/70">{label}</p>
            </div>
          );
        })}
      </div>
    </div>
  );
}
