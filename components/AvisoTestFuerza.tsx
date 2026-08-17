"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { BotonPrincipal, BotonSecundarioTexto } from "./Botones";

export function AvisoTestFuerza() {
  const [abierto, setAbierto] = useState(false);
  const router = useRouter();

  return (
    <>
      <button
        onClick={() => setAbierto(true)}
        className="mt-3 block w-full rounded-lg border border-terracota/40 px-3 py-2 text-left text-xs font-medium text-terracota"
      >
        Arrancás un mesociclo nuevo — es un buen momento para tu test de fuerza periódico →
      </button>

      {abierto && (
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
              Al empezar un mesociclo nuevo, tu fuerza probablemente cambió desde el último test
              — repetirlo ahora nos permite recalcular tus porcentajes de carga con un dato real y
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
              <BotonSecundarioTexto onClick={() => setAbierto(false)}>Ahora no</BotonSecundarioTexto>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
