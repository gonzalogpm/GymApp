"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { BotonPrincipal, BotonSecundarioTexto } from "./Botones";

type Paso = null | "fase" | "test";

export function InfoFaseMesociclo({
  usuarioId,
  semana,
  explicacion,
  mostrarAutomaticamente,
  esMesocicloNuevo,
}: {
  usuarioId: string;
  semana: number;
  explicacion: { titulo: string; comoTrabajamos: string; porque: string };
  mostrarAutomaticamente: boolean;
  esMesocicloNuevo: boolean;
}) {
  const [paso, setPaso] = useState<Paso>(null);
  const [fueAutomatico, setFueAutomatico] = useState(false);
  const router = useRouter();

  useEffect(() => {
    if (mostrarAutomaticamente) {
      setPaso("fase");
      setFueAutomatico(true);
      fetch("/api/mesociclo-visto", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ usuarioId, semana }),
      }).then(() => router.refresh());
    }
    // Solo debe correr una vez al montar esta semana, no en cada re-render.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  function cerrarExplicacionFase() {
    // Si además es el inicio de un mesociclo nuevo Y este modal se abrió solo
    // (no porque el usuario tocó el botón "i" manualmente), encadenamos el
    // aviso del test de fuerza — nunca los dos modales abiertos a la vez, y
    // nunca se lo repetimos si ya lo estaba reabriendo por curiosidad.
    setPaso(esMesocicloNuevo && fueAutomatico ? "test" : null);
  }

  return (
    <>
      <button
        onClick={() => setPaso("fase")}
        aria-label="Por qué trabajamos así esta semana"
        className="ml-2 inline-flex h-5 w-5 shrink-0 items-center justify-center rounded-full border border-terracota text-[11px] font-bold text-terracota"
      >
        i
      </button>

      {paso === "fase" && (
        <div className="fixed inset-0 z-20 flex items-end justify-center bg-tinta/50 sm:items-center">
          <div className="w-full max-w-sm rounded-t-3xl sm:rounded-3xl bg-fondo p-6 pb-[max(1.5rem,env(safe-area-inset-bottom))]">
            <h3 className="font-serif-editorial text-lg font-semibold">{explicacion.titulo}</h3>
            <p className="mt-3 text-sm font-medium text-tinta/70">Cómo trabajamos esta semana</p>
            <p className="mt-1 text-sm text-tinta/80">{explicacion.comoTrabajamos}</p>
            <p className="mt-4 text-sm font-medium text-tinta/70">Por qué lo hacemos así</p>
            <p className="mt-1 text-sm text-tinta/80">{explicacion.porque}</p>
            <BotonPrincipal className="mt-6" onClick={cerrarExplicacionFase}>
              Entendido
            </BotonPrincipal>
          </div>
        </div>
      )}

      {paso === "test" && (
        <div className="fixed inset-0 z-20 flex items-end justify-center bg-tinta/50 sm:items-center">
          <div className="w-full max-w-sm rounded-t-3xl sm:rounded-3xl bg-fondo p-6 pb-[max(1.5rem,env(safe-area-inset-bottom))]">
            <h3 className="font-serif-editorial text-lg font-semibold">Test de fuerza periódico</h3>

            <p className="mt-3 text-sm font-medium text-tinta/70">En qué consiste</p>
            <p className="mt-1 text-sm text-tinta/80">
              Elegís un ejercicio básico, hacés una sola serie cercana al fallo técnico (entre 1 y
              10 repeticiones) con una carga exigente, y cargás el resultado. No hace falta que
              busques tu máximo real — con esa serie estimamos tu 1RM con la fórmula de Epley.
            </p>

            <p className="mt-4 text-sm font-medium text-tinta/70">Por qué lo hacemos</p>
            <p className="mt-1 text-sm text-tinta/80">
              Arrancás un mesociclo nuevo — tu fuerza probablemente cambió desde el último test.
              Repetirlo ahora nos permite recalcular tus porcentajes de carga con un dato real y
              actualizado, en vez de asumir que seguís igual que hace 4 semanas.
            </p>

            <p className="mt-4 text-xs text-tinta/50">
              Es opcional — si no querés hacerlo ahora, la app sigue usando tu progresión habitual
              basada en RIR reportado.
            </p>

            <div className="mt-6 flex flex-col gap-2">
              <BotonPrincipal onClick={() => router.push("/test-fuerza")}>
                Iniciar test ahora
              </BotonPrincipal>
              <BotonSecundarioTexto onClick={() => setPaso(null)}>Ahora no</BotonSecundarioTexto>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
