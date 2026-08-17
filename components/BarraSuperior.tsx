"use client";

import { useRouter } from "next/navigation";
import type { ReactNode } from "react";

export function BarraSuperior({
  titulo,
  subtitulo,
  accionDerecha,
}: {
  titulo: string;
  subtitulo?: string;
  accionDerecha?: ReactNode;
}) {
  const router = useRouter();
  return (
    <header className="flex items-start justify-between px-5 pt-6 pb-4">
      <button
        onClick={() => router.back()}
        aria-label="Volver"
        className="mt-2 shrink-0"
      >
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#26241F" strokeWidth="1.6">
          <path d="M19 12H5M11 6l-6 6 6 6" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </button>
      <div className="flex-1 text-center px-2">
        <h1 className="font-serif-editorial text-2xl font-semibold leading-tight text-tinta">
          {titulo}
        </h1>
        {subtitulo && <p className="mt-1 text-sm text-tinta/70">{subtitulo}</p>}
      </div>
      <div className="mt-1 w-6 shrink-0">{accionDerecha}</div>
    </header>
  );
}
