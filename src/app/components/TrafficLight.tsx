import React from "react";

export type Status = "red" | "yellow" | "green";

const cfg = {
  red: {
    active: "#ef4444",
    glow: "rgba(239,68,68,0.7)",
    dim: "rgba(239,68,68,0.1)",
    label: "Критично",
    labelColor: "#f87171",
  },
  yellow: {
    active: "#f59e0b",
    glow: "rgba(245,158,11,0.7)",
    dim: "rgba(245,158,11,0.1)",
    label: "Внимание",
    labelColor: "#fbbf24",
  },
  green: {
    active: "#10b981",
    glow: "rgba(16,185,129,0.7)",
    dim: "rgba(16,185,129,0.1)",
    label: "Норма",
    labelColor: "#34d399",
  },
};

interface TrafficLightProps {
  status: Status;
  label?: string;
  sublabel?: string;
  size?: "sm" | "md" | "lg";
  horizontal?: boolean;
}

export function TrafficLight({
  status,
  label,
  sublabel,
  size = "md",
  horizontal = false,
}: TrafficLightProps) {
  const dotSize = size === "sm" ? 10 : size === "lg" ? 18 : 14;
  const gap = size === "sm" ? 4 : 6;
  const c = cfg[status];

  const dots = (["red", "yellow", "green"] as Status[]).map((s) => {
    const isActive = s === status;
    const sc = cfg[s];
    return (
      <div
        key={s}
        style={{
          width: dotSize,
          height: dotSize,
          borderRadius: "50%",
          background: isActive ? sc.active : sc.dim,
          boxShadow: isActive ? `0 0 ${dotSize}px ${sc.glow}` : "none",
          transition: "all 0.3s ease",
        }}
      />
    );
  });

  return (
    <div className="flex items-center gap-2.5">
      {/* Housing */}
      <div
        style={{
          display: "flex",
          flexDirection: horizontal ? "row" : "column",
          gap,
          background: "rgba(0,0,0,0.4)",
          border: "1px solid rgba(255,255,255,0.08)",
          borderRadius: horizontal ? 20 : 20,
          padding: horizontal ? "5px 8px" : "6px 5px",
          backdropFilter: "blur(8px)",
        }}
      >
        {dots}
      </div>

      {/* Text */}
      {(label || sublabel) && (
        <div>
          {label && (
            <p className="text-sm font-medium" style={{ color: "rgba(255,255,255,0.8)" }}>
              {label}
            </p>
          )}
          {sublabel && (
            <p className="text-xs" style={{ color: "rgba(255,255,255,0.35)" }}>
              {sublabel}
            </p>
          )}
        </div>
      )}
    </div>
  );
}

export function StatusRow({
  items,
}: {
  items: { label: string; status: Status; value?: string }[];
}) {
  return (
    <div className="space-y-2">
      {items.map((item, i) => {
        const c = cfg[item.status];
        return (
          <div
            key={i}
            className="flex items-center justify-between px-3 py-2 rounded-xl transition-all"
            style={{
              background: "rgba(255,255,255,0.03)",
              border: "1px solid rgba(255,255,255,0.05)",
            }}
          >
            <TrafficLight status={item.status} label={item.label} size="sm" />
            {item.value && (
              <span className="text-xs font-bold" style={{ color: c.labelColor }}>
                {item.value}
              </span>
            )}
          </div>
        );
      })}
    </div>
  );
}
