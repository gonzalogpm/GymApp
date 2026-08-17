import Link from "next/link";
import { BarraNavegacion } from "@/components/BarraNavegacion";
import { ESTILO_BOTON_PRINCIPAL } from "@/components/Botones";
import { generarRutina } from "@/lib/generador";
import { obtenerPerfilUsuario } from "@/lib/store-usuario";
import { InfoFaseMesociclo } from "@/components/InfoFaseMesociclo";

const MOTIVO_BLOQUEO_TOTAL: Record<string, string> = {
  "R-027": "Marcaste que estás embarazada, pero todavía no confirmaste tener autorización médica para entrenar. Por seguridad, no generamos rutinas de fuerza hasta que la confirmes en tu perfil.",
  "R-021": "Marcaste escoliosis en tus alteraciones posturales, pero todavía no confirmaste una evaluación profesional reciente. Por seguridad, no generamos ejercicios correctivos específicos hasta que la confirmes en tu perfil.",
  "R-026": "Tu perfil está marcado como menor de edad sin confirmación de consentimiento de un adulto responsable. No podemos generar rutinas de fuerza hasta que se confirme.",
};

function MensajeSinEjercicios({
  sustituciones,
}: {
  sustituciones: { reglaId: string }[];
}) {
  const reglaBloqueante = sustituciones.find((s) => MOTIVO_BLOQUEO_TOTAL[s.reglaId]);

  if (reglaBloqueante) {
    return (
      <div className="rounded-xl border border-terracota/40 bg-terracota/5 p-4">
        <p className="text-sm text-tinta/80">{MOTIVO_BLOQUEO_TOTAL[reglaBloqueante.reglaId]}</p>
        <Link href="/perfil" className={`${ESTILO_BOTON_PRINCIPAL} mt-4`}>
          Ir a mi perfil
        </Link>
      </div>
    );
  }

  return (
    <p className="text-sm text-tinta/60">
      No encontramos ejercicios disponibles con tu equipamiento y nivel actuales.
    </p>
  );
}

export const dynamic = "force-dynamic";

export default async function DashboardPage() {
  const usuario = await obtenerPerfilUsuario();
  const rutina = await generarRutina(usuario);

  return (
    <div className="flex min-h-dvh flex-col">
      <header className="px-5 pt-6 pb-2">
        {usuario.nombre && <p className="text-sm text-tinta/60">Hola, {usuario.nombre}</p>}
        <h1 className="font-serif-editorial text-2xl font-semibold leading-tight">
          {rutina.nombre}
        </h1>
        <p className="mt-1 text-sm text-tinta/70 capitalize">
          {rutina.fecha} · Día {rutina.diaDelCiclo.indice + 1} de {rutina.diaDelCiclo.total} del ciclo
        </p>
        <div className="mt-0.5 flex items-center text-xs text-terracota">
          Semana {rutina.mesociclo.semana}/{rutina.mesociclo.duracionSemanas} del mesociclo — {rutina.mesociclo.etiquetaFase}
          <InfoFaseMesociclo
            usuarioId={usuario.id}
            semana={rutina.mesociclo.semana}
            explicacion={rutina.mesociclo.explicacion}
            mostrarAutomaticamente={rutina.mesociclo.mostrarIntroAutomatica}
            esMesocicloNuevo={rutina.mesociclo.semana === 1 && !usuario.condicionesEspeciales.includes("tercera_edad")}
          />
        </div>

        {!usuario.condicionesEspeciales.includes("tercera_edad") && (
          <Link
            href="/test-fuerza"
            className="mt-2 inline-block text-xs font-medium text-tinta/60 underline underline-offset-4"
          >
            Hacer test de fuerza
          </Link>
        )}
      </header>

      <main className="flex-1 px-5 pt-4">
        {rutina.moduloDeportivo && (
          <div className="mb-4 rounded-xl border border-pino/20 bg-white/40 p-4">
            <p className="text-sm font-semibold text-pino">
              Complementá con — {rutina.moduloDeportivo.nombre}
            </p>
            <p className="mt-2 text-xs font-medium text-tinta/70">Cardio específico</p>
            <p className="text-sm text-tinta/80">{rutina.moduloDeportivo.cardioEspecifico}</p>
            <p className="mt-2 text-xs font-medium text-tinta/70">Prevención</p>
            <p className="text-sm text-tinta/80">{rutina.moduloDeportivo.prevencion}</p>
          </div>
        )}
        {rutina.ejercicios.length === 0 ? (
          <MensajeSinEjercicios sustituciones={rutina.auditoria.sustituciones} />
        ) : (
          <ul className="divide-y divide-tinta/10 rounded-2xl border border-tinta/10 bg-white/40">
            {rutina.ejercicios.map((ej, i) => (
              <li key={ej.id} className={ej.paraLesion ? "bg-pino/5" : undefined}>
                <Link
                  href={`/ejercicio/${ej.id}`}
                  className="flex items-center gap-4 px-4 py-4"
                >
                  <span className="flex h-14 w-14 shrink-0 items-center justify-center rounded-xl bg-fondo border border-tinta/10 text-xs text-tinta/40">
                    {i + 1}
                  </span>
                  <span className="flex-1">
                    <span className="block font-sans-calida text-base font-semibold text-tinta">
                      {ej.nombre}
                    </span>
                    <span className="block text-sm text-tinta/60">
                      {ej.series} series x {ej.reps} {ej.esIsometrico ? "" : "repeticiones"}
                    </span>
                    {ej.paraLesion && (
                      <span className="mt-1 inline-block rounded-full bg-pino px-2 py-0.5 text-xs font-semibold text-fondo">
                        Para tratar tu lesión
                      </span>
                    )}
                  </span>
                </Link>
              </li>
            ))}
          </ul>
        )}

        {rutina.auditoria.alertas.length > 0 && (
          <p className="mt-4 text-xs text-terracota">
            Esta rutina tiene {rutina.auditoria.alertas.length} alerta(s) del motor de reglas —
            revisalas antes de guardar en el auditor.
          </p>
        )}
      </main>

      <div className="flex flex-col gap-2 px-5 pb-4 pt-6">
        {rutina.ejercicios[0] && (
          <Link href={`/ejercicio/${rutina.ejercicios[0].id}`} className={ESTILO_BOTON_PRINCIPAL}>
            Comenzar sesión
          </Link>
        )}
        <Link
          href="/rutinas/auditor"
          className="text-center text-sm font-medium text-tinta/60 underline underline-offset-4"
        >
          Ver auditor de esta rutina
        </Link>
      </div>

      <BarraNavegacion />
    </div>
  );
}
