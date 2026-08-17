import { readFile, writeFile, mkdir } from "node:fs/promises";
import path from "node:path";
import { obtenerUltimoTest } from "./store-test-fuerza";
import type { FaseMesociclo } from "./store-estado-rutina";

const ARCHIVO = path.join(process.cwd(), "data", "registros-carga.json");

export interface RegistroCarga {
  usuarioId: string;
  ejercicioId: string;
  fecha: string; // ISO
  cargaKg: number;
  repsRealizadas: number;
  rirReportado: number; // repeticiones en reserva, 0-5+
}

async function leerTodos(): Promise<RegistroCarga[]> {
  try {
    const raw = await readFile(ARCHIVO, "utf-8");
    return JSON.parse(raw);
  } catch {
    return [];
  }
}

export async function registrarSerie(registro: Omit<RegistroCarga, "fecha">): Promise<void> {
  const todos = await leerTodos();
  todos.push({ ...registro, fecha: new Date().toISOString() });
  await mkdir(path.dirname(ARCHIVO), { recursive: true });
  await writeFile(ARCHIVO, JSON.stringify(todos, null, 2), "utf-8");
}

export async function obtenerHistorialEjercicio(
  usuarioId: string,
  ejercicioId: string,
  limite = 6
): Promise<RegistroCarga[]> {
  const todos = await leerTodos();
  return todos
    .filter((r) => r.usuarioId === usuarioId && r.ejercicioId === ejercicioId)
    .sort((a, b) => new Date(b.fecha).getTime() - new Date(a.fecha).getTime())
    .slice(0, limite);
}

export interface SugerenciaCarga {
  cargaSugeridaKg: number | null; // null = sin historial, el usuario define desde cero
  cargaUltimaVezKg: number | null;
  motivo: string;
}

// % de 1RM objetivo según el objetivo de entrenamiento (sección 7 del marco teórico).
const PORCENTAJE_1RM_POR_OBJETIVO: Record<string, number> = {
  fuerza_maxima: 0.87,
  fuerza_potencia: 0.6,
  fuerza_resistencia: 0.5,
  hipertrofia: 0.72,
  salud_general: 0.65,
  rehabilitacion: 0.5,
  movilidad: 0.4,
};

function ajustarPorcentajePorFase(porcentaje: number, fase?: FaseMesociclo): number {
  if (fase === "intensificacion") return Math.min(0.92, porcentaje + 0.05);
  if (fase === "descarga") return Math.max(0.3, porcentaje - 0.15);
  return porcentaje;
}

/** Calcula la carga sugerida como % del 1RM del último test, independientemente de si hay historial de series o no. */
export async function obtenerCargaSegunRM(
  usuarioId: string,
  ejercicioId: string,
  objetivo?: string,
  fase?: FaseMesociclo
): Promise<number | null> {
  const test = await obtenerUltimoTest(usuarioId, ejercicioId);
  if (!test) return null;
  const porcentajeBase = PORCENTAJE_1RM_POR_OBJETIVO[objetivo ?? "salud_general"] ?? PORCENTAJE_1RM_POR_OBJETIVO.salud_general;
  const porcentaje = ajustarPorcentajePorFase(porcentajeBase, fase);
  return Math.round(test.valor1RMEstimado * porcentaje * 2) / 2;
}

/**
 * Progresión de carga (sección 6.1 del marco teórico): si en las últimas
 * sesiones el usuario reportó consistentemente un RIR alto (le sobró margen),
 * sugerimos +2.5kg. Si reportó RIR bajo (llegó muy cerca del fallo), mantenemos
 * la misma carga. Sin historial de series propias, si existe un test de fuerza
 * (sección 17.2.2) usamos el 1RM estimado para calcular un punto de partida
 * como % de 1RM según el objetivo y la fase del mesociclo — en vez de dejar el
 * campo vacío para que el usuario adivine.
 */
export async function obtenerSugerenciaCarga(
  usuarioId: string,
  ejercicioId: string,
  objetivo?: string,
  fase?: FaseMesociclo
): Promise<SugerenciaCarga> {
  const historial = await obtenerHistorialEjercicio(usuarioId, ejercicioId, 3);

  if (historial.length === 0) {
    const cargaSegunRM = await obtenerCargaSegunRM(usuarioId, ejercicioId, objetivo, fase);
    if (cargaSegunRM !== null) {
      return {
        cargaSugeridaKg: cargaSegunRM,
        cargaUltimaVezKg: null,
        motivo: `Sin historial de series todavía — usamos tu test de fuerza como punto de partida.`,
      };
    }
    return { cargaSugeridaKg: null, cargaUltimaVezKg: null, motivo: "Sin historial todavía — registrá tu primera carga." };
  }

  const ultimaCarga = historial[0].cargaKg;
  const rirPromedio = historial.reduce((sum, r) => sum + r.rirReportado, 0) / historial.length;

  if (historial.length >= 2 && rirPromedio >= 3) {
    return {
      cargaSugeridaKg: Math.round((ultimaCarga + 2.5) * 2) / 2,
      cargaUltimaVezKg: ultimaCarga,
      motivo: `Las últimas ${historial.length} veces te sobró margen (RIR promedio ${rirPromedio.toFixed(1)}) — te sugerimos subir un poco.`,
    };
  }

  return {
    cargaSugeridaKg: ultimaCarga,
    cargaUltimaVezKg: ultimaCarga,
    motivo: "Mantené la misma carga que la última vez.",
  };
}

export interface SugerenciaProgresionCalistenia {
  siguienteEjercicioId: string;
  motivo: string;
}

/**
 * Escalera de progresión sin carga externa (sección 10.2 del marco teórico):
 * si el ejercicio es de peso corporal y el historial reciente muestra RIR
 * consistentemente alto (le sobra margen — no hay forma de "subir el peso"
 * en calistenia), y existe un escalón siguiente definido para ese ejercicio,
 * lo sugerimos en vez de simplemente repetir el mismo movimiento para
 * siempre.
 */
export async function obtenerSugerenciaProgresionCalistenia(
  usuarioId: string,
  ejercicio: { id: string; equipamientoRequerido: string[]; escaleraSiguienteId?: string | null }
): Promise<SugerenciaProgresionCalistenia | null> {
  if (!ejercicio.escaleraSiguienteId) return null;
  if (!ejercicio.equipamientoRequerido.every((eq) => eq === "ninguno")) return null;

  const historial = await obtenerHistorialEjercicio(usuarioId, ejercicio.id, 3);
  if (historial.length < 2) return null;

  const rirPromedio = historial.reduce((sum, r) => sum + r.rirReportado, 0) / historial.length;
  if (rirPromedio < 3) return null;

  return {
    siguienteEjercicioId: ejercicio.escaleraSiguienteId,
    motivo: `Las últimas ${historial.length} veces te sobró margen (RIR promedio ${rirPromedio.toFixed(1)}). Como es un ejercicio de peso corporal, no hay carga que subir — te sugerimos pasar a una variante más exigente.`,
  };
}
