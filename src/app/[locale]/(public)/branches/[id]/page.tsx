"use client";

import { Navbar } from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { useParams } from "next/navigation";
import Image from "next/image";

export default function BranchDetailPage() {
  const params = useParams();
  const branchId = params.id as string;
  const locale = params.locale as string;

  return (
    <main className="min-h-screen bg-white">
      <Navbar transparent={false} />

      <section className="py-8 px-4">
        <div className="max-w-4xl mx-auto">
          <div className="mb-8">
            <Image
              src="/images/Rectangle 87.png"
              alt="VITALFIT CENTRAL"
              width={800}
              height={400}
              className="w-full h-64 object-cover rounded-lg"
              priority
            />
          </div>

          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold text-gray-900 mb-6">
              VITALFIT CENTRAL
            </h1>
          </div>

          <div className="space-y-4 mb-8">
            <div className="flex items-start">
              <span className="text-gray-900 mr-2">-</span>
              <div>
                <p className="text-gray-900">Av. Principal 121, Centro</p>
                <p className="text-gray-600 ml-4">-58 424 581 2350</p>
              </div>
            </div>

            <div className="mb-4">
              <h2 className="text-xl font-semibold text-gray-900 mb-2">
                Info@vitalfitcentral.com
              </h2>
            </div>

            <div className="mb-4">
              <p className="text-gray-900 mb-2">- Atención al Público:</p>
              <p className="text-gray-600 ml-4">
                Lunes - Viernes: 06:00am a 10:00pm
              </p>
              <p className="text-gray-600 ml-4">
                Sábado - Domingo: 09:00am - 03:00pm
              </p>
            </div>

            <div>
              <h2 className="text-xl font-semibold text-gray-900 mb-2">
                Administrador Asignado:
              </h2>
              <p className="text-gray-900 ml-4">Gabriela Ramos</p>
              <p className="text-gray-600 ml-4">
                gabriela.r@vitalfitcentral.com
              </p>
            </div>
          </div>

          <div className="border-t border-gray-300 my-8"></div>

          <div className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">SERVICIOS</h2>

            <div className="mb-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                Generación
              </h3>

              <div className="grid grid-cols-3 gap-4 mb-4">
                <div className="text-sm font-medium text-gray-700">
                  Filosofía
                </div>
                <div className="text-sm font-medium text-gray-700">Tipo</div>
                <div className="text-sm font-medium text-gray-700">
                  Contrato
                </div>
              </div>

              <div className="mb-6">
                <h4 className="text-lg font-bold text-gray-900 mb-4">
                  BENEFICIOS
                </h4>

                <ul className="space-y-2 ml-4">
                  <li className="flex">
                    <span className="text-gray-900 mr-2">-</span>
                    <span className="text-gray-700">
                      Acceso ilimitado a todas las áreas del gimnasio incluyendo
                      el área de Yoga.
                    </span>
                  </li>
                  <li className="flex">
                    <span className="text-gray-900 mr-2">-</span>
                    <span className="text-gray-700">
                      Una clase premium al mes incluyendo spinning.
                    </span>
                  </li>
                  <li className="flex">
                    <span className="text-gray-900 mr-2">-</span>
                    <span className="text-gray-700">
                      Sesión exclusiva para orientación con nuestro personal.
                    </span>
                  </li>
                  <li className="flex">
                    <span className="text-gray-900 mr-2">-</span>
                    <span className="text-gray-700">
                      Descuento en productos y eventos especiales.
                    </span>
                  </li>
                </ul>
              </div>
            </div>
          </div>

          <div className="border-t border-gray-300 my-8"></div>

          <div className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">
              MEMBRESÍAS
            </h2>

            <div className="space-y-6">
              <div className="space-y-2">
                <div className="flex justify-between items-start">
                  <h3 className="text-lg font-semibold text-gray-900">
                    - Plan Full
                  </h3>
                  <span className="text-lg font-bold text-gray-900">
                    $75/mes
                  </span>
                </div>
                <p className="text-gray-600 ml-4">
                  Más beneficios por su vida fitness
                </p>
                <div className="flex gap-2 ml-4">
                  <button className="bg-orange-500 hover:bg-orange-600 text-white px-4 py-1 rounded text-sm font-medium">
                    Saber más
                  </button>
                  <button className="border border-orange-500 text-orange-500 hover:bg-orange-50 px-4 py-1 rounded text-sm font-medium">
                    Afiliarte
                  </button>
                </div>
              </div>

              <div className="space-y-2">
                <div className="flex justify-between items-start">
                  <h3 className="text-lg font-semibold text-gray-900">
                    - Plan Básico
                  </h3>
                  <span className="text-lg font-bold text-gray-900">
                    $50/mes
                  </span>
                </div>
                <p className="text-gray-600 ml-4">
                  Más beneficios por su vida fitness
                </p>
                <div className="flex gap-2 ml-4">
                  <button className="bg-orange-500 hover:bg-orange-600 text-white px-4 py-1 rounded text-sm font-medium">
                    Saber más
                  </button>
                  <button className="border border-orange-500 text-orange-500 hover:bg-orange-50 px-4 py-1 rounded text-sm font-medium">
                    Afiliarte
                  </button>
                </div>
              </div>

              <div className="space-y-2">
                <div className="flex justify-between items-start">
                  <h3 className="text-lg font-semibold text-gray-900">
                    - Plan Estándar
                  </h3>
                  <span className="text-lg font-bold text-gray-900">
                    $88/mes
                  </span>
                </div>
                <p className="text-gray-600 ml-4">
                  Más beneficios por su vida fitness
                </p>
                <div className="flex gap-2 ml-4">
                  <button className="bg-orange-500 hover:bg-orange-600 text-white px-4 py-1 rounded text-sm font-medium">
                    Saber más
                  </button>
                  <button className="border border-orange-500 text-orange-500 hover:bg-orange-50 px-4 py-1 rounded text-sm font-medium">
                    Afiliarte
                  </button>
                </div>
              </div>

              <div className="space-y-2">
                <div className="flex justify-between items-start">
                  <h3 className="text-lg font-semibold text-gray-900">
                    - Plan Nuevo
                  </h3>
                  <span className="text-lg font-bold text-gray-900">
                    $35/mes
                  </span>
                </div>
                <p className="text-gray-600 ml-4">
                  Más beneficios por su vida fitness
                </p>
                <div className="flex gap-2 ml-4">
                  <button className="bg-orange-500 hover:bg-orange-600 text-white px-4 py-1 rounded text-sm font-medium">
                    Saber más
                  </button>
                  <button className="border border-orange-500 text-orange-500 hover:bg-orange-50 px-4 py-1 rounded text-sm font-medium">
                    Afiliarte
                  </button>
                </div>
              </div>
            </div>
          </div>

          <div className="border-t border-gray-300 my-8"></div>

          <div className="text-center">
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Vitalfit</h2>
            <p className="text-gray-600 italic mb-6">
              Empieza tu vida: Alcanza tu máximo potencial.
            </p>

            <div className="grid grid-cols-2 gap-8 text-left max-w-md mx-auto">
              <div>
                <p className="text-gray-900 mb-2">- Énfasis: Pilates</p>
                <p className="text-gray-900 mb-1">- Servicios:</p>
                <p className="text-gray-900 mb-1">- Membresías:</p>
                <p className="text-gray-900 mb-1">- Sucursales:</p>
                <p className="text-gray-900">- Contacto:</p>
              </div>
              <div>
                <p className="text-gray-900 mb-2">- Nuestros Servicios:</p>
                <p className="text-gray-600 ml-4">- Yoga:</p>
                <p className="text-gray-600 ml-4">- Cardio:</p>
                <p className="text-gray-600 ml-4">- Spinning:</p>
                <p className="text-gray-600 ml-4">- Pilates:</p>

                <p className="text-gray-900 mt-4 mb-2">- Contacto:</p>
                <p className="text-gray-600 ml-4">+58 424 581 2350</p>
                <p className="text-gray-600 ml-4">info@vitalfit.com</p>
                <p className="text-gray-600 ml-4">Av. Principal 123, Centro</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </main>
  );
}
