import { NextResponse } from "next/server";
import { avanzarDia, tipoSplitPorDias, totalDiasDelCiclo } from "@/lib/store-estado-rutina";
import { limpiarSesionActiva } from "@/lib/store-sesion-activa";

export async function POST(request: Request) {
  const { usuarioId, diasPorSemana } = await request.json();
  const total = totalDiasDelCiclo(tipoSplitPorDias(diasPorSemana ?? 3));
  await avanzarDia(usuarioId, total, diasPorSemana ?? 3);
  await limpiarSesionActiva(usuarioId);
  return NextResponse.json({ ok: true });
}
