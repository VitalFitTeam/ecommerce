import { Button } from "@/components/ui/button";
import { PublicMembershipResponse } from "@vitalfit/sdk";
import { PackageOption } from "./PackageCarousel";

interface Props {
  membership: PublicMembershipResponse;
  selectedPackage?: PackageOption | null;
  onCheckout?: () => void;
  isProcessing?: boolean;
  onBack?: () => void;
  isStep1: boolean;
}

export const OrderSummary = ({
  membership,
  selectedPackage,
  onCheckout,
  onBack,
  isStep1,
  isProcessing,
}: Props) => {
  const formatPrice = (price: number | string) => Number(price).toFixed(2);

  const hasDiscount =
    membership.ref_price &&
    Number(membership.ref_price) > Number(membership.price);

  // Calcular total sumando membresía + paquete
  const totalPrice =
    Number(membership.price) +
    (selectedPackage ? Number(selectedPackage.price) : 0);

  return (
    <div className="bg-white shadow-md rounded-xl border border-gray-100 overflow-hidden">
      <div className="bg-gray-50 px-6 py-4 border-b">
        <h3 className="text-xl font-bold">Resumen de tu compra</h3>
      </div>

      <div className="p-6 space-y-6">
        {/* Membresía */}
        <div className="p-4 bg-gray-50 rounded-lg border border-gray-100 shadow-sm">
          <p className="font-semibold text-lg">{membership.name}</p>

          {membership.duration_days > 0 && (
            <p className="text-sm text-gray-500 mt-2">
              Precio:{" "}
              <span className="font-medium">
                {membership.base_currency} ${formatPrice(membership.price)}
              </span>
            </p>
          )}
        </div>

        {/* Paquete extra */}
        {selectedPackage && (
          <div className="p-4 bg-gray-50 rounded-lg border border-gray-100 shadow-sm">
            <p className="font-semibold text-lg">{selectedPackage.name}</p>
            <p className="text-sm text-gray-500 mt-2">
              Precio:{" "}
              <span className="font-medium">
                {selectedPackage.base_currency} $
                {formatPrice(selectedPackage.price)}
              </span>
            </p>
          </div>
        )}

        {/* Descuento base */}
        {hasDiscount && (
          <div className="flex justify-between text-sm text-gray-400 line-through">
            <span>Precio base</span>
            <span>
              {membership.base_currency} ${formatPrice(membership.ref_price)}
            </span>
          </div>
        )}

        {/* Precio de la membresía */}
        <div className="flex justify-between text-lg font-bold">
          <span>Subtotal</span>
          <span>
            {membership.base_currency} ${formatPrice(membership.price)}
          </span>
        </div>

        {/* Precio del paquete extra */}
        {selectedPackage && (
          <div className="flex justify-between text-lg font-bold">
            <span>Paquete extra</span>
            <span>
              {selectedPackage.base_currency} $
              {formatPrice(selectedPackage.price)}
            </span>
          </div>
        )}

        {/* Total */}
        <div className="flex justify-between text-2xl font-extrabold border-t pt-4">
          <span>Total</span>
          <span>
            {membership.base_currency} ${formatPrice(totalPrice)}
          </span>
        </div>

        {/* Botones */}
        <div className="flex gap-2 pt-2">
          {onBack && (
            <Button onClick={onBack} variant="outline">
              Volver
            </Button>
          )}

          <Button onClick={onCheckout} disabled={isProcessing}>
            {isStep1 ? "Continuar al pago" : "Pagar"}
          </Button>
        </div>
      </div>
    </div>
  );
};
