import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Sin esto, el navegador reutiliza una versión en caché de las páginas
  // dinámicas (dashboard, detalle de ejercicio) cuando volvés atrás, incluso
  // si los datos cambiaron mientras tanto (nuevo test de fuerza, perfil
  // actualizado, etc.). staleTimes.dynamic=0 fuerza a pedir datos frescos
  // siempre, en vez de tener que parchar cada pantalla una por una.
  experimental: {
    staleTimes: {
      dynamic: 0,
    },
  },
};

export default nextConfig;
