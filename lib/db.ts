import ejerciciosSeed from "@/data/ejercicios-seed.json";

export interface EjercicioDB {
  id: string;
  nombreEs: string;
  nombreEn: string;
  patronMovimiento: string;
  grupoMuscularAgonista: string;
  grupoMuscularAntagonista: string;
  musculosSecundarios?: string[];
  tipo: "multiarticular" | "monoarticular";
  equipamientoRequerido: string[];
  nivelDificultad: "principiante" | "intermedio" | "avanzado";
  instruccionesEs: string;
  tagsAdicionales: string[];
  objetivoCorrectivo?: string[];
  videoUrl?: string | null;
  escaleraAnteriorId?: string | null;
  escaleraSiguienteId?: string | null;
  fuente?: "free_exercise_db" | "conocimiento_general";
}

/**
 * NOTA: hoy lee de data/ejercicios-seed.json (generado a partir de free-exercise-db).
 * Cuando corras `npx prisma migrate dev` en tu máquina (acá el sandbox bloquea la
 * descarga del engine de Prisma), reemplazar el cuerpo de estas funciones por
 * `prisma.ejercicio.findMany()` / `findUnique()` — la firma no cambia, así que
 * las pantallas que consumen esto no necesitan tocarse.
 */
export async function listarEjercicios(): Promise<EjercicioDB[]> {
  return ejerciciosSeed as EjercicioDB[];
}

export async function obtenerEjercicio(id: string): Promise<EjercicioDB | undefined> {
  return (ejerciciosSeed as EjercicioDB[]).find((e) => e.id === id);
}
