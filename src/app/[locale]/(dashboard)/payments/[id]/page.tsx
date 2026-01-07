"use client";

import { use } from "react";
import { useTranslations } from "next-intl";
import { useInvoiceDetail } from "@/hooks/useInvoiceDetail";
import {
  Loader2,
  ArrowLeft,
  Download,
  Mail,
  FileText,
  CheckCircle,
  Clock,
  XCircle,
  Calendar,
  Store,
  CreditCard,
  Hash,
  AlertCircle,
  Ban,
} from "lucide-react";
import { Link } from "@/i18n/routing";
import InvoiceItemsTable from "@/components/features/invoice/InvoiceItemsTable";
import { useAuth } from "@/context/AuthContext";
import { useBranches } from "@/hooks/useBranches";
import { Button } from "@/components/ui/button";
import { usePaymentMethod } from "@/hooks/usePaymentMethods";

const formatMoney = (amount: string | number | undefined) => {
  const value = Number(amount) || 0;
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  }).format(value);
};

const formatDate = (dateString: string) => {
  if (!dateString) {
    return "-";
  }

  try {
    const date = new Date(dateString);

    if (isNaN(date.getTime())) {
      return "-";
    }

    return date.toLocaleDateString("es-ES", {
      timeZone: "UTC",
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    });
  } catch (error) {
    return "-";
  }
};

const formatShortDate = (dateString?: string) => {
  if (!dateString) {
    return "-";
  }

  try {
    const date = new Date(dateString);
    if (isNaN(date.getTime())) {
      return "-";
    }

    return date.toLocaleDateString("es-VE", {
      timeZone: "UTC",
      day: "2-digit",
      month: "long",
      year: "numeric",
    });
  } catch {
    return dateString;
  }
};

const StatusPill: React.FC<{ status?: string }> = ({ status }) => {
  const t = useTranslations("invoiceDetails.status");
  const s = String(status || "").toLowerCase();

  const baseClasses =
    "inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider border";

  if (["paid", "completed", "confirmado"].includes(s)) {
    return (
      <span
        className={`${baseClasses} bg-emerald-50 text-emerald-700 border-emerald-100`}
      >
        <CheckCircle size={12} strokeWidth={3} /> {t("paid")}
      </span>
    );
  }

  if (["pending", "processing", "unpaid"].includes(s)) {
    return (
      <span
        className={`${baseClasses} bg-amber-50 text-amber-700 border-amber-100`}
      >
        <Clock size={12} strokeWidth={3} /> {t("pending")}
      </span>
    );
  }

  if (s === "overdue") {
    return (
      <span className={`${baseClasses} bg-red-50 text-red-700 border-red-100`}>
        <AlertCircle size={12} strokeWidth={3} /> {t("overdue")}
      </span>
    );
  }

  if (s === "void") {
    return (
      <span
        className={`${baseClasses} bg-gray-100 text-gray-600 border-gray-200`}
      >
        <Ban size={12} strokeWidth={3} /> {t("void")}
      </span>
    );
  }

  return (
    <span className={`${baseClasses} bg-red-50 text-red-700 border-red-100`}>
      <XCircle size={12} strokeWidth={3} /> {status}
    </span>
  );
};

export default function InvoiceDetailsPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const t = useTranslations("invoiceDetails");

  const { invoice, loading, error } = useInvoiceDetail(id);
  const { token } = useAuth();
  const { branches, loading: branchesLoading } = useBranches(token || "");

  const mainPayment = invoice?.payments?.[0];

  const { paymentMethod, isLoading: loadingPaymentMethod } = usePaymentMethod(
    mainPayment?.payment_method_id,
    token || "",
  );

  const branch = branches.find((b) => b.branch_id === invoice?.branch_id);

  if (loading) {
    return (
      <div className="flex h-[70vh] items-center justify-center bg-gray-50/30">
        <Loader2 className="h-8 w-8 animate-spin text-gray-300" />
      </div>
    );
  }

  if (error || !invoice) {
    return (
      <div className="flex h-[70vh] flex-col items-center justify-center gap-4 bg-gray-50/30">
        <div className="bg-white p-4 rounded-full shadow-sm border border-red-100">
          <XCircle size={40} className="text-red-400" />
        </div>
        <h2 className="text-lg font-semibold text-gray-900">
          {t("errors.notFound")}
        </h2>
        <Link
          href="/payments"
          className="text-sm font-medium text-orange-600 hover:text-orange-700 transition-colors"
        >
          &larr; {t("backToHistory")}
        </Link>
      </div>
    );
  }

  const displayRef =
    invoice.invoice_number || invoice.invoice_id?.substring(0, 8).toUpperCase();

  return (
    <div className="min-h-screen bg-gray-50/30 py-12 px-4 sm:px-6 font-sans text-gray-900">
      <div className="max-w-5xl mx-auto">
        <div className="mb-8 pl-1">
          <Link
            href="/payments"
            className="inline-flex items-center text-sm font-medium text-gray-500 hover:text-gray-900 transition-all group"
          >
            <ArrowLeft
              size={16}
              className="mr-2 group-hover:-translate-x-1 transition-transform"
            />
            {t("backToHistory")}
          </Link>
        </div>

        <div className="bg-white rounded-2xl border border-gray-100 shadow-xl shadow-gray-200/40 overflow-hidden">
          <div className="px-8 pt-8 pb-6 border-b border-gray-50 flex justify-between items-center">
            <h1 className="text-xl font-bold text-gray-900 tracking-tight flex items-center gap-3">
              {t("title")}
              <span className="text-gray-300 font-light">|</span>
              <span className="text-gray-400 font-mono text-base font-normal">
                #{displayRef}
              </span>
            </h1>
            <div className="hidden sm:block">
              <StatusPill status={invoice.status} />
            </div>
          </div>

          <div className="p-8">
            <div className="flex flex-col lg:flex-row gap-12 mb-12">
              <div className="flex-1">
                <h2 className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-6 flex items-center gap-2">
                  <Hash size={14} /> {t("summary.title")}
                </h2>

                <div className="grid grid-cols-[140px_1fr] sm:grid-cols-[180px_1fr] gap-y-5 text-sm">
                  <span className="text-gray-500 font-medium">
                    {t("summary.issueDate")}
                  </span>
                  <span className="font-semibold text-gray-900">
                    {formatDate(invoice.issue_date)}
                  </span>
                  <span className="text-gray-500 font-medium sm:hidden">
                    {t("summary.statusLabel")}
                  </span>
                  <div className="sm:hidden">
                    <StatusPill status={invoice.status} />
                  </div>
                  <span className="text-gray-500 font-medium self-center">
                    {t("summary.paymentMethod")}
                  </span>
                  <div className="flex items-center gap-3">
                    {loadingPaymentMethod ? (
                      <span className="text-gray-300 italic">
                        {t("summary.loading")}
                      </span>
                    ) : (
                      <span className="font-medium text-gray-900 capitalize">
                        {paymentMethod?.name || t("summary.unspecified")}
                      </span>
                    )}
                  </div>

                  <span className="text-gray-500 font-medium self-center">
                    {t("summary.branch")}
                  </span>
                  <div className="flex items-center gap-3">
                    {branchesLoading ? (
                      <span className="text-gray-300 italic">
                        {t("summary.loading")}
                      </span>
                    ) : (
                      <span className="font-medium text-gray-900">
                        {branch?.name || t("summary.mainBranch")}
                      </span>
                    )}
                  </div>
                </div>
              </div>

              <div className="flex flex-col gap-3 w-full lg:w-72">
                <h2 className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-3 lg:mb-6 lg:text-right flex items-center gap-2 lg:justify-end">
                  <FileText size={14} /> {t("actions.title")}
                </h2>
                <Button
                  variant="outline"
                  className="justify-start h-11 border-gray-200 text-gray-600 hover:text-gray-900 hover:border-gray-300 hover:bg-gray-50 shadow-sm transition-all group"
                >
                  <Download
                    size={16}
                    className="mr-3 text-gray-400 group-hover:text-gray-600"
                  />{" "}
                  {t("actions.download")}
                </Button>
                <Button
                  variant="outline"
                  className="justify-start h-11 border-gray-200 text-gray-600 hover:text-gray-900 hover:border-gray-300 hover:bg-gray-50 shadow-sm transition-all group"
                >
                  <Mail
                    size={16}
                    className="mr-3 text-gray-400 group-hover:text-gray-600"
                  />{" "}
                  {t("actions.email")}
                </Button>
              </div>
            </div>

            <div className="mb-10 p-1">
              <div className="border border-gray-100 rounded-xl p-6 bg-gray-50/50 flex flex-col sm:flex-row gap-8 sm:gap-16 items-start sm:items-center relative overflow-hidden">
                <div className="absolute top-0 right-0 p-4 opacity-5 pointer-events-none">
                  <Calendar size={120} />
                </div>

                <div>
                  <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1 block">
                    {t("planValidity.from")}
                  </span>
                  <div className="flex items-center gap-2 text-gray-900 text-lg font-semibold">
                    <Calendar size={18} className="text-orange-400" />
                    {formatShortDate(invoice.issue_date)}
                  </div>
                </div>

                <div className="hidden sm:block h-8 w-px bg-gray-300/50"></div>

                <div>
                  <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1 block">
                    {t("planValidity.to")}
                  </span>
                  <div className="flex items-center gap-2 text-gray-900 text-lg font-semibold">
                    <Calendar size={18} className="text-orange-400" />
                    {formatShortDate(invoice.due_date)}
                  </div>
                </div>
              </div>
            </div>

            <div className="mb-8">
              <h2 className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-4">
                {t("conceptsTitle")}
              </h2>
              <div className="border border-gray-100 rounded-xl overflow-hidden shadow-sm">
                <InvoiceItemsTable data={invoice.invoice_items || []} />
              </div>
            </div>
            <div className="flex justify-end pt-2">
              <div className="w-full sm:w-1/2 lg:w-1/3 bg-gray-50/50 rounded-xl p-6 border border-gray-100 space-y-3">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500 font-medium">
                    {t("totals.subtotal")}
                  </span>
                  <span className="text-gray-900 font-semibold">
                    {formatMoney(invoice.sub_total)}
                  </span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500 font-medium">
                    {t("totals.tax")}
                  </span>
                  <span className="text-gray-900 font-semibold">
                    {formatMoney(invoice.tax)}
                  </span>
                </div>
                <div className="border-t border-gray-200 my-2"></div>
                <div className="flex justify-between items-center">
                  <span className="text-base font-bold text-gray-900">
                    {t("totals.total")}
                  </span>
                  <span className="text-2xl font-bold text-gray-900 tracking-tight">
                    {formatMoney(invoice.total_amount)}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
