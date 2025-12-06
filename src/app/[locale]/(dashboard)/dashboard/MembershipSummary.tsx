"use client";

import { useMemo } from "react";
import { useTranslations, useFormatter } from "next-intl";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/button";
import {
  ArrowPathIcon,
  ClockIcon,
  NoSymbolIcon,
  PlusCircleIcon,
} from "@heroicons/react/24/outline";
import { ClientMembership } from "@vitalfit/sdk";
import {
  MEMBERSHIP_STATUS_CONFIG,
  MembershipStatusType,
} from "@/constants/membershipStatus";
import { useRouter } from "@/i18n/routing";

interface MembershipSummaryProps {
  clientMembership: ClientMembership | null | undefined;
}

export const MembershipSummary: React.FC<MembershipSummaryProps> = ({
  clientMembership,
}) => {
  const t = useTranslations("membership");
  const format = useFormatter();
  const router = useRouter();

  const statusInfo = useMemo(() => {
    if (!clientMembership) {
      return null;
    }

    let statusKey =
      clientMembership.status.toLowerCase() as MembershipStatusType;

    if (!MEMBERSHIP_STATUS_CONFIG[statusKey]) {
      statusKey = "expired";
    }

    const start = new Date(clientMembership.start_date);
    const end = new Date(clientMembership.end_date);
    const now = new Date();

    const totalDuration = end.getTime() - start.getTime();
    const elapsed = now.getTime() - start.getTime();
    let daysRemaining = Math.ceil(
      (end.getTime() - now.getTime()) / (1000 * 60 * 60 * 24),
    );

    if (statusKey === "expired" || statusKey === "cancel") {
      daysRemaining = 0;
    }

    const progress = Math.min(
      Math.max((elapsed / totalDuration) * 100, 0),
      100,
    );
    const isUrgent = statusKey === "active" && daysRemaining <= 5;

    const visualConfig = MEMBERSHIP_STATUS_CONFIG[statusKey];

    const currentProgressColor = isUrgent
      ? "bg-red-500"
      : visualConfig.progressBarColor;

    return {
      start,
      end,
      daysRemaining,
      progress,
      statusKey,
      config: visualConfig,
      progressColor: currentProgressColor,
      planName: "Plan VIP",
    };
  }, [clientMembership]);

  if (!statusInfo) {
    return (
      <Card className="bg-white overflow-hidden">
        <div className="p-8 flex flex-col items-center justify-center text-center space-y-4">
          <div className="p-3 bg-blue-50 rounded-full">
            <PlusCircleIcon className="w-8 h-8 text-orange-400" />
          </div>
          <div className="space-y-1">
            <h3 className="text-lg font-bold text-gray-900">
              {t("noMembershipTitle")}
            </h3>
            <p className="text-sm text-gray-500 max-w-xs mx-auto">
              {t("noMembershipDescription")}
            </p>
          </div>

          <Button
            className="w-full sm:w-auto"
            onClick={() => router.push("/memberships")}
          >
            {t("acquireMembershipButton")}
          </Button>
        </div>
      </Card>
    );
  }

  const {
    start,
    end,
    daysRemaining,
    progress,
    config,
    progressColor,
    statusKey,
    planName,
  } = statusInfo;

  return (
    <Card className="overflow-hidden bg-white">
      <div className="p-6 space-y-6">
        {/* HEADER */}
        <div className="flex items-start justify-between">
          <div>
            <h3 className="text-lg font-bold text-gray-900">{t("title")}</h3>
            <p className="text-sm font-medium text-gray-500">{planName}</p>
          </div>
          <span
            className={`px-3 py-1 rounded-full text-xs font-bold border ${config.badgeColor}`}
          >
            {t(config.translationKey)}
          </span>
        </div>

        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span className="text-gray-500">{t("nextLabel")}</span>
            <span className={`font-bold flex gap-1 items-center text-gray-900`}>
              {statusKey === "cancel" ? (
                <NoSymbolIcon className={`w-4 h-4 ${config.iconColor}`} />
              ) : (
                <ClockIcon className={`w-4 h-4 ${config.iconColor}`} />
              )}

              {statusKey === "expired"
                ? t("expiredLabel")
                : `${daysRemaining} ${t("daysRemaining")}`}
            </span>
          </div>

          <div className="h-2 w-full bg-gray-100 rounded-full overflow-hidden">
            <div
              className={`h-full transition-all duration-500 ${progressColor}`}
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>

        {/* FECHAS */}
        <div className="flex justify-between text-sm pt-2">
          <div>
            <p className="text-gray-500 text-xs uppercase font-semibold">
              {t("startLabel")}
            </p>
            <p className="font-medium text-gray-900">
              {format.dateTime(start, { dateStyle: "medium" })}
            </p>
          </div>
          <div className="text-right">
            <p className="text-gray-500 text-xs uppercase font-semibold">
              {t("expiryLabel")}
            </p>
            <p
              className={`font-medium ${statusKey === "expired" ? "text-red-600" : "text-gray-900"}`}
            >
              {format.dateTime(end, { dateStyle: "medium" })}
            </p>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row gap-3 pt-4 border-t border-gray-100 mt-4">
          <Button
            className={`w-full sm:w-auto gap-2 ${statusKey === "expired" ? "bg-red-600 hover:bg-red-700" : ""}`}
          >
            <ArrowPathIcon className="w-4 h-4" />
            {statusKey === "active" ? t("renewButton") : t("reactivateButton")}
          </Button>

          {statusKey === "active" && (
            <Button variant="ghost" className="text-red-600 hover:bg-red-50">
              {t("cancelMembership")}
            </Button>
          )}
        </div>
      </div>
    </Card>
  );
};
