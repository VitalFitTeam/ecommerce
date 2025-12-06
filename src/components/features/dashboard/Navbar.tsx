"use client";

import Image from "next/image";
import { useTranslations } from "next-intl";
import { UserNav } from "@/components/layout/UserNav";
import { useRouter } from "@/i18n/routing";
import { useAuth } from "@/context/AuthContext";
import { Button } from "@/components/ui/button";

interface NavbarProps {
  onSignOut?: () => void;
  transparent?: boolean;
}

const NavbarDashboard = ({ onSignOut, transparent }: NavbarProps) => {
  const t = useTranslations("Navbar");
  const router = useRouter();
  const { user } = useAuth();

  const handleLogoClick = () => router.push("/");
  const handleProfileClick = () => router.push("/profile");
  const handleHomeClick = () => router.push("/dashboard");

  return (
    <nav
      className={`
        fixed top-0 left-0 z-50 w-full h-16
        flex items-center
        border-b backdrop-blur-md
        transition-colors duration-300 ease-out
        ${
          transparent
            ? "bg-transparent border-transparent"
            : "bg-[#0a0a0a]/85 border-white/10 shadow-[0_0_30px_rgba(0,0,0,0.25)]"
        }
      `}
    >
      <div className="w-full max-w-7xl mx-auto px-6 flex items-center justify-between">
        {/* LOGO */}
        <button
          onClick={handleLogoClick}
          className="relative flex items-center group select-none"
        >
          <div
            className="
            absolute -inset-2 
            rounded-xl blur-xl 
            bg-primary/20 
            opacity-0 
            group-hover:opacity-100 
            transition-opacity duration-500
          "
          />

          <Image
            src="/logo/logo-vitalfit.svg"
            alt="VitalFit Logo"
            width={130}
            height={40}
            priority
            className="
              relative
              transition duration-300
              group-hover:scale-[1.03]
              group-hover:brightness-110
              drop-shadow-[0_4px_12px_rgba(0,0,0,0.35)]
              cursor-pointer
            "
          />
        </button>

        <div className="flex items-center gap-4">
          {user ? (
            <div className="flex items-center gap-4">
              <div className="hidden sm:flex flex-col items-end mr-1">
                <div className="flex items-center gap-1.5">
                  <span className="text-emerald-400 font-bold text-sm leading-none">
                    {user.ClientProfile.scoring} pts
                  </span>
                </div>

                <span className="text-gray-400 text-[10px] font-medium uppercase tracking-wider mt-0.5">
                  {user.ClientProfile.category || "Sin categoria"}
                </span>
              </div>
              <div className="h-8 w-px bg-white/10 hidden sm:block"></div>
              <UserNav
                user={user}
                onSignOut={onSignOut}
                onProfileClick={handleProfileClick}
                onHomeClick={handleHomeClick}
              />
            </div>
          ) : (
            <Button onClick={() => router.push("/login")}>{t("login")}</Button>
          )}
        </div>
      </div>
    </nav>
  );
};

export default NavbarDashboard;
