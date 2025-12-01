"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import {
  QrCodeIcon,
  ShieldCheckIcon,
  CreditCardIcon,
  HeartIcon,
  ArrowRightOnRectangleIcon,
  CurrencyDollarIcon,
  UserIcon,
} from "@heroicons/react/24/outline";

// Importaciones de shadcn/ui
import { Button } from "@/components/ui/button";
import { useAuth } from "@/context/AuthContext";
import QRCode from "react-qr-code";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Card, CardContent } from "@/components/ui/Card";

import Wishlist from "./Whislist";
import { Link, usePathname } from "@/i18n/routing";
import QRCodeModal from "../QRCodeModal";

export default function Sidebar() {
  const t = useTranslations("sidebar");
  const { logout } = useAuth();
  const handleLogout = () => logout();
  const dateMember = "Enero 2024";
  const idMember = "FM-2024-00134";
  const vencimiento = "31 Dic 2025";
  const userName = "Albani Barragan";
  const [showQR, setShowQR] = useState(false);
  const pathname = usePathname();
  const isDashboardHome = pathname === "/dashboard";

  const activePath = "/profile";

  const stats = [
    { label: t("stats.memberId"), value: idMember },
    { label: t("stats.classesThisMonth"), value: "12" },
    { label: t("stats.totalVisits"), value: "89" },
  ];

  return (
    <>
      <aside className="w-[300px] flex-shrink-0 bg-white border-r border-gray-200 p-8 flex flex-col h-full">
        <ScrollArea className="flex-1 pr-4">
          <div className="text-center mb-6">
            <div className="w-32 h-32 mx-auto mb-4 border border-gray-200 rounded-full overflow-hidden bg-gray-100 flex items-center justify-center">
              <span className="text-gray-500 font-bold text-3xl">AB</span>
            </div>

            <h3 className="font-semibold text-xl text-gray-900">{userName}</h3>
            <p className="text-sm font-light text-gray-700 mt-1 mb-1">
              Membresía premium
            </p>
            <p className="text-xs text-gray-500 mb-6">
              Miembro desde {dateMember}
            </p>

            <Button
              variant="outline"
              className="w-full h-10 flex items-center justify-center gap-2 mb-8 border-gray-300 rounded-lg text-sm font-medium hover:bg-gray-50"
              onClick={() => setShowQR(true)}
            >
              <QrCodeIcon className="w-5 h-5" />
              {t("qrCode")}
            </Button>
          </div>

          <div className="space-y-4 text-sm text-gray-600 mb-8">
            {stats.map((item) => (
              <div key={item.label} className="flex justify-between">
                <span className="text-gray-600">{item.label}</span>
                <span className="font-semibold text-gray-900">
                  {item.value}
                </span>{" "}
                {/* Valores más oscuros */}
              </div>
            ))}
          </div>

          <hr className="my-6 border-gray-200" />

          <nav className="space-y-1 mb-6 items-start">
            <Link href="/profile" replace={!isDashboardHome}>
              <MenuItem
                icon={<UserIcon className="w-5 h-5" />}
                label={t("menu.profile")}
              />
            </Link>
            <Link href="/security/changePassword" replace={!isDashboardHome}>
              <MenuItem
                icon={<ShieldCheckIcon className="w-5 h-5" />}
                label={t("menu.security")}
              />
            </Link>
            <Link href="/history" replace={!isDashboardHome}>
              <MenuItem
                icon={<CreditCardIcon className="w-5 h-5" />}
                label={t("menu.membership")}
              />
            </Link>
            <MenuItem
              icon={<CurrencyDollarIcon className="w-5 h-5" />}
              label={t("menu.paymentHistory")}
            />
            <MenuItem
              icon={<HeartIcon className="w-5 h-5" />}
              label={t("menu.wishlist")}
            />
          </nav>

          <hr className="my-6 border-gray-200" />

          <MenuItem
            icon={<ArrowRightOnRectangleIcon className="w-5 h-5" />}
            label={t("menu.logout")}
            isRed
            onClick={handleLogout}
          />
          <div className="mt-8">
            <Wishlist />
          </div>
        </ScrollArea>
      </aside>

      {showQR && (
        <QRCodeModal
          idMember={idMember}
          userName={userName}
          vencimiento={vencimiento}
          onClose={() => setShowQR(false)}
        />
      )}
    </>
  );
}

interface MenuItemProps {
  icon: React.ReactNode;
  label: string;
  isRed?: boolean;
  isActive?: boolean;
}

function MenuItem({
  icon,
  label,
  isRed,
  onClick,
}: MenuItemProps & { onClick?: () => void }) {
  return (
    <Button
      onClick={onClick}
      className={`w-full bg-transparent flex gap-3 px-3 py-2 rounded text-sm font-medium transition justify-start ${
        isRed
          ? "text-red-500 hover:bg-red-50"
          : "text-gray-700 hover:bg-gray-100"
      }`}
    >
      {icon}
      {label}
    </Button>
  );
}
