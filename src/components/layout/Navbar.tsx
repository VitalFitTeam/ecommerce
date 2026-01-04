"use client";

import { useState, useEffect } from "react";
import { Link, useRouter } from "@/i18n/routing";
import { usePathname } from "next/navigation";
import { Button } from "@/components/ui/button";
import {
  Bars3Icon,
  XMarkIcon,
  UserCircleIcon,
  ShoppingCartIcon,
  ArrowRightStartOnRectangleIcon,
} from "@heroicons/react/24/outline";
import Logo from "@/components/features/Logo";
import LocaleSwitcher from "../ui/LocaleSwitcher";
import { useTranslations } from "next-intl";
import { useAuth } from "@/context/AuthContext";
import { UserNav } from "./UserNav";

interface NavbarProps {
  transparent?: boolean;
  cartItemCount?: number;
}

export function Navbar({
  transparent = false,
  cartItemCount = 0,
}: NavbarProps) {
  const t = useTranslations("Navbar");
  const pathname = usePathname();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  useEffect(() => {
    if (isMenuOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
  }, [isMenuOpen]);

  const { user, token, logout } = useAuth();
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

  const handleCartClick = () => {
    router.push("/checkout");
    setIsMenuOpen(false);
  };

  return (
    <nav
      className={`
        fixed top-0 left-0 right-0 z-[999] 
        w-full 
        px-6 lg:px-10 
        py-4 
        flex items-center justify-between
        transition-all duration-300
        border-b border-white/5
        ${
          transparent && !isMenuOpen
            ? "bg-transparent backdrop-blur-sm"
            : "bg-[#1c1c1c]/95 backdrop-blur-xl shadow-lg"
        }
      `}
    >
      <button
        className="md:hidden p-2 text-gray-300 hover:text-white hover:bg-white/10 rounded-full transition active:scale-95"
        onClick={() => setIsMenuOpen(!isMenuOpen)}
      >
        {isMenuOpen ? (
          <XMarkIcon className="h-6 w-6" />
        ) : (
          <Bars3Icon className="h-6 w-6" />
        )}
      </button>

      <div className="flex items-center gap-3">
        <Logo slogan={true} theme="light" />
      </div>

      <div className="hidden md:flex items-center gap-6 xl:gap-8">
        {navItemsConfig.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className={`
              text-sm font-bold tracking-wide transition-all px-4 py-2 rounded-full
              ${
                isActive(item.href)
                  ? "text-white bg-primary shadow-[0_0_15px_rgba(234,88,12,0.4)]"
                  : "text-white/80 hover:text-white hover:bg-white/10"
              }
            `}
          >
            {t(`navItems.${item.key}`)}
          </Link>
        ))}
      </div>

      <div className="hidden md:flex items-center gap-5">
        <LocaleSwitcher />

        {/* Carrito Desktop */}
        <div
          className="relative cursor-pointer group"
          onClick={handleCartClick}
        >
          <div className="p-2 rounded-full hover:bg-white/10 transition-colors">
            <ShoppingCartIcon className="w-6 h-6 text-white group-hover:text-primary transition" />
          </div>
          {cartItemCount > 0 && (
            <span className="absolute top-0 right-0 inline-flex items-center justify-center h-5 w-5 text-[10px] font-bold leading-none text-white bg-red-600 rounded-full border-2 border-[#1c1c1c]">
              {cartItemCount}
            </span>
          )}
        </div>

        {/* Separador Vertical */}
        <div className="hidden lg:block h-8 w-px bg-white/10 mx-1"></div>

        {user && token ? (
          <div className="flex items-center gap-3 animate-in fade-in duration-300">
            {/* ESTILO PLATZI (Puntos) */}
            <div className="flex flex-col items-end">
              <span className="text-emerald-400 font-bold text-sm leading-none drop-shadow-sm">
                {user.ClientProfile.scoring} pts
              </span>
              <span className="text-gray-500 text-[10px] font-semibold uppercase tracking-widest">
                {user.ClientProfile.category}
              </span>
            </div>

            <UserNav
              user={user}
              onHomeClick={() => router.push("/dashboard")}
              onProfileClick={() => router.push("/profile")}
              onSignOut={logout}
            />
          </div>
        ) : (
          <div className="flex items-center gap-3">
            <Link href="/login">
              <Button
                variant="ghost"
                className="text-primary border border-primary/50 hover:bg-primary hover:text-white transition rounded-full"
              >
                {t("loginButton")}
              </Button>
            </Link>
            <Link href="/register">
              <Button className="bg-primary hover:bg-orange-600 text-white shadow-lg shadow-orange-900/20 rounded-full px-6">
                {t("registerButton")}
              </Button>
            </Link>
          </div>
        )}
      </div>

      {isMenuOpen && (
        <div className="fixed inset-0 top-[72px] z-[998] bg-[#1c1c1c] md:hidden animate-in slide-in-from-top-5 duration-300 flex flex-col h-[calc(100vh-72px)] overflow-y-auto">
          <div className="flex flex-col p-6 gap-2 pb-20">
            {/* TARJETA DE USUARIO MÓVIL (Gamificación) */}
            {user && token && (
              <div className="mb-6 p-4 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-full bg-primary/20 flex items-center justify-center text-primary font-bold border border-primary/30">
                    {user.first_name?.charAt(0)}
                  </div>
                  <div>
                    <p className="text-white font-medium text-sm">
                      {user.first_name}
                    </p>
                    <p className="text-emerald-400 text-xs font-bold">
                      {user.ClientProfile.scoring} Pts
                    </p>
                  </div>
                </div>
              </div>
            )}

            <span className="text-xs font-semibold text-gray-500 uppercase tracking-widest px-4 mb-2">
              Menú Principal
            </span>

            {navItemsConfig.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setIsMenuOpen(false)}
                className={`
                  py-4 px-4 rounded-xl text-base font-medium flex items-center justify-between group transition-colors
                  ${
                    isActive(item.href)
                      ? "text-white bg-primary/10 border border-primary/20"
                      : "text-gray-400 hover:bg-white/5 hover:text-white border border-transparent"
                  }
                `}
              >
                {t(`navItems.${item.key}`)}
                {isActive(item.href) && (
                  <div className="h-2 w-2 rounded-full bg-primary shadow-glow"></div>
                )}
              </Link>
            ))}

            {/* SECCIÓN INFERIOR MÓVIL */}
            <div className="mt-8 pt-6 border-t border-white/10 flex flex-col gap-4">
              <div className="px-2">
                <LocaleSwitcher />
              </div>

              {user && token ? (
                <div className="grid grid-cols-2 gap-3">
                  <Button
                    onClick={handleCartClick}
                    className="bg-slate-800 hover:bg-slate-700 text-white border border-white/5 h-12 rounded-xl"
                  >
                    <ShoppingCartIcon className="w-5 h-5 mr-2" />
                    {"Carrito"} ({cartItemCount})
                  </Button>
                  <Button
                    onClick={() => {
                      router.push("/dashboard");
                      setIsMenuOpen(false);
                    }}
                    className="bg-primary hover:bg-orange-600 text-white h-12 rounded-xl"
                  >
                    <UserCircleIcon className="w-5 h-5 mr-2" />
                    Dashboard
                  </Button>
                  <Button
                    onClick={() => {
                      logout();
                      setIsMenuOpen(false);
                    }}
                    className="col-span-2 bg-red-600/10 hover:bg-red-600 text-red-500 hover:text-white border border-red-600/20 h-12 rounded-xl transition-all duration-300"
                  >
                    <ArrowRightStartOnRectangleIcon className="w-5 h-5 mr-2" />
                    {t("logoutButton")}
                  </Button>
                </div>
              ) : (
                <div className="flex flex-col gap-3">
                  <Link href="/login" onClick={() => setIsMenuOpen(false)}>
                    <Button
                      variant="outline"
                      className="w-full h-12 border-primary/50 text-primary hover:bg-primary/10 hover:text-white rounded-xl"
                    >
                      {t("loginButton")}
                    </Button>
                  </Link>

                  <Link href="/register" onClick={() => setIsMenuOpen(false)}>
                    <Button className="w-full h-12 bg-primary hover:bg-orange-600 text-white font-bold rounded-xl shadow-lg">
                      {t("registerButton")}
                    </Button>
                  </Link>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </nav>
  );
}
