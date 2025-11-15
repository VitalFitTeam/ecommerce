"use client";

import { useTranslations } from "next-intl";
import { MoreVertical } from "lucide-react";

export default function PaymentHistory() {
  const t = useTranslations("paymentHistory");

  const payments = [
    {
      id: "TX-IA0001",
      date: "10/11/2025",
      amount: "$250.00",
      status: t("statusPaid"),
      method: "Tarjeta Crédito***6671",
      action: "...",
    },
    {
      id: "TX-IA0002",
      date: "10/11/2025",
      amount: "$250.00",
      status: t("statusRefunded"),
      method: "Tarjeta Crédito***6671",
      action: "...",
    },
    {
      id: "TX-IA0003",
      date: "10/11/2025",
      amount: "$250.00",
      status: t("statusPending"),
      method: "Tarjeta Crédito***6671",
      action: "...",
    },
    {
      id: "TX-IA0004",
      date: "10/11/2025",
      amount: "$250.00",
      status: t("statusPending"),
      method: "Tarjeta Crédito***6671",
      action: "...",
    },
    {
      id: "TX-IA0005",
      date: "10/11/2025",
      amount: "$250.00",
      status: t("statusPending"),
      method: "Tarjeta Crédito***6671",
      action: "...",
    },
  ];

  const getStatusStyle = (status: string) => {
    switch (status) {
      case t("statusPaid"):
        return "border border-green-300 text-green-500";
      case t("statusRefunded"):
        return "border border-gray-300 text-gray-500";
      case t("statusPending"):
        return "border border-yellow-300 text-yellow-500";
      default:
        return "border border-gray-300 text-gray-800";
    }
  };

  return (
    <div className="bg-white rounded-lg p-6 border border-gray-200">
      <h3 className="text-lg font-bold mb-6">{t("title")}</h3>

      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-gray-200">
              <th className="text-left py-3 px-4 font-semibold text-gray-700">
                {t("columns.transactionId")}
              </th>
              <th className="text-left py-3 px-4 font-semibold text-gray-700">
                {t("columns.date")}
              </th>
              <th className="text-left py-3 px-4 font-semibold text-gray-700">
                {t("columns.totalPrice")}
              </th>
              <th className="text-left py-3 px-4 font-semibold text-gray-700">
                {t("columns.status")}
              </th>
              <th className="text-left py-3 px-4 font-semibold text-gray-700">
                {t("columns.paymentMethod")}
              </th>
              <th className="text-left py-3 px-4 font-semibold text-gray-700">
                {t("columns.actions")}
              </th>
            </tr>
          </thead>
          <tbody>
            {payments.map((payment) => (
              <tr
                key={payment.id}
                className="border-b border-gray-100 hover:bg-gray-50"
              >
                <td className="py-4 px-4 text-gray-600">{payment.id}</td>
                <td className="py-4 px-4 text-gray-600">{payment.date}</td>
                <td className="py-4 px-4 text-gray-600">{payment.amount}</td>
                <td className="py-4 px-4">
                  <span
                    className={`${getStatusStyle(payment.status)} px-3 py-1 rounded text-xs font-semibold`}
                  >
                    {payment.status}
                  </span>
                </td>
                <td className="py-4 px-4 text-gray-600">{payment.method}</td>
                <td className="py-4 px-4 text-center">
                  <button className="text-gray-400 hover:text-gray-600">
                    <MoreVertical size={18} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
