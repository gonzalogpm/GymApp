import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Anatómica Natural",
  description: "Tu guía para el movimiento saludable",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="es" className="h-full antialiased">
      <body className="min-h-full flex flex-col bg-fondo text-tinta">{children}</body>
    </html>
  );
}
