"use client";

interface DonutSegment {
  label: string;
  count: number;
  color: string;
  dotColor: string;
}

interface DonutChartProps {
  enRangoCount: number;
  enRevisionCount: number;
  fueraDeRangoCount: number;
}

export function DonutChart({
  enRangoCount = 0,
  enRevisionCount = 0,
  fueraDeRangoCount = 0,
}: DonutChartProps) {
  const total = enRangoCount + enRevisionCount + fueraDeRangoCount;

  // Segments definition
  const segments: DonutSegment[] = [
    {
      label: "En rango",
      count: enRangoCount,
      color: "#22c55e", // emerald/green
      dotColor: "bg-emerald-500",
    },
    {
      label: "En revisión",
      count: enRevisionCount,
      color: "#f59e0b", // amber/orange
      dotColor: "bg-amber-500",
    },
    {
      label: "Fuera de rango",
      count: fueraDeRangoCount,
      color: "#ef4444", // red
      dotColor: "bg-red-500",
    },
  ];

  // SVG Geometry
  const size = 160;
  const strokeWidth = 18;
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;

  let accumulatedPercent = 0;

  return (
    <div className="flex flex-col items-center justify-center p-2 sm:flex-row sm:gap-6">
      {/* Donut graphic */}
      <div className="relative flex items-center justify-center" style={{ width: size, height: size }}>
        <svg
          width={size}
          height={size}
          viewBox={`0 0 ${size} ${size}`}
          className="transform -rotate-90"
        >
          {/* Background circle if total is 0 */}
          {total === 0 ? (
            <circle
              cx={size / 2}
              cy={size / 2}
              r={radius}
              stroke="#e2e8f0"
              strokeWidth={strokeWidth}
              fill="transparent"
            />
          ) : (
            segments.map((seg, index) => {
              if (seg.count === 0) return null;
              const percent = seg.count / total;
              const strokeDasharray = `${percent * circumference} ${circumference}`;
              const strokeDashoffset = -accumulatedPercent * circumference;
              accumulatedPercent += percent;

              return (
                <circle
                  key={index}
                  cx={size / 2}
                  cy={size / 2}
                  r={radius}
                  stroke={seg.color}
                  strokeWidth={strokeWidth}
                  strokeDasharray={strokeDasharray}
                  strokeDashoffset={strokeDashoffset}
                  strokeLinecap="butt"
                  fill="transparent"
                  className="transition-all duration-500 ease-out"
                />
              );
            })
          )}
        </svg>

        {/* Center Text inside Donut */}
        <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
          <span className="text-2xl font-bold text-slate-800 leading-none">
            {total}
          </span>
          <span className="text-[11px] font-medium text-slate-500 mt-0.5">
            Total
          </span>
        </div>
      </div>

      {/* Legend on Right side */}
      <div className="mt-4 flex flex-col gap-2.5 sm:mt-0">
        {segments.map((seg, i) => (
          <div key={i} className="flex items-center justify-between gap-6 text-xs">
            <div className="flex items-center gap-2">
              <span className={`h-2.5 w-2.5 rounded-full ${seg.dotColor}`} />
              <span className="text-slate-600">{seg.label}</span>
            </div>
            <span className="font-semibold text-slate-900">{seg.count}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
