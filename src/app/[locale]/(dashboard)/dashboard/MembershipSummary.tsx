import { Card } from "@/components/ui/Card";
import { ArrowPathIcon, ClockIcon } from "@heroicons/react/24/outline";
import { Button } from "@/components/ui/button";
import { useTranslations } from "next-intl";
type MembershipSummaryProps = {
  status: boolean;
  plan: string;
  fecha: string;
  vence: string;
  dias: number;
};

export const MembershipSummary: React.FC<MembershipSummaryProps> = ({
  status,
  plan,
  fecha,
  vence,
  dias,
}) => {
  const t = useTranslations("membership");
  const statusBadge = status
    ? "bg-green-100 text-green-700"
    : "bg-red-100 text-red-700";
  return (
    <Card>
      <div className="bg-white rounded-lg p-6 border border-gray-200">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h3 className="text-lg font-bold">{t("title")}</h3>
            <p className="text-sm text-gray-500">{plan}</p>
          </div>
          <span
            className={`${statusBadge} px-3 py-1 rounded text-xs font-semibold`}
          >
            {status ? "Activa" : "Cancelada"}
          </span>
        </div>

        <div className="grid grid-cols-2 gap-6">
          <div>
            <div className="mb-4">
              <h4 className="text-gray-600 text-xs mb-1">{t("startLabel")}</h4>
              <p className="text-lg font-bold">{fecha}</p>
            </div>
            <div>
              <h4 className="text-gray-600 text-xs mb-1">{t("nextLabel")}</h4>
              <div className="flex items-center gap-2">
                <div className="text-xs text-orange-500 flex items-center">
                  <ClockIcon className="h-6 w-6 text-primary" />
                </div>
                <span className="text-sm text-gray-600">
                  {dias} {t("daysRemaining")}
                </span>
              </div>
            </div>
            <div className="mt-4 bg-gradient-to-r from-orange-400 to-orange-500 h-1 rounded w-2/3"></div>
          </div>

          <div>
            <h4 className="text-gray-600 text-xs mb-1">{t("expiryLabel")}</h4>
            <p className="text-lg font-bold">{vence}</p>
          </div>
        </div>

        <div className="flex gap-4 mt-6 pt-6 border-t border-gray-200">
          <Button>
            <ArrowPathIcon className="w-6 h-6" />
            {t("renewButton")}
          </Button>
          <Button className="bg-gray text-gray-600 hover:text-gray-800 text-sm font-semibold">
            {t("updatePlan")}
          </Button>
          <Button className="bg-transparent text-red-600 hover:text-red-700 text-sm font-semibold">
            {t("cancelMembership")}
          </Button>
        </div>
      </div>
    </Card>
  );
};
