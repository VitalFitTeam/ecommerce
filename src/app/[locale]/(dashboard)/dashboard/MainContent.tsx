"use client";

import BannerOffer from "./BannerOffer";
import { MembershipSummary } from "./MembershipSummary";
import UpcomingClasses from "./UpcomingClasses";
import PaymentHistory from "./PaymentHistory";
import { useAuth } from "@/context/AuthContext";

export default function MainContent() {
  const { user, loading } = useAuth();

  if (loading) {
    // Tip: Usa un Skeleton Loader aquí en lugar de texto plano para mejor UX
    return (
      <div className="flex-1 p-8 animate-pulse bg-gray-50">Cargando...</div>
    );
  }

  if (!user) {
    return (
      <div className="flex-1 p-8">
        No se ha encontrado información del usuario.
      </div>
    );
  }

  // Verificar si tiene membresía activa para decidir si mostramos el banner
  const hasActiveMembership = user.client_membership?.status === "Active";

  return (
    <main className="flex-1 p-8">
      <div className="space-y-6">
        {/* Lógica de UX: Solo mostramos oferta si NO tiene membresía activa */}
        {!hasActiveMembership && <BannerOffer />}

        {/* TypeScript ahora está feliz porque los tipos coinciden */}
        <MembershipSummary clientMembership={user.client_membership} />

        <UpcomingClasses />
        <PaymentHistory />
      </div>
    </main>
  );
}
