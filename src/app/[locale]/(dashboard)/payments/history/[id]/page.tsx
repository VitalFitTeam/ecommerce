"use client";

import { useParams } from "next/navigation";
import { useTranslations } from "next-intl";
import { Button } from "@/components/ui/button";
import { PageHeader } from "@/components/ui/PageHeader";
import { DataTable, Column } from "@/components/ui/table/DataTable";
import { Card, CardContent } from "@/components/ui/Card";
import { EnvelopeIcon, ArrowDownTrayIcon } from "@heroicons/react/24/outline";

export default function MembershipDetailPage() {
  const { id } = useParams();
  const t = useTranslations("PaymentHistoryScreenDetail");

  const transaction = {
    transactionId: "TX-1A9D04",
    dateTime: "11/11/2025 8:00 PM",
    status: t("status.paid"),
    paymentMethod: "Tarjeta Crédito (****4567)",
    total: "$250.00",
    startDate: "11/11/2025",
    endDate: "11/01/2025",
    items: [
      {
        type: "Membresía",
        name: "Premium Anual",
        quantity: 1,
        unitPrice: "$100.00",
        discount: "$50.00",
        total: "$50.00",
      },
      {
        type: "Paquete",
        name: "Paquete 5 Sesiones",
        quantity: 1,
        unitPrice: "$150.00",
        discount: "$50.00",
        total: "$100.00",
      },
    ],
  };

  const getStatusStyle = (status: string) => {
    switch (status) {
      case t("statusBadge.paid"):
        return "border border-green-300 text-green-600";
      case t("statusBadge.pending"):
        return "border border-yellow-300 text-yellow-500";
      case t("statusBadge.refunded"):
        return "border border-gray-300 text-gray-500";
      default:
        return "border border-gray-300 text-gray-800";
    }
  };

  const columns: Column<(typeof transaction.items)[number]>[] = [
    { header: t("columns.type"), accessor: "type" },
    { header: t("columns.name"), accessor: "name" },
    { header: t("columns.quantity"), accessor: "quantity" },
    { header: t("columns.unitPrice"), accessor: "unitPrice" },
    { header: t("columns.discount"), accessor: "discount" },
    { header: t("columns.total"), accessor: "total" },
  ];

  return (
    <div className="min-h-screen">
      <main className="p-8">
        <div className="p-6 space-y-6">
          <PageHeader title={t("title")} />
          <Card>
            <CardContent>
              <section className="p-6 space-y-4">
                <p className="text-lg font-semibold">{t("summary")}</p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
                  <div className="gap-4">
                    <div className="my-3">
                      <strong>{t("transactionId")}:</strong>
                      {transaction.transactionId}
                    </div>
                    <div className="my-3">
                      <strong>{t("dateTime")}:</strong>
                      {transaction.dateTime}
                    </div>
                    <div className="my-3 flex items-center gap-2">
                      <strong>{t("statusLabel")}:</strong>
                      <span
                        className={`${getStatusStyle(transaction.status)} px-3 py-1 rounded text-xs font-semibold`}
                      >
                        {transaction.status}
                      </span>
                    </div>
                    <div className="my-3">
                      <strong>{t("paymentMethod")}:</strong>
                      {transaction.paymentMethod}
                    </div>
                    <div className="my-3">
                      <strong>{t("total")}:</strong>
                      {transaction.total}
                    </div>
                  </div>
                  <div className="flex flex-col items-center gap-3">
                    <Button variant="outline" className="w-full min-w-[100px]">
                      <ArrowDownTrayIcon className="h-6 w-6" />
                      {t("download")}
                    </Button>
                    <Button variant="outline" className="w-full min-w-[100px]">
                      <EnvelopeIcon className="h-6 w-6" />
                      {t("sendEmail")}
                    </Button>
                    <Button variant="outline" className="w-full min-w-[100px]">
                      <ArrowDownTrayIcon className="h-6 w-6" />
                      {t("invoice")}
                    </Button>
                  </div>
                </div>
              </section>

              <section className="p-6 space-y-4">
                <p className="text-lg font-semibold">{t("planDetail")}</p>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <strong>{t("startDate")}:</strong> {transaction.startDate}
                  </div>
                  <div>
                    <strong>{t("endDate")}:</strong> {transaction.endDate}
                  </div>
                </div>

                <div className="overflow-auto mt-4">
                  <DataTable
                    columns={columns}
                    data={transaction.items}
                    enableRowSelection={false}
                    rowIdKey="name"
                  />
                </div>
              </section>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
}
