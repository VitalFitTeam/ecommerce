"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { useAuth } from "@/context/AuthContext";
import { api } from "@/lib/sdk-config";
import type { QrToken as QrTokenType } from "@vitalfit/sdk";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { usePathname } from "@/i18n/routing";
import UserHeader from "@/components/layout/Sidebar/UserHeader";
import MenuList from "@/components/layout/Sidebar/MenuList";
import QRCodeModal from "@/components/layout/QRCodeModal";

export default function Sidebar() {
  const { user, logout, token } = useAuth();
  const pathname = usePathname();

  const [showQR, setShowQR] = useState(false);
  const [qrToken, setQrToken] = useState<string | null>(null);
  const [qrDuration, setQrDuration] = useState<number>(30);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const membership = user?.client_membership;

  const fetchQrToken = useCallback(async () => {
    if (!user || !token) {
      setError("Usuario no autenticado");
      return;
    }

    try {
      setLoading(true);
      setError(null);

      const res: QrTokenType = await api.user.QrToken(token);
      setQrToken(res.token);
      setQrDuration(180);
    } catch (err) {
      console.error("Error generando QR:", err);
      setQrToken(null);
      setError("No se pudo generar el QR. Intenta de nuevo.");
    } finally {
      setLoading(false);
    }
  }, [token, user]);

  const handleQrClick = () => {
    setShowQR(true);
  };

  const handleCloseModal = () => {
    setShowQR(false);
    setQrToken(null);
    setError(null);
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
  };

  useEffect(() => {
    if (!showQR) {
      return;
    }

    fetchQrToken();

    intervalRef.current = setInterval(() => {
      fetchQrToken();
    }, qrDuration * 1000);

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    };
  }, [showQR, fetchQrToken, qrDuration]);

  if (!user) {
    return null;
  }

  return (
    <>
      <aside className="flex h-full w-[280px] xl:w-[320px] flex-col bg-white shadow-lg border-r border-gray-100 p-4 space-y-2">
        <div className="border-b border-orange-400 pb-2">
          <UserHeader
            user={user}
            membership={membership}
            onQrClick={handleQrClick}
          />
        </div>

        {error && <p className="text-red-500 mt-2">{error}</p>}

        <ScrollArea className="flex-1 px-4 py-3">
          <MenuList pathname={pathname} />
        </ScrollArea>

        <Button
          onClick={logout}
          className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
        >
          Cerrar sesión
        </Button>
      </aside>
    </>
  );
}
