import { NextResponse } from "next/server";
import { registrarSerie } from "@/lib/store-registro-carga";

export async function POST(request: Request) {
  const body = await request.json();
  await registrarSerie({
    usuarioId: body.usuarioId,
    ejercicioId: body.ejercicioId,
    cargaKg: Number(body.cargaKg),
    repsRealizadas: Number(body.repsRealizadas),
    rirReportado: Number(body.rirReportado),
  });
  return NextResponse.json({ ok: true });
}
