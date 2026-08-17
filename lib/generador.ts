import { listarEjercicios, type EjercicioDB } from "./db";
import { evaluarReglas } from "./motor-reglas";
import { tipoSplitPorDias, totalDiasDelCiclo, obtenerDiaActual, fasePorSemana, type TipoSplit, type FaseMesociclo } from "./store-estado-rutina";
import { obtenerRutinaCacheada, guardarRutinaCacheada } from "./store-rutina-cache";
import { elegirMetodoAplicable, registrarUsoMetodo } from "./store-metodos";
import type { ContextoEvaluacion, EjercicioCandidato, PerfilUsuario, ResultadoRegla } from "./types";

export interface EjercicioRutina {
  id: string;
  nombre: string;
  patronMovimiento: string;
  series: number;
  reps: string;
  descansoSeg: number;
  instrucciones: string;
  videoUrl: string | null;
  metodoAplicado?: { nombre: string; descripcion: string } | null;
  equipamientoRequerido: string[];
  escaleraSiguienteId?: string | null;
  esIsometrico: boolean;
  paraLesion?: string | null;
}

export interface RutinaGenerada {
  nombre: string;
  fecha: string;
  diaDelCiclo: { indice: number; total: number; etiqueta: string };
  mesociclo: {
    semana: number;
    duracionSemanas: number;
    fase: FaseMesociclo;
    etiquetaFase: string;
    explicacion: { titulo: string; comoTrabajamos: string; porque: string };
    mostrarIntroAutomatica: boolean;
  };
  ejercicios: EjercicioRutina[];
  auditoria: {
    alertas: ResultadoRegla[];
    sustituciones: { bucket: string; original: string; sustituto: string; reglaId: string }[];
    ratioEmpujeTraccion: number;
  };
  moduloDeportivo?: { nombre: string; cardioEspecifico: string; prevencion: string } | null;
}

interface Bucket {
  id: string;
  patrones: string[];
}

// Bloques según el día del ciclo, por tipo de split (sección 4.2 del marco teórico).
const BUCKETS_POR_DIA: Record<TipoSplit, { etiqueta: string; buckets: Bucket[] }[]> = {
  full_body: [
    {
      etiqueta: "Full body",
      buckets: [
        { id: "empuje", patrones: ["empuje_horizontal", "empuje_vertical_barra"] },
        { id: "traccion", patrones: ["traccion_horizontal", "traccion_vertical"] },
        { id: "sentadilla", patrones: ["sentadilla"] },
        { id: "bisagra", patrones: ["bisagra_cadera"] },
        { id: "core", patrones: ["core_antiextension", "core_antirotacion"] },
      ],
    },
  ],
  upper_lower: [
    {
      etiqueta: "Tren superior",
      buckets: [
        { id: "empuje_horizontal", patrones: ["empuje_horizontal"] },
        { id: "traccion_horizontal", patrones: ["traccion_horizontal"] },
        { id: "empuje_vertical", patrones: ["empuje_vertical_barra"] },
        { id: "traccion_vertical", patrones: ["traccion_vertical"] },
        { id: "brazo", patrones: ["flexion_codo", "extension_codo"] },
      ],
    },
    {
      etiqueta: "Tren inferior",
      buckets: [
        { id: "sentadilla", patrones: ["sentadilla"] },
        { id: "bisagra", patrones: ["bisagra_cadera"] },
        { id: "sentadilla_2", patrones: ["sentadilla"] },
        { id: "core", patrones: ["core_antiextension", "core_antirotacion"] },
      ],
    },
  ],
  ppl: [
    {
      etiqueta: "Empuje (push)",
      buckets: [
        { id: "empuje_horizontal_1", patrones: ["empuje_horizontal"] },
        { id: "empuje_horizontal_2", patrones: ["empuje_horizontal"] },
        { id: "empuje_vertical", patrones: ["empuje_vertical_barra"] },
        { id: "extension_codo", patrones: ["extension_codo"] },
        { id: "core", patrones: ["core_antiextension"] },
      ],
    },
    {
      etiqueta: "Tracción (pull)",
      buckets: [
        { id: "traccion_horizontal_1", patrones: ["traccion_horizontal"] },
        { id: "traccion_horizontal_2", patrones: ["traccion_horizontal"] },
        { id: "traccion_vertical", patrones: ["traccion_vertical"] },
        { id: "flexion_codo", patrones: ["flexion_codo"] },
        { id: "core", patrones: ["core_antirotacion"] },
      ],
    },
    {
      etiqueta: "Piernas (legs)",
      buckets: [
        { id: "sentadilla_1", patrones: ["sentadilla"] },
        { id: "sentadilla_2", patrones: ["sentadilla"] },
        { id: "bisagra", patrones: ["bisagra_cadera"] },
        { id: "core", patrones: ["core_antiextension", "core_antirotacion"] },
      ],
    },
  ],
};

// Plantillas deportivas (sección 11 del marco teórico). A diferencia del
// split genérico, cada deporte es una sola plantilla de sesión (no rota por
// día) — combina fuerza base + específica de ese deporte. El bloque de
// cardio específico y prevención no son "ejercicios" de la biblioteca (no
// tenemos sprints/agilidad como entidades de datos), así que se devuelven
// como texto descriptivo en `moduloDeportivo`, no como parte de `ejercicios`.
// Qué zona lesionada trata cada tag de objetivoCorrectivo — usado tanto para
// priorizar la selección de ejercicios (candidatosParaBucket) como para el
// badge "Para tratar tu lesión" en la rutina generada. Un mismo ejercicio
// puede tratar más de una zona (ej. rango controlado de rodilla sirve tanto
// para menisco como para post-operatorio de LCA, misma articulación).
const ZONA_POR_TAG_CORRECTIVO: Record<string, string[]> = {
  fortalece_manguito_rotador: ["hombro"],
  rango_controlado_rodilla: ["rodilla", "lca_post_operatorio"],
};

const PLANTILLAS_DEPORTE: Record<
  string,
  { nombre: string; buckets: Bucket[]; cardioEspecifico: string; prevencion: string }
> = {
  futbol: {
    nombre: "Fútbol",
    buckets: [
      { id: "sentadilla", patrones: ["sentadilla"] },
      { id: "bisagra", patrones: ["bisagra_cadera"] },
      { id: "core", patrones: ["core_antirotacion"] },
      { id: "traccion", patrones: ["traccion_horizontal"] },
    ],
    cardioEspecifico:
      "Sprints de 20-40m (6-10 repeticiones, pausa 1-2min) + resistencia intermitente tipo Yo-Yo, según el momento de la temporada (sección 11.1).",
    prevencion:
      "Nordic hamstring, Copenhagen plank (aductores), propiocepción de tobillo (sección 11.2).",
  },
  voley: {
    nombre: "Vóley",
    buckets: [
      { id: "sentadilla", patrones: ["sentadilla"] },
      { id: "empuje_vertical", patrones: ["empuje_vertical_barra"] },
      { id: "core", patrones: ["core_antirotacion"] },
      { id: "bisagra", patrones: ["bisagra_cadera"] },
    ],
    cardioEspecifico:
      "Series de salto repetido y sprint lateral corto (5-10m) — priorizá la capacidad de repetir esfuerzos explosivos por sobre la resistencia continua (sección 11.3).",
    prevencion: "Fuerza excéntrica de cuádriceps (tendinopatía rotuliana), estabilidad de tobillo.",
  },
  basquet: {
    nombre: "Básquet",
    buckets: [
      { id: "sentadilla", patrones: ["sentadilla"] },
      { id: "bisagra", patrones: ["bisagra_cadera"] },
      { id: "core", patrones: ["core_antirotacion"] },
      { id: "empuje", patrones: ["empuje_horizontal"] },
    ],
    cardioEspecifico:
      "RSA: 10-15 sprints de 15-20m con 15-20s de pausa, incluyendo cambios de dirección con frenado (sección 11.4).",
    prevencion: "Control de aterrizaje de salto (esguince de tobillo), fuerza excéntrica de cuádriceps.",
  },
  tenis_padel: {
    nombre: "Tenis / Pádel",
    buckets: [
      { id: "core", patrones: ["core_antirotacion"] },
      { id: "traccion", patrones: ["traccion_horizontal"] },
      { id: "sentadilla", patrones: ["sentadilla"] },
      { id: "empuje", patrones: ["empuje_horizontal"] },
    ],
    cardioEspecifico:
      "Desplazamientos laterales/diagonales cortos: 8-10 series de 10-15s de intensidad alta con 20-30s de pausa (sección 11.5).",
    prevencion: "Salud de hombro/manguito rotador, fuerza excéntrica de isquiotibiales y aductores.",
  },
  hockey: {
    nombre: "Hockey",
    buckets: [
      { id: "sentadilla", patrones: ["sentadilla"] },
      { id: "bisagra", patrones: ["bisagra_cadera"] },
      { id: "core", patrones: ["core_antiextension"] },
      { id: "traccion", patrones: ["traccion_horizontal"] },
    ],
    cardioEspecifico:
      "RSA: 6-8 sprints de 20-25m, arrancando desde posición de flexión de cadera (postura típica del deporte) (sección 11.6).",
    prevencion: "Fuerza de zona lumbar y cadena posterior, fortalecimiento de aductores.",
  },
};

const NIVEL_RANGO: Record<string, number> = { principiante: 1, intermedio: 2, avanzado: 3 };

// Parámetros por objetivo (sección 7 del marco teórico).
const PARAMS_POR_OBJETIVO: Record<string, { series: number; reps: string; descanso: number }> = {
  fuerza_maxima: { series: 5, reps: "3-5", descanso: 240 },
  fuerza_potencia: { series: 4, reps: "3-5", descanso: 180 },
  fuerza_resistencia: { series: 3, reps: "15-20", descanso: 45 },
  hipertrofia: { series: 4, reps: "8-12", descanso: 75 },
  salud_general: { series: 3, reps: "10-12", descanso: 60 },
  rehabilitacion: { series: 2, reps: "10-15", descanso: 60 },
  movilidad: { series: 2, reps: "10-15", descanso: 45 },
};

// % de 1RM aproximado según objetivo (mismos valores que store-registro-carga.ts) —
// se usa acá para que reglas como R-003 (rodilla + sentadilla + intensidad alta)
// puedan evaluarse durante la selección, no solo cuando ya se completó una serie.
const PORCENTAJE_1RM_POR_OBJETIVO: Record<string, number> = {
  fuerza_maxima: 87,
  fuerza_potencia: 60,
  fuerza_resistencia: 50,
  hipertrofia: 72,
  salud_general: 65,
  rehabilitacion: 50,
  movilidad: 40,
};

function intensidadEstimada(objetivo: string | undefined, fase: FaseMesociclo): number {
  const base = PORCENTAJE_1RM_POR_OBJETIVO[objetivo ?? "salud_general"] ?? PORCENTAJE_1RM_POR_OBJETIVO.salud_general;
  if (fase === "intensificacion") return Math.min(92, base + 5);
  if (fase === "descarga") return Math.max(30, base - 15);
  return base;
}

function nivelPermitido(nivelEjercicio: string, experienciaUsuario: string): boolean {
  return NIVEL_RANGO[nivelEjercicio] <= NIVEL_RANGO[experienciaUsuario];
}

function equipamientoDisponible(ejercicio: EjercicioDB, disponible: string[]): boolean {
  return ejercicio.equipamientoRequerido.every((eq) => eq === "ninguno" || disponible.includes(eq));
}

function clasificarEmpujeTraccion(patron: string): "empuje" | "traccion" | "otro" {
  if (patron.startsWith("empuje")) return "empuje";
  if (patron.startsWith("traccion")) return "traccion";
  return "otro";
}

function aEjercicioCandidato(e: EjercicioDB): EjercicioCandidato {
  return {
    id: e.id,
    patronMovimiento: e.patronMovimiento,
    equipamientoRequerido: e.equipamientoRequerido,
    nivelDificultad: e.nivelDificultad,
    tipo: e.tipo,
    grupoMuscularAgonista: e.grupoMuscularAgonista,
    musculosSecundarios: e.musculosSecundarios,
    contraindicaciones: [],
    tagsAdicionales: e.tagsAdicionales,
    implicaValsalva: e.tagsAdicionales.includes("valsalva"),
  };
}

/**
 * Paso 4 del algoritmo (sección 23.1): para un bucket dado, arma la lista de
 * candidatos ya filtrados por equipamiento y nivel, priorizando ejercicios
 * multiarticulares (básicos) antes que aislamiento.
 */
function candidatosParaBucket(
  bucket: { patrones: string[] },
  biblioteca: EjercicioDB[],
  perfil: PerfilUsuario,
  yaUsados: Set<string>
): EjercicioDB[] {
  const zonasActivas = new Set(
    perfil.historialLesiones.filter((l) => l.estado === "activa").map((l) => l.zona)
  );
  const esCorrectivoParaLesionActiva = (e: EjercicioDB) =>
    (e.objetivoCorrectivo ?? []).some((tag) =>
      (ZONA_POR_TAG_CORRECTIVO[tag] ?? []).some((zona) => zonasActivas.has(zona))
    );

  return biblioteca
    .filter(
      (e) =>
        bucket.patrones.includes(e.patronMovimiento) &&
        !yaUsados.has(e.id) &&
        nivelPermitido(e.nivelDificultad, perfil.experiencia) &&
        equipamientoDisponible(e, perfil.equipamientoDisponible)
    )
    .sort((a, b) => {
      // Un ejercicio pensado para tratar una lesión activa del usuario va
      // primero, incluso antes que el criterio de "multiarticular primero" —
      // si existe una opción terapéutica disponible, es más importante que
      // el usuario la reciba que maximizar eficiencia de entrenamiento.
      const correctivoA = Number(esCorrectivoParaLesionActiva(a));
      const correctivoB = Number(esCorrectivoParaLesionActiva(b));
      if (correctivoA !== correctivoB) return correctivoB - correctivoA;
      return Number(b.tipo === "multiarticular") - Number(a.tipo === "multiarticular");
    });
}

/**
 * Ejercicios básicos disponibles para el test de fuerza (sección 17.2.2),
 * elegidos según el equipamiento real del usuario — no siempre son con barra.
 * Un candidato por patrón (empuje, sentadilla, bisagra de cadera), priorizando
 * barra > mancuernas/kettlebell > peso corporal, en ese orden si están
 * disponibles.
 */
export async function obtenerEjerciciosTest(
  perfil: PerfilUsuario
): Promise<{ id: string; nombre: string; patron: string }[]> {
  const biblioteca = await listarEjercicios();
  const patrones: { id: string; patrones: string[] }[] = [
    { id: "empuje", patrones: ["empuje_horizontal"] },
    { id: "sentadilla", patrones: ["sentadilla"] },
    { id: "bisagra", patrones: ["bisagra_cadera"] },
  ];

  const resultado: { id: string; nombre: string; patron: string }[] = [];
  for (const p of patrones) {
    const candidatos = candidatosParaBucket(p, biblioteca, perfil, new Set());
    // Entre los candidatos ya filtrados por equipamiento/nivel, preferimos barra
    // primero (permite cargas más precisas de testear), después lo que haya.
    const conBarra = candidatos.find((c) => c.equipamientoRequerido.includes("barra"));
    const elegido = conBarra ?? candidatos[0];
    if (elegido) resultado.push({ id: elegido.id, nombre: elegido.nombreEs, patron: p.id });
  }
  return resultado;
}

/**
 * Genera la rutina del día siguiendo los 10 pasos de la sección 23.1 del
 * marco teórico: elegir bloques → poblar con ejercicios reales → rebalancear
 * agonista/antagonista → asignar parámetros → pasar por el motor de reglas →
 * sustituir lo bloqueado → auditar.
 */
async function generarRutinaSinCache(perfil: PerfilUsuario): Promise<RutinaGenerada> {
  const biblioteca = await listarEjercicios();
  const yaUsados = new Set<string>();
  const seleccionados: { bucket: string; ejercicio: EjercicioDB }[] = [];
  const sustituciones: RutinaGenerada["auditoria"]["sustituciones"] = [];

  const tipoSplit = tipoSplitPorDias(perfil.diasPorSemana ?? 3);
  const totalDias = totalDiasDelCiclo(tipoSplit);
  const { diaIndice: diaIndiceCrudo, semanaMesociclo, mostrarIntroSemana, sesionesEstaSemana } = await obtenerDiaActual(perfil.id);
  const diaIndice = diaIndiceCrudo % totalDias;
  const fase = fasePorSemana(semanaMesociclo);

  const plantillaDeporte = perfil.deporte ? PLANTILLAS_DEPORTE[perfil.deporte] : null;
  const diaDeHoy = plantillaDeporte
    ? { etiqueta: plantillaDeporte.nombre, buckets: plantillaDeporte.buckets }
    : BUCKETS_POR_DIA[tipoSplit][diaIndice];

  // Si el usuario entrena más veces por semana que días tiene el ciclo del
  // split (ej. PPL con 5 días/semana: el ciclo dura 3 días, así que "Push"
  // aparece dos veces en la misma semana), la 2da vuelta no debe repetir
  // exactamente los mismos ejercicios que la 1ra — rotamos qué candidato se
  // elige dentro de cada bucket según cuántas vueltas ya pasaron esta semana.
  const rotacionEnLaSemana = Math.floor(sesionesEstaSemana / totalDias);

  // Si el usuario tiene un patrón postural de hombro/cabeza adelantados (sección 13.6),
  // priorizamos un bucket extra de tracción para compensar — la app "sabe" esto sin
  // que el usuario tenga que pedirlo.
  const necesitaMasTraccion = ["hombros_adelantados", "cabeza_adelantada"].some((a) =>
    perfil.alteracionesPosturales.includes(a)
  );
  const buckets = necesitaMasTraccion
    ? [...diaDeHoy.buckets, { id: "traccion_extra", patrones: ["traccion_horizontal", "traccion_vertical"] }]
    : diaDeHoy.buckets;

  const intensidadPorcentaje1RM = intensidadEstimada(perfil.objetivoPrincipal, fase);

  // Paso 4 + 8: poblar cada bucket y pasar cada candidato por el motor de reglas
  // antes de aceptarlo definitivamente (sustitución automática si bloquea).
  const alertasPorSeleccion: ResultadoRegla[] = [];
  for (const bucket of buckets) {
    const candidatosBase = candidatosParaBucket(bucket, biblioteca, perfil, yaUsados);
    // Rotamos el orden en el que se prueban los candidatos (no cuáles son
    // válidos) para que la 2da/3ra vuelta de la semana prefiera una opción
    // distinta a la de la vuelta anterior, mantenimiento el mismo filtro de
    // seguridad/equipamiento/nivel de siempre.
    const offset = candidatosBase.length > 0 ? rotacionEnLaSemana % candidatosBase.length : 0;
    const candidatos = [...candidatosBase.slice(offset), ...candidatosBase.slice(0, offset)];
    let elegido: EjercicioDB | null = null;

    for (const candidato of candidatos) {
      const ctx: ContextoEvaluacion = {
        usuario: perfil,
        ejercicio: aEjercicioCandidato(candidato),
        parametros: { intensidadPorcentaje1RM },
      };
      const reglas = evaluarReglas(ctx);
      const bloqueo = reglas.find((r) => r.accionTipo.startsWith("bloqueo"));

      if (!bloqueo) {
        elegido = candidato;
        // Las reglas que no bloquearon pero sí son alerta (ej. R-020 Valsalva
        // en tercera edad) se guardan igual, para mostrarlas en el auditor.
        alertasPorSeleccion.push(...reglas.filter((r) => !r.accionTipo.startsWith("bloqueo")));
        break;
      }
      // Regla 22.4: un bloqueo descarta este candidato y probamos el siguiente del mismo bucket.
      sustituciones.push({
        bucket: bucket.id,
        original: candidato.nombreEs,
        sustituto: "siguiente candidato del mismo patrón",
        reglaId: bloqueo.id,
      });
    }

    if (elegido) {
      seleccionados.push({ bucket: bucket.id, ejercicio: elegido });
      yaUsados.add(elegido.id);
    }
  }

  // Paso 5: verificar balance agonista/antagonista (sección 4.1 / 9.1).
  const empuje = seleccionados.filter((s) => clasificarEmpujeTraccion(s.ejercicio.patronMovimiento) === "empuje").length;
  const traccion = seleccionados.filter((s) => clasificarEmpujeTraccion(s.ejercicio.patronMovimiento) === "traccion").length;
  const ratioEmpujeTraccion = traccion === 0 ? empuje : empuje / traccion;

  // Para R-023 (anteversión pélvica): ¿hay suficiente trabajo de glúteo/core
  // en la rutina para acompañar una bisagra de cadera cargada?
  const volumenGluteoCoreSuficiente = seleccionados.some(
    (s) =>
      s.ejercicio.grupoMuscularAgonista === "gluteo" ||
      s.ejercicio.patronMovimiento.startsWith("core_")
  );
  const hayBisagraCargada = seleccionados.some((s) => s.ejercicio.patronMovimiento === "bisagra_cadera");

  const ctxDesbalance: ContextoEvaluacion = {
    usuario: perfil,
    ejercicio: { id: "n/a", patronMovimiento: hayBisagraCargada ? "bisagra_cadera" : "n/a", equipamientoRequerido: [], nivelDificultad: "intermedio", contraindicaciones: [], tagsAdicionales: [] },
    parametros: { intensidadPorcentaje1RM },
    ratioEmpujeTraccion,
    volumenGluteoCoreSuficiente,
  };
  const alertas = [...alertasPorSeleccion, ...evaluarReglas(ctxDesbalance)];

  // Paso 6: asignar parámetros de entrenamiento según el objetivo, ajustados por fase (sección 6.2).
  const paramsBase = PARAMS_POR_OBJETIVO[perfil.objetivoPrincipal ?? "salud_general"] ?? PARAMS_POR_OBJETIVO.salud_general;
  const params = ajustarPorFase(paramsBase, fase);

  const zonasActivas = new Set(
    perfil.historialLesiones.filter((l) => l.estado === "activa").map((l) => l.zona)
  );

  const ejercicios: EjercicioRutina[] = seleccionados.map(({ ejercicio }) => {
    const esIsometrico = ejercicio.tagsAdicionales.includes("isometrico");
    const zonaTratada = (ejercicio.objetivoCorrectivo ?? [])
      .flatMap((tag) => ZONA_POR_TAG_CORRECTIVO[tag] ?? [])
      .find((zona) => zonasActivas.has(zona));
    return {
      id: ejercicio.id,
      nombre: ejercicio.nombreEs,
      patronMovimiento: ejercicio.patronMovimiento,
      series: params.series,
      reps: esIsometrico ? duracionIsometrica(fase) : params.reps,
      descansoSeg: params.descanso,
      instrucciones: ejercicio.instruccionesEs,
      videoUrl: ejercicio.videoUrl ?? null,
      metodoAplicado: null,
      equipamientoRequerido: ejercicio.equipamientoRequerido,
      escaleraSiguienteId: ejercicio.escaleraSiguienteId ?? null,
      esIsometrico,
      paraLesion: zonaTratada ?? null,
    };
  });

  // Paso 7: aplicar un método de intensificación (sección 5) — la evidencia es
  // consistente en que estas técnicas son para ejercicios de aislamiento
  // (monoarticulares), nunca para básicos multiarticulares pesados (sentadilla,
  // peso muerto, press banca con barra — ahí el riesgo de fallar la técnica
  // bajo fatiga supera el beneficio) ni para ejercicios isométricos (no existe
  // "repetición" que reducir de peso y continuar en una plancha). Buscamos el
  // último ejercicio de la sesión que cumpla esa condición, no simplemente el
  // último de la lista.
  if (perfil.objetivoPrincipal === "hipertrofia" && fase !== "descarga" && ejercicios.length > 0) {
    let indiceApto = -1;
    for (let i = seleccionados.length - 1; i >= 0; i--) {
      const candidato = seleccionados[i].ejercicio;
      if (candidato.tipo === "monoarticular" && !candidato.tagsAdicionales.includes("isometrico")) {
        indiceApto = i;
        break;
      }
    }
    if (indiceApto !== -1) {
      const metodo = await elegirMetodoAplicable(perfil);
      if (metodo) {
        ejercicios[indiceApto].metodoAplicado = { nombre: metodo.nombre, descripcion: metodo.descripcion };
        await registrarUsoMetodo(perfil.id, metodo.id);
      }
    }
  }

  return {
    nombre: plantillaDeporte
      ? `${plantillaDeporte.nombre} — sesión de fuerza específica`
      : `${diaDeHoy.etiqueta} — ${nombrePorObjetivo(perfil.objetivoPrincipal)}`,
    fecha: new Date().toLocaleDateString("es-AR", { weekday: "long", day: "numeric", month: "long" }),
    diaDelCiclo: { indice: diaIndice, total: totalDias, etiqueta: diaDeHoy.etiqueta },
    mesociclo: {
      semana: semanaMesociclo,
      duracionSemanas: 4,
      fase,
      etiquetaFase: ETIQUETA_FASE[fase],
      explicacion: EXPLICACION_FASE[fase],
      mostrarIntroAutomatica: mostrarIntroSemana,
    },
    ejercicios,
    auditoria: { alertas, sustituciones, ratioEmpujeTraccion },
    moduloDeportivo: plantillaDeporte
      ? { nombre: plantillaDeporte.nombre, cardioEspecifico: plantillaDeporte.cardioEspecifico, prevencion: plantillaDeporte.prevencion }
      : null,
  };
}

const ETIQUETA_FASE: Record<FaseMesociclo, string> = {
  acumulacion: "Acumulación (más volumen)",
  intensificacion: "Intensificación (más intensidad, menos series)",
  descarga: "Descarga (semana de recuperación)",
};

export const EXPLICACION_FASE: Record<FaseMesociclo, { titulo: string; comoTrabajamos: string; porque: string }> = {
  acumulacion: {
    titulo: "Semana de Acumulación",
    comoTrabajamos:
      "Trabajamos con el volumen más alto del mesociclo (más series por ejercicio) y una intensidad moderada, dejando margen de reserva (RIR 2-3) en la mayoría de las series.",
    porque:
      "El volumen es el principal disparador del estímulo de adaptación muscular. Acumular trabajo de calidad ahora, sin llegar al límite en cada serie, construye una base amplia de estímulo mientras la fatiga se mantiene controlada — así llegamos frescos a las semanas siguientes, donde el tipo de estímulo cambia.",
  },
  intensificacion: {
    titulo: "Semana de Intensificación",
    comoTrabajamos:
      "Bajamos un poco el volumen (una serie menos por ejercicio) y subimos la intensidad relativa — vas a acercarte más al fallo técnico en cada serie, con descansos un poco más largos entre series.",
    porque:
      "Después de acumular volumen, el cuerpo necesita un estímulo más intenso y específico para consolidar la fuerza — es el principio de sobrecarga progresiva por intensidad, no solo por volumen. Reducir el volumen acá evita que la fatiga se acumule sin control mientras aumenta la exigencia por serie.",
  },
  descarga: {
    titulo: "Semana de Descarga",
    comoTrabajamos:
      "El volumen baja de forma marcada (aproximadamente la mitad de tus series habituales), manteniendo la técnica y el rango de movimiento completo, pero sin buscar exigencia máxima.",
    porque:
      "El cuerpo no se adapta durante el entrenamiento, se adapta durante la recuperación. Esta semana existe para permitir que las tres semanas anteriores terminen de consolidarse (supercompensación) y para prevenir el sobreentrenamiento — la misma lógica que usa el motor de reglas cuando detecta señales de fatiga acumulada. Reduce el riesgo de lesión y te deja con más energía para arrancar el próximo mesociclo con más fuerza.",
  },
};

/**
 * Ajusta series y descanso según la fase del mesociclo (sección 6.2):
 * - Acumulación: parámetros base, foco en volumen.
 * - Intensificación: -1 serie, +15seg de descanso (más intensidad relativa, menos volumen).
 * - Descarga: series reducidas ~45%, mismo descanso — semana de recuperación activa.
 */
function ajustarPorFase(
  base: { series: number; reps: string; descanso: number },
  fase: FaseMesociclo
): { series: number; reps: string; descanso: number } {
  if (fase === "intensificacion") {
    return { ...base, series: Math.max(2, base.series - 1), descanso: base.descanso + 15 };
  }
  if (fase === "descarga") {
    return { ...base, series: Math.max(1, Math.round(base.series * 0.55)) };
  }
  return base;
}

/**
 * Los ejercicios isométricos (ej. plancha) se prescriben por tiempo de
 * sostén, no por repeticiones — no tiene sentido pedir "8-12 repeticiones"
 * de un ejercicio que se mide en segundos. La duración varía por fase igual
 * que el resto de los parámetros (sección 6.2).
 */
function duracionIsometrica(fase: FaseMesociclo): string {
  if (fase === "intensificacion") return "45-60s";
  if (fase === "descarga") return "20-30s";
  return "30-45s";
}

function nombrePorObjetivo(objetivo?: string): string {
  const nombres: Record<string, string> = {
    fuerza_maxima: "Sesión de fuerza máxima",
    fuerza_potencia: "Sesión de potencia",
    fuerza_resistencia: "Sesión de fuerza-resistencia",
    hipertrofia: "Sesión de hipertrofia",
    rehabilitacion: "Sesión de rehabilitación",
    movilidad: "Sesión de movilidad",
  };
  return (objetivo && nombres[objetivo]) || "Sesión de entrenamiento general";
}

/**
 * Punto de entrada público. La primera vez que se pide la rutina de un
 * día/semana determinado, se calcula y se guarda (`store-rutina-cache.ts`).
 * Cualquier pantalla que la pida después —el dashboard, el detalle de cada
 * ejercicio— recibe exactamente la misma lista de ejercicios e ids, sin
 * importar cuántas veces se llame ni qué haya cambiado mientras tanto. Así
 * un link a un ejercicio nunca puede quedar apuntando a algo que "ya no está"
 * en la sesión de hoy.
 */
export async function generarRutina(perfil: PerfilUsuario): Promise<RutinaGenerada> {
  const totalDias = totalDiasDelCiclo(tipoSplitPorDias(perfil.diasPorSemana ?? 3));
  const { diaIndice: diaIndiceCrudo, semanaMesociclo, mostrarIntroSemana } = await obtenerDiaActual(perfil.id);
  const diaIndice = diaIndiceCrudo % totalDias;

  const cacheada = await obtenerRutinaCacheada(perfil.id, diaIndice, semanaMesociclo);
  const rutina = cacheada ?? (await generarRutinaSinCache(perfil));
  if (!cacheada) {
    await guardarRutinaCacheada(perfil.id, diaIndice, semanaMesociclo, rutina);
  }

  // El flag de "mostrar el aviso automático" depende de estado mutable aparte
  // (si el usuario ya lo cerró), no de qué ejercicios componen la sesión —
  // nunca se cachea, se recalcula siempre en el momento.
  return { ...rutina, mesociclo: { ...rutina.mesociclo, mostrarIntroAutomatica: mostrarIntroSemana } };
}
