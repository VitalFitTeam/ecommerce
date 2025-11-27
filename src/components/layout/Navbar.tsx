"use client";

import { useState } from "react";
import { Link, useRouter } from "@/i18n/routing";
import { usePathname } from "next/navigation";
import { Button } from "@/components/ui/button";
import {
  Bars3Icon,
  XMarkIcon,
  UserCircleIcon,
  ShoppingCartIcon,
} from "@heroicons/react/24/outline";
import Logo from "@/components/features/Logo";
import LocaleSwitcher from "../ui/LocaleSwitcher";
import { useTranslations } from "next-intl";
import { useAuth } from "@/context/AuthContext";
import { UserNav } from "./UserNav";

interface NavbarProps {
  transparent?: boolean;
  cartItemCount?: number; // opcional, para mostrar badge
}

export function Navbar({
  transparent = false,
  cartItemCount = 0,
}: NavbarProps) {
  const t = useTranslations("Navbar");
  const pathname = usePathname();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

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
    router.push("/purchase");
  };

  return (
    <nav
      className={`
        w-full 
        px-6 lg:px-10 
        py-4 
        flex items-center justify-between
        backdrop-blur-md
        transition-all duration-300
        ${transparent ? "bg-transparent" : "bg-[#303030]/95 shadow-md"}
      `}
    >
      {/* Mobile Hamburger */}
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

      {/* Logo */}
      <div className="flex items-center gap-3">
        <Logo slogan={true} theme="dark" />
      </div>

      {/* Desktop Nav Items */}
      <div className="hidden md:flex items-center gap-10">
        {navItemsConfig.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className={`
              text-sm font-medium transition-all px-2 py-1 rounded-md
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

      {/* Right Section */}
      <div className="hidden md:flex items-center gap-4">
        <LocaleSwitcher />

        {/* Carrito */}
        <div className="relative cursor-pointer" onClick={handleCartClick}>
          <ShoppingCartIcon className="w-6 h-6 text-white hover:text-primary transition" />
          {cartItemCount > 0 && (
            <span className="absolute -top-2 -right-2 inline-flex items-center justify-center px-1.5 py-0.5 text-xs font-bold leading-none text-white bg-red-600 rounded-full">
              {cartItemCount}
            </span>
          )}
        </div>

        {user && token ? (
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

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="absolute top-16 left-0 right-0 bg-[#303030] border-t md:hidden z-40 shadow-xl">
          <div className="flex flex-col p-4 gap-4">
            {navItemsConfig.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setIsMenuOpen(false)}
                className={`
                  py-3 px-4 rounded-lg text-sm font-medium
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

            {/* Mobile User */}
            <div className="flex flex-col gap-3 pt-3 border-t border-white/10">
              {user && token ? (
                <>
                  <Link href="/purchase" onClick={() => setIsMenuOpen(false)}>
                    <Button className="bg-slate-700 w-full flex items-center justify-center gap-2 text-white shadow">
                      <ShoppingCartIcon className="w-5 h-5" />
                      {t("cart")}
                    </Button>
                  </Link>
                  <Link href="/dashboard" onClick={() => setIsMenuOpen(false)}>
                    <Button className="bg-slate-700 w-full flex items-center justify-center gap-2 text-white shadow">
                      <UserCircleIcon className="w-5 h-5" />
                      {user.first_name}
                    </Button>
                  </Link>
                </>
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

            {/* Locale Mobile */}
            <div className="pt-3 border-t border-white/10">
              <LocaleSwitcher />
            </div>
          </div>
        </div>
      )}
    </nav>
  );
}
