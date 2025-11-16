"use client";

import { useTranslations } from "next-intl";
import { MoreVertical } from "lucide-react";
import { DataTable } from "@/components/ui/table/DataTable";

export default function PaymentHistory() {
  const t = useTranslations("paymentHistory");

  const payments = [
    {
      id: "TX-IA0001",
      date: "10/11/2025",
      amount: "$250.00",
      status: t("statusPaid"),
      method: "Tarjeta Crédito***6671",
    },
    {
      id: "TX-IA0002",
      date: "10/11/2025",
      amount: "$250.00",
      status: t("statusRefunded"),
      method: "Tarjeta Crédito***6671",
    },
    {
      id: "TX-IA0003",
      date: "10/11/2025",
      amount: "$250.00",
      status: t("statusPending"),
      method: "Tarjeta Crédito***6671",
    },
    {
      id: "TX-IA0004",
      date: "10/11/2025",
      amount: "$250.00",
      status: t("statusPending"),
      method: "Tarjeta Crédito***6671",
    },
    {
      id: "TX-IA0005",
      date: "10/11/2025",
      amount: "$250.00",
      status: t("statusPending"),
      method: "Tarjeta Crédito***6671",
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

  const columns = [
    {
      header: t("columns.transactionId"),
      accessor: "id" as const,
    },
    {
      header: t("columns.date"),
      accessor: "date" as const,
    },
    {
      header: t("columns.totalPrice"),
      accessor: "amount" as const,
    },
    {
      header: t("columns.status"),
      accessor: "status" as const,
      render: (value: string) => (
        <span
          className={`${getStatusStyle(value)} px-3 py-1 rounded text-xs font-semibold`}
        >
          {value}
        </span>
      ),
    },
    {
      header: t("columns.paymentMethod"),
      accessor: "method" as const,
    },
  ];

  const actions = (row: any) => (
    <button className="text-gray-400 hover:text-gray-600">
      <MoreVertical size={18} />
    </button>
  );

  return (
    <div className="bg-white rounded-lg p-6 border border-gray-200">
      <h3 className="text-lg font-bold mb-6">{t("title")}</h3>

      <DataTable
        columns={columns}
        data={payments}
        actions={actions}
        enableRowSelection={false}
      />
    </div>
  );
}
