"use client";

import { Link } from "@/i18n/routing";
import {
  CheckCircle2,
  ArrowRight,
  Clock,
  Download,
  HelpCircle,
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
  const stateConfig = {
    success: {
      icon: <CheckCircle2 className="w-12 h-12 text-green-600" />,
      bgIcon: "bg-green-100",
      title: "¡Membresía Activada!",
      desc: "Gracias por tu compra. Todo está listo para que comiences a entrenar.",
      color: "text-green-600",
      borderColor: "border-green-200",
    },
    pending: {
      icon: <Clock className="w-12 h-12 text-orange-600" />,
      bgIcon: "bg-orange-100",
      title: "Pago en Revisión",
      desc: "Hemos recibido tu comprobante. Validaremos la transacción en las próximas 24 horas.",
      color: "text-orange-600",
      borderColor: "border-orange-200",
    },
  };

  const activeState = isPending ? stateConfig.pending : stateConfig.success;

  return (
    <div className="flex items-center justify-center min-h-[60vh] p-4 animate-in fade-in zoom-in-95 duration-500">
      <Card className="w-full max-w-md bg-white rounded-3xl shadow-2xl overflow-hidden border border-gray-100">
        <div className="pt-10 pb-6 px-8 text-center bg-white relative">
          <div
            className={`mx-auto w-24 h-24 rounded-full flex items-center justify-center mb-6 ${activeState.bgIcon} ring-8 ring-white shadow-sm`}
          >
            {activeState.icon}
          </div>

          <h2 className="text-2xl font-bold text-gray-900 tracking-tight mb-2">
            {activeState.title}
          </h2>
          <p className="text-gray-500 text-sm leading-relaxed">
            {activeState.desc}
          </p>
        </div>
        <div className="px-6 pb-6">
          <div className="bg-slate-50 rounded-2xl p-6 border border-slate-100 relative">
            <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 w-4 h-4 bg-white rounded-full border border-gray-100"></div>

            <div className="flex flex-col gap-4">
              <div className="text-center border-b border-dashed border-gray-300 pb-4">
                <span className="text-xs font-semibold text-gray-400 uppercase tracking-wider">
                  Monto Pagado
                </span>
                <div className="text-3xl font-extrabold text-slate-900 mt-1">
                  {currency} {amountPaid.toFixed(2)}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-y-4 text-sm pt-2">
                <div className="flex flex-col">
                  <span className="text-gray-400 text-xs">Referencia</span>
                  <span className="font-mono text-gray-700 font-medium truncate pr-2">
                    {invoiceNumber}
                  </span>
                </div>
                <div className="flex flex-col text-right">
                  <span className="text-gray-400 text-xs">Fecha</span>
                  <span className="text-gray-700 font-medium">{date}</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="p-6 pt-0 bg-white">
          <Link href="/dashboard" className="block w-full">
            <Button className="w-full h-12 text-base rounded-xl">
              Ir al Dashboard <ArrowRight size={18} className="ml-2" />
            </Button>
          </Link>

          <div className="mt-6 flex justify-center">
            <a
              href="mailto:soporte@vitalfit.com"
              className="flex items-center gap-1.5 text-xs text-gray-400 hover:text-gray-600 transition-colors"
            >
              <HelpCircle size={14} />
              <span>
                ¿Necesitas ayuda? <span className="underline">Contáctanos</span>
              </span>
            </a>
          </div>
        </div>
      </Card>
    </div>
  );
};
