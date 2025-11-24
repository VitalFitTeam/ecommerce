"use client";

import { XMarkIcon } from "@heroicons/react/24/outline";
import QRCode from "react-qr-code";
import { Button } from "@/components/ui/button";

interface QRCodeModalProps {
  idMember: string;
  userName: string;
  vencimiento: string;
  onClose: () => void;
}

export default function QRCodeModal({
  idMember,
  userName,
  vencimiento,
  onClose,
}: QRCodeModalProps) {
  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-80 text-center relative shadow-lg">
        <button
          onClick={onClose}
          className="absolute top-3 right-3 text-gray-400 hover:text-gray-600"
        >
          <XMarkIcon className="w-5 h-5" />
        </button>

        <h4 className="text-lg font-bold mb-2">Código QR</h4>
        <p className="text-xs text-gray-500 mb-4">
          Escanea este código en la entrada del gimnasio
        </p>

        <div className="flex justify-center mb-4">
          <QRCode value={idMember} size={160} />
        </div>

        <h4 className="text-md font-semibold mb-1">{userName}</h4>
        <p className="text-xs font-bold text-primary mb-1">Miembro activo</p>
        <p className="text-xs text-gray-500 mb-1">ID: {idMember}</p>
        <p className="text-xs text-gray-500 mb-4">
          Válido hasta: {vencimiento}
        </p>

        <Button className="w-full border border-gray-300 bg-white text-gray-800 hover:bg-gray-50">
          Descargar
        </Button>
      </div>
    </div>
  );
}
