"use client";

import MagnifyingGlassIcon from "@heroicons/react/24/outline/MagnifyingGlassIcon";
import Header from "@/components/layout/dashboard/Header";
import Sidebar from "@/components/layout/dashboard/Sidebar";
import Footer from "@/components/layout/Footer";
import { useAuth } from "@/context/AuthContext";
import { useTranslations } from "next-intl";
import { PageHeader } from "@/components/ui/PageHeader";
import { DataTable } from "@/components/ui/table/DataTable";
import { Eye, Download } from "lucide-react";
import { RowActions } from "@/components/ui/table/RowActions";
import { Input } from "@/components/ui/Input";
import { useState, useMemo, useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import { useRouter } from "@/i18n/routing";

export default function HistoryPaymentPage() {
  const { token } = useAuth();
  const router = useRouter();
  const t = useTranslations("PaymentHistoryScreen");

  const [payName, setpayName] = useState("");
  const [status, setStatus] = useState("all");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");

  const showClearFilters = useMemo(() => {
    return payName || status !== "all" || startDate || endDate;
  }, [payName, status, startDate, endDate]);

  useEffect(() => {
    if (!token) {
      router.push("/login");
    }
  }, [token, router]);

  if (!token) {
    return null;
  }

  const clearFilters = () => {
    setpayName("");
    setStatus("all");
    setStartDate("");
    setEndDate("");
  };

  const payments = [
    {
      id: "m1",
      transactionId: "TX-149D03",
      date: "10/11/2025",
      totalPrice: "$250.00",
      status: t("status.paid"),
      paymentMethod: "****4567",
    },
    {
      id: "m2",
      transactionId: "TX-149D03",
      date: "10/11/2025",
      totalPrice: "$250.00",
      status: t("status.refunded"),
      paymentMethod: "****4567",
    },
    {
      id: "m3",
      transactionId: "TX-149D03",
      date: "10/11/2025",
      totalPrice: "$250.00",
      status: t("status.pending"),
      paymentMethod: "****4567",
    },
  ];

  const getStatusStyle = (status: string) => {
    switch (status) {
      case t("status.paid"):
        return "border border-green-300 text-green-600";
      case t("status.pending"):
        return "border border-yellow-300 text-yellow-500";
      case t("status.refunded"):
        return "border border-gray-300 text-gray-500";
      default:
        return "border border-gray-300 text-gray-800";
    }
  };

  const columns = [
    {
      header: t("columns.transactionId"),
      accessor: "transactionId" as const,
    },
    {
      header: t("columns.date"),
      accessor: "date" as const,
    },
    {
      header: t("columns.totalPrice"),
      accessor: "totalPrice" as const,
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
      accessor: "paymentMethod" as const,
    },
  ];

  const actions = (row: any) => (
    <RowActions
      menuLabel={""}
      actions={[
        {
          label: t("actions.viewDetails"),
          icon: Eye,
          onClick: () => {
            console.log("Ver detalles de:", row);
            router.push(`/payments/history/${row.id}`);
          },
        },
        {
          label: t("actions.downloadReceipt"),
          icon: Download,
          onClick: () => {
            console.log("Descargar recibo de:", row);
          },
        },
      ]}
    />
  );

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <div className="flex">
        <Sidebar />
        <main className="flex-1 p-8">
          <PageHeader title={t("title")} />
          <div className="space-y-4 my-4">
            <div className="flex flex-wrap gap-4 items-end">
              <div className="relative w-full sm:w-[250px]">
                <MagnifyingGlassIcon className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  type="text"
                  placeholder={t("filters.payname")}
                  className="w-64 pl-9"
                  value={payName}
                  onChange={(e) => setpayName(e.target.value)}
                />
              </div>

              <Select value={status} onValueChange={setStatus}>
                <SelectTrigger className="w-48">
                  <SelectValue placeholder={t("filters.status")} />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">{t("filters.status")}</SelectItem>
                  <SelectItem value="paid">{t("status.paid")}</SelectItem>
                  <SelectItem value="refunded">
                    {t("status.refunded")}
                  </SelectItem>
                  <SelectItem value="pending">{t("status.pending")}</SelectItem>
                </SelectContent>
              </Select>

              <Input
                type="date"
                placeholder={t("filters.startDate")}
                className="w-40"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
              />
              <Input
                type="date"
                placeholder={t("filters.endDate")}
                className="w-40"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
              />

              {showClearFilters && (
                <Button variant="outline" onClick={clearFilters}>
                  {t("filters.clear")}
                </Button>
              )}
            </div>

            <DataTable
              columns={columns}
              data={payments}
              actions={actions}
              enableRowSelection={false}
            />
          </div>
        </main>
      </div>
      <Footer />
    </div>
  );
}
