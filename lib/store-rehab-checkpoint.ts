import { readFile, writeFile, mkdir } from "node:fs/promises";
import path from "node:path";

const ARCHIVO = path.join(process.cwd(), "data", "rehab-checkpoints.json");

export interface RehabCheckpoint {
  usuarioId: string;
  lesion: string; // zona: hombro | rodilla | desgarro_muscular | lca_post_operatorio
  faseActual: number; // índice 0-3
  faseConfirmadaHasta: number; // -1 = ninguna fase confirmada todavía
  confirmadoPor: "profesional_vinculado" | null;
  fechaConfirmacion: string | null;
}

interface Almacen {
  [clave: string]: RehabCheckpoint; // clave = `${usuarioId}:${lesion}`
}

function clave(usuarioId: string, lesion: string) {
  return `${usuarioId}:${lesion}`;
}

async function leer(): Promise<Almacen> {
  try {
    return JSON.parse(await readFile(ARCHIVO, "utf-8"));
  } catch {
    return {};
  }
}

async function guardar(almacen: Almacen): Promise<void> {
  await mkdir(path.dirname(ARCHIVO), { recursive: true });
  await writeFile(ARCHIVO, JSON.stringify(almacen, null, 2), "utf-8");
}

/**
 * Devuelve el checkpoint de una lesión, creando uno nuevo (fase 0, sin nada
 * confirmado todavía) si es la primera vez que se consulta. La fase actual
 * nunca puede superar `faseConfirmadaHasta + 1` — es decir, siempre hace
 * falta la confirmación de la fase anterior para avanzar a la siguiente
 * (sección 12 / regla R-007 del motor).
 */
export async function obtenerCheckpoint(usuarioId: string, lesion: string): Promise<RehabCheckpoint> {
  const almacen = await leer();
  const existente = almacen[clave(usuarioId, lesion)];
  if (existente) return existente;

  const nuevo: RehabCheckpoint = {
    usuarioId,
    lesion,
    faseActual: 0,
    faseConfirmadaHasta: -1,
    confirmadoPor: null,
    fechaConfirmacion: null,
  };
  almacen[clave(usuarioId, lesion)] = nuevo;
  await guardar(almacen);
  return nuevo;
}

export async function confirmarFase(usuarioId: string, lesion: string, totalFases: number): Promise<RehabCheckpoint> {
  const almacen = await leer();
  const actual = (await obtenerCheckpoint(usuarioId, lesion));
  const nuevaFaseConfirmada = Math.min(actual.faseConfirmadaHasta + 1, totalFases - 1);

  const actualizado: RehabCheckpoint = {
    ...actual,
    faseConfirmadaHasta: nuevaFaseConfirmada,
    faseActual: Math.min(nuevaFaseConfirmada + 1, totalFases - 1),
    confirmadoPor: "profesional_vinculado",
    fechaConfirmacion: new Date().toISOString(),
  };
  almacen[clave(usuarioId, lesion)] = actualizado;
  await guardar(almacen);
  return actualizado;
}
