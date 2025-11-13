"use client";

import { useState } from "react";
import { Link } from "@/i18n/routing";
import { usePathname } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Bars3Icon, XMarkIcon } from "@heroicons/react/24/outline";
import Logo from "@/components/features/Logo";
import LocaleSwitcher from "../ui/LocaleSwitcher";
import { useTranslations } from "next-intl"; // Importado

interface NavbarProps {
  transparent?: boolean;
}

export function Navbar({ transparent = false }: NavbarProps) {
  const t = useTranslations("Navbar"); // Inicializado
  const pathname = usePathname();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const isActive = (href: string) => {
    if (href === "/" && pathname === "/") {
      return true;
    }
    if (href !== "/" && pathname.startsWith(href)) {
      return true;
    }
    return false;
  };

  // Configuración de los ítems de navegación usando claves de traducción
  const navItemsConfig = [
    { key: "home", href: "/" },
    { key: "services", href: "/services" },
    { key: "branches", href: "/branches" },
    { key: "memberships", href: "/memberships" },
    { key: "contact", href: "/contact" },
  ];

  return (
    <nav
      className={`w-full px-6 py-4 flex items-center lg:justify-between transition-colors ${
        transparent ? "bg-transparent" : "bg-[#303030]"
      }`}
    >
      {/* Botón menu mobile */}
      <button
        className="md:hidden p-2 text-white hover:bg-slate-800 rounded-lg transition-colors"
        onClick={() => setIsMenuOpen(!isMenuOpen)}
      >
        {isMenuOpen ? (
          <XMarkIcon className="w-6 h-6" />
        ) : (
          <Bars3Icon className="w-6 h-6" />
        )}
      </button>

      {/* Logo */}
      <Logo slogan={true} theme="dark" />

      {/* Menu Desktop */}
      <div className="hidden md:flex items-center gap-8">
        {navItemsConfig.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className={`transition-colors ${
              isActive(item.href)
                ? "text-white bg-primary rounded border-primary p-2"
                : "text-gray-300 hover:text-primary"
            }`}
          >
            {t(`navItems.${item.key}`)} {/* Traducción */}
          </Link>
        ))}
      </div>

      {/* Botones Desktop */}
      <div className="hidden md:flex items-center gap-3">
        <Link href="/login">
          <Button
            variant="ghost"
            className="text-primary border border-primary hover:bg-primary hover:text-white"
          >
            {t("loginButton")} {/* Traducción */}
          </Button>
        </Link>
        <Link href="/register">
          <Button className="bg-primary hover:bg-orange-600 text-white">
            {t("registerButton")} {/* Traducción */}
          </Button>
        </Link>
      </div>

      {/* Menu Mobile */}
      {isMenuOpen && (
        <div className="absolute top-16 left-0 right-0 bg-[#303030] border-t md:hidden z-10">
          <div className="flex flex-col p-4 gap-4">
            {navItemsConfig.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setIsMenuOpen(false)}
                className={`transition-colors py-2 px-4 rounded-lg ${
                  isActive(item.href)
                    ? "text-white bg-primary"
                    : "text-gray-300 hover:text-white"
                }`}
              >
                {t(`navItems.${item.key}`)} {/* Traducción */}
              </Link>
            ))}

            <div className="flex flex-col gap-2 pt-2 border-t border-slate-800">
              <Link href="/login" onClick={() => setIsMenuOpen(false)}>
                <Button
                  variant="ghost"
                  className="text-primary border border-primary hover:bg-primary hover:text-white w-full"
                >
                  {t("loginButton")} {/* Traducción */}
                </Button>
              </Link>
              <Link href="/register" onClick={() => setIsMenuOpen(false)}>
                <Button className="bg-primary hover:bg-orange-600 text-white w-full">
                  {t("registerButton")} {/* Traducción */}
                </Button>
              </Link>
            </div>
          </div>
        </div>
      )}
      <div className="ml-4">
        <LocaleSwitcher />
      </div>
    </nav>
  );
}
