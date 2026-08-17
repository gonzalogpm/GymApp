import { readFile, writeFile, mkdir } from "node:fs/promises";
import path from "node:path";
import metodosData from "@/data/metodos.json";
import type { MetodoIntensificacion, PerfilUsuario } from "./types";

const ARCHIVO = path.join(process.cwd(), "data", "metodos-aplicados.json");

interface RegistroMetodo {
  usuarioId: string;
  metodoId: string;
  fecha: string;
}

async function leerTodos(): Promise<RegistroMetodo[]> {
  try {
    return JSON.parse(await readFile(ARCHIVO, "utf-8"));
  } catch {
    return [];
  }
}

async function registrarUso(usuarioId: string, metodoId: string): Promise<void> {
  const todos = await leerTodos();
  todos.push({ usuarioId, metodoId, fecha: new Date().toISOString() });
  await mkdir(path.dirname(ARCHIVO), { recursive: true });
  await writeFile(ARCHIVO, JSON.stringify(todos, null, 2), "utf-8");
}

async function usosEstaSemana(usuarioId: string, metodoId: string): Promise<number> {
  const todos = await leerTodos();
  const haceUnaSemana = Date.now() - 7 * 24 * 60 * 60 * 1000;
  return todos.filter(
    (r) => r.usuarioId === usuarioId && r.metodoId === metodoId && new Date(r.fecha).getTime() >= haceUnaSemana
  ).length;
}

export function listarMetodos(): MetodoIntensificacion[] {
  return metodosData as MetodoIntensificacion[];
}

const NIVEL_RANGO: Record<string, number> = { principiante: 1, intermedio: 2, avanzado: 3 };

/**
 * Elige un método aplicable para este usuario, respetando su nivel mínimo y
 * la frecuencia máxima semanal ya usada (sección 5.2 del marco teórico). No
 * se aplica a niños/adolescentes (R-024 del motor de reglas ya lo bloquearía,
 * pero acá lo filtramos antes para no gastar el llamado a la regla).
 */
export async function elegirMetodoAplicable(perfil: PerfilUsuario): Promise<MetodoIntensificacion | null> {
  if (perfil.franjaEtaria !== "adulto") return null;
  if (perfil.condicionesEspeciales.includes("tercera_edad")) return null;
  if (perfil.estadoGestacional !== "no_aplica") return null;

  for (const metodo of listarMetodos()) {
    if (NIVEL_RANGO[perfil.experiencia] < NIVEL_RANGO[metodo.nivelMinimo]) continue;
    const usos = await usosEstaSemana(perfil.id, metodo.id);
    if (usos < metodo.frecuenciaMaximaSemanal) {
      return metodo;
    }
  }
  return null;
}

export { registrarUso as registrarUsoMetodo };
