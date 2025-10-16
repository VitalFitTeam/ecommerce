"use client";

import { useState } from "react";

type QrProps = {
  id: string;
  name: string;
};

export const QRCodeCard : React.FC<QrProps> = ({id,name,}) => {
  const [showModal, setShowModal] = useState(false);
  const modalButtonStyle = "rounded-md border border-gray-300 bg-gray-100 px-4 py-2 text-sm";
  return (
    <>
      <div className="rounded-lg border border-orange-500 bg-gradient-to-br from-orange-500 to-orange-600 text-white shadow-sm">
        <div className="flex flex-col space-y-1.5 p-6">
          <h3 className="text-center text-base font-semibold leading-none tracking-tight">
            Código QR de Acceso
          </h3>
        </div>

        <div className="flex flex-col items-center p-6 pt-0">
          <div
            className="flex h-32 w-32 items-center justify-center rounded-lg cursor-pointer"
            onClick={() => setShowModal(true)}
          >
            <img
              src="/images/qr-code.png"
              alt="Código QR"
              className="h-28 w-28 object-contain"
            />
          </div>
          <p className="mt-4 text-center text-sm font-medium">Escanea para ingresar</p>
        </div>
      </div>

      {/* Modal QR */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60">
          <div className="relative w-full max-w-md rounded-xl bg-white p-6 shadow-lg text-center">
            <button
              onClick={() => setShowModal(false)}
              className="absolute top-3 right-3 text-orange-600 hover:text-orange-700 text-xl font-bold"
              aria-label="Cerrar"
            >
              ×
            </button>

            <h4 className="text-lg font-semibold text-gray-800 mb-4">Código QR de Acceso</h4>

            <img
              src="/images/qr-code.png"
              alt="Código QR ampliado"
              className="mx-auto h-48 w-48 object-contain mb-4"
            />

            <p className="text-base font-semibold text-gray-900">{name}</p>
            <p className="text-sm text-gray-500 mb-2">{id}</p>
            <p className="text-sm text-gray-600">Presenta este código en la recepción</p>

            <div className="mt-6 flex justify-center gap-4">
              <button className={modalButtonStyle}>
                Descargar
              </button>
              <button className={modalButtonStyle}>
                Compartir
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}