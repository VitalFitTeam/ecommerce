"use client";

import { useState, useMemo } from "react";
import { useRouter } from "@/i18n/routing";
import { useTranslations } from "next-intl";
import MagnifyingGlassIcon from "@heroicons/react/24/outline/MagnifyingGlassIcon";
import { Eye, Download } from "lucide-react";

import { PageHeader } from "@/components/ui/PageHeader";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import { RowActions } from "@/components/ui/table/RowActions";
import PaymentHistoryTable from "@/components/layout/dashboard/PaymentHistoryTable";
import { useMyInvoices } from "@/hooks/useClientInvoices";

export default function HistoryPaymentPage() {
  const t = useTranslations("paymentHistory");
  const router = useRouter();

  const [payName, setPayName] = useState("");
  const [status, setStatus] = useState("all");

  const {
    invoices,
    loading: invoicesLoading,
    page,
    setPage,
    totalPages,
    setSearch,
  } = useMyInvoices({ limit: 10 });

  const showClearFilters = payName || status !== "all";

  const clearFilters = () => {
    setPayName("");
    setStatus("all");
    setSearch("");
    setPage(1);
  };

  const handleSearchChange = (value: string) => {
    setPayName(value);
    setSearch(value);
    setPage(1);
  };

  const filteredInvoices = useMemo(() => {
    return invoices.filter((inv) => {
      let matches = true;

      if (status !== "all") {
        matches = matches && inv.status.toLowerCase() === status.toLowerCase();
      }

      if (payName) {
        matches =
          matches &&
          inv.invoice_id.toLowerCase().includes(payName.toLowerCase());
      }

      return matches;
    });
  }, [invoices, status, payName]);

  const actions = (row: any) => (
    <RowActions
      menuLabel=""
      actions={[
        {
          label: t("actions.viewDetails"),
          icon: Eye,
          onClick: () => router.push(`/payments/history/${row.invoice_id}`),
        },
        {
          label: t("actions.downloadReceipt"),
          icon: Download,
          onClick: () => console.log("Descargar recibo de:", row.invoice_id),
        },
      ]}
    />
  );

  return (
    <div className="min-h-screen">
      <main className="p-8">
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
                onChange={(e) => handleSearchChange(e.target.value)}
              />
            </div>

            <Select value={status} onValueChange={setStatus}>
              <SelectTrigger className="w-48">
                <SelectValue placeholder={t("filters.status")} />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">{t("filters.status")}</SelectItem>
                <SelectItem value="completed">
                  {t("status.completed")}
                </SelectItem>
                <SelectItem value="pending">{t("status.pending")}</SelectItem>
                <SelectItem value="refunded">{t("status.refunded")}</SelectItem>
                <SelectItem value="failed">{t("status.failed")}</SelectItem>
              </SelectContent>
            </Select>

            {showClearFilters && (
              <Button variant="outline" onClick={clearFilters}>
                {t("filters.clear")}
              </Button>
            )}
          </div>

          <PaymentHistoryTable
            data={filteredInvoices}
            loading={invoicesLoading}
            page={page}
            totalPages={totalPages}
            onPageChange={setPage}
          />
        </div>
      </main>
    </div>
  );
}
