import Image from "next/image";
import { BrandIcon } from "@/components/brand-logo";
import { LoginForm } from "@/components/login-form";

export default function LoginPage() {
  return (
    <div className="min-h-screen w-full flex flex-col md:flex-row bg-white">
      {/* Left Side: Industrial Imagery & Branding (Full height, 50% width) */}
      <div className="relative md:w-1/2 min-h-[340px] md:min-h-screen bg-[#0c2340] text-white p-8 md:p-16 flex flex-col justify-between overflow-hidden">
        {/* Background image: Authentic sugar mill machinery without text */}
        <div className="absolute inset-0 z-0">
          <Image
            src="/clean-machinery-bg.jpg"
            alt="Maquinaria y rodillos de molienda"
            fill
            className="object-cover object-center opacity-65"
            priority
          />
          {/* Deep navy blue tint overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-[#09182d]/95 via-[#0c2340]/75 to-[#0d294d]/60" />
        </div>

        {/* Top: Logo and Main Title */}
        <div className="relative z-10 space-y-4 pt-4 md:pt-8">
          {/* Logo icon with NO outer box, directly white line art */}
          <div>
            <BrandIcon className="w-12 h-12 text-white" light={true} />
          </div>

          <div className="pt-2">
            <h1 className="text-2xl md:text-3xl lg:text-4xl font-bold tracking-tight text-white leading-tight">
              Sistema de Trazabilidad
              <br />
              de Mediciones
            </h1>
            <p className="mt-2 text-sm md:text-base font-normal text-blue-100/90 tracking-wide">
              Ingenios Azucareros
            </p>
          </div>
        </div>

        {/* Bottom Slogan with subtle divider line */}
        <div className="relative z-10 pb-4 md:pb-8">
          <div className="w-full pt-6 border-t border-white/20">
            <p className="text-xs md:text-sm font-medium tracking-wide text-slate-200">
              Controla · Registra · Analiza
            </p>
          </div>
        </div>
      </div>

      {/* Right Side: Login Form (Full height, 50% width) */}
      <div className="md:w-1/2 flex flex-col justify-between bg-white p-8 md:p-16 min-h-[480px] md:min-h-screen">
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
