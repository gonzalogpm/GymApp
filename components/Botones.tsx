import type { ButtonHTMLAttributes } from "react";

export const ESTILO_BOTON_PRINCIPAL =
  "block w-full rounded-2xl bg-terracota px-6 py-4 text-center font-sans-calida text-base font-semibold text-fondo transition active:scale-[0.98] active:bg-terracota-suave";

export const ESTILO_BOTON_SECUNDARIO_TEXTO =
  "text-sm font-medium text-tinta/70 underline decoration-tinta/30 underline-offset-4";

export function BotonPrincipal({
  className = "",
  ...props
}: ButtonHTMLAttributes<HTMLButtonElement>) {
  return <button className={`${ESTILO_BOTON_PRINCIPAL} ${className}`} {...props} />;
}

export function BotonSecundarioTexto({
  className = "",
  ...props
}: ButtonHTMLAttributes<HTMLButtonElement>) {
  return <button className={`${ESTILO_BOTON_SECUNDARIO_TEXTO} ${className}`} {...props} />;
}
