import type { Metadata } from "next";
import { montserrat, bebas } from "@/styles/styles";
import { NextIntlClientProvider, hasLocale } from "next-intl";
import { notFound } from "next/navigation";
import { routing } from "@/i18n/routing";
import { getMessages } from "next-intl/server";
import "../../styles/globals.css";

export const metadata: Metadata = {
  title: "VITALFIT",
  description: "Administra tus reservas, entrenadores y sucursales de gimnasio",
};

type Props = {
  children: React.ReactNode;
  params: { locale: string };
};

export default async function RootLayout({ children, params }: Props) {
  const { locale } = await params;

  if (!hasLocale(routing.locales, locale)) {
    notFound();
  }

  const messages = await getMessages({ locale });
  const plainMessages = (messages as any)?.default ?? messages;
  const serializableMessages = JSON.parse(JSON.stringify(plainMessages));

  return (
    <html lang={locale} className={`${montserrat.variable} ${bebas.variable}`}>
      <body className="antialiased">
        <NextIntlClientProvider locale={locale} messages={serializableMessages}>
          {children}
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
