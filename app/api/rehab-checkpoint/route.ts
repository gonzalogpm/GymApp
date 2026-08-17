import { NextResponse } from "next/server";
import { obtenerCheckpoint, confirmarFase } from "@/lib/store-rehab-checkpoint";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const usuarioId = searchParams.get("usuarioId")!;
  const lesion = searchParams.get("lesion")!;
  const checkpoint = await obtenerCheckpoint(usuarioId, lesion);
  return NextResponse.json(checkpoint);
}

export async function POST(request: Request) {
  const { usuarioId, lesion, totalFases } = await request.json();
  const checkpoint = await confirmarFase(usuarioId, lesion, totalFases ?? 4);
  return NextResponse.json(checkpoint);
}
