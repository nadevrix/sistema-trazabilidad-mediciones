export function BrandIcon({
  className = "w-10 h-10",
  light = true,
}: {
  className?: string;
  light?: boolean;
}) {
  const strokeColor = light ? "#ffffff" : "#0c2340";
  const accentColor = light ? "#ffffff" : "#133863";

  return (
    <svg
      viewBox="0 0 64 64"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      {/* Outer Gear */}
      <circle
        cx="36"
        cy="32"
        r="18"
        stroke={strokeColor}
        strokeWidth="2.8"
        strokeLinecap="round"
      />
      {/* Gear teeth */}
      <path
        d="M36 10v4M36 50v4M14 32h4M54 32h4M20.4 16.4l2.8 2.8M48.8 44.8l2.8 2.8M20.4 47.6l2.8-2.8M48.8 19.2l2.8-2.8"
        stroke={strokeColor}
        strokeWidth="2.8"
        strokeLinecap="round"
      />
      {/* Caliper slide arm on left */}
      <path
        d="M8 26h20M8 26v12M12 26v8M28 26v12"
        stroke={accentColor}
        strokeWidth="2.4"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      {/* Center cylinder inside gear */}
      <circle
        cx="36"
        cy="32"
        r="4.5"
        stroke={strokeColor}
        strokeWidth="2.4"
      />
      {/* Scale tick marks */}
      <path
        d="M16 26v-3M20 26v-3M24 26v-3"
        stroke={accentColor}
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
            className={`text-[10px] font-medium tracking-wide ${
              light ? "text-slate-300" : "text-slate-500"
            }`}
          >
            Ingenios Azucareros
          </span>
        )}
      </div>
    </div>
  );
}
