"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { BarraNavegacion } from "@/components/BarraNavegacion";
import { BarraSuperior } from "@/components/BarraSuperior";
import { BotonPrincipal } from "@/components/Botones";
import type { PerfilUsuario } from "@/lib/types";

const EJERCICIOS_TEST_POR_DEFECTO = [
  { id: "ex-press-banca-con-barra", nombre: "Press banca con barra" },
  { id: "ex-sentadilla-con-barra", nombre: "Sentadilla con barra" },
  { id: "ex-peso-muerto-con-barra", nombre: "Peso muerto con barra" },
];

interface TestGuardado {
  ejercicioId: string;
  fecha: string;
  pesoKg: number;
  repsRealizadas: number;
  valor1RMEstimado: number;
}

function diasDesde(fechaISO: string) {
  return Math.floor((Date.now() - new Date(fechaISO).getTime()) / (1000 * 60 * 60 * 24));
}

export default function TestFuerzaPage() {
  const router = useRouter();
  const [ejercicios, setEjercicios] = useState(EJERCICIOS_TEST_POR_DEFECTO);
  const [ejercicioId, setEjercicioId] = useState<string | null>(null);
  const [peso, setPeso] = useState("");
  const [reps, setReps] = useState("");
  const [resultado, setResultado] = useState<{ valor1RMEstimado: number } | null>(null);
  const [enviando, setEnviando] = useState(false);
  const [ultimoDelEjercicio, setUltimoDelEjercicio] = useState<TestGuardado | null | undefined>(undefined);
  const [historial, setHistorial] = useState<TestGuardado[]>([]);
  const [usuario, setUsuario] = useState<PerfilUsuario | null>(null);

  const modoAccesible = usuario?.condicionesEspeciales.includes("tercera_edad") ?? false;

  function nombreEjercicio(id: string) {
    return ejercicios.find((e) => e.id === id)?.nombre ?? id;
  }

  useEffect(() => {
    fetch("/api/perfil")
      .then((r) => r.json())
      .then((p: PerfilUsuario) => {
        setUsuario(p);
        // El test de fuerza pide una serie cercana al fallo técnico, algo que
        // la sección 14 del marco teórico recomienda evitar en tercera edad —
        // directamente no se lo ofrecemos a este perfil.
        if (p.condicionesEspeciales.includes("tercera_edad")) {
          router.replace("/accesible");
        }
      });
  }, [router]);

  useEffect(() => {
    fetch("/api/ejercicios-test")
      .then((r) => r.json())
      .then(({ ejercicios: reales }) => {
        if (reales?.length) {
          setEjercicios(reales);
          setEjercicioId(reales[0].id);
        } else {
          setEjercicioId(EJERCICIOS_TEST_POR_DEFECTO[0].id);
        }
      });
  }, []);

  useEffect(() => {
    if (!ejercicioId) return;
    setUltimoDelEjercicio(undefined);
    fetch(`/api/test-fuerza?usuarioId=demo&ejercicioId=${ejercicioId}`)
      .then((r) => r.json())
      .then(({ ultimo }) => setUltimoDelEjercicio(ultimo));
  }, [ejercicioId]);

  useEffect(() => {
    fetch("/api/test-fuerza?usuarioId=demo&historial=1")
      .then((r) => r.json())
      .then(({ historial }) => setHistorial(historial));
  }, [resultado]);

  async function enviarTest() {
    setEnviando(true);
    try {
      const res = await fetch("/api/test-fuerza", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ usuarioId: "demo", ejercicioId, pesoKg: peso, repsRealizadas: reps }),
      });
      setResultado(await res.json());
    } finally {
      setEnviando(false);
    }
  }

  return (
    <div className="flex min-h-dvh flex-col">
      <BarraSuperior titulo="Test de fuerza" subtitulo="Recalculá tu 1RM estimado" />

      <main className={`flex-1 px-5 ${modoAccesible ? "px-6" : ""}`}>
        {modoAccesible && (
          <p className="mb-4 rounded-xl border border-terracota/30 bg-terracota/5 px-4 py-3 text-base text-tinta/85">
            Priorizá siempre la técnica por sobre el esfuerzo. Frená bastante antes de sentir que
            no podés más — no hace falta llegar cerca del fallo para que este test sirva.
          </p>
        )}
        <p className={modoAccesible ? "text-lg text-tinta/70" : "text-sm text-tinta/70"}>
          Elegí un ejercicio básico, hacé una serie cercana al fallo técnico (entre 1 y 10
          repeticiones) con una carga exigente, y cargá acá el resultado. Estimamos tu 1RM con la
          fórmula de Epley — no hace falta que intentes levantar tu máximo real.
        </p>

        <p className="mt-6 text-sm font-medium text-tinta/70">Ejercicio</p>
        <div className="mt-2 flex flex-col gap-2">
          {ejercicios.map((ej) => (
            <button
              key={ej.id}
              onClick={() => {
                setEjercicioId(ej.id);
                setResultado(null);
              }}
              className={`rounded-xl border px-4 py-3 text-left text-sm font-medium ${
                ejercicioId === ej.id ? "border-pino bg-salvia/40" : "border-tinta/20"
              }`}
            >
              {ej.nombre}
            </button>
          ))}
        </div>

        {ultimoDelEjercicio !== undefined && (
          <p className="mt-2 text-xs text-tinta/60">
            {ultimoDelEjercicio
              ? `Último test de este ejercicio: hace ${diasDesde(ultimoDelEjercicio.fecha)} día(s) — 1RM estimado en ese momento: ${ultimoDelEjercicio.valor1RMEstimado}kg.`
              : "Todavía no hiciste un test de este ejercicio."}
          </p>
        )}

        <div className="mt-4 flex gap-3">
          <label className="flex-1">
            <span className="text-xs text-tinta/60">Carga (kg)</span>
            <input
              type="number"
              value={peso}
              onChange={(e) => setPeso(e.target.value)}
              className="mt-1 w-full rounded-lg border border-tinta/20 px-3 py-2 text-base"
            />
          </label>
          <label className="flex-1">
            <span className="text-xs text-tinta/60">Repeticiones al fallo</span>
            <input
              type="number"
              value={reps}
              onChange={(e) => setReps(e.target.value)}
              className="mt-1 w-full rounded-lg border border-tinta/20 px-3 py-2 text-base"
            />
          </label>
        </div>

        <BotonPrincipal className="mt-5" onClick={enviarTest} disabled={enviando || !peso || !reps || !ejercicioId}>
          {enviando ? "Calculando…" : "Calcular 1RM estimado"}
        </BotonPrincipal>

        {resultado && (
          <div
            className="mt-5 rounded-xl px-4 py-4 text-center"
            style={{ backgroundColor: "var(--color-pino)", color: "var(--color-fondo)" }}
          >
            <p className="text-sm">Tu 1RM estimado es</p>
            <p className="font-serif-editorial text-3xl font-semibold">
              {resultado.valor1RMEstimado} kg
            </p>
          </div>
        )}

        <p className="mt-6 text-xs text-tinta/50">
          Repetí este test cada 4-6 semanas — coincide, más o menos, con el ritmo de un mesociclo
          completo (sección 6.2). Es una estimación, no un 1RM real medido: sirve para ajustar tus
          porcentajes de carga, no como marca de competencia.
        </p>

        {historial.length > 0 && (
          <>
            <p className="mt-8 text-sm font-medium text-tinta/70">Historial de tests</p>
            <ul className="mt-2 divide-y divide-tinta/10 rounded-xl border border-tinta/10">
              {historial.map((t, i) => (
                <li key={i} className="flex items-center justify-between px-4 py-3">
                  <span className="text-sm">
                    {nombreEjercicio(t.ejercicioId)}
                    <span className="block text-xs text-tinta/50">
                      hace {diasDesde(t.fecha)} día(s) · {t.pesoKg}kg x {t.repsRealizadas}
                    </span>
                  </span>
                  <span className="font-sans-calida text-sm font-semibold">
                    {t.valor1RMEstimado}kg
                  </span>
                </li>
              ))}
            </ul>
          </>
        )}
      </main>

      <BarraNavegacion />
    </div>
  );
}
