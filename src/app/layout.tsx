import type { Metadata } from "next";
import { montserrat, bebas } from "@/styles/styles";

import "../styles/globals.css";
export const metadata: Metadata = {
  title: "VITALFIT",
  description: "Administra tus reservas, entrenadores y sucursales de gimnasio",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es" className={`${montserrat.variable} ${bebas.variable}`}>
      <body className="antialiased ">{children}</body>
    </html>
  );
}
