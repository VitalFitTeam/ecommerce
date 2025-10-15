"use client";
import {
  CalendarIcon,
  CreditCardIcon,
  CalendarDaysIcon,
  BookmarkIcon,
} from "@heroicons/react/24/outline";
import { typography } from "@/styles/styles";
import Card from "@/components/dashboard/Card";
import QuickButton from "@/components/dashboard/QuickButton";

export function QuickActions() {
  const quickTitle = typography.h3 + " text-center uppercase text-orange-600";
  return (
    <Card>
      <div className="p-6 pb-4">
        <h3 className={quickTitle}>Acciones Rápidas</h3>
      </div>
      <div className="p-6 pt-0 grid grid-cols-2 gap-3">
        <QuickButton>
          <CalendarIcon className="h-4 w-4" />
          <span className="text-sm">Clases</span>
        </QuickButton>

        <QuickButton>
          <CreditCardIcon className="h-4 w-4" />
          <span className="text-sm">Historial pago</span>
        </QuickButton>

        <QuickButton>
          <CalendarDaysIcon className="h-4 w-4" />
          <span className="text-sm">Mi Calendario</span>
        </QuickButton>

        <QuickButton>
          <BookmarkIcon className="h-4 w-4" />
          <span className="text-sm">Wishlist</span>
        </QuickButton>
      </div>
    </Card>
  );
}
