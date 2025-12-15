import { Info, Trash2, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { MembershipType } from "@vitalfit/sdk";

interface Props {
  plan: MembershipType;
  onRemove: () => void;
}

export const MembershipSummary = ({ plan, onRemove }: Props) => (
  <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
    <div className="p-6 border-b border-gray-100 flex justify-between items-start">
      <div>
        <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2">
          {plan.name}
          <span className="bg-orange-100 text-orange-600 p-1 rounded-full">
            <Info size={14} />
          </span>
        </h2>
        <p className="text-gray-500 text-sm mt-1">
          {plan.description || "Plan de membresía seleccionado."}
        </p>
      </div>
      <Button
        variant="ghost"
        size="sm"
        className="text-gray-400 hover:text-red-500 hover:bg-red-50"
        onClick={onRemove}
      >
        <Trash2 size={18} />
      </Button>
    </div>

    <div className="bg-gray-50/50 p-6 flex flex-col sm:flex-row justify-between items-center gap-4">
      <div className="flex flex-col">
        <span className="text-sm text-gray-500 font-medium uppercase tracking-wide">
          Precio Total
        </span>
        <div className="flex items-baseline gap-1">
          <span className="text-3xl font-bold text-gray-900">
            ${plan.price}
          </span>
        </div>
      </div>
      {plan.duration_days && (
        <div className="px-4 py-2 bg-white border border-gray-200 rounded-lg shadow-sm">
          <span className="text-sm font-medium text-gray-600 flex items-center gap-2">
            <CheckCircle2 size={16} className="text-green-500" />
            Duración: {plan.duration_days} días
          </span>
        </div>
      )}
    </div>
  </div>
);
