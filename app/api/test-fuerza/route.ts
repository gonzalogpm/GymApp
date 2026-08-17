import { NextResponse } from "next/server";
import { registrarTestFuerza, obtenerUltimoTest, obtenerHistorialTests } from "@/lib/store-test-fuerza";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const usuarioId = searchParams.get("usuarioId")!;
  const ejercicioId = searchParams.get("ejercicioId");
  const historial = searchParams.get("historial");

  if (historial === "1") {
    return NextResponse.json({ historial: await obtenerHistorialTests(usuarioId) });
  }

  const ultimo = await obtenerUltimoTest(usuarioId, ejercicioId!);
  return NextResponse.json({ ultimo });
}

export async function POST(request: Request) {
  const { usuarioId, ejercicioId, pesoKg, repsRealizadas } = await request.json();
  const test = await registrarTestFuerza(usuarioId, ejercicioId, Number(pesoKg), Number(repsRealizadas));
  return NextResponse.json(test);
}
