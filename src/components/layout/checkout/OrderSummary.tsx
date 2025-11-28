import { Button } from "@/components/ui/button";
import { PublicMembershipResponse } from "@vitalfit/sdk";

interface Props {
  membership: PublicMembershipResponse;
  onCheckout: () => void;
  isProcessing?: boolean;
  onBack?: () => void;
  isStep1: boolean;
}

export const OrderSummary = ({
  membership,
  onCheckout,
  onBack,
  isStep1,
  isProcessing,
}: Props) => {
  const formatPrice = (price: number | string) => Number(price).toFixed(2);

  const hasDiscount =
    membership.ref_price &&
    Number(membership.ref_price) > Number(membership.price);

  return (
    <div className="bg-white shadow-md rounded-xl border border-gray-100 overflow-hidden">
      <div className="bg-gray-50 px-6 py-4 border-b">
        <h3 className="text-xl font-bold">Resumen de tu compra</h3>
      </div>

      <div className="p-6 space-y-6">
        <div className="p-4 bg-gray-50 rounded-lg border border-gray-100 shadow-sm">
          <p className="font-semibold text-lg">{membership.name}</p>

          {membership.duration_days > 0 && (
            <p className="text-sm text-gray-500 mt-2">
              {" "}
              Precio: <span className="font-medium">${membership.price}</span>
            </p>
          )}
        </div>

        <div className="space-y-2">
          {hasDiscount && (
            <div className="flex justify-between text-sm text-gray-400 line-through">
              <span>Precio base</span>
              <span>
                {membership.base_currency} ${formatPrice(membership.ref_price)}
              </span>
            </div>
          )}

          <div className="flex justify-between text-lg font-bold">
            <span>Precio</span>
            <span>
              {membership.base_currency} ${formatPrice(membership.price)}
            </span>
          </div>
        </div>
        <div className="flex justify-between text-2xl font-extrabold border-t pt-4">
          <span>Total</span>
          <span>
            {membership.base_currency} ${formatPrice(membership.price)}
          </span>
        </div>

        <div className="flex gap-2 pt-2">
          {onBack && (
            <Button onClick={onBack} variant="outline">
              Volver
            </Button>
          )}

          <Button onClick={onCheckout} disabled={isProcessing}>
            {isStep1 ? "Continuar al pago" : "Confirmar pago"}
          </Button>
        </div>
      </div>
    </div>
  );
};
