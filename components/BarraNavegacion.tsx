"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const ITEMS = [
  { href: "/dashboard", label: "Inicio", icon: IconInicio },
  { href: "/rutinas", label: "Rutinas", icon: IconRutinas },
  { href: "/progreso", label: "Progreso", icon: IconProgreso },
  { href: "/perfil", label: "Perfil", icon: IconPerfil },
];

export function BarraNavegacion({ inicioHref = "/dashboard" }: { inicioHref?: string }) {
  const pathname = usePathname();

  const items = ITEMS.map((item) => (item.href === "/dashboard" ? { ...item, href: inicioHref } : item));

  return (
    <nav className="sticky bottom-0 z-10 flex items-center justify-around border-t border-tinta/10 bg-fondo/95 px-2 pb-[max(0.75rem,env(safe-area-inset-bottom))] pt-3 backdrop-blur">
      {items.map(({ href, label, icon: Icon }) => {
        const activo = pathname?.startsWith(href);
        return (
          <Link
            key={href}
            href={href}
            className="flex flex-col items-center gap-1 px-3 py-1"
          >
            <Icon activo={!!activo} />
            <span
              className={`text-xs font-medium ${activo ? "text-pino" : "text-tinta/70"}`}
            >
              {label}
            </span>
          </Link>
        );
      })}
    </nav>
  );
}

function IconInicio({ activo }: { activo: boolean }) {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke={activo ? "#2C3E32" : "#26241F99"} strokeWidth="1.5">
      <path d="M3 11.5 12 4l9 7.5" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M5.5 10v9h13v-9" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function IconRutinas({ activo }: { activo: boolean }) {
  const c = activo ? "#2C3E32" : "#26241F99";
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth="1.5">
      <rect x="2" y="10" width="3" height="4" rx="0.5" />
      <rect x="19" y="10" width="3" height="4" rx="0.5" />
      <path d="M5 12h14" strokeLinecap="round" />
      <rect x="6.5" y="8.5" width="2.5" height="7" rx="0.5" />
      <rect x="15" y="8.5" width="2.5" height="7" rx="0.5" />
    </svg>
  );
}

function IconProgreso({ activo }: { activo: boolean }) {
  const c = activo ? "#2C3E32" : "#26241F99";
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth="1.5">
      <path d="M3 19V5" strokeLinecap="round" />
      <path d="M3 17l5-6 4 3 7-8" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M15 6h4v4" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function IconPerfil({ activo }: { activo: boolean }) {
  const c = activo ? "#2C3E32" : "#26241F99";
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth="1.5">
      <circle cx="12" cy="8" r="3.2" />
      <path d="M5.5 20c1-3.5 3.8-5.5 6.5-5.5s5.5 2 6.5 5.5" strokeLinecap="round" />
    </svg>
  );
}
