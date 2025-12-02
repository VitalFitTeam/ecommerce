"use client";

import {
  MapPinIcon,
  PhoneIcon,
  CalendarDaysIcon,
} from "@heroicons/react/24/solid";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useParams } from "next/navigation";

export interface BranchCardProps {
  branch: {
    branch_id: string;
    name: string;
    address: string;
    phone: string;
    schedule?: string;
    imageUrl?: string;
    latitude?: number;
    longitude?: number;
  };
  index?: number;
}

export function BranchCard({ branch, index = 0 }: BranchCardProps) {
  const router = useRouter();
  const params = useParams();
  const locale = params.locale as string;

  const isFeatured = index % 2 === 1;

  const DEFAULT_IMAGES = [
    "/images/gym-training-spain.png",
    "/images/gym-training-venezuela.png",
    "/images/gym-training-chile.png",
  ];

  const imageSrc =
    branch.imageUrl && branch.imageUrl.trim() !== ""
      ? branch.imageUrl
      : DEFAULT_IMAGES[index % DEFAULT_IMAGES.length];

  const handleClick = () => {
    // Navegar a la página de detalle de la sucursal INCLUYENDO el locale
    router.push(`/${locale}/branches/${branch.branch_id}`);
  };

  return (
    <div
      onClick={handleClick}
      className={`
        relative flex flex-col h-full min-h-[600px] rounded-2xl overflow-hidden border transition-all duration-300 cursor-pointer
        hover:scale-105 ${
          isFeatured
            ? "bg-gradient-to-r from-orange-500 to-orange-600 border-transparent shadow-lg text-white"
            : "bg-white border-gray-300 shadow-md text-gray-700"
        }
      `}
    >
      <div className="relative w-full h-64 md:h-72 overflow-hidden">
        {imageSrc ? (
          <Image
            src={imageSrc}
            alt={branch.name}
            fill
            className="object-cover object-center"
          />
        ) : (
          <div className="w-full h-full bg-gray-200 flex items-center justify-center text-gray-400">
            Sin imagen
          </div>
        )}
      </div>

      <div className="p-6 flex flex-col flex-grow">
        <h3
          className={`text-2xl md:text-3xl font-bold text-center mb-6 ${isFeatured ? "text-white" : "text-orange-500"}`}
        >
          {branch.name}
        </h3>

        <div className="flex flex-col gap-4 flex-grow">
          <div className="flex items-start gap-3">
            <MapPinIcon
              className={`w-6 h-6 flex-shrink-0 mt-0.5 ${isFeatured ? "text-white" : "text-orange-500"}`}
            />
            <p className="text-sm md:text-base font-medium leading-relaxed">
              {branch.address}
            </p>
          </div>

          <div className="flex items-start gap-3">
            <PhoneIcon
              className={`w-6 h-6 flex-shrink-0 mt-0.5 ${isFeatured ? "text-white" : "text-orange-500"}`}
            />
            <p className="text-sm md:text-base font-medium leading-relaxed">
              {branch.phone}
            </p>
          </div>

          <div className="flex items-start gap-3">
            <CalendarDaysIcon
              className={`w-6 h-6 flex-shrink-0 mt-0.5 ${isFeatured ? "text-white" : "text-orange-500"}`}
            />
            <p className="text-sm md:text-base font-medium leading-relaxed">
              {branch.schedule ||
                "Lunes - Viernes: 6:00 am - 9:00 pm\nSábado: 7:00 am - 5:00 pm"}
            </p>
          </div>
        </div>

        {/* Botón de acción agregado */}
        <div className="mt-6 pt-4 border-t border-gray-200 border-opacity-50">
          <button
            onClick={(e) => {
              e.stopPropagation();
              handleClick();
            }}
            className={`
              w-full py-3 px-4 rounded-xl font-semibold transition-all duration-200
              ${
                isFeatured
                  ? "bg-white text-orange-500 hover:bg-gray-100 hover:shadow-lg"
                  : "bg-orange-500 text-white hover:bg-orange-600 hover:shadow-lg"
              }
            `}
          >
            Ver Detalles
          </button>
        </div>
      </div>
    </div>
  );
}
