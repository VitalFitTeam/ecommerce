"use client";

import { Navbar } from "@/components/layout/Navbar";
import { MembershipCard } from "./MembershipCard";
import Footer from "@/components/layout/Footer";
import { Button } from "@/components/ui/button";
import {
  BuildingStorefrontIcon,
  DevicePhoneMobileIcon,
  UserGroupIcon,
  UserIcon,
} from "@heroicons/react/24/outline";
import { Card, CardContent, CardTitle } from "@/components/ui/Card";

export default function Memberships() {
  const membershipPlans = [
    {
      id: 1,
      title: "Suscripción avanzada",
      price: 75,
      billingPeriod: "mes",
      description: "Más beneficios a tu vida fitness",
      services: [
        "Acceso ilimitado al gimnasio",
        "7 sesiones con consultor fitness",
        "Seguimiento nutricional",
        "5 suplementos gratis",
        "Credencial de gimnasio",
        "Entrenador personal",
      ],
      featured: false,
    },
    {
      id: 2,
      title: "Plan estándar",
      price: 500,
      billingPeriod: "año",
      description: "Máximo ahorro y beneficios",
      services: [
        "Uso Ilimitado de las instalaciones",
        "Consultas con entrenador experto",
        "Control de alimentación",
        "Recibe 3 suplementos gratuitos",
        "Entrena 5 días a la semana",
        "Entrenador personal",
      ],
      featured: true,
      accentColor: "#FF8C42",
    },
    {
      id: 3,
      title: "Paquete atleta",
      price: 105,
      billingPeriod: "3 meses",
      description: "La mejor relación calidad-precio",
      services: [
        "Acceso ilimitado al gimnasio",
        "Incluye prendas sin costo",
        "Entrena Sin Límites",
        "Consultor fitness gratis",
        "Credencial de gimnasio",
      ],
      featured: false,
    },
    {
      id: 4,
      title: "Paquete básico",
      price: 25,
      billingPeriod: "mes",
      description: "Ideal para iniciar en el mundo fit",
      services: [
        "Ahorra con el plan anual",
        "2 sesiones con consultor fitness",
        "Control de alimentación",
        "1 suplemento gratis",
        "Entrenador personal",
      ],
      featured: false,
    },
  ];

  return (
    <main className="min-h-screen bg-white">
      <Navbar transparent={false} />

      <>
        <section className="bg-gray-50 py-12 px-6">
          <div className="max-w-6xl mx-auto">
            <h1 className="text-4xl md:text-5xl font-bold text-center mb-4">
              <span className="text-orange-500">PLANES Y</span>{" "}
              <span className="text-gray-900">MEMBRESÍAS</span>
            </h1>
            <p className="text-center text-gray-600 w-full mx-auto">
              Elige el plan que mejor se adapte a tus necesidades y objetivos de
              fitness
            </p>
          </div>
        </section>

        <section className="py-16 px-6">
          <div className="max-w-6xl mx-auto">
            <div className="flex items-center justify-between mb-8">
              <div className="grid grid-cols-1 md:grid-cols-4 gap-6 flex-1 mx-4">
                {membershipPlans.map((membership, index) => (
                  <MembershipCard key={index} {...membership} />
                ))}
              </div>
            </div>
          </div>
        </section>

        <section className="py-16 px-6 bg-gray-100">
          <div className="max-w-6xl mx-auto">
            <h1 className="text-4xl md:text-5xl font-bold text-center mb-4">
              TODOS LOS PLANES INCLUYEN
            </h1>
            <div className="flex items-center justify-between my-8">
              <div className="grid grid-cols-1 md:grid-cols-4 gap-6 flex-1 mx-4">
                <Card className="text-center p-5">
                  <BuildingStorefrontIcon className="w-6 text-gray-800 h-6 inline-block mr-2" />
                  <CardTitle className="my-4">Todas las Sucursales</CardTitle>
                  <CardContent>
                    <p className="text-sm">
                      Acceso a todas nuestras ubicaciones
                    </p>
                  </CardContent>
                </Card>
                <Card className="text-center p-5">
                  <UserIcon className="w-6 text-gray-800 h-6 inline-block mr-2" />
                  <CardTitle className="my-4">Entrenador</CardTitle>
                  <CardContent>
                    <p className="text-sm">Entrenador de planta gratuito</p>
                  </CardContent>
                </Card>
                <Card className="text-center p-5">
                  <UserGroupIcon className="w-6 text-gray-800 h-6 inline-block mr-2" />
                  <CardTitle className="my-4">Clases Grupales</CardTitle>
                  <CardContent>
                    <p className="text-sm">
                      Diversas clases en todos los lugares
                    </p>
                  </CardContent>
                </Card>
                <Card className="text-center p-5">
                  <DevicePhoneMobileIcon className="w-6 text-gray-800 h-6 inline-block mr-2" />
                  <CardTitle className="my-4">App Movil</CardTitle>
                  <CardContent>
                    <p className="text-sm">
                      Reserva clases y sigue tu progreso
                    </p>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
          <div className="max-w-4xl mx-auto bg-primary rounded-2xl md:rounded-3xl p-4 md:p-8 text-center mt-12">
            <span className="text-3xl md:text-4xl font-bold text-center text-white mb-4">
              ¿No estás seguro de qué plan elegir?
            </span>
            <p className="text-white mt-2">
              Nuestro equipo está aquí para ayudarte a encontrar el plan
              perfecto para tus necesidades
            </p>
            <div className="flex items-center justify-center gap-4 my-4">
              <Button className="bg-black text-white px-4 py-2 text-sm rounded-md w-50">
                Hablar con un asesor
              </Button>
              <Button className="bg-white text-black px-4 py-2 text-sm rounded-md w-50">
                Ver Preguntas Frecuentes
              </Button>
            </div>
          </div>
        </section>
      </>

      <Footer />
    </main>
  );
}
