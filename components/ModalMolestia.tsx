"use client";

import { useState } from "react";
import { evaluarReglas } from "@/lib/motor-reglas";
import type { ContextoEvaluacion, PerfilUsuario } from "@/lib/types";
import { BotonPrincipal, BotonSecundarioTexto } from "./Botones";

type TipoMolestia = "fatiga_muscular_normal" | "molestia_articular" | "dolor_agudo_punzante";

export function ModalMolestia({
  ejercicioId,
  usuario,
  onCerrar,
}: {
  ejercicioId: string;
  usuario: PerfilUsuario;
  onCerrar: () => void;
}) {
  const [tipo, setTipo] = useState<TipoMolestia>("fatiga_muscular_normal");
  const [intensidad, setIntensidad] = useState(3);
  const [countEnMesociclo, setCountEnMesociclo] = useState(1);
  const [resultado, setResultado] = useState<ReturnType<typeof evaluarReglas> | null>(null);

  function evaluar() {
    const contexto: ContextoEvaluacion = {
      usuario,
      ejercicio: {
        id: ejercicioId,
        patronMovimiento: "generico",
        equipamientoRequerido: [],
        nivelDificultad: "intermedio",
        contraindicaciones: [],
        tagsAdicionales: [],
      },
      parametros: {},
      reporteMolestia: {
        ejercicioId,
        tipo,
        zonaCorporal: "no_especificada",
        intensidad,
        countEnMesociclo,
      },
    };
    setResultado(evaluarReglas(contexto));
  }

  return (
    <div className="fixed inset-0 z-20 flex items-end justify-center bg-tinta/50 sm:items-center">
      <div className="w-full max-w-sm rounded-t-3xl sm:rounded-3xl bg-fondo p-6 pb-[max(1.5rem,env(safe-area-inset-bottom))]">
        {!resultado ? (
          <>
            <h3 className="font-serif-editorial text-lg font-semibold">
              ¿Qué sentiste en este ejercicio?
            </h3>

            <div className="mt-4 flex flex-col gap-2">
              <OpcionTipo
                valor="fatiga_muscular_normal"
                etiqueta="Ardor muscular normal"
                seleccionado={tipo === "fatiga_muscular_normal"}
                onSelect={setTipo}
              />
              <OpcionTipo
                valor="molestia_articular"
                etiqueta="Molestia en la articulación"
                seleccionado={tipo === "molestia_articular"}
                onSelect={setTipo}
              />
              <OpcionTipo
                valor="dolor_agudo_punzante"
                etiqueta="Dolor agudo o punzante"
                seleccionado={tipo === "dolor_agudo_punzante"}
                onSelect={setTipo}
              />
            </div>

            {tipo !== "fatiga_muscular_normal" && (
              <div className="mt-4">
                <label className="text-sm text-tinta/70">Intensidad (1-10)</label>
                <input
                  type="range"
                  min={1}
                  max={10}
                  value={intensidad}
                  onChange={(e) => setIntensidad(Number(e.target.value))}
                  className="mt-1 w-full accent-terracota"
                />
                <span className="text-sm font-semibold">{intensidad}/10</span>
              </div>
            )}

            {tipo === "molestia_articular" && (
              <div className="mt-3">
                <label className="text-sm text-tinta/70">
                  ¿Cuántas veces pasó ya este mesociclo?
                </label>
                <input
                  type="number"
                  min={1}
                  value={countEnMesociclo}
                  onChange={(e) => setCountEnMesociclo(Number(e.target.value))}
                  className="mt-1 w-20 rounded-lg border border-tinta/20 px-2 py-1"
                />
              </div>
            )}

            <div className="mt-6 flex flex-col gap-2">
              <BotonPrincipal onClick={evaluar}>Enviar reporte</BotonPrincipal>
              <BotonSecundarioTexto onClick={onCerrar}>Cancelar</BotonSecundarioTexto>
            </div>
          </>
        ) : (
          <ResultadoEvaluacion resultado={resultado} onCerrar={onCerrar} />
        )}
      </div>
    </div>
  );
}

function OpcionTipo({
  valor,
  etiqueta,
  seleccionado,
  onSelect,
}: {
  valor: TipoMolestia;
  etiqueta: string;
  seleccionado: boolean;
  onSelect: (v: TipoMolestia) => void;
}) {
  return (
    <button
      onClick={() => onSelect(valor)}
      className={`rounded-xl border px-4 py-3 text-left text-sm font-medium ${
        seleccionado ? "border-terracota bg-terracota/10" : "border-tinta/15"
      }`}
    >
      {etiqueta}
    </button>
  );
}

function ResultadoEvaluacion({
  resultado,
  onCerrar,
}: {
  resultado: ReturnType<typeof evaluarReglas>;
  onCerrar: () => void;
}) {
  const sinAccion =
    resultado.length === 0 ||
    (resultado.length === 1 && resultado[0].accionTipo === "sin_accion");

  if (sinAccion) {
    return (
      <div>
        <h3 className="font-serif-editorial text-lg font-semibold">Gracias, quedó registrado</h3>
        <p className="mt-2 text-sm text-tinta/70">
          Es fatiga muscular esperable. No se generó ninguna alerta — seguí con tu sesión.
        </p>
        <BotonPrincipal className="mt-6" onClick={onCerrar}>
          Entendido
        </BotonPrincipal>
      </div>
    );
  }

  const principal = resultado[0];
  const esBloqueo = principal.accionTipo.startsWith("bloqueo");

  return (
    <div>
      <h3 className="font-serif-editorial text-lg font-semibold">
        {esBloqueo ? "Este ejercicio queda en observación" : "Quedó registrado, con una alerta"}
      </h3>
      <p className="mt-2 text-sm text-tinta/70">
        Regla disparada: <strong>{principal.id}</strong> ({principal.categoria}) — sección{" "}
        {principal.seccionReferencia}.
        {esBloqueo &&
          " Te sugerimos consultar a un profesional si la molestia se repite, y mientras tanto te proponemos un ejercicio alternativo."}
      </p>
      <BotonPrincipal className="mt-6" onClick={onCerrar}>
        {esBloqueo ? "Ver alternativa" : "Entendido"}
      </BotonPrincipal>
    </div>
  );
}
