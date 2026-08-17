import { NextResponse } from "next/server";
import { marcarIntroSemanaMostrada } from "@/lib/store-estado-rutina";

export async function POST(request: Request) {
  const { usuarioId, semana } = await request.json();
  await marcarIntroSemanaMostrada(usuarioId, semana);
  return NextResponse.json({ ok: true });
}
