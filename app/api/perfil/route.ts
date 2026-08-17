import { NextResponse } from "next/server";
import { obtenerPerfilUsuario, guardarPerfilUsuario } from "@/lib/store-usuario";
import { invalidarRutinaCacheada } from "@/lib/store-rutina-cache";
import { obtenerDiaActual, tipoSplitPorDias, totalDiasDelCiclo } from "@/lib/store-estado-rutina";
import { haySesionEnProgreso, limpiarSesionActiva } from "@/lib/store-sesion-activa";

export async function GET() {
  const perfil = await obtenerPerfilUsuario();
  return NextResponse.json(perfil);
}

export async function POST(request: Request) {
  const perfilAnterior = await obtenerPerfilUsuario();
  const { forzarAhora, ...datosPerfil } = await request.json();
  const perfil = await guardarPerfilUsuario(datosPerfil);

  const totalDias = totalDiasDelCiclo(tipoSplitPorDias(perfilAnterior.diasPorSemana ?? 3));
  const { diaIndice: diaIndiceCrudo } = await obtenerDiaActual(perfil.id);
  const diaIndice = diaIndiceCrudo % totalDias;

  const enProgreso = (await haySesionEnProgreso(perfil.id, diaIndice)) && !forzarAhora;

  if (enProgreso) {
    // Ya completaste alguna serie de la sesión de hoy — no la tocamos todavía.
    // Le devolvemos al cliente que hay una decisión pendiente, sin aplicar
    // nada hasta que el usuario elija explícitamente.
    return NextResponse.json({ ...perfil, cambioAplicadoAhora: false, requiereConfirmacion: true });
  }

  if (forzarAhora) {
    // El usuario eligió descartar el progreso de hoy y empezar de cero.
    await limpiarSesionActiva(perfil.id);
  }
  await invalidarRutinaCacheada(perfil.id);
  return NextResponse.json({ ...perfil, cambioAplicadoAhora: true, requiereConfirmacion: false });
}
