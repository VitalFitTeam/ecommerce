import {
  CreditCardIcon,
  CalendarIcon,
  CalendarDaysIcon,
} from "@heroicons/react/24/outline";
import { Card } from "@/components/ui/Card";
type HeaderProps = {
  status: boolean;
  plan: string;
  fecha: string;
  vence: string;
  sucursal: string;
};

export const Membership: React.FC<HeaderProps> = ({
  status,
  plan,
  fecha,
  vence,
  sucursal,
}) => {
  const statusBadge = status
    ? "bg-green-100 text-green-700"
    : "bg-red-100 text-red-700";
  return (
    <Card>
      <div className="flex flex-row items-center justify-between space-y-0 pb-4">
        <h3 className="text-lg font-semibold">Estado de Membresía</h3>
        <span
          className={
            "rounded-full px-3 py-1 text-sm font-medium " + statusBadge
          }
        >
          {status ? "Activa" : "Inactiva"}
        </span>
      </div>
      <div className="space-y-4">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-gray-100">
            <CreditCardIcon className="h-5 w-5 text-gray-700" />
          </div>
          <div>
            <p className="text-sm font-medium text-gray-900">Plan: {plan}</p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-gray-100">
            <CalendarIcon className="h-5 w-5 text-gray-700" />
          </div>
          <div>
            <p className="text-sm text-gray-600">Miembro desde: {fecha}</p>
          </div>
        </div>

        <div className="flex items-center gap-3 border-b pb-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-gray-100">
            <CalendarDaysIcon className="h-5 w-5 text-gray-700" />
          </div>
          <div>
            <p className="text-sm text-gray-600">Vence: {vence}</p>
          </div>
        </div>

        <div className="pt-2">
          <p className="text-sm font-medium text-gray-700">
            Sucursal: {sucursal}
          </p>
        </div>
      </div>
    </Card>
  );
};
