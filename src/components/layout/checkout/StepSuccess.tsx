"use client";

import { Link } from "@/i18n/routing";
import {
  CheckCircle2,
  Download,
  ArrowRight,
  Receipt,
  AlertCircle,
  Trophy,
  Dumbbell,
  Star,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/Card";

interface Props {
  invoiceNumber: string;
  amountPaid: number;
  currency: string;
  date: string;
  receiptUrl?: string;
  isPending?: boolean;
}

export const StepSuccess = ({
  invoiceNumber,
  amountPaid,
  currency,
  date,
  receiptUrl,
  isPending = false,
}: Props) => {
  const statusColor = isPending ? "text-orange-500" : "text-green-500";
  const statusBg = isPending ? "bg-orange-500" : "bg-green-500";
  const statusLightBg = isPending ? "bg-orange-50" : "bg-green-50";
  const statusBorder = isPending ? "border-orange-200" : "border-green-200";

  return (
    <div className="max-w-3xl mx-auto animate-in fade-in zoom-in-95 duration-500 p-4">
      <Card className="bg-white rounded-xl shadow-xl border-0 overflow-hidden relative">
        <div className={`absolute top-0 left-0 w-full h-2 ${statusBg}`} />

        <div className="p-8">
          <div className="text-center mb-8">
            <div className="flex justify-center mb-4">
              <div
                className={`w-20 h-20 ${statusBg} rounded-full flex items-center justify-center shadow-lg ring-4 ring-white`}
              >
                <CheckCircle2
                  className="w-10 h-10 text-white"
                  strokeWidth={2}
                />
              </div>
            </div>

            <h2 className="text-3xl font-bold text-gray-900 mb-2">
              {isPending ? "Pago Registrado" : "¡Membresía Activada!"}
            </h2>
            <p className="text-gray-500 max-w-md mx-auto">
              {isPending
                ? "Hemos recibido tu solicitud. Tu plan se activará en cuanto validemos la transacción."
                : "Gracias por tu compra. Todo está listo para que empieces a entrenar."}
            </p>
          </div>

          {isPending && (
            <div
              className={`mb-8 flex gap-4 p-4 rounded-lg ${statusLightBg} border ${statusBorder}`}
            >
              <AlertCircle className={`w-6 h-6 ${statusColor} flex-shrink-0`} />
              <div>
                <h4 className="font-bold text-gray-900 text-sm">
                  Verificación en proceso
                </h4>
                <p className="text-xs text-gray-700 mt-1">
                  Este proceso puede tardar hasta 24 horas. Te notificaremos por
                  correo electrónico cuando tu comprobante haya sido validado.
                </p>
              </div>
            </div>
          )}

          <div className="grid md:grid-cols-2 gap-8">
            <div className="bg-slate-50 rounded-xl border border-gray-200 overflow-hidden flex flex-col">
              <div className="bg-slate-100/80 p-3 border-b border-gray-200 flex items-center gap-2 text-gray-500">
                <Receipt size={16} />
                <span className="text-xs font-bold uppercase tracking-wider">
                  Detalles del Pago
                </span>
              </div>

              <div className="p-5 space-y-4 flex-1">
                <div>
                  <span className="text-xs text-gray-400 font-semibold uppercase">
                    Monto Total
                  </span>
                  <div className="flex items-baseline gap-1">
                    <span className="text-2xl font-bold text-gray-900">
                      {currency} {amountPaid?.toFixed(2)}
                    </span>
                  </div>
                </div>

                <div className="space-y-2 pt-2 border-t border-dashed border-gray-200">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-500">Referencia:</span>
                    <span className="font-mono text-gray-700 bg-white px-1.5 rounded border border-gray-200 text-xs py-0.5">
                      {invoiceNumber}
                    </span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-500">Fecha:</span>
                    <span className="text-gray-900 font-medium">{date}</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="flex flex-col justify-between">
              <div className="mt-6 text-center md:text-left">
                <p className="text-xs text-gray-400">
                  ¿Dudas? Contáctanos en{" "}
                  <a href="#" className="underline hover:text-orange-500">
                    soporte@vitalfit.com
                  </a>
                </p>
              </div>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-3 justify-center items-center mt-8 pt-6 border-t border-gray-100">
            <Link href="/dashboard" className="w-full sm:w-auto">
              <Button
                size="lg"
                className="w-full bg-gray-900 hover:bg-gray-800 text-white font-bold shadow-lg"
              >
                Ir al Dashboard <ArrowRight size={18} className="ml-2" />
              </Button>
            </Link>

            {receiptUrl && !isPending && (
              <a
                href={receiptUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full sm:w-auto"
              >
                <Button
                  variant="outline"
                  size="lg"
                  className="w-full text-gray-600 border-gray-300 hover:bg-gray-50"
                >
                  <Download size={18} className="mr-2" />
                  Descargar Recibo
                </Button>
              </a>
            )}
          </div>
        </div>
      </Card>
    </div>
  );
};
