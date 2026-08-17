"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { BarraSuperior } from "@/components/BarraSuperior";
import { BotonPrincipal, BotonSecundarioTexto } from "@/components/Botones";
import type { RutinaGenerada } from "@/lib/generador";
import type { PerfilUsuario } from "@/lib/types";

const MENSAJES_ALERTA: Record<string, string> = {
  "R-008": "Volumen semanal alto para tu nivel de experiencia.",
  "R-009": "Mismo grupo muscular entrenado con menos de 48h de diferencia.",
  "R-010": "Carga alta en sentadilla/peso muerto en días consecutivos.",
  "R-012": "Rutina de alta frecuencia sin trabajo de core.",
  "R-013": "Tu esfuerzo percibido viene creciendo con la misma carga — señal de fatiga acumulada.",
  "R-014": "Llevás dos semanas sin días de descanso.",
  "R-020": "Este ejercicio implica maniobra de Valsalva — con perfil de tercera edad, prestale atención a tu respiración y evitá contener el aire.",
  "R-022": "Tu ratio empuje/tracción no favorece la corrección postural que tenés marcada en el perfil.",
  "R-023": "Ejercicio de bisagra de cadera con carga alta sin suficiente trabajo de glúteo/core en la rutina.",
};

export default function AuditorRutinaPage() {
  const router = useRouter();
  const [rutina, setRutina] = useState<RutinaGenerada | null>(null);
  const [usuario, setUsuario] = useState<PerfilUsuario | null>(null);

  useEffect(() => {
    fetch("/api/rutina").then((r) => r.json()).then(setRutina);
    fetch("/api/perfil").then((r) => r.json()).then(setUsuario);
  }, []);

  if (!rutina || !usuario) {
    return (
      <div className="flex min-h-dvh flex-col">
        <BarraSuperior titulo="Revisá tu rutina" subtitulo="antes de guardar" />
        <p className="px-5 text-sm text-tinta/60">Cargando…</p>
      </div>
    );
  }

  const modoAccesible = usuario.condicionesEspeciales.includes("tercera_edad");
  const inicioHref = modoAccesible ? "/accesible" : "/dashboard";
  const total = rutina.ejercicios.length || 1;
  const empuje = rutina.ejercicios.filter((e) => e.patronMovimiento.startsWith("empuje")).length;
  const traccion = rutina.ejercicios.filter((e) => e.patronMovimiento.startsWith("traccion")).length;
  const pctEmpuje = Math.round((empuje / total) * 100);
  const pctTraccion = Math.round((traccion / total) * 100);
  const sinAlertas = rutina.auditoria.alertas.length === 0 && rutina.auditoria.sustituciones.length === 0;

  if (modoAccesible) {
    return (
      <div className="flex min-h-dvh flex-col">
        <BarraSuperior titulo="Tu rutina" />
        <main className="flex-1 px-6">
          {sinAlertas ? (
            <p className="text-lg text-tinta/80">Todo listo, no hay nada para revisar.</p>
          ) : (
            <div className="flex flex-col gap-4">
              {rutina.auditoria.alertas.map((a, i) => (
                <AlertaGrande
                  key={i}
                  texto={a.id === "R-011" ? "El balance de empuje y tracción no es ideal." : MENSAJES_ALERTA[a.id] ?? "Revisá esto antes de entrenar."}
                />
              ))}
              {rutina.auditoria.sustituciones.map((s, i) => (
                <AlertaGrande key={`s-${i}`} texto={`Cambiamos "${s.original}" por otro ejercicio más seguro para vos.`} />
              ))}
            </div>
          )}
        </main>
        <div className="flex flex-col items-center gap-3 px-6 pb-[max(1.5rem,env(safe-area-inset-bottom))] pt-6">
          <button
            onClick={() => router.push(inicioHref)}
            className="w-full rounded-2xl bg-terracota px-6 py-6 text-center text-xl font-semibold text-fondo"
          >
            Listo
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-dvh flex-col">
      <BarraSuperior titulo="Revisá tu rutina" subtitulo="antes de guardar" />

      <main className="flex-1 px-5">
        <p className="text-sm font-medium text-tinta/70">Ratio Empuje/Tracción</p>
        <BarraRatio etiqueta={`EMPUJE ${pctEmpuje}%`} color="bg-pino" ancho={pctEmpuje} />
        <BarraRatio etiqueta={`TRACCIÓN ${pctTraccion}%`} color="bg-terracota" ancho={pctTraccion} />

        <div className="mt-6 flex flex-col gap-4">
          {sinAlertas && (
            <Alerta texto="Tu rutina está bien balanceada y no disparó ninguna alerta del motor de reglas." />
          )}
          {rutina.auditoria.alertas.map((a, i) => (
            <Alerta
              key={i}
              texto={
                a.id === "R-011"
                  ? `Regla ${a.id}: ratio empuje/tracción ${rutina.auditoria.ratioEmpujeTraccion.toFixed(2)}, fuera del rango recomendado.`
                  : `Regla ${a.id} (${a.categoria}): ${MENSAJES_ALERTA[a.id] ?? "revisá esta alerta antes de entrenar."}`
              }
            />
          ))}
          {rutina.auditoria.sustituciones.map((s, i) => (
            <Alerta
              key={`s-${i}`}
              texto={`"${s.original}" quedó bloqueado por la regla ${s.reglaId} y se sustituyó automáticamente en el bloque "${s.bucket}".`}
            />
          ))}
        </div>
      </main>

      <div className="flex flex-col items-center gap-3 px-5 pb-[max(1.5rem,env(safe-area-inset-bottom))] pt-6">
        <BotonPrincipal onClick={() => router.push(inicioHref)}>Guardar rutina</BotonPrincipal>
        <BotonSecundarioTexto onClick={() => router.back()}>Ajustar</BotonSecundarioTexto>
      </div>
    </div>
  );
}

function BarraRatio({ etiqueta, color, ancho }: { etiqueta: string; color: string; ancho: number }) {
  return (
    <div className="mt-3">
      <p className="text-sm font-semibold">{etiqueta}</p>
      <div className="mt-1 h-6 w-full rounded-md bg-tinta/5">
        <div className={`h-6 rounded-md ${color}`} style={{ width: `${ancho}%` }} />
      </div>
    </div>
  );
}

function Alerta({ texto }: { texto: string }) {
  return (
    <div className="flex items-start gap-3">
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#C97B4A" strokeWidth="1.6" className="mt-0.5 shrink-0">
        <path d="M12 3 2 20h20L12 3Z" strokeLinejoin="round" />
        <path d="M12 10v4M12 17h.01" strokeLinecap="round" />
      </svg>
      <p className="text-sm text-tinta/80">{texto}</p>
    </div>
  );
}

function AlertaGrande({ texto }: { texto: string }) {
  return (
    <div className="rounded-xl border border-terracota/30 bg-terracota/5 px-4 py-4">
      <p className="text-lg text-tinta/85">{texto}</p>
    </div>
  );
}
