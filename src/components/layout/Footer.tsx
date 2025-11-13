"use client";
import Image from "next/image";
import { EnvelopeIcon, PhoneIcon, MapPinIcon } from "@heroicons/react/24/solid";
import { FaFacebookF, FaInstagram, FaTwitter } from "react-icons/fa";
import { useTranslations } from "next-intl";

export default function Footer() {
  const t = useTranslations("Footer");

  // Configuración para servicios
  const servicesConfig = [
    { key: "yoga" },
    { key: "crossfit" },
    { key: "spinning" },
    { key: "pilates" },
  ];

  // Configuración para enlaces rápidos
  const quickLinksConfig = [
    { key: "services", href: "#services" },
    { key: "membership", href: "#membership" },
    { key: "branches", href: "#branches" },
    { key: "contact", href: "#contact" },
  ];

  return (
    <footer className="bg-[#EDEDED] text-[#0A0A0A]">
      {/* Contenido principal */}
      <div className="max-w-7xl mx-auto px-6 md:px-10 py-12 grid grid-cols-1 md:grid-cols-4 gap-10 text-sm md:text-base">
        {/* Columna 1: Logo + lema + redes */}
        <div className="flex flex-col items-start space-y-4">
          <div className="flex items-center space-x-2">
            <Image
              src="/logo/logo-vitalfit-orange.png"
              alt="Logo VitalFit"
              width={250}
              height={250}
              className="object-contain"
            />
          </div>
          <p className="text-gray-700 font-bold leading-relaxed max-w-xs">
            {t("tagline")}
          </p>
          <div className="flex space-x-4 pt-2">
            <a
              href="https://instagram.com/vitalfit"
              target="_blank"
              className="text-[#0A0A0A] hover:text-[#F27F2A] transition-colors"
              aria-label={t("social.instagram")}
            >
              <FaInstagram className="w-5 h-5" />
            </a>
            <a
              href="https://x.com/vitalfit"
              target="_blank"
              className="text-[#0A0A0A] hover:text-[#F27F2A] transition-colors"
              aria-label={t("social.twitter")}
            >
              <FaTwitter className="w-5 h-5" />
            </a>
            <a
              href="https://facebook.com/vitalfit"
              target="_blank"
              className="text-[#0A0A0A] hover:text-[#F27F2A] transition-colors"
              aria-label={t("social.facebook")}
            >
              <FaFacebookF className="w-5 h-5" />
            </a>
          </div>
        </div>

        {/* Columna 2: Enlaces rápidos */}
        <div>
          <div className="pb-3">
            <span className="font-semibold mb-3">{t("quickLinks.title")}</span>
          </div>
          <ul className="space-y-2 text-gray-700">
            {quickLinksConfig.map((link) => (
              <li key={link.key}>
                <a href={link.href} className="hover:text-[#F27F2A]">
                  {t(`quickLinks.links.${link.key}`)}
                </a>
              </li>
            ))}
          </ul>
        </div>

        {/* Columna 3: Nuestros Servicios */}
        <div>
          <div className="pb-3">
            <span className="font-semibold mb-3">{t("services.title")}</span>
          </div>
          <ul className="space-y-2 text-gray-700">
            {servicesConfig.map((service) => (
              <li key={service.key}>{t(`services.list.${service.key}`)}</li>
            ))}
          </ul>
        </div>

        {/* Columna 4: Contacto */}
        <div>
          <div className="pb-3">
            <span className="font-semibold mb-3">{t("contact.title")}</span>
          </div>
          <ul className="space-y-3 text-gray-700">
            <li className="flex items-center gap-2">
              <PhoneIcon className="w-4 h-4 text-[#0A0A0A]" />
              <span>{t("contact.phone")}</span>
            </li>
            <li className="flex items-center gap-2">
              <EnvelopeIcon className="w-4 h-4 text-[#0A0A0A]" />
              <span>{t("contact.email")}</span>
            </li>
            <li className="flex items-start gap-2">
              <MapPinIcon className="w-4 h-4 text-[#0A0A0A] mt-1" />
              <span>{t("contact.address")}</span>
            </li>
          </ul>
        </div>
      </div>

      {/* Línea anaranjada */}
      <div className="w-full h-[3px] bg-[#F27F2A]" />

      {/* Copyright */}
      <div className="text-center text-sm text-black py-4 [#EDEDED]">
        {t("copyright", { year: new Date().getFullYear() })}
      </div>
    </footer>
  );
}
