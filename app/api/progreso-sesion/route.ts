import { NextResponse } from "next/server";
import { obtenerProgresoEjercicio, registrarSerieCompletada } from "@/lib/store-sesion-activa";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const usuarioId = searchParams.get("usuarioId")!;
  const diaIndice = Number(searchParams.get("diaIndice"));
  const ejercicioId = searchParams.get("ejercicioId")!;

  const seriesCompletadas = await obtenerProgresoEjercicio(usuarioId, diaIndice, ejercicioId);
  return NextResponse.json({ seriesCompletadas });
}

export async function POST(request: Request) {
  const { usuarioId, diaIndice, ejercicioId } = await request.json();
  const seriesCompletadas = await registrarSerieCompletada(usuarioId, diaIndice, ejercicioId);
  return NextResponse.json({ seriesCompletadas });
}
