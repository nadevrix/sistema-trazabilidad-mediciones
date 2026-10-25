export function BrandIcon({ className = "w-8 h-8", light = false }: { className?: string; light?: boolean }) {
  return (
    <svg
      viewBox="0 0 48 48"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      {/* Outer Gear */}
      <circle
        cx="24"
        cy="24"
        r="17"
        stroke={light ? "#ffffff" : "#0c2340"}
        strokeWidth="3.2"
        strokeLinecap="round"
      />
      {/* Gear Teeth (8 teeth) */}
      <path
        d="M24 3v4M24 41v4M3 24h4M41 24h4M9.15 9.15l2.83 2.83M36.02 36.02l2.83 2.83M9.15 38.85l2.83-2.83M36.02 11.98l2.83-2.83"
        stroke={light ? "#ffffff" : "#0c2340"}
        strokeWidth="3.2"
        strokeLinecap="round"
      />
      {/* Precision Caliper / Measurement Jaw */}
      <path
        d="M17 18h14M17 18v12M21 18v8M31 18v12"
        stroke={light ? "#60a5fa" : "#2563eb"}
        strokeWidth="2.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      {/* Center roller / cylinder being measured */}
      <circle
        cx="24"
        cy="24"
        r="3.5"
        fill={light ? "#ffffff" : "#0c2340"}
      />
      {/* Vernier scale indicator notches */}
      <path
        d="M23 15v-2M25 15v-2M27 15v-2"
        stroke={light ? "#93c5fd" : "#3b82f6"}
        strokeWidth="1.8"
        strokeLinecap="round"
      />
    </svg>
  );
}

export function BrandLogo({
  size = "md",
  light = true,
  showSubtitle = true,
}: {
  size?: "sm" | "md" | "lg";
  light?: boolean;
  showSubtitle?: boolean;
}) {
  const iconSize = size === "sm" ? "w-6 h-6" : size === "lg" ? "w-12 h-12" : "w-8 h-8";

  return (
    <div className="flex items-center gap-2.5">
      <BrandIcon className={iconSize} light={light} />
      <div className="flex flex-col">
        <span
          className={`font-bold tracking-tight leading-tight ${
            light ? "text-white" : "text-[#0c2340]"
          } ${size === "sm" ? "text-base" : size === "lg" ? "text-2xl" : "text-lg"}`}
        >
          Trazabilidad
        </span>
        {showSubtitle && (
          <span
            className={`text-[10px] uppercase font-semibold tracking-wider ${
              light ? "text-blue-200/80" : "text-slate-500"
            }`}
          >
            Ingenios Azucareros
          </span>
        )}
      </div>
    </div>
  );
}
