import { readFile, writeFile, mkdir } from "node:fs/promises";
import path from "node:path";
import type { PerfilUsuario } from "./types";

const ARCHIVO = path.join(process.cwd(), "data", "usuario-demo.json");

const PERFIL_POR_DEFECTO: PerfilUsuario = {
  id: "demo",
  experiencia: "intermedio",
  objetivoPrincipal: "salud_general",
  diasPorSemana: 3,
  equipamientoDisponible: ["barra", "mancuernas", "maquina", "polea", "kettlebell", "barra_ez"],
  condicionesEspeciales: [],
  historialLesiones: [],
  alteracionesPosturales: [],
  franjaEtaria: "adulto",
  consentimientoAdultoConfirmado: true,
  estadoGestacional: "no_aplica",
  autorizacionMedicaConfirmada: true,
};

/**
 * NOTA: guarda en un JSON en disco porque este sandbox no puede compilar el
 * engine de Prisma (ver README). En tu máquina, reemplazar el cuerpo de estas
 * dos funciones por `prisma.usuario.upsert(...)` / `prisma.usuario.findUnique(...)`
 * — la firma no cambia.
 */
export async function obtenerPerfilUsuario(): Promise<PerfilUsuario> {
  try {
    const raw = await readFile(ARCHIVO, "utf-8");
    return { ...PERFIL_POR_DEFECTO, ...JSON.parse(raw) };
  } catch {
    return PERFIL_POR_DEFECTO;
  }
}

export async function guardarPerfilUsuario(
  datos: Partial<PerfilUsuario>
): Promise<PerfilUsuario> {
  const actual = await obtenerPerfilUsuario();
  const actualizado = { ...actual, ...datos, id: "demo" };
  await mkdir(path.dirname(ARCHIVO), { recursive: true });
  await writeFile(ARCHIVO, JSON.stringify(actualizado, null, 2), "utf-8");
  return actualizado;
}
