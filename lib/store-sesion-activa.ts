import { readFile, writeFile, mkdir } from "node:fs/promises";
import path from "node:path";

const ARCHIVO = path.join(process.cwd(), "data", "sesion-activa.json");

interface SesionActiva {
  [usuarioId: string]: {
    diaIndice: number;
    ejercicios: { [ejercicioId: string]: number }; // series completadas
  };
}

async function leer(): Promise<SesionActiva> {
  try {
    return JSON.parse(await readFile(ARCHIVO, "utf-8"));
  } catch {
    return {};
  }
}

async function guardar(estado: SesionActiva): Promise<void> {
  await mkdir(path.dirname(ARCHIVO), { recursive: true });
  await writeFile(ARCHIVO, JSON.stringify(estado, null, 2), "utf-8");
}

/**
 * Devuelve cuántas series de este ejercicio ya se completaron en la sesión de
 * hoy. Si el día del ciclo cambió desde el último registro (sesión distinta),
 * el progreso quedó viejo y se ignora — es una sesión nueva.
 */
export async function obtenerProgresoEjercicio(
  usuarioId: string,
  diaIndice: number,
  ejercicioId: string
): Promise<number> {
  const estado = await leer();
  const sesion = estado[usuarioId];
  if (!sesion || sesion.diaIndice !== diaIndice) return 0;
  return sesion.ejercicios[ejercicioId] ?? 0;
}

export async function registrarSerieCompletada(
  usuarioId: string,
  diaIndice: number,
  ejercicioId: string
): Promise<number> {
  const estado = await leer();
  if (!estado[usuarioId] || estado[usuarioId].diaIndice !== diaIndice) {
    estado[usuarioId] = { diaIndice, ejercicios: {} };
  }
  const actual = estado[usuarioId].ejercicios[ejercicioId] ?? 0;
  estado[usuarioId].ejercicios[ejercicioId] = actual + 1;
  await guardar(estado);
  return actual + 1;
}

export async function haySesionEnProgreso(usuarioId: string, diaIndice: number): Promise<boolean> {
  const estado = await leer();
  const sesion = estado[usuarioId];
  if (!sesion || sesion.diaIndice !== diaIndice) return false;
  return Object.values(sesion.ejercicios).some((series) => series > 0);
}

/** Se llama al terminar la sesión completa (avanzarDia) — limpia el progreso. */
export async function limpiarSesionActiva(usuarioId: string): Promise<void> {
  const estado = await leer();
  delete estado[usuarioId];
  await guardar(estado);
}
