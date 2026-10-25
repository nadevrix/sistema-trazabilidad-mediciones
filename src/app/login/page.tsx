import Image from "next/image";
import { BrandIcon } from "@/components/brand-logo";
import { LoginForm } from "@/components/login-form";

export default function LoginPage() {
  return (
    <div className="min-h-screen w-full flex flex-col md:flex-row bg-white">
      {/* Left Side: Official Machinery Image & Official Logo (compact hero on mobile, 50% min-h-screen on desktop) */}
      <div className="relative md:w-1/2 min-h-[220px] md:min-h-screen bg-[#0c2340] text-white p-6 md:p-16 flex flex-col justify-between overflow-hidden">
        {/* Background Image: Official photograph provided by user */}
        <div className="absolute inset-0 z-0">
          <Image
            src="/login-machinery.jpg"
            alt="Rodillos de molienda de caña de azúcar"
            fill
            className="object-cover object-center scale-105"
            priority
          />
          {/* Deep industrial navy gradient overlay for readability and color-grade */}
          <div className="absolute inset-0 bg-gradient-to-t from-[#081729]/95 via-[#0c2340]/80 to-[#0e2c52]/65" />
        </div>

        {/* Top Branding: Official Logo + Title */}
        <div className="relative z-10 space-y-3 md:space-y-5 pt-1 md:pt-8">
          {/* Official logo icon without box */}
          <div className="w-12 h-10 md:w-16 md:h-14 relative">
            <BrandIcon className="w-12 h-10 md:w-16 md:h-14" light={true} />
          </div>

          <div>
            <h1 className="text-xl md:text-3xl lg:text-4xl font-bold tracking-tight text-white leading-tight">
              Sistema de Trazabilidad
              <br />
              de Mediciones
            </h1>
            <p className="mt-1 md:mt-2 text-xs md:text-base font-normal text-slate-200 tracking-wide">
              Ingenios Azucareros
            </p>
          </div>
        </div>

        {/* Bottom Slogan with subtle divider (visible on desktop) */}
        <div className="relative z-10 pb-2 md:pb-8 hidden md:block">
          <div className="w-full pt-6 border-t border-white/20">
            <p className="text-xs md:text-sm font-medium tracking-wide text-slate-200">
              Controla · Registra · Analiza
            </p>
          </div>
        </div>
      </div>

      {/* Right Side: Login Form (50% width, min-h-screen on desktop) */}
      <div className="md:w-1/2 flex flex-col justify-between bg-white p-6 sm:p-8 md:p-16 min-h-[400px] md:min-h-screen">
        <div className="my-auto max-w-md w-full mx-auto">
          <div className="mb-8">
            <h2 className="text-2xl md:text-3xl font-bold tracking-tight text-slate-900">
              Iniciar sesión
            </h2>
            <p className="mt-1.5 text-xs md:text-sm text-slate-500">
              Ingresa tus credenciales para acceder al sistema
            </p>
          </div>

          <LoginForm />
        </div>

        {/* Footer */}
        <div className="pt-6 text-center text-[11px] text-slate-400">
          © 2025. Sistema de Trazabilidad de Mediciones.
        </div>
      </div>
    </div>
  );
}
