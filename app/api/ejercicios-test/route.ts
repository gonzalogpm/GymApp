import { NextResponse } from "next/server";
import { obtenerEjerciciosTest } from "@/lib/generador";
import { obtenerPerfilUsuario } from "@/lib/store-usuario";

export async function GET() {
  const usuario = await obtenerPerfilUsuario();
  const ejercicios = await obtenerEjerciciosTest(usuario);
  return NextResponse.json({ ejercicios });
}
