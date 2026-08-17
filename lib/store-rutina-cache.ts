import { readFile, writeFile, mkdir } from "node:fs/promises";
import path from "node:path";
import type { RutinaGenerada } from "./generador";

const ARCHIVO = path.join(process.cwd(), "data", "rutina-cache.json");

interface CacheRutina {
  [usuarioId: string]: {
    diaIndice: number;
    semanaMesociclo: number;
    rutina: RutinaGenerada;
  };
}

async function leer(): Promise<CacheRutina> {
  try {
    return JSON.parse(await readFile(ARCHIVO, "utf-8"));
  } catch {
    return {};
  }
}

async function guardar(cache: CacheRutina): Promise<void> {
  await mkdir(path.dirname(ARCHIVO), { recursive: true });
  await writeFile(ARCHIVO, JSON.stringify(cache, null, 2), "utf-8");
}

/**
 * Si ya generamos la rutina de este mismo día/semana para este usuario,
 * devolvemos exactamente esa (misma lista de ejercicios e ids) en vez de
 * recalcular — así el dashboard y el detalle de cada ejercicio nunca pueden
 * divergir entre sí durante el mismo día, sin importar qué cambie mientras
 * tanto (equipamiento, orden de datos, lo que sea).
 */
export async function obtenerRutinaCacheada(
  usuarioId: string,
  diaIndice: number,
  semanaMesociclo: number
): Promise<RutinaGenerada | null> {
  const cache = await leer();
  const entrada = cache[usuarioId];
  if (entrada && entrada.diaIndice === diaIndice && entrada.semanaMesociclo === semanaMesociclo) {
    return entrada.rutina;
  }
  return null;
}

export async function guardarRutinaCacheada(
  usuarioId: string,
  diaIndice: number,
  semanaMesociclo: number,
  rutina: RutinaGenerada
): Promise<void> {
  const cache = await leer();
  cache[usuarioId] = { diaIndice, semanaMesociclo, rutina };
  await guardar(cache);
}

/**
 * Invalida la rutina cacheada de hoy — se llama cuando el usuario cambia algo
 * que afecta directamente qué ejercicios le corresponden (equipamiento,
 * objetivo, alteraciones posturales, etc.) al guardar su perfil. La próxima
 * vez que pida la rutina, se recalcula desde cero con los datos nuevos.
 */
export async function invalidarRutinaCacheada(usuarioId: string): Promise<void> {
  const cache = await leer();
  delete cache[usuarioId];
  await guardar(cache);
}
