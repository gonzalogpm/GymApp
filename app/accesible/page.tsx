import Link from "next/link";
import { BarraNavegacion } from "@/components/BarraNavegacion";
import { generarRutina } from "@/lib/generador";
import { obtenerPerfilUsuario } from "@/lib/store-usuario";

export const dynamic = "force-dynamic";

export default async function DashboardAccesiblePage() {
  const usuario = await obtenerPerfilUsuario();
  const rutina = await generarRutina(usuario);
  // Máximo 3 ejercicios visibles a la vez, según sección 14.1 del marco teórico.
  const ejercicios = rutina.ejercicios.slice(0, 3);

  return (
    <div className="flex min-h-dvh flex-col">
      <header className="px-6 pt-8 pb-4">
        <h1 className="font-serif-editorial text-3xl font-semibold leading-tight">
          Hoy: {rutina.nombre}
        </h1>
        <Link href="/perfil" className="mt-2 inline-block text-base text-tinta/60 underline underline-offset-4">
          Editar mi perfil
        </Link>
      </header>

      <main className="flex-1 px-6">
        <ul className="flex flex-col gap-4">
          {ejercicios.map((ej) => (
            <li key={ej.id}>
              <Link
                href={`/ejercicio/${ej.id}`}
                className="flex items-center gap-4 rounded-2xl border-2 border-pino/30 bg-white/50 px-5 py-5"
              >
                <span className="flex-1">
                  <span className="block font-sans-calida text-xl font-semibold">
                    {ej.nombre}
                  </span>
                  <span className="mt-1 block text-lg text-tinta/70">
                    {ej.series} series x {ej.reps}
                  </span>
                </span>
              </Link>
            </li>
          ))}
        </ul>
      </main>

      <div className="px-6 pb-6 pt-4">
        <Link
          href={`/ejercicio/${ejercicios[0]?.id}`}
          className="block w-full rounded-2xl bg-terracota px-6 py-6 text-center font-sans-calida text-xl font-semibold text-fondo"
        >
          Comenzar
        </Link>
      </div>

      <BarraNavegacion inicioHref="/accesible" />
    </div>
  );
}
