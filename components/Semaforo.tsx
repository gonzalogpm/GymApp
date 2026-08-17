export type EstadoSemaforo = "verde" | "amarillo" | "rojo";

const COLOR: Record<EstadoSemaforo, string> = {
  verde: "bg-semaforo-verde",
  amarillo: "bg-semaforo-amarillo",
  rojo: "bg-semaforo-rojo",
};

const ETIQUETA: Record<EstadoSemaforo, string> = {
  verde: "Sin reportes",
  amarillo: "Con molestia reportada",
  rojo: "En observación",
};

export function Semaforo({ estado, className = "" }: { estado: EstadoSemaforo; className?: string }) {
  return (
    <span
      role="img"
      aria-label={ETIQUETA[estado]}
      title={ETIQUETA[estado]}
      className={`inline-block h-3.5 w-3.5 rounded-full ${COLOR[estado]} ${className}`}
    />
  );
}
