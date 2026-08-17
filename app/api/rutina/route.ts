import { NextResponse } from "next/server";
import { generarRutina } from "@/lib/generador";
import { obtenerPerfilUsuario } from "@/lib/store-usuario";

export async function GET() {
  const usuario = await obtenerPerfilUsuario();
  const rutina = await generarRutina(usuario);
  return NextResponse.json(rutina);
}
