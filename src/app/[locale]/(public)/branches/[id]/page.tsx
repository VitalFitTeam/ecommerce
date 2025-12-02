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
        <div className="max-w-6xl mx-auto">
          <div className="flex flex-col md:flex-row gap-8 mb-8">
            <div className="md:w-1/2">
              <Image
                src="/images/Rectangle 87.png"
                alt="VITALFIT CENTRAL"
                width={600}
                height={400}
                className="w-full h-64 object-cover"
                priority
              />
            </div>

            <div className="md:w-1/2">
              <h1 className="text-3xl font-bold text-black mb-6">
                VITALFIT CENTRAL
              </h1>

              <div className="space-y-4">
                <div className="flex items-start">
                  <img
                    src="/logo/map-pin.png"
                    alt="ubicación"
                    className="w-5 h-5 mt-1 mr-3 flex-shrink-0"
                  />
                  <div>
                    <p className="text-black">- Av. Principal 121, Centro</p>
                    <div className="flex items-center ml-6">
                      <img
                        src="/logo/phone.png"
                        alt="teléfono"
                        className="w-4 h-4 mr-2"
                      />
                      <p className="text-black">+58 424 581 2350</p>
                    </div>
                  </div>
                </div>

                <div className="flex items-center">
                  <img
                    src="/logo/envelope.png"
                    alt="email"
                    className="w-5 h-5 mr-3"
                  />
                  <h2 className="text-xl font-bold text-black">
                    info@vitalfitcentral.com
                  </h2>
                </div>

                <div className="flex items-start">
                  <img
                    src="/logo/Frame 1686555439.png"
                    alt="horarios"
                    className="w-5 h-5 mt-1 mr-3 flex-shrink-0"
                  />
                  <div>
                    <p className="text-black">- Atención al Público:</p>
                    <p className="text-black ml-6">
                      Lunes - Viernes: 06:00am a 10:00pm
                    </p>
                    <p className="text-black ml-6">
                      Sabados - Domingos: 09:00am - 03:00pm
                    </p>
                  </div>
                </div>

                <div className="flex items-start">
                  <img
                    src="/logo/user.png"
                    alt="administrador"
                    className="w-5 h-5 mt-1 mr-3 flex-shrink-0"
                  />
                  <div>
                    <h2 className="text-xl font-bold text-black">
                      Administrador Asignado:
                    </h2>
                    <p className="text-black ml-6">Gabriela Ramos</p>
                    <p className="text-black ml-6">
                      gabriela.r@vitalfitcentral.com
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <hr className="border-t border-gray-300 my-8" />

          <div className="mb-8">
            <h2 className="text-2xl font-bold text-black mb-4">SERVICIOS</h2>

            <div className="mb-6">
              <div className="mb-6">
                <div className="flex mb-2">
                  <div className="w-1/4 font-bold text-black">Gimnasio</div>
                  <div className="w-1/4 font-bold text-black">Piscina</div>
                  <div className="w-1/4 font-bold text-black">Yoga</div>
                  <div className="w-1/4 font-bold text-black">Crossfit</div>
                </div>
              </div>

              <div>
                <h4 className="text-lg font-bold text-black mb-3">
                  BENEFICIOS
                </h4>
                <ul className="space-y-2">
                  <li className="flex items-start">
                    <span className="inline-block w-2 h-2 bg-black rounded-full mt-2 mr-3 flex-shrink-0"></span>
                    <span className="text-black">
                      Acceso ilimitado a todas las áreas del gimnasio,
                      incluyendo el área de Yoga.
                    </span>
                  </li>
                  <li className="flex items-start">
                    <span className="inline-block w-2 h-2 bg-black rounded-full mt-2 mr-3 flex-shrink-0"></span>
                    <span className="text-black">
                      6 clases premium al mes incluyendo spinning.
                    </span>
                  </li>
                  <li className="flex items-start">
                    <span className="inline-block w-2 h-2 bg-black rounded-full mt-2 mr-3 flex-shrink-0"></span>
                    <span className="text-black">
                      Sala exclusiva para entrenamiento personal.
                    </span>
                  </li>
                  <li className="flex items-start">
                    <span className="inline-block w-2 h-2 bg-black rounded-full mt-2 mr-3 flex-shrink-0"></span>
                    <span className="text-black">
                      Descuento en productos y eventos especiales.
                    </span>
                  </li>
                </ul>
              </div>
            </div>
          </div>

          <hr className="border-t border-gray-300 my-8" />

          <div className="mb-8">
            <h2 className="text-2xl font-bold text-black mb-6">MEMBRESÍAS</h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="space-y-2 p-4 border border-gray-200 rounded-lg">
                <div className="flex flex-col mb-2">
                  <h3 className="text-lg font-bold text-orange-500">
                    {" "}
                    Plan Full
                  </h3>
                  <span className="text-xl font-bold text-black">$75/mes</span>
                </div>
                <p className="text-black text-sm">
                  Más beneficios para tu vida fitness
                </p>
                <div className="flex gap-2 mt-3">
                  <button className="border border-orange-500 text-orange-500 px-3 py-2 rounded text-sm font-medium w-full">
                    Saber más
                  </button>
                  <button className="bg-orange-500 text-white px-3 py-2 rounded text-sm font-medium w-full">
                    Afiliate
                  </button>
                </div>
              </div>

              <div className="space-y-2 p-4 border border-gray-200 rounded-lg">
                <div className="flex flex-col mb-2">
                  <h3 className="text-lg font-bold text-orange-500">
                    {" "}
                    Plan Básico
                  </h3>
                  <span className="text-xl font-bold text-black">$50/mes</span>
                </div>
                <p className="text-black text-sm">
                  Más beneficios para tu vida fitness
                </p>
                <div className="flex gap-2 mt-3">
                  <button className="border border-orange-500 text-orange-500 px-3 py-2 rounded text-sm font-medium w-full">
                    Saber más
                  </button>
                  <button className="bg-orange-500 text-white px-3 py-2 rounded text-sm font-medium w-full">
                    Afiliate
                  </button>
                </div>
              </div>

              <div className="space-y-2 p-4 border border-gray-200 rounded-lg">
                <div className="flex flex-col mb-2">
                  <h3 className="text-lg font-bold text-orange-500">
                    {" "}
                    Plan Estándor
                  </h3>
                  <span className="text-xl font-bold text-black">$88/mes</span>
                </div>
                <p className="text-black text-sm">
                  Más beneficios para tu vida fitness
                </p>
                <div className="flex gap-2 mt-3">
                  <button className="border border-orange-500 text-orange-500 px-3 py-2 rounded text-sm font-medium w-full">
                    Saber más
                  </button>
                  <button className="bg-orange-500 text-white px-3 py-2 rounded text-sm font-medium w-full">
                    Afiliate
                  </button>
                </div>
              </div>

              <div className="space-y-2 p-4 border border-gray-200 rounded-lg">
                <div className="flex flex-col mb-2">
                  <h3 className="text-lg font-bold text-orange-500">
                    Plan Nuevo
                  </h3>
                  <span className="text-xl font-bold text-black">$35/mes</span>
                </div>
                <p className="text-black text-sm">
                  Más beneficios para tu vida fitness
                </p>
                <div className="flex gap-2 mt-3">
                  <button className="border border-orange-500 text-orange-500 px-3 py-2 rounded text-sm font-medium w-full">
                    Saber más
                  </button>
                  <button className="bg-orange-500 text-white px-3 py-2 rounded text-sm font-medium w-full">
                    Afiliate
                  </button>
                </div>
              </div>
            </div>
          </div>

          <hr className="border-t border-gray-300 my-8" />
        </div>
      </section>

      <Footer />
    </main>
  );
}
