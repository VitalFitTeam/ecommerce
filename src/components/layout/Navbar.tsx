"use client";

import { useState } from "react";
import { Link, useRouter } from "@/i18n/routing";
import { usePathname } from "next/navigation";
import { Button } from "@/components/ui/button";
import {
  Bars3Icon,
  XMarkIcon,
  UserCircleIcon,
} from "@heroicons/react/24/outline";
import Logo from "@/components/features/Logo";
import LocaleSwitcher from "../ui/LocaleSwitcher";
import { useTranslations } from "next-intl";
import { useAuth } from "@/context/AuthContext";
import { UserNav } from "./UserNav";

interface NavbarProps {
  transparent?: boolean;
}

export function Navbar({ transparent = false }: NavbarProps) {
  const t = useTranslations("Navbar");
  const pathname = usePathname();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const { user, token, logout, loading } = useAuth();
  const router = useRouter();

  const isActive = (href: string) =>
    href === "/" ? pathname === "/" : pathname.startsWith(href);

  const navItemsConfig = [
    { key: "home", href: "/" },
    { key: "services", href: "/services" },
    { key: "branches", href: "/branches" },
    { key: "memberships", href: "/memberships" },
    { key: "contact", href: "/contact" },
  ];

  return (
    <nav
      className={`
        w-full 
        px-6 lg:px-10 
        py-4 
        flex items-center justify-between
        backdrop-blur-md
        transition-all duration-300
        sticky top-0 z-50
        ${transparent ? "bg-transparent" : "bg-[#303030]/95 shadow-md"}
      `}
    >
      <button
        className="md:hidden p-2 text-white hover:bg-white/10 rounded-lg transition"
        onClick={() => setIsMenuOpen(!isMenuOpen)}
      >
        {isMenuOpen ? (
          <XMarkIcon className="h-6 w-6" />
        ) : (
          <Bars3Icon className="h-6 w-6" />
        )}
      </button>

      <div className="flex items-center gap-3">
        <Logo slogan={true} theme="dark" />
      </div>

      <div className="hidden md:flex items-center gap-10">
        {navItemsConfig.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className={`
              text-sm font-medium 
              transition-all px-2 py-1 rounded-md
              ${
                isActive(item.href)
                  ? "text-white bg-primary shadow-sm"
                  : "text-gray-300 hover:text-white hover:bg-white/10"
              }
            `}
          >
            {t(`navItems.${item.key}`)}
          </Link>
        ))}
      </div>

      <div className="hidden md:flex items-center gap-4">
        <LocaleSwitcher />

        {loading ? (
          <div className="w-9 h-9 rounded-full bg-white/20 animate-pulse" />
        ) : user && token ? (
          <UserNav
            user={user}
            onHomeClick={() => router.push("/dashboard")}
            onProfileClick={() => router.push("/dashboard/profile")}
            onSignOut={logout}
          />
        ) : (
          <div className="flex items-center gap-3">
            <Link href="/login">
              <Button
                variant="ghost"
                className="text-primary border border-primary hover:bg-primary hover:text-white transition"
              >
                {t("loginButton")}
              </Button>
            </Link>
            <Link href="/register">
              <Button className="bg-primary hover:bg-orange-600 text-white shadow">
                {t("registerButton")}
              </Button>
            </Link>
          </div>
        )}
      </div>

      {isMenuOpen && (
        <div className="absolute top-16 left-0 right-0 bg-[#303030] border-t md:hidden z-40 shadow-xl animate-fade-in">
          <div className="flex flex-col p-4 gap-4">
            {navItemsConfig.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setIsMenuOpen(false)}
                className={`
                  py-3 px-4 rounded-lg 
                  text-sm font-medium
                  ${
                    isActive(item.href)
                      ? "text-white bg-primary"
                      : "text-gray-300 hover:bg-white/10 hover:text-white"
                  }
                `}
              >
                {t(`navItems.${item.key}`)}
              </Link>
            ))}
            <div className="flex flex-col gap-3 pt-3 border-t border-white/10">
              {loading ? (
                <div className="w-full h-10 bg-white/10 animate-pulse rounded-lg" />
              ) : user && token ? (
                <Link href="/dashboard" onClick={() => setIsMenuOpen(false)}>
                  <Button className="bg-slate-700 w-full flex items-center justify-center gap-2 text-white shadow">
                    <UserCircleIcon className="w-5 h-5" />
                    {user.first_name}
                  </Button>
                </Link>
              ) : (
                <>
                  <Link href="/login" onClick={() => setIsMenuOpen(false)}>
                    <Button
                      variant="ghost"
                      className="text-primary border border-primary hover:bg-primary hover:text-white w-full"
                    >
                      {t("loginButton")}
                    </Button>
                  </Link>

                  <Link href="/register" onClick={() => setIsMenuOpen(false)}>
                    <Button className="bg-primary hover:bg-orange-600 text-white w-full shadow">
                      {t("registerButton")}
                    </Button>
                  </Link>
                </>
              )}
            </div>
            <div className="pt-3 border-t border-white/10">
              <LocaleSwitcher />
            </div>
          </div>
        </div>
      )}
    </nav>
  );
}
