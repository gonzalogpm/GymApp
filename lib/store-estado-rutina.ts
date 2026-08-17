import { readFile, writeFile, mkdir } from "node:fs/promises";
import path from "node:path";

const ARCHIVO = path.join(process.cwd(), "data", "estado-rutina.json");

interface EstadoRutina {
  [usuarioId: string]: {
    diaIndice: number;
    ultimaFecha: string | null;
    semanaMesociclo: number;
    introSemanaMostradaPara: number | null;
    sesionesEstaSemana: number;
  };
}

const DURACION_MESOCICLO_SEMANAS = 4; // 1-2 acumulación, 3 intensificación, 4 descarga (sección 6.2)

export type FaseMesociclo = "acumulacion" | "intensificacion" | "descarga";

export function fasePorSemana(semana: number): FaseMesociclo {
  if (semana >= 4) return "descarga";
  if (semana === 3) return "intensificacion";
  return "acumulacion";
}

async function leerEstado(): Promise<EstadoRutina> {
  try {
    return JSON.parse(await readFile(ARCHIVO, "utf-8"));
  } catch {
    return {};
  }
}

async function guardarEstado(estado: EstadoRutina): Promise<void> {
  await mkdir(path.dirname(ARCHIVO), { recursive: true });
  await writeFile(ARCHIVO, JSON.stringify(estado, null, 2), "utf-8");
}

/** Determina el tipo de split según los días disponibles (sección 4.2 del marco teórico). */
export type TipoSplit = "full_body" | "upper_lower" | "ppl";

export function tipoSplitPorDias(diasPorSemana: number): TipoSplit {
  if (diasPorSemana >= 5) return "ppl";
  if (diasPorSemana === 4) return "upper_lower";
  return "full_body";
}

export function totalDiasDelCiclo(tipoSplit: TipoSplit): number {
  return tipoSplit === "ppl" ? 3 : tipoSplit === "upper_lower" ? 2 : 1;
}

/** Día actual, semana de mesociclo, sesiones ya hechas esta semana, y si corresponde mostrar la explicación de la fase automáticamente. */
export async function obtenerDiaActual(
  usuarioId: string
): Promise<{ diaIndice: number; semanaMesociclo: number; mostrarIntroSemana: boolean; sesionesEstaSemana: number }> {
  const estado = await leerEstado();
  const s = estado[usuarioId];
  const semanaMesociclo = s?.semanaMesociclo ?? 1;
  return {
    diaIndice: s?.diaIndice ?? 0,
    semanaMesociclo,
    mostrarIntroSemana: (s?.introSemanaMostradaPara ?? null) !== semanaMesociclo,
    sesionesEstaSemana: s?.sesionesEstaSemana ?? 0,
  };
}

export async function marcarIntroSemanaMostrada(usuarioId: string, semana: number): Promise<void> {
  const estado = await leerEstado();
  const actual = estado[usuarioId] ?? { diaIndice: 0, ultimaFecha: null, semanaMesociclo: semana, introSemanaMostradaPara: null };
  estado[usuarioId] = { ...actual, introSemanaMostradaPara: semana };
  await guardarEstado(estado);
}

/**
 * Avanza al siguiente día del ciclo del split — se llama al terminar la
 * sesión completa. El ciclo del split (qué tipo de sesión toca: día 1/2/3 de
 * PPL, por ejemplo) y la semana del mesociclo son cosas independientes: el
 * ciclo de PPL dura 3 días, pero si el usuario entrena 5 veces por semana,
 * una "semana" de mesociclo son 5 sesiones, no 3. Por eso la semana avanza
 * recién cuando se completan `diasPorSemana` sesiones, no cuando el ciclo del
 * split vuelve al día 0.
 */
export async function avanzarDia(usuarioId: string, totalDiasCiclo: number, diasPorSemana: number): Promise<void> {
  const estado = await leerEstado();
  const actual = estado[usuarioId] ?? {
    diaIndice: 0,
    ultimaFecha: null,
    semanaMesociclo: 1,
    introSemanaMostradaPara: null,
    sesionesEstaSemana: 0,
  };

  const nuevoDiaIndice = (actual.diaIndice + 1) % totalDiasCiclo;
  const nuevasSesiones = actual.sesionesEstaSemana + 1;
  const completoSemana = nuevasSesiones >= Math.max(1, diasPorSemana);

  const nuevaSemana = completoSemana
    ? (actual.semanaMesociclo % DURACION_MESOCICLO_SEMANAS) + 1
    : actual.semanaMesociclo;

  estado[usuarioId] = {
    diaIndice: nuevoDiaIndice,
    ultimaFecha: new Date().toISOString(),
    semanaMesociclo: nuevaSemana,
    introSemanaMostradaPara: actual.introSemanaMostradaPara,
    sesionesEstaSemana: completoSemana ? 0 : nuevasSesiones,
  };
  await guardarEstado(estado);
}
