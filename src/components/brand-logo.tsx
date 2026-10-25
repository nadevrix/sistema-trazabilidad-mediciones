import Image from "next/image";

export function BrandIcon({
  className = "w-10 h-10",
  light = true,
}: {
  className?: string;
  light?: boolean;
}) {
  return (
    <div className={`relative inline-block ${className}`}>
      <Image
        src="/logo-official.png"
        alt="Logo Trazabilidad"
        fill
        className={`object-contain ${light ? "" : "brightness-0"}`}
        priority
      />
    </div>
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
  const iconSize = size === "sm" ? "w-7 h-7" : size === "lg" ? "w-14 h-14" : "w-9 h-9";

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
