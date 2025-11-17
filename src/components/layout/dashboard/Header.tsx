"use client";

import { useState } from "react";
import { Link } from "@/i18n/routing";
import { useTranslations } from "next-intl";
import { usePathname } from "next/navigation";
import { BellIcon } from "@heroicons/react/24/outline";
import Logo from "@/components/features/Logo";

export default function Header() {
  const t = useTranslations("Navbar");
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

  const navItemsConfig = [
    { key: "home", href: "/" },
    { key: "services", href: "/services" },
    { key: "branches", href: "/branches" },
    { key: "memberships", href: "/memberships" },
    { key: "contact", href: "/contact" },
  ];

  return (
    <header className="bg-[#303030] text-white px-6 py-4 flex items-center justify-between">
      <Logo slogan={true} theme="dark" />
      <div className="flex items-center gap-8">
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
      </div>

      <div className="flex items-center gap-4">
        <button className="hover:bg-gray-700 p-2 rounded">
          <BellIcon className="w-6 h-6" />
        </button>
        <div className="flex items-center gap-3 ml-2">
          <div className="w-8 h-8 bg-gray-400 rounded-full"></div>
          <div className="text-right text-xs">
            <div className="font-semibold">Albani Barragan</div>
            <div className="text-gray-400">albania@gmail.com</div>
          </div>
        </div>
      </div>
    </header>
  );
}
