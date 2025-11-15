"use client";

import BannerOffer from "./BannerOffer";
import { MembershipSummary } from "./MembershipSummary";
import UpcomingClasses from "./UpcomingClasses";
import PaymentHistory from "./PaymentHistory";

export default function MainContent() {
  return (
    <main className="flex-1 p-8">
      <div className="space-y-6">
        <BannerOffer />
        <MembershipSummary
          status={true}
          plan="Premium"
          fecha="14 Enero 2024"
          vence="15 Enero 2025"
          dias={30}
        />
        <UpcomingClasses />
        <PaymentHistory />
      </div>
    </main>
  );
}
