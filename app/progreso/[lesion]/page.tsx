"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { BarraNavegacion } from "@/components/BarraNavegacion";
import { BarraSuperior } from "@/components/BarraSuperior";
import { BotonPrincipal } from "@/components/Botones";
import type { RehabCheckpoint } from "@/lib/store-rehab-checkpoint";

const FASES = ["Protección", "Restauración", "Fortalecimiento", "Retorno a actividad"];

const NOMBRES_LESION: Record<string, string> = {
  hombro: "Hombro",
  rodilla: "Rodilla (menisco)",
  desgarro_muscular: "Desgarro muscular",
  lca_post_operatorio: "Post-operatorio LCA",
};

export default function ProgresoRehabPage() {
  const params = useParams<{ lesion: string }>();
  const lesion = decodeURIComponent(params.lesion);
  const [checkpoint, setCheckpoint] = useState<RehabCheckpoint | null>(null);
  const [confirmando, setConfirmando] = useState(false);

  useEffect(() => {
    fetch(`/api/rehab-checkpoint?usuarioId=demo&lesion=${encodeURIComponent(lesion)}`)
      .then((r) => r.json())
      .then(setCheckpoint);
  }, [lesion]);

  async function confirmar() {
    setConfirmando(true);
    try {
      const res = await fetch("/api/rehab-checkpoint", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ usuarioId: "demo", lesion, totalFases: FASES.length }),
      });
      setCheckpoint(await res.json());
    } finally {
      setConfirmando(false);
    }
  }

  if (!checkpoint) {
    return (
      <div className="flex min-h-dvh flex-col">
        <BarraSuperior titulo="Progreso —" subtitulo={NOMBRES_LESION[lesion] ?? lesion} />
        <p className="px-5 text-sm text-tinta/60">Cargando…</p>
      </div>
    );
  }

  const faseActual = checkpoint.faseActual;
  const bloqueado = faseActual > checkpoint.faseConfirmadaHasta;

  return (
    <div className="flex min-h-dvh flex-col">
      <BarraSuperior titulo="Progreso —" subtitulo={NOMBRES_LESION[lesion] ?? lesion} />

      <main className="flex-1 px-5">
        <p className="text-sm font-medium text-tinta/70">Fases del proceso</p>

        <div className="mt-3 grid grid-cols-4 gap-1">
          {FASES.map((f, i) => (
            <div key={f} className="text-center">
              <div
                className={`h-3 rounded-full ${
                  i < faseActual ? "bg-tinta/15" : i === faseActual ? "bg-terracota" : "bg-terracota/25"
                }`}
              />
              <p className={`mt-2 text-xs ${i === faseActual ? "font-semibold" : "text-tinta/60"}`}>{f}</p>
            </div>
          ))}
        </div>

        <div className="mt-8 flex justify-center">
          {bloqueado ? (
            <IconoCandado className="h-12 w-12 text-tinta/40" />
          ) : faseActual + 1 < FASES.length ? (
            <p className="text-sm text-tinta/60">Podés seguir avanzando cuando corresponda.</p>
          ) : (
            <p className="text-sm text-tinta/60">Fase final del proceso.</p>
          )}
        </div>

        <div className="mt-8 rounded-2xl border border-tinta/10 bg-white/40 p-5 text-center">
          <p className="font-serif-editorial text-lg font-semibold">
            Requiere confirmación de tu kinesiólogo para avanzar
          </p>
          <p className="mt-2 text-sm text-tinta/70">
            Mientras no se confirme, podés seguir entrenando la fase actual sin límite de tiempo.
            {checkpoint.fechaConfirmacion && (
              <> Última confirmación: {new Date(checkpoint.fechaConfirmacion).toLocaleDateString("es-AR")}.</>
            )}
          </p>
          <BotonPrincipal
            className="mt-5"
            onClick={confirmar}
            disabled={confirmando || faseActual + 1 >= FASES.length + 1 || checkpoint.faseConfirmadaHasta >= FASES.length - 1}
          >
            {confirmando ? "Guardando…" : "Marcar como confirmado por profesional"}
          </BotonPrincipal>
        </div>
      </main>

      <BarraNavegacion />
    </div>
  );
}

function IconoCandado({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className={className}>
      <rect x="5" y="11" width="14" height="9" rx="1.5" />
      <path d="M8 11V7a4 4 0 0 1 8 0v4" />
    </svg>
  );
}
