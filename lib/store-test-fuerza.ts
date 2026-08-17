import { readFile, writeFile, mkdir } from "node:fs/promises";
import path from "node:path";

const ARCHIVO = path.join(process.cwd(), "data", "tests-fuerza.json");

export interface TestFuerza {
  usuarioId: string;
  ejercicioId: string;
  fecha: string;
  pesoKg: number;
  repsRealizadas: number;
  valor1RMEstimado: number;
  formula: "epley";
}

async function leerTodos(): Promise<TestFuerza[]> {
  try {
    return JSON.parse(await readFile(ARCHIVO, "utf-8"));
  } catch {
    return [];
  }
}

/** Fórmula de Epley: 1RM = peso × (1 + reps/30). Válida para series de hasta ~10-12 reps cercanas al fallo. */
function estimar1RMEpley(pesoKg: number, reps: number): number {
  return Math.round(pesoKg * (1 + reps / 30) * 10) / 10;
}

export async function registrarTestFuerza(
  usuarioId: string,
  ejercicioId: string,
  pesoKg: number,
  repsRealizadas: number
): Promise<TestFuerza> {
  const todos = await leerTodos();
  const test: TestFuerza = {
    usuarioId,
    ejercicioId,
    fecha: new Date().toISOString(),
    pesoKg,
    repsRealizadas,
    valor1RMEstimado: estimar1RMEpley(pesoKg, repsRealizadas),
    formula: "epley",
  };
  todos.push(test);
  await mkdir(path.dirname(ARCHIVO), { recursive: true });
  await writeFile(ARCHIVO, JSON.stringify(todos, null, 2), "utf-8");
  return test;
}

export async function obtenerUltimoTest(usuarioId: string, ejercicioId: string): Promise<TestFuerza | null> {
  const todos = await leerTodos();
  const propios = todos
    .filter((t) => t.usuarioId === usuarioId && t.ejercicioId === ejercicioId)
    .sort((a, b) => new Date(b.fecha).getTime() - new Date(a.fecha).getTime());
  return propios[0] ?? null;
}

export async function obtenerHistorialTests(usuarioId: string, limite = 20): Promise<TestFuerza[]> {
  const todos = await leerTodos();
  return todos
    .filter((t) => t.usuarioId === usuarioId)
    .sort((a, b) => new Date(b.fecha).getTime() - new Date(a.fecha).getTime())
    .slice(0, limite);
}

export async function haceCuantosDiasElUltimoTest(usuarioId: string, ejercicioId: string): Promise<number | null> {
  const ultimo = await obtenerUltimoTest(usuarioId, ejercicioId);
  if (!ultimo) return null;
  return Math.floor((Date.now() - new Date(ultimo.fecha).getTime()) / (1000 * 60 * 60 * 24));
}
