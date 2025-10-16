import { typography } from "@/styles/styles";
import { Membership } from "@/components/dashboard/Membership";
import { QuickActions } from "@/components/dashboard/QuickActions";
import { Header } from "@/components/dashboard/header";
import { QRCodeCard } from "@/components/dashboard/QRCodeCard";
import { TipCard } from "@/components/dashboard/TipCard";
import { AppDownloadBanner } from "@/components/dashboard/AppDownloadBanner";
import { StatsCards } from "@/components/dashboard/StatsCards";

export default function DashboardPage() {
  return (
    <div className="min-h-screen bg-gray-100">
      <Header name="Albani Barragan" email="albani@gmail.com" />

      <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="text-center">
          <h1 className={`${typography.h2} uppercase tracking-tight text-gray-900`}>
            Bienvenido Albani
          </h1>
          <p className="mt-2 text-sm text-gray-600">
            Gestiona tu membresía y accede a todas las funcionalidades de tu gimnasio
          </p>
        </div>

        <div className="mt-8 grid grid-cols-1 gap-6 lg:grid-cols-3">
          <div className="space-y-10 lg:col-span-2 w-full">
            <Membership
              status={true}
              plan="Premium"
              fecha="14 Enero 2024"
              vence="15 Enero 2025"
              sucursal="Sucursal Oeste"
            />
            <StatsCards semana="4/5" calorias={1200} clases={0} />
            <AppDownloadBanner />
          </div>

          <div className="space-y-6 w-full">
            <QuickActions />
            <QRCodeCard id="FM-2024-001234" name="Albani Barragan" />
            <TipCard />
          </div>
        </div>
      </main>
    </div>
  );
}