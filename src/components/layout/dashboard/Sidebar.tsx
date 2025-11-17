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
  XMarkIcon,
} from "@heroicons/react/24/outline";
import { Button } from "@/components/ui/button";
import QRCode from "react-qr-code";
import Wishlist from "./Whislist";

export default function Sidebar() {
  const t = useTranslations("sidebar");
  const dateMember = "Enero 2024";
  const idMember = "FM-2024-00134";
  const vencimiento = "31 Dic 2025";
  const userName = "Albani Barragan";
  const [showQR, setShowQR] = useState(false);

  return (
    <>
      <aside className="w-60 bg-white border-r border-gray-200 p-6">
        <div className="text-center mb-8">
          <div className="w-24 h-24 mx-auto mb-3 bg-gray-300 rounded-full"></div>
          <h3 className="font-bold text-lg">{userName}</h3>
          <p className="text-xs font-bold text-gray-500 mb-4">
            {t("membership")}
          </p>
          <p className="text-xs text-gray-500 mb-4">
            {t("membershipMember") + " " + dateMember}
          </p>

          <button
            onClick={() => setShowQR(true)}
            className="w-full flex items-center justify-center gap-2 border border-gray-300 rounded px-3 py-2 text-xs hover:bg-gray-50 mb-4"
          >
            <QrCodeIcon className="w-4 h-4" />
            {t("qrCode")}
          </button>

          <div className="space-y-2 text-xs text-gray-600 text-left">
            <div className="flex justify-between">
              <span>{t("stats.memberId")}</span>
              <span className="font-semibold">{idMember}</span>
            </div>
            <div className="flex justify-between">
              <span>{t("stats.classesThisMonth")}</span>
              <span className="font-semibold">12</span>
            </div>
            <div className="flex justify-between">
              <span>{t("stats.totalVisits")}</span>
              <span className="font-semibold">89</span>
            </div>
          </div>
        </div>

        <hr className="my-6" />

        <nav className="space-y-4">
          <MenuItem
            icon={<UserIcon className="w-5 h-5" />}
            label={t("menu.profile")}
          />
          <MenuItem
            icon={<ShieldCheckIcon className="w-5 h-5" />}
            label={t("menu.security")}
          />
          <MenuItem
            icon={<CreditCardIcon className="w-5 h-5" />}
            label={t("menu.membership")}
          />
          <MenuItem
            icon={<CurrencyDollarIcon className="w-5 h-5" />}
            label={t("menu.paymentHistory")}
          />
          <MenuItem
            icon={<HeartIcon className="w-5 h-5" />}
            label={t("menu.wishlist")}
          />
          <MenuItem
            icon={<ArrowRightOnRectangleIcon className="w-5 h-5" />}
            label={t("menu.logout")}
            isRed
          />
        </nav>

        <Wishlist />
      </aside>

      {/* Modal QR */}
      {showQR && (
        <div className="fixed inset-0 bg-black bg-opacity-100 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-80 text-center relative">
            <button
              onClick={() => setShowQR(false)}
              className="absolute top-2 right-2 text-gray-400 hover:text-gray-600"
            >
              <XMarkIcon className="w-5 h-5" />
            </button>
            <h4 className="text-lg font-bold mb-4">{t("qrModal.title")}</h4>
            <p className="text-xs text-gray-500 my-4">
              {t("qrModal.description")}
            </p>
            <div className="flex justify-center">
              <QRCode value={idMember} size={160} />
            </div>
            <h4 className="text-lg font-bold my-2">{userName}</h4>
            <p className="text-xs text-primary font-bold mb-4">
              {t("membership")}
            </p>
            <p className="text-xs text-gray-500 my-2">ID: {idMember}</p>
            <p className="text-xs text-gray-500 my-2">
              Valido hasta: {vencimiento}
            </p>
            <Button className="border border-gray-500 bg-white text-gray-800">
              Descargar
            </Button>
          </div>
        </div>
      )}
    </>
  );
}

interface MenuItemProps {
  icon: React.ReactNode;
  label: string;
  isRed?: boolean;
}

function MenuItem({ icon, label, isRed }: MenuItemProps) {
  return (
    <button
      className={`w-full flex items-center gap-3 px-3 py-2 rounded text-sm font-medium transition ${
        isRed
          ? "text-red-500 hover:bg-red-50"
          : "text-gray-700 hover:bg-gray-100"
      }`}
    >
      {icon}
      {label}
    </button>
  );
}
