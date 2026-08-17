import reglasMeta from "@/data/reglas.json";
import type { ContextoEvaluacion, ResultadoRegla } from "./types";

// Cada regla es un predicado puro: (contexto) => boolean.
// El texto de "condición" en data/reglas.json es documentación legible por humanos;
// esta es la traducción ejecutable de esa misma condición.
const PREDICADOS: Record<string, (ctx: ContextoEvaluacion) => boolean> = {
  "R-001": (ctx) =>
    tieneLesionActivaOTemprana(ctx, "hombro") &&
    ctx.ejercicio.patronMovimiento === "empuje_vertical_barra" &&
    !ctx.ejercicio.tagsAdicionales.includes("rango_controlado"),

  "R-002": (ctx) =>
    tieneLesionActivaOTemprana(ctx, "hombro") &&
    ctx.ejercicio.tagsAdicionales.includes("fondos_profundos"),

  "R-003": (ctx) =>
    tieneLesionActiva(ctx, "rodilla") &&
    ctx.ejercicio.patronMovimiento === "sentadilla" &&
    !ctx.ejercicio.tagsAdicionales.includes("rango_controlado") &&
    (ctx.parametros.intensidadPorcentaje1RM ?? 0) > 70,

  "R-004": (ctx) =>
    tieneLesionActiva(ctx, "rodilla") &&
    ctx.ejercicio.tagsAdicionales.includes("torsion_pie_fijo"),

  "R-005": (ctx) => {
    const activa = ctx.usuario.historialLesiones.find((l) => l.zona === "desgarro_muscular" && l.estado === "activa");
    if (!activa) return false;

    const musculoLesionado = musculoDeLesion(activa.tipo);

    // Si el usuario especificó qué músculo se desgarró, bloqueamos cualquier
    // ejercicio donde ESE músculo sea el agonista principal — no solo
    // pliometría/excéntrico. La guía clínica es consistente: mientras el
    // desgarro está activo, se evita carga significativa sobre el músculo
    // lesionado (progresión isométrico sin dolor → isotónico → isocinético,
    // recién con carga real en fases posteriores). Ejemplo concreto: un
    // desgarro de pectoral SÍ debe bloquear el press de banca, no solo los
    // ejercicios pliométricos de pecho.
    if (musculoLesionado) {
      const agonista = ctx.ejercicio.grupoMuscularAgonista ?? "";
      // "pectoral_superior"/"pectoral_inferior" son variantes de "pectoral" —
      // un desgarro de pectoral debe bloquear las tres, no solo la exacta.
      if (agonista === musculoLesionado || agonista.startsWith(`${musculoLesionado}_`)) return true;

      // Además, si el músculo lesionado aparece como secundario (ej. fondos
      // en paralelas carga pectoral como asistencia del tríceps), también lo
      // bloqueamos — sigue siendo carga real sobre el músculo desgarrado,
      // aunque no sea el protagonista del movimiento.
      const secundarios = (ctx.ejercicio.musculosSecundarios ?? [])
        .map((m) => MAPA_SECUNDARIO_EN_A_TAG[m] ?? m);
      return secundarios.includes(musculoLesionado);
    }

    // Si no especificó el músculo, no podemos filtrar por grupo muscular —
    // mantenemos el bloqueo conservador original, limitado a lo más riesgoso
    // (pliometría/excéntrico intenso) para no bloquear la rutina entera a
    // ciegas sin saber qué músculo evitar.
    return ctx.ejercicio.tagsAdicionales.some((t) =>
      ["excentrico_intenso", "pliometria", "plyometrics"].includes(t)
    );
  },

  "R-006": (ctx) => {
    const lesion = ctx.usuario.historialLesiones.find((l) => l.zona === "lca_post_operatorio");
    const mesesPostOp = lesion ? mesesDesde(lesion.fecha) : null;
    return (
      !!lesion &&
      mesesPostOp !== null &&
      mesesPostOp < 6 &&
      ctx.ejercicio.tagsAdicionales.some((t) => ["pliometria", "plyometrics", "cambio_direccion"].includes(t))
    );
  },

  "R-007": (ctx) =>
    !!ctx.rehabCheckpoint?.faseActualCompletadaPorTiempo && !ctx.rehabCheckpoint?.confirmadaPorProfesional,

  "R-008": (ctx) =>
    ctx.usuario.experiencia === "principiante" && (ctx.volumenSemanaGrupoMuscular ?? 0) > 15,

  "R-009": (ctx) =>
    ctx.usuario.experiencia !== "avanzado" &&
    (ctx.parametros.horasDesdeUltimoEntrenoMismoGrupo ?? 999) < 48,

  "R-010": (ctx) =>
    ["sentadilla", "bisagra_cadera"].includes(ctx.ejercicio.patronMovimiento) &&
    (ctx.parametros.intensidadPorcentaje1RM ?? 0) > 80 &&
    !!ctx.ejercicio.intensidadAltaConsecutiva,

  "R-011": (ctx) => (ctx.ratioEmpujeTraccion ?? 1) > 1.4,

  "R-012": (ctx) =>
    (ctx.sesionesFuerzaPorSemana ?? 0) > 3 && ctx.rutinaIncluyeCore === false,

  "R-013": (ctx) => !!ctx.rpeCrecienteDosSemanas,

  "R-014": (ctx) => (ctx.diasDescansoUltimas2Semanas ?? 1) === 0,

  "R-015": (ctx) =>
    ctx.reporteMolestia?.tipo === "dolor_agudo_punzante" && (ctx.reporteMolestia?.intensidad ?? 0) >= 7,

  "R-016": (ctx) =>
    ctx.reporteMolestia?.tipo === "molestia_articular" && (ctx.reporteMolestia?.countEnMesociclo ?? 0) >= 2,

  "R-017": (ctx) => ctx.reporteMolestia?.tipo === "fatiga_muscular_normal",

  "R-018": (ctx) =>
    !ctx.ejercicio.equipamientoRequerido.every(
      (eq) => eq === "ninguno" || ctx.usuario.equipamientoDisponible.includes(eq)
    ),

  "R-019": (ctx) =>
    ctx.usuario.condicionesEspeciales.includes("tercera_edad") &&
    (ctx.ejercicio.tagsAdicionales.includes("tecnica_al_fallo") || (ctx.parametros.intensidadPorcentaje1RM ?? 0) >= 95),

  "R-020": (ctx) =>
    ctx.usuario.condicionesEspeciales.includes("tercera_edad") && !!ctx.ejercicio.implicaValsalva,

  "R-031": (ctx) =>
    ctx.usuario.condicionesEspeciales.includes("tercera_edad") &&
    ctx.ejercicio.equipamientoRequerido.includes("barra"),

  "R-021": (ctx) =>
    ctx.usuario.alteracionesPosturales.includes("escoliosis") && !ctx.usuario.autorizacionMedicaConfirmada,

  "R-022": (ctx) =>
    ["hombros_adelantados", "cabeza_adelantada"].some((a) => ctx.usuario.alteracionesPosturales.includes(a)) &&
    (ctx.ratioEmpujeTraccion ?? 1) > 1.2,

  "R-023": (ctx) =>
    ctx.usuario.alteracionesPosturales.includes("anteversion_pelvica") &&
    ctx.ejercicio.patronMovimiento === "bisagra_cadera" &&
    (ctx.parametros.intensidadPorcentaje1RM ?? 0) > 70 &&
    ctx.volumenGluteoCoreSuficiente === false,

  "R-024": (ctx) =>
    ctx.usuario.franjaEtaria === "niño_preadolescente" && !!ctx.parametros.metodoIntensificacionId,

  "R-025": (ctx) =>
    ctx.usuario.franjaEtaria === "niño_preadolescente" &&
    ((ctx.parametros.intensidadPorcentaje1RM ?? 0) >= 85 || !!ctx.parametros.esTestDe1RMReal),

  "R-026": (ctx) =>
    ["niño_preadolescente", "adolescente"].includes(ctx.usuario.franjaEtaria) &&
    !ctx.usuario.consentimientoAdultoConfirmado,

  "R-027": (ctx) => ctx.usuario.estadoGestacional === "embarazada" && !ctx.usuario.autorizacionMedicaConfirmada,

  "R-028": (ctx) =>
    ctx.usuario.estadoGestacional === "embarazada" &&
    (ctx.usuario.semanaGestacionOPosparto ?? 0) >= 14 && // ~inicio 2do trimestre
    !!ctx.parametros.posicionSupinaProlongada,

  "R-029": (ctx) =>
    ctx.usuario.estadoGestacional === "posparto" &&
    (ctx.usuario.semanaGestacionOPosparto ?? 99) < 6 &&
    ctx.ejercicio.tagsAdicionales.some((t) => ["alta_intensidad", "alto_impacto"].includes(t)),

  "R-030": (ctx) =>
    ["abombamiento_abdominal", "perdida_orina"].includes(ctx.reporteMolestia?.zonaCorporal ?? ""),
};

function tieneLesionActiva(ctx: ContextoEvaluacion, zona: string) {
  return ctx.usuario.historialLesiones.some((l) => l.zona === zona && l.estado === "activa");
}

// Traduce las etiquetas del selector de músculos del formulario de perfil
// (español, con mayúscula/tilde) al tag interno usado en grupoMuscularAgonista
// de la biblioteca de ejercicios (sección 13.6 / 22.1). Si el usuario escribió
// el músculo a mano ("otro") no lo podemos mapear con certeza — se devuelve
// null y R-005 cae al comportamiento conservador de bloquear todo el patrón.
const MAPA_MUSCULO_A_TAG: Record<string, string> = {
  "Isquiotibiales": "isquiotibiales",
  "Cuádriceps": "cuadriceps",
  "Pectoral": "pectoral",
  "Sóleo/gemelo": "gemelos",
  "Deltoides": "deltoides",
  "Dorsal ancho": "dorsal_ancho",
  "Aductores": "aductores",
};

// Los músculos secundarios de cada ejercicio vinieron en inglés desde
// free-exercise-db y nunca se tradujeron — este mapa los alinea con los tags
// internos en español para poder compararlos contra el músculo declarado en
// el perfil (sección 12.3, R-005).
const MAPA_SECUNDARIO_EN_A_TAG: Record<string, string> = {
  chest: "pectoral",
  quadriceps: "cuadriceps",
  hamstrings: "isquiotibiales",
  glutes: "gluteo",
  calves: "gemelos",
  adductors: "aductores",
  shoulders: "deltoides",
  lats: "dorsal_ancho",
  biceps: "biceps",
  triceps: "triceps",
  abdominals: "abdominales",
};

function musculoDeLesion(tipoJson: string): string | null {
  try {
    const detalle = JSON.parse(tipoJson) as { musculo?: string };
    if (!detalle.musculo) return null;
    return MAPA_MUSCULO_A_TAG[detalle.musculo] ?? null;
  } catch {
    return null;
  }
}

function tieneLesionActivaOTemprana(ctx: ContextoEvaluacion, zona: string) {
  return ctx.usuario.historialLesiones.some(
    (l) => l.zona === zona && (l.estado === "activa" || l.faseRehabActual === "temprana")
  );
}

function mesesDesde(fechaISO: string): number {
  const ms = Date.now() - new Date(fechaISO).getTime();
  return ms / (1000 * 60 * 60 * 24 * 30.44);
}

/**
 * Evalúa un contexto (usuario + ejercicio + parámetros de la sesión) contra
 * todas las reglas con predicado implementado, y devuelve las que se disparan,
 * ordenadas según la lógica de resolución de conflictos de la sección 22.4:
 * 1) prioridad alta > media > baja
 * 2) empate → categoría lesion/rehab_checkpoint gana
 * 3) bloqueo siempre gana sobre alerta/sustitución
 */
export function evaluarReglas(ctx: ContextoEvaluacion): ResultadoRegla[] {
  const disparadas = (reglasMeta as ResultadoRegla[]).filter((regla) => {
    const predicado = PREDICADOS[regla.id];
    return predicado ? predicado(ctx) : false;
  });

  const pesoPrioridad = { alta: 3, media: 2, baja: 1 };
  const esBloqueo = (r: ResultadoRegla) => r.accionTipo.startsWith("bloqueo");
  const esCategoriaClinica = (r: ResultadoRegla) => ["lesion", "rehab_checkpoint"].includes(r.categoria);

  return disparadas.sort((a, b) => {
    if (esBloqueo(a) !== esBloqueo(b)) return esBloqueo(a) ? -1 : 1;
    if (pesoPrioridad[a.prioridad] !== pesoPrioridad[b.prioridad]) {
      return pesoPrioridad[b.prioridad] - pesoPrioridad[a.prioridad];
    }
    if (esCategoriaClinica(a) !== esCategoriaClinica(b)) return esCategoriaClinica(a) ? -1 : 1;
    return 0;
  });
}

/** Reglas cuyo predicado todavía no está implementado (quedan como TODO explícito). */
export const REGLAS_PENDIENTES_DE_IMPLEMENTAR = (reglasMeta as ResultadoRegla[])
  .map((r) => r.id)
  .filter((id) => !PREDICADOS[id]);
