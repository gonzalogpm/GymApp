import { notFound } from "next/navigation";
import { generarRutina } from "@/lib/generador";
import { obtenerPerfilUsuario } from "@/lib/store-usuario";
import {
  obtenerSugerenciaCarga,
  obtenerCargaSegunRM,
  obtenerSugerenciaProgresionCalistenia,
} from "@/lib/store-registro-carga";
import { obtenerEjercicio } from "@/lib/db";
import { EjercicioInteractivo } from "@/components/EjercicioInteractivo";

export const dynamic = "force-dynamic";

export default async function EjercicioPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const usuario = await obtenerPerfilUsuario();
  const rutina = await generarRutina(usuario);
  const indice = rutina.ejercicios.findIndex((e) => e.id === id);

  if (indice === -1) notFound();

  const ejercicio = rutina.ejercicios[indice];
  const siguiente = rutina.ejercicios[indice + 1];
  const sugerencia = await obtenerSugerenciaCarga(
    usuario.id,
    ejercicio.id,
    usuario.objetivoPrincipal,
    rutina.mesociclo.fase
  );
  const cargaSegunRM = await obtenerCargaSegunRM(
    usuario.id,
    ejercicio.id,
    usuario.objetivoPrincipal,
    rutina.mesociclo.fase
  );

  const sugerenciaCalistenia = await obtenerSugerenciaProgresionCalistenia(usuario.id, {
    id: ejercicio.id,
    equipamientoRequerido: ejercicio.equipamientoRequerido,
    escaleraSiguienteId: ejercicio.escaleraSiguienteId,
  });
  const siguienteEjercicioCalistenia = sugerenciaCalistenia
    ? await obtenerEjercicio(sugerenciaCalistenia.siguienteEjercicioId)
    : null;

  return (
    <EjercicioInteractivo
      ejercicio={ejercicio}
      indice={indice}
      total={rutina.ejercicios.length}
      siguienteId={siguiente?.id ?? null}
      usuario={usuario}
      sugerencia={sugerencia}
      cargaSegunRM={cargaSegunRM}
      diaIndice={rutina.diaDelCiclo.indice}
      sugerenciaCalistenia={
        sugerenciaCalistenia && siguienteEjercicioCalistenia
          ? { motivo: sugerenciaCalistenia.motivo, siguienteNombre: siguienteEjercicioCalistenia.nombreEs }
          : null
      }
    />
  );
}
