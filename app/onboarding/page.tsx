import Link from "next/link";
import { ESTILO_BOTON_PRINCIPAL, ESTILO_BOTON_SECUNDARIO_TEXTO } from "@/components/Botones";

export default function OnboardingPage() {
  return (
    <div className="relative flex min-h-dvh flex-col overflow-hidden px-6 pb-10 pt-16">
      <IconoCintaMetrica className="absolute -top-4 -left-10 h-32 w-32 rotate-[20deg] text-salvia/40" />
      <IconoBrujula className="absolute -bottom-6 -right-8 h-36 w-36 text-salvia/40" />

      <div className="relative flex-1 flex flex-col items-center text-center">
        <h1 className="font-serif-editorial text-4xl font-semibold leading-tight">
          Anatómica
          <br />
          Natural
        </h1>
        <p className="mt-3 text-base text-tinta/70">
          Tu guía para el movimiento saludable
        </p>

        <FiguraSilueta className="mt-16 h-64 w-40 text-pino" />
      </div>

      <div className="relative flex flex-col items-center gap-4">
        <Link href="/perfil" className={ESTILO_BOTON_PRINCIPAL}>
          Comenzar
        </Link>
        <Link href="/dashboard" className={ESTILO_BOTON_SECUNDARIO_TEXTO}>
          Ya tengo cuenta
        </Link>
      </div>
    </div>
  );
}

function FiguraSilueta({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 120 240" fill="none" stroke="currentColor" strokeWidth="1.5" className={className}>
      <circle cx="60" cy="24" r="18" />
      <path d="M60 42v58M60 55 30 90M60 55l30 35M60 100 35 220M60 100l25 120" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function IconoCintaMetrica({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 100 100" className={className} fill="none" stroke="currentColor" strokeWidth="1.5">
      <rect x="10" y="30" width="80" height="18" rx="2" />
      {Array.from({ length: 8 }).map((_, i) => (
        <line key={i} x1={16 + i * 9.5} y1="30" x2={16 + i * 9.5} y2="38" />
      ))}
    </svg>
  );
}

function IconoBrujula({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 100 100" className={className} fill="none" stroke="currentColor" strokeWidth="1.5">
      <circle cx="50" cy="50" r="38" />
      <circle cx="50" cy="50" r="2" fill="currentColor" />
      <path d="M50 20 58 50 50 80 42 50Z" />
    </svg>
  );
}
