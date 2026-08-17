"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { BarraSuperior } from "@/components/BarraSuperior";
import { BotonPrincipal, BotonSecundarioTexto } from "@/components/Botones";
import type { LesionUsuario } from "@/lib/types";

const NIVELES = ["principiante", "intermedio", "avanzado"] as const;
const EQUIPAMIENTO = [
  { id: "barra", etiqueta: "Barra" },
  { id: "mancuernas", etiqueta: "Mancuernas" },
  { id: "maquina", etiqueta: "Máquinas de gimnasio" },
  { id: "polea", etiqueta: "Polea / cable" },
  { id: "kettlebell", etiqueta: "Kettlebell" },
  { id: "banda_elastica", etiqueta: "Bandas elásticas" },
];
const DEPORTES = [
  { id: "", etiqueta: "Ninguno (fuerza general)" },
  { id: "futbol", etiqueta: "Fútbol" },
  { id: "voley", etiqueta: "Vóley" },
  { id: "basquet", etiqueta: "Básquet" },
  { id: "tenis_padel", etiqueta: "Tenis / Pádel" },
  { id: "hockey", etiqueta: "Hockey" },
];
const OBJETIVOS = [
  { id: "hipertrofia", etiqueta: "Aumentar masa muscular" },
  { id: "fuerza_maxima", etiqueta: "Mejorar fuerza" },
  { id: "movilidad", etiqueta: "Aumentar movilidad" },
  { id: "rehabilitacion", etiqueta: "Recuperarme de una lesión" },
  { id: "salud_general", etiqueta: "Salud general" },
];
const ALTERACIONES_POSTURALES = [
  { id: "hombros_adelantados", etiqueta: "Hombros adelantados" },
  { id: "cabeza_adelantada", etiqueta: "Cabeza adelantada" },
  { id: "anteversion_pelvica", etiqueta: "Anteversión pélvica" },
  { id: "escoliosis", etiqueta: "Escoliosis diagnosticada" },
];
const ESTADOS_GESTACIONALES = [
  { id: "no_aplica", etiqueta: "No aplica" },
  { id: "embarazada", etiqueta: "Embarazada" },
  { id: "posparto", etiqueta: "Posparto" },
];
const ZONAS_LESION = [
  { id: "hombro", etiqueta: "Hombro" },
  { id: "rodilla", etiqueta: "Rodilla (menisco)" },
  { id: "desgarro_muscular", etiqueta: "Desgarro muscular reciente" },
  { id: "lca_post_operatorio", etiqueta: "Post-operatorio LCA" },
];
const MUSCULOS_COMUNES = [
  "Isquiotibiales",
  "Cuádriceps",
  "Pectoral",
  "Sóleo/gemelo",
  "Deltoides",
  "Dorsal ancho",
  "Aductores",
];
const LADOS = [
  { id: "izquierdo", etiqueta: "Izquierdo" },
  { id: "derecho", etiqueta: "Derecho" },
  { id: "ambos", etiqueta: "Ambos" },
];
const TIPOS_LESION_HOMBRO = [
  "Manguito rotador",
  "Tendinitis",
  "Bursitis",
  "Pinzamiento (impingement)",
  "Inestabilidad / luxación",
];

interface DetalleLesion {
  musculo?: string;
  musculoOtro?: string;
  lado?: string;
  mesesTranscurridos?: string;
  tipoHombro?: string;
  tipoHombroOtro?: string;
}

function franjaEtariaPorEdad(edadNum: number): string {
  if (edadNum < 13) return "niño_preadolescente";
  if (edadNum < 18) return "adolescente";
  return "adulto";
}

function etiquetaFranjaEtaria(f: string): string {
  return f === "niño_preadolescente"
    ? "Niño/a (preadolescente)"
    : f === "adolescente"
    ? "Adolescente"
    : "Adulto";
}

export default function PerfilFormPage() {
  const router = useRouter();
  const [cargado, setCargado] = useState(false);
  const [nombre, setNombre] = useState("");
  const [edad, setEdad] = useState("");
  const [nivel, setNivel] = useState<(typeof NIVELES)[number]>("intermedio");
  const [dias, setDias] = useState(3);
  const [equipamiento, setEquipamiento] = useState<string[]>(["barra", "mancuernas"]);
  const [objetivo, setObjetivo] = useState<string | null>(null);
  const [deporte, setDeporte] = useState<string>("");
  const [terceraEdad, setTerceraEdad] = useState(false);
  const [alteracionesPosturales, setAlteracionesPosturales] = useState<string[]>([]);
  const [estadoGestacional, setEstadoGestacional] = useState("no_aplica");
  const [autorizacionMedica, setAutorizacionMedica] = useState(false);
  const [lesionesActivas, setLesionesActivas] = useState<string[]>([]);
  const [detalleLesiones, setDetalleLesiones] = useState<Record<string, DetalleLesion>>({});
  const [consentimientoAdulto, setConsentimientoAdulto] = useState(false);
  const [guardando, setGuardando] = useState(false);
  const [pideConfirmacion, setPideConfirmacion] = useState(false);
  const franjaEtariaCalculada = edad ? franjaEtariaPorEdad(Number(edad)) : "adulto";

  useEffect(() => {
    if (edad && Number(edad) < 50 && terceraEdad) setTerceraEdad(false);
  }, [edad, terceraEdad]);

  useEffect(() => {
    fetch("/api/perfil")
      .then((r) => r.json())
      .then((p) => {
        setNombre(p.nombre ?? "");
        setEdad(p.edad ? String(p.edad) : "");
        setNivel(p.experiencia ?? "intermedio");
        setDias(p.diasPorSemana ?? 3);
        setEquipamiento(p.equipamientoDisponible ?? ["barra", "mancuernas"]);
        setObjetivo(p.objetivoPrincipal ?? null);
        setDeporte(p.deporte ?? "");
        setTerceraEdad((p.condicionesEspeciales ?? []).includes("tercera_edad"));
        setAlteracionesPosturales(p.alteracionesPosturales ?? []);
        setEstadoGestacional(p.estadoGestacional ?? "no_aplica");
        setAutorizacionMedica(!!p.autorizacionMedicaConfirmada);
        setLesionesActivas(
          ((p.historialLesiones ?? []) as LesionUsuario[])
            .filter((l) => l.estado === "activa")
            .map((l) => l.zona)
        );
        {
          const detalle: Record<string, DetalleLesion> = {};
          ((p.historialLesiones ?? []) as LesionUsuario[])
            .filter((l) => l.estado === "activa")
            .forEach((l) => {
              try {
                detalle[l.zona] = JSON.parse(l.tipo);
              } catch {
                detalle[l.zona] = {};
              }
            });
          setDetalleLesiones(detalle);
        }
        // franjaEtaria se recalcula sola a partir de edad, no hace falta precargarla
        setConsentimientoAdulto(!!p.consentimientoAdultoConfirmado);
        setCargado(true);
      });
  }, []);

  function alternar(lista: string[], set: (v: string[]) => void, id: string) {
    set(lista.includes(id) ? lista.filter((x) => x !== id) : [...lista, id]);
  }

  function datosPerfil(forzarAhora?: boolean) {
    return {
      nombre,
      edad: edad ? Number(edad) : undefined,
      experiencia: nivel,
      diasPorSemana: dias,
      equipamientoDisponible: equipamiento,
      objetivoPrincipal: objetivo,
      deporte: deporte || null,
      condicionesEspeciales: terceraEdad ? ["tercera_edad"] : [],
      alteracionesPosturales,
      estadoGestacional,
      autorizacionMedicaConfirmada: autorizacionMedica,
      historialLesiones: lesionesActivas.map((zona) => {
        const detalle = detalleLesiones[zona] ?? {};
        const meses = Number(detalle.mesesTranscurridos) || 0;
        const fecha =
          zona === "lca_post_operatorio" && meses > 0
            ? new Date(Date.now() - meses * 30 * 24 * 60 * 60 * 1000).toISOString()
            : new Date().toISOString();
        return {
          zona,
          tipo: JSON.stringify(detalle),
          fecha,
          estado: "activa" as const,
          origen: "declarado_por_usuario" as const,
        };
      }),
      franjaEtaria: franjaEtariaCalculada,
      consentimientoAdultoConfirmado: consentimientoAdulto,
      ...(forzarAhora ? { forzarAhora: true } : {}),
    };
  }

  function destino() {
    return terceraEdad ? "/accesible" : "/dashboard";
  }

  async function guardarYContinuar() {
    setGuardando(true);
    try {
      const res = await fetch("/api/perfil", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(datosPerfil()),
      });
      const { requiereConfirmacion } = await res.json();
      if (requiereConfirmacion) {
        setPideConfirmacion(true);
        setGuardando(false);
        return;
      }
    } catch {
      setGuardando(false);
      return;
    }
    router.push(destino());
  }

  async function seguirConLaActual() {
    setPideConfirmacion(false);
    router.push(destino());
  }

  async function empezarDeCeroAhora() {
    setGuardando(true);
    await fetch("/api/perfil", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(datosPerfil(true)),
    });
    setPideConfirmacion(false);
    router.push(destino());
  }

  if (!cargado) {
    return (
      <div className="flex min-h-dvh flex-col">
        <BarraSuperior titulo="Tu perfil" />
        <p className="px-5 text-sm text-tinta/60">Cargando…</p>
      </div>
    );
  }

  return (
    <div className="flex min-h-dvh flex-col">
      <BarraSuperior titulo="Tu perfil" />

      <form
        className="flex-1 px-5"
        onSubmit={(e) => {
          e.preventDefault();
          guardarYContinuar();
        }}
      >
        <Campo etiqueta="Nombre completo" tipo="text" valor={nombre} onChange={setNombre} />
        <Campo etiqueta="Edad" tipo="number" valor={edad} onChange={setEdad} />

        <p className="mt-6 text-sm font-medium text-tinta/70">Nivel de experiencia</p>
        <div className="mt-2 flex gap-2">
          {NIVELES.map((n) => (
            <button
              type="button"
              key={n}
              onClick={() => setNivel(n)}
              className={`flex-1 rounded-full border px-3 py-2 text-sm capitalize ${
                nivel === n ? "border-pino bg-salvia/40 font-semibold" : "border-tinta/20"
              }`}
            >
              {n}
            </button>
          ))}
        </div>

        <p className="mt-6 text-sm font-medium text-tinta/70">Días por semana disponibles</p>
        <div className="mt-2 flex gap-2">
          {[2, 3, 4, 5, 6].map((d) => (
            <button
              type="button"
              key={d}
              onClick={() => setDias(d)}
              className={`h-10 w-10 rounded-full border text-sm font-semibold ${
                dias === d ? "border-pino bg-salvia/40" : "border-tinta/20"
              }`}
            >
              {d}
            </button>
          ))}
        </div>

        <p className="mt-6 text-sm font-medium text-tinta/70">
          Equipamiento disponible (además de tu propio cuerpo)
        </p>
        <div className="mt-2 flex flex-wrap gap-2">
          {EQUIPAMIENTO.map((eq) => {
            const activo = equipamiento.includes(eq.id);
            return (
              <button
                type="button"
                key={eq.id}
                onClick={() => alternar(equipamiento, setEquipamiento, eq.id)}
                className={`rounded-full border px-3 py-2 text-sm ${
                  activo ? "border-pino bg-salvia/40 font-semibold" : "border-tinta/20"
                }`}
              >
                {eq.etiqueta}
              </button>
            );
          })}
        </div>

        <p className="mt-6 text-sm font-medium text-tinta/70">
          Deporte específico (sección 11 del marco teórico)
        </p>
        <p className="mt-1 text-xs text-tinta/50">
          Si elegís uno, tu rutina prioriza fuerza específica para ese deporte en vez del split
          general, y te suma indicaciones de cardio y prevención propias de esa disciplina.
        </p>
        <div className="mt-2 flex flex-wrap gap-2">
          {DEPORTES.map((d) => (
            <button
              type="button"
              key={d.id}
              onClick={() => setDeporte(d.id)}
              className={`rounded-full border px-3 py-2 text-xs font-medium ${
                deporte === d.id ? "border-pino bg-salvia/40" : "border-tinta/20"
              }`}
            >
              {d.etiqueta}
            </button>
          ))}
        </div>

        <p className="mt-6 text-sm font-medium text-tinta/70">Objetivo principal</p>
        <ul className="mt-2 divide-y divide-tinta/10 rounded-xl border border-tinta/10">
          {OBJETIVOS.map((o) => (
            <li key={o.id}>
              <button
                type="button"
                onClick={() => setObjetivo(o.id)}
                className="flex w-full items-center justify-between px-4 py-3 text-left text-sm"
              >
                {o.etiqueta}
                <span
                  className={`h-4 w-4 rounded-full border ${
                    objetivo === o.id ? "border-pino bg-pino" : "border-tinta/30"
                  }`}
                />
              </button>
            </li>
          ))}
        </ul>

        <p className="mt-6 text-sm font-medium text-tinta/70">Población especial</p>
        <button
          type="button"
          disabled={!!edad && Number(edad) < 50}
          onClick={() => setTerceraEdad((v) => !v)}
          className={`mt-2 flex w-full items-center justify-between rounded-xl border px-4 py-3 text-left text-sm font-medium ${
            !!edad && Number(edad) < 50
              ? "cursor-not-allowed border-tinta/10 text-tinta/30"
              : terceraEdad
              ? "border-pino bg-salvia/40"
              : "border-tinta/20"
          }`}
        >
          Soy adulto mayor (tercera edad)
          <span
            className={`h-4 w-4 rounded-full border ${
              terceraEdad ? "border-pino bg-pino" : "border-tinta/30"
            }`}
          />
        </button>
        {!!edad && Number(edad) < 50 && (
          <p className="mt-1 text-xs text-tinta/40">Disponible a partir de los 50 años.</p>
        )}

        <p className="mt-6 text-sm font-medium text-tinta/70">
          Estado gestacional (sección 17 del marco teórico)
        </p>
        <div className="mt-2 flex gap-2">
          {ESTADOS_GESTACIONALES.map((eg) => (
            <button
              type="button"
              key={eg.id}
              onClick={() => setEstadoGestacional(eg.id)}
              className={`flex-1 rounded-full border px-3 py-2 text-xs font-medium ${
                estadoGestacional === eg.id ? "border-pino bg-salvia/40" : "border-tinta/20"
              }`}
            >
              {eg.etiqueta}
            </button>
          ))}
        </div>

        {(estadoGestacional !== "no_aplica" || alteracionesPosturales.includes("escoliosis")) && (
          <p className="mt-2 text-xs text-tinta/50">
            {alteracionesPosturales.includes("escoliosis") &&
              "Para escoliosis, necesitamos confirmación de una evaluación profesional reciente antes de generar cualquier bloque correctivo específico. "}
            {estadoGestacional !== "no_aplica" &&
              "Durante embarazo/posparto, necesitamos confirmación médica antes de generar rutinas de fuerza."}
          </p>
        )}

        <p className="mt-6 text-sm font-medium text-tinta/70">
          Alteraciones posturales (sección 13 del marco teórico)
        </p>
        <div className="mt-2 flex flex-wrap gap-2">
          {ALTERACIONES_POSTURALES.map((a) => {
            const activo = alteracionesPosturales.includes(a.id);
            return (
              <button
                type="button"
                key={a.id}
                onClick={() => alternar(alteracionesPosturales, setAlteracionesPosturales, a.id)}
                className={`rounded-full border px-3 py-2 text-xs font-medium ${
                  activo ? "border-pino bg-salvia/40" : "border-tinta/20"
                }`}
              >
                {a.etiqueta}
              </button>
            );
          })}
        </div>

        {(estadoGestacional !== "no_aplica" || alteracionesPosturales.includes("escoliosis")) && (
          <button
            type="button"
            onClick={() => setAutorizacionMedica((v) => !v)}
            className={`mt-3 flex w-full items-center justify-between rounded-xl border px-4 py-3 text-left text-xs font-medium ${
              autorizacionMedica ? "border-pino bg-salvia/40" : "border-tinta/20"
            }`}
          >
            Tengo autorización médica / evaluación profesional confirmada
            <span
              className={`h-4 w-4 rounded-full border ${
                autorizacionMedica ? "border-pino bg-pino" : "border-tinta/30"
              }`}
            />
          </button>
        )}

        <p className="mt-6 text-sm font-medium text-tinta/70">
          Franja etaria (calculada automáticamente según tu edad)
        </p>
        <p className="mt-1 text-sm text-tinta/80">
          {edad ? etiquetaFranjaEtaria(franjaEtariaCalculada) : "Ingresá tu edad arriba para calcularla."}
        </p>

        {franjaEtariaCalculada !== "adulto" && (
          <>
            <p className="mt-2 text-xs text-tinta/50">
              Para menores, el entrenamiento de fuerza debe estar supervisado por un adulto
              responsable — la app no reemplaza esa supervisión presencial.
            </p>
            <button
              type="button"
              onClick={() => setConsentimientoAdulto((v) => !v)}
              className={`mt-2 flex w-full items-center justify-between rounded-xl border px-4 py-3 text-left text-xs font-medium ${
                consentimientoAdulto ? "border-pino bg-salvia/40" : "border-tinta/20"
              }`}
            >
              Un adulto responsable confirma y supervisa este entrenamiento
              <span
                className={`h-4 w-4 rounded-full border ${
                  consentimientoAdulto ? "border-pino bg-pino" : "border-tinta/30"
                }`}
              />
            </button>
          </>
        )}

        <p className="mt-6 text-sm font-medium text-tinta/70">
          Lesiones activas ahora mismo (sección 12 del marco teórico)
        </p>
        <p className="mt-1 text-xs text-tinta/50">
          Esto activa las reglas de seguridad más estrictas del motor — bloquea ejercicios que no
          son seguros para esa lesión, en vez de solo advertir.
        </p>
        <div className="mt-2 flex flex-wrap gap-2">
          {ZONAS_LESION.map((z) => {
            const activo = lesionesActivas.includes(z.id);
            return (
              <button
                type="button"
                key={z.id}
                onClick={() => alternar(lesionesActivas, setLesionesActivas, z.id)}
                className={`rounded-full border px-3 py-2 text-xs font-medium ${
                  activo ? "border-terracota bg-terracota/10 text-terracota" : "border-tinta/20"
                }`}
              >
                {z.etiqueta}
              </button>
            );
          })}
        </div>

        {lesionesActivas.map((zona) => {
          const etiquetaZona = ZONAS_LESION.find((z) => z.id === zona)?.etiqueta ?? zona;
          const detalle = detalleLesiones[zona] ?? {};

          function actualizarDetalle(campo: keyof DetalleLesion, valor: string) {
            setDetalleLesiones((actual) => ({
              ...actual,
              [zona]: { ...actual[zona], [campo]: valor },
            }));
          }

          return (
            <div key={zona} className="mt-3 rounded-xl border border-terracota/30 bg-terracota/5 p-4">
              <p className="text-sm font-semibold text-terracota">Detalle: {etiquetaZona}</p>
              <a
                href={`/progreso/${zona}`}
                className="mt-1 inline-block text-xs font-medium text-terracota underline underline-offset-4"
              >
                Ver progreso de rehabilitación de esta lesión →
              </a>

              {zona === "desgarro_muscular" && (
                <>
                  <p className="mt-3 text-xs font-medium text-tinta/70">¿Qué músculo?</p>
                  <div className="mt-2 flex flex-wrap gap-2">
                    {MUSCULOS_COMUNES.map((m) => (
                      <button
                        type="button"
                        key={m}
                        onClick={() => actualizarDetalle("musculo", m)}
                        className={`rounded-full border px-3 py-1.5 text-xs ${
                          detalle.musculo === m ? "border-pino bg-salvia/40" : "border-tinta/20"
                        }`}
                      >
                        {m}
                      </button>
                    ))}
                  </div>
                  <input
                    type="text"
                    placeholder="Otro músculo (si no está en la lista)"
                    value={detalle.musculoOtro ?? ""}
                    onChange={(e) => actualizarDetalle("musculoOtro", e.target.value)}
                    className="mt-2 w-full rounded-lg border border-tinta/20 px-3 py-2 text-sm"
                  />
                </>
              )}

              {zona === "hombro" && (
                <>
                  <p className="mt-3 text-xs font-medium text-tinta/70">¿Qué tipo de lesión de hombro?</p>
                  <div className="mt-2 flex flex-wrap gap-2">
                    {TIPOS_LESION_HOMBRO.map((t) => (
                      <button
                        type="button"
                        key={t}
                        onClick={() => actualizarDetalle("tipoHombro", t)}
                        className={`rounded-full border px-3 py-1.5 text-xs ${
                          detalle.tipoHombro === t ? "border-pino bg-salvia/40" : "border-tinta/20"
                        }`}
                      >
                        {t}
                      </button>
                    ))}
                  </div>
                  <input
                    type="text"
                    placeholder="Otro tipo (si no está en la lista)"
                    value={detalle.tipoHombroOtro ?? ""}
                    onChange={(e) => actualizarDetalle("tipoHombroOtro", e.target.value)}
                    className="mt-2 w-full rounded-lg border border-tinta/20 px-3 py-2 text-sm"
                  />
                  <p className="mt-2 text-xs text-tinta/50">
                    Sea cual sea el tipo, evitamos igual todo ejercicio de empuje por encima de la
                    cabeza y fondos profundos mientras esté activa (evidencia consistente: presión
                    directa sobre el manguito rotador en esa posición).
                  </p>
                </>
              )}

              {(zona === "hombro" || zona === "rodilla" || zona === "lca_post_operatorio") && (
                <>
                  <p className="mt-3 text-xs font-medium text-tinta/70">¿Qué lado?</p>
                  <div className="mt-2 flex gap-2">
                    {LADOS.map((l) => (
                      <button
                        type="button"
                        key={l.id}
                        onClick={() => actualizarDetalle("lado", l.id)}
                        className={`flex-1 rounded-full border px-2 py-1.5 text-xs ${
                          detalle.lado === l.id ? "border-pino bg-salvia/40" : "border-tinta/20"
                        }`}
                      >
                        {l.etiqueta}
                      </button>
                    ))}
                  </div>
                </>
              )}

              {zona === "lca_post_operatorio" && (
                <label className="mt-3 block">
                  <span className="text-xs font-medium text-tinta/70">
                    ¿Hace cuántos meses fue la operación?
                  </span>
                  <input
                    type="number"
                    value={detalle.mesesTranscurridos ?? ""}
                    onChange={(e) => actualizarDetalle("mesesTranscurridos", e.target.value)}
                    className="mt-1 w-24 rounded-lg border border-tinta/20 px-3 py-2 text-sm"
                  />
                  <span className="ml-2 text-xs text-tinta/50">
                    Esto define qué ejercicios están permitidos según la fase de rehabilitación.
                  </span>
                </label>
              )}
            </div>
          );
        })}

        <div className="h-28" />
      </form>

      <div className="sticky bottom-0 bg-fondo px-5 pb-[max(1.25rem,env(safe-area-inset-bottom))] pt-3">
        <BotonPrincipal onClick={guardarYContinuar} disabled={guardando}>
          {guardando ? "Guardando…" : "Continuar"}
        </BotonPrincipal>
      </div>

      {pideConfirmacion && (
        <div className="fixed inset-0 z-20 flex items-end justify-center bg-tinta/50 sm:items-center">
          <div className="w-full max-w-sm rounded-t-3xl sm:rounded-3xl bg-fondo p-6 pb-[max(1.5rem,env(safe-area-inset-bottom))]">
            <h3 className="font-serif-editorial text-lg font-semibold">
              Tenés una sesión en progreso hoy
            </h3>
            <p className="mt-3 text-sm text-tinta/80">
              Si empezás de cero ahora con estos cambios, se pierde el progreso de las series que
              ya completaste hoy. Si preferís, podés seguir con la rutina actual y aplicar los
              cambios recién en tu próxima sesión.
            </p>
            <div className="mt-6 flex flex-col gap-2">
              <BotonPrincipal onClick={seguirConLaActual} disabled={guardando}>
                Seguir con la rutina actual
              </BotonPrincipal>
              <BotonSecundarioTexto onClick={empezarDeCeroAhora}>
                Empezar de cero ahora (pierdo el progreso de hoy)
              </BotonSecundarioTexto>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function Campo({
  etiqueta,
  tipo,
  valor,
  onChange,
}: {
  etiqueta: string;
  tipo: string;
  valor: string;
  onChange: (v: string) => void;
}) {
  return (
    <label className="mt-6 block">
      <span className="text-sm font-medium text-tinta/70">{etiqueta}</span>
      <input
        type={tipo}
        value={valor}
        onChange={(e) => onChange(e.target.value)}
        className="mt-2 w-full border-b border-tinta/25 bg-transparent pb-2 text-base outline-none focus:border-pino"
      />
    </label>
  );
}
