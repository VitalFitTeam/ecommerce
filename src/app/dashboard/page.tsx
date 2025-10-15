import { Header } from "@/components/dashboard/header";
import { typography } from "@/styles/styles";

export default function DashboardPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <Header name="Albani Barragan" email="albani@gmail.com" />

      <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="text-center">
          <h1
            className={
              typography.h2 +
              "text-3xl font-bold uppercase tracking-tight text-gray-900"
            }
          >
            Bienvenido Albani
          </h1>
          <p className="mt-2 text-sm text-gray-600">
            Gestiona tu membresía y accede a todas las funcionalidades de tu
            gimnasio
          </p>
        </div>
      </main>
    </div>
  );
}
