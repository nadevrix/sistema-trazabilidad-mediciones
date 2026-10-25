import Image from "next/image";
import { BrandIcon } from "@/components/brand-logo";
import { LoginForm } from "@/components/login-form";

export default function LoginPage() {
  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-slate-900 p-4 md:p-8">
      <div className="w-full max-w-4xl overflow-hidden rounded-2xl bg-white shadow-2xl flex flex-col md:flex-row border border-slate-200">
        
        {/* Left Side: Industrial Imagery & Branding */}
        <div className="relative md:w-1/2 min-h-[380px] md:min-h-[520px] bg-[#0c2340] text-white p-8 flex flex-col justify-between overflow-hidden">
          {/* Background image with overlay */}
          <div className="absolute inset-0 z-0">
            <Image
              src="/login-hero.png"
              alt="Maquinaria y rodillos de molienda"
              fill
              className="object-cover object-center opacity-40 mix-blend-luminosity scale-105"
              priority
            />
            {/* Deep navy gradient overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-[#08172b] via-[#0c2340]/90 to-[#0e2c52]/80" />
          </div>

          {/* Top branding */}
          <div className="relative z-10 space-y-4">
            <div className="inline-flex items-center justify-center p-2 rounded-xl bg-white/10 backdrop-blur-sm border border-white/15">
              <BrandIcon className="w-10 h-10" light={true} />
            </div>

            <div>
              <h1 className="text-2xl md:text-3xl font-extrabold tracking-tight text-white leading-tight">
                Sistema de Trazabilidad
                <br />
                de Mediciones
              </h1>
              <p className="mt-1 text-sm font-medium text-blue-200 tracking-wide uppercase">
                Ingenios Azucareros
              </p>
            </div>
          </div>

          {/* Bottom Slogan */}
          <div className="relative z-10 pt-8 border-t border-white/15">
            <p className="text-xs md:text-sm font-medium tracking-widest text-slate-300">
              Controla · Registra · Analiza
            </p>
          </div>
        </div>

        {/* Right Side: Login Form */}
        <div className="md:w-1/2 p-8 md:p-12 flex flex-col justify-between bg-white">
          <div>
            <div className="mb-6">
              <h2 className="text-2xl font-bold tracking-tight text-slate-900">
                Iniciar sesión
              </h2>
              <p className="mt-1 text-xs text-slate-500">
                Ingresa tus credenciales para acceder al sistema
              </p>
            </div>

            <LoginForm />
          </div>

          {/* Card Footer */}
          <div className="mt-8 pt-4 border-t border-slate-100 text-center">
            <p className="text-[11px] text-slate-400">
              © 2025. Sistema de Trazabilidad de Mediciones.
            </p>
          </div>
        </div>

      </div>
    </div>
  );
}
