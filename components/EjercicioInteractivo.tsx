"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { BarraNavegacion } from "@/components/BarraNavegacion";
import { BarraSuperior } from "@/components/BarraSuperior";
import { ModalMolestia } from "@/components/ModalMolestia";
import type { EjercicioRutina } from "@/lib/generador";
import type { SugerenciaCarga } from "@/lib/store-registro-carga";
import type { PerfilUsuario } from "@/lib/types";

export function EjercicioInteractivo({
  ejercicio,
  indice,
  total,
  siguienteId,
  usuario,
  sugerencia,
  cargaSegunRM,
  diaIndice,
  sugerenciaCalistenia,
}: {
  ejercicio: EjercicioRutina;
  indice: number;
  total: number;
  siguienteId: string | null;
  usuario: PerfilUsuario;
  sugerencia: SugerenciaCarga;
  cargaSegunRM: number | null;
  diaIndice: number;
  sugerenciaCalistenia: { motivo: string; siguienteNombre: string } | null;
}) {
  const router = useRouter();
  const modoAccesible = usuario.condicionesEspeciales.includes("tercera_edad");
  const inicioHref = modoAccesible ? "/accesible" : "/dashboard";

  const [serieActual, setSerieActual] = useState(1);
  const [cargando, setCargando] = useState(true);
  const [modalMolestiaAbierto, setModalMolestiaAbierto] = useState(false);
  const [cargaKg, setCargaKg] = useState(
    String(sugerencia.cargaSugeridaKg ?? sugerencia.cargaUltimaVezKg ?? "")
  );
  const [repsRealizadas, setRepsRealizadas] = useState(
    String(parseInt(ejercicio.reps, 10) || "")
  );
  const [rir, setRir] = useState(2);
  const [guardando, setGuardando] = useState(false);

  useEffect(() => {
    let cancelado = false;
    fetch(
      `/api/progreso-sesion?usuarioId=${usuario.id}&diaIndice=${diaIndice}&ejercicioId=${ejercicio.id}`
    )
      .then((r) => r.json())
      .then(({ seriesCompletadas }) => {
        if (cancelado) return;
        setSerieActual(Math.min(seriesCompletadas + 1, ejercicio.series));
        setCargando(false);
      });
    return () => {
      cancelado = true;
    };
  }, [ejercicio.id, ejercicio.series, usuario.id, diaIndice]);

  async function completarSerie() {
    setGuardando(true);
    let seriesCompletadas = serieActual;
    try {
      await fetch("/api/registro-carga", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          usuarioId: usuario.id,
          ejercicioId: ejercicio.id,
          cargaKg: cargaKg || 0,
          repsRealizadas: repsRealizadas || 0,
          rirReportado: rir,
        }),
      });
      const res = await fetch("/api/progreso-sesion", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ usuarioId: usuario.id, diaIndice, ejercicioId: ejercicio.id }),
      });
      ({ seriesCompletadas } = await res.json());
    } finally {
      setGuardando(false);
    }

    if (seriesCompletadas < ejercicio.series) {
      setSerieActual(seriesCompletadas + 1);
    } else if (siguienteId) {
      router.push(`/ejercicio/${siguienteId}`);
    } else {
      await fetch("/api/estado-rutina", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ usuarioId: usuario.id, diasPorSemana: usuario.diasPorSemana }),
      });
      router.push(inicioHref);
    }
  }

  if (cargando) {
    return (
      <div className="flex min-h-dvh flex-col">
        <BarraSuperior titulo="Mi Sesión" subtitulo={`Ejercicio ${indice + 1} de ${total}`} />
        <p className="px-5 text-sm text-tinta/60">Cargando…</p>
      </div>
    );
  }

  if (modoAccesible) {
    return (
      <div className="flex min-h-dvh flex-col">
        <BarraSuperior titulo="Mi Sesión" subtitulo={`Ejercicio ${indice + 1} de ${total}`} />

        <main className="flex-1 px-6">
          <h2 className="font-serif-editorial text-2xl font-semibold text-center">
            {ejercicio.nombre}
          </h2>

          {ejercicio.videoUrl ? (
            <video
              src={ejercicio.videoUrl}
              controls
              playsInline
              className="mt-4 w-full rounded-2xl border border-tinta/10"
            />
          ) : (
            <div className="mt-4 flex h-56 w-full flex-col items-center justify-center gap-2 rounded-2xl border border-tinta/15 bg-white/40">
              <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="#26241F66" strokeWidth="1.5">
                <rect x="2.5" y="5" width="14" height="14" rx="2" />
                <path d="M16.5 10 21 7v10l-4.5-3" strokeLinejoin="round" />
              </svg>
              <span className="text-base text-tinta/50">Video de demostración próximamente</span>
            </div>
          )}

          <dl className="mt-5 grid grid-cols-2 gap-3">
            <DatoGrande etiqueta="Series" valor={String(ejercicio.series)} />
            <DatoGrande etiqueta={ejercicio.esIsometrico ? "Duración" : "Repeticiones"} valor={ejercicio.reps} />
          </dl>

          {serieActual > 1 && (
            <p
              className="mt-4 rounded-xl px-4 py-3 text-center text-lg font-semibold"
              style={{ backgroundColor: "var(--color-pino)", color: "var(--color-fondo)" }}
            >
              ✓ Ya hiciste {serieActual - 1} de {ejercicio.series}
            </p>
          )}

          <p className="mt-6 text-lg leading-relaxed text-tinta/80">{ejercicio.instrucciones}</p>

          <button
            onClick={completarSerie}
            disabled={guardando}
            className="mt-6 w-full rounded-2xl bg-terracota px-6 py-6 text-center text-xl font-semibold text-fondo disabled:opacity-50"
          >
            {guardando ? "Guardando…" : `Completé la serie ${serieActual}`}
          </button>

          <button
            onClick={() => setModalMolestiaAbierto(true)}
            className="mt-4 w-full text-center text-lg font-medium text-terracota underline underline-offset-4"
          >
            Me genera dolor o incomodidad
          </button>
        </main>

        <BarraNavegacion inicioHref="/accesible" />

        {modalMolestiaAbierto && (
          <ModalMolestia
            ejercicioId={ejercicio.id}
            usuario={usuario}
            onCerrar={() => setModalMolestiaAbierto(false)}
          />
        )}
      </div>
    );
  }

  return (
    <div className="flex min-h-dvh flex-col">
      <BarraSuperior titulo="Mi Sesión" subtitulo={`Ejercicio ${indice + 1} de ${total}`} />

      <main className="flex-1 px-5">
        <div className="mx-auto mb-4 flex h-40 w-40 items-center justify-center rounded-2xl bg-white/40 border border-tinta/10">
          <span className="text-xs text-tinta/40">ilustración anatómica</span>
        </div>

        <h2 className="font-serif-editorial text-xl font-semibold text-center">
          {ejercicio.nombre}
        </h2>

        {ejercicio.paraLesion && (
          <p className="mx-auto mt-2 w-fit rounded-full bg-pino px-3 py-1 text-center text-xs font-semibold text-fondo">
            Para tratar tu lesión
          </p>
        )}

        {ejercicio.metodoAplicado && (
          <div className="mx-auto mt-2 max-w-xs rounded-lg bg-terracota/10 px-3 py-2 text-center">
            <p className="text-xs font-semibold text-terracota">
              Técnica: {ejercicio.metodoAplicado.nombre}
            </p>
            <p className="mt-0.5 text-xs text-tinta/70">{ejercicio.metodoAplicado.descripcion}</p>
          </div>
        )}

        <dl className="mt-5 grid grid-cols-3 divide-x divide-tinta/10 rounded-xl border border-tinta/10 text-center">
          <Dato etiqueta="Series" valor={String(ejercicio.series)} />
          <Dato etiqueta={ejercicio.esIsometrico ? "Duración" : "Reps obj."} valor={ejercicio.reps} />
          <Dato etiqueta="Descanso" valor={`${ejercicio.descansoSeg}s`} />
        </dl>

        <p className="mt-4 text-xs text-tinta/60">{sugerencia.motivo}</p>

        {sugerenciaCalistenia && (
          <div className="mt-2 rounded-lg border border-pino/30 bg-salvia/10 px-3 py-2">
            <p className="text-xs font-semibold text-pino">
              Probá subir de nivel: {sugerenciaCalistenia.siguienteNombre}
            </p>
            <p className="mt-0.5 text-xs text-tinta/70">{sugerenciaCalistenia.motivo}</p>
          </div>
        )}

        {serieActual > 1 && (
          <p
            className="mt-2 rounded-lg px-3 py-2 text-sm font-semibold"
            style={{ backgroundColor: "var(--color-pino)", color: "var(--color-fondo)" }}
          >
            ✓ Ya completaste {serieActual - 1} de {ejercicio.series} series de este ejercicio hoy.
          </p>
        )}

        <div className="mt-3 rounded-xl border border-tinta/15 p-4">
          <p className="text-sm font-medium text-tinta/70">
            Registrá la serie {serieActual} / {ejercicio.series}
          </p>
          {cargaSegunRM !== null && (
            <p className="mt-1 text-xs font-semibold text-terracota">
              Carga según RM: {cargaSegunRM}kg
            </p>
          )}
          <div className="mt-3 flex gap-3">
            <CampoNumero etiqueta="Carga (kg)" valor={cargaKg} onChange={setCargaKg} />
            <CampoNumero
              etiqueta={ejercicio.esIsometrico ? "Segundos sostenidos" : "Reps hechas"}
              valor={repsRealizadas}
              onChange={setRepsRealizadas}
            />
          </div>

          <p className="mt-4 text-sm font-medium text-tinta/70">¿Cuánto margen te quedó? (RIR)</p>
          <div className="mt-2 flex gap-2">
            {[0, 1, 2, 3, 4, 5].map((v) => (
              <button
                key={v}
                onClick={() => setRir(v)}
                className={`h-9 w-9 rounded-full border text-sm font-semibold ${
                  rir === v ? "border-pino bg-salvia/50" : "border-tinta/20"
                }`}
              >
                {v}
              </button>
            ))}
          </div>
          <p className="mt-2 text-xs text-tinta/50">
            RIR = repeticiones que te quedaban en reserva. 0 = fallo total.
          </p>
        </div>

        <button
          onClick={completarSerie}
          disabled={guardando}
          className="mt-4 flex w-full items-center gap-4 rounded-xl border border-tinta/20 px-4 py-4 text-left disabled:opacity-50"
        >
          <span className="h-8 w-8 shrink-0 rounded-lg border-2 border-pino" />
          <span className="font-sans-calida font-medium">
            {guardando ? "Guardando…" : "Completar serie"}
          </span>
          <span className="ml-auto text-sm text-tinta/60">
            Serie actual: {serieActual} / {ejercicio.series}
            {serieActual > 1 && " ✓"}
          </span>
        </button>

        <p className="mt-6 text-sm leading-relaxed text-tinta/80">
          <strong className="font-sans-calida">Instrucciones: </strong>
          {ejercicio.instrucciones}
        </p>

        <button
          onClick={() => setModalMolestiaAbierto(true)}
          className="mt-3 text-sm font-medium text-terracota underline decoration-terracota/40 underline-offset-4"
        >
          Me genera dolor o incomodidad
        </button>

        <p className="mt-6 text-center text-xs text-tinta/50">
          Recomendación basada en evidencia. No reemplaza la evaluación de un profesional.
        </p>
      </main>

      <BarraNavegacion />

      {modalMolestiaAbierto && (
        <ModalMolestia
          ejercicioId={ejercicio.id}
          usuario={usuario}
          onCerrar={() => setModalMolestiaAbierto(false)}
        />
      )}
    </div>
  );
}

function Dato({ etiqueta, valor }: { etiqueta: string; valor: string }) {
  return (
    <div className="py-3">
      <dt className="text-xs uppercase tracking-wide text-tinta/50">{etiqueta}</dt>
      <dd className="mt-1 font-sans-calida text-base font-semibold">{valor}</dd>
    </div>
  );
}

function DatoGrande({ etiqueta, valor }: { etiqueta: string; valor: string }) {
  return (
    <div className="rounded-xl border border-tinta/15 py-4 text-center">
      <dt className="text-sm text-tinta/60">{etiqueta}</dt>
      <dd className="mt-1 font-sans-calida text-2xl font-bold">{valor}</dd>
    </div>
  );
}

function CampoNumero({
  etiqueta,
  valor,
  onChange,
}: {
  etiqueta: string;
  valor: string;
  onChange: (v: string) => void;
}) {
  return (
    <label className="flex-1">
      <span className="text-xs text-tinta/60">{etiqueta}</span>
      <input
        type="number"
        inputMode="decimal"
        value={valor}
        onChange={(e) => onChange(e.target.value)}
        className="mt-1 w-full rounded-lg border border-tinta/20 px-3 py-2 text-base"
      />
    </label>
  );
}
