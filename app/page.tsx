import { redirect } from "next/navigation";
import { obtenerPerfilUsuario } from "@/lib/store-usuario";

export const dynamic = "force-dynamic";

export default async function Home() {
  const perfil = await obtenerPerfilUsuario();
  const yaTieneNombre = !!perfil.nombre;

  if (!yaTieneNombre) redirect("/onboarding");
  redirect(perfil.condicionesEspeciales.includes("tercera_edad") ? "/accesible" : "/dashboard");
}
