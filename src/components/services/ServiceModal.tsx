"use client";

import Image from "next/image";
import {
  XMarkIcon,
  StarIcon,
  UserGroupIcon,
  ClockIcon,
  MapPinIcon,
} from "@heroicons/react/24/solid";
import { motion, AnimatePresence } from "framer-motion";

interface Service {
  id: number;
  title: string;
  description: string;
  price: number;
  rating: number;
  image: string;
  capacity?: number;
  duration?: string;
  branch?: string;
}

interface ServiceModalProps {
  service: Service | null;
  isOpen: boolean;
  onClose: () => void;
}

export default function ServiceModal({
  service,
  isOpen,
  onClose,
}: ServiceModalProps) {
  if (!isOpen || !service) {return null;}

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black/50 flex justify-center items-center z-50 p-4 sm:p-6"
        onClick={onClose}
      >
        <motion.div
          initial={{ scale: 0.95, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.95, opacity: 0 }}
          onClick={(e) => e.stopPropagation()}
          className="bg-white rounded-2xl shadow-lg w-full max-w-md sm:max-w-lg md:max-w-xl overflow-y-auto max-h-[90vh] flex flex-col"
        >
          {/* Header con imagen y botón cerrar */}
          <div className="relative">
            <Image
              src={service.image}
              alt={service.title}
              width={600}
              height={300}
              className="w-full h-48 sm:h-56 md:h-64 object-cover"
            />
            <button
              onClick={onClose}
              className="absolute top-3 right-3 bg-white/80 hover:bg-white text-gray-800 rounded-full p-1 transition cursor-pointer"
            >
              <XMarkIcon className="w-5 h-5 sm:w-6 sm:h-6" />
            </button>
          </div>

          {/* Contenido */}
          <div className="p-5 sm:p-6 md:p-8 flex flex-col justify-between flex-grow">
            {/* Título y rating */}
            <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center mb-3">
              <h2 className="text-[#F27F2A] font-semibold text-2xl sm:text-3xl uppercase mb-2 sm:mb-0">
                {service.title}
              </h2>
              <div className="flex items-center text-gray-700 text-sm sm:text-base">
                <StarIcon className="w-4 h-4 text-yellow-400 mr-1" />
                {service.rating}
              </div>
            </div>

            <p className="text-xl sm:text-2xl font-bold mb-5">
              ${service.price}
            </p>

            {/* Info breve: capacidad, duración, sucursal */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-6 text-sm sm:text-base text-gray-700">
              <div className="flex items-center gap-2">
                <UserGroupIcon className="w-5 h-5 text-[#F27F2A]" />
                <span>{service.capacity ?? 10} personas</span>
              </div>
              <div className="flex items-center gap-2">
                <ClockIcon className="w-5 h-5 text-[#F27F2A]" />
                <span>{service.duration ?? "60 min"}</span>
              </div>
              <div className="flex items-center gap-2">
                <MapPinIcon className="w-5 h-5 text-[#F27F2A]" />
                <span>{service.branch ?? "Sucursal Central"}</span>
              </div>
            </div>

            {/* Descripción */}
            <h3 className="font-medium text-lg sm:text-xl text-gray-800 mb-2">
              Descripción
            </h3>
            <p className="text-gray-600 text-sm sm:text-base leading-relaxed mb-6">
              {service.description}
            </p>

            {/* Horarios */}
            <h3 className="font-medium text-lg sm:text-xl text-gray-800 mb-2">
              Horarios disponibles
            </h3>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 mb-6">
              {[
                "6:00 AM",
                "10:00 AM",
                "12:00 PM",
                "3:00 PM",
                "5:00 PM",
                "8:00 PM",
              ].map((hour) => (
                <button
                  key={hour}
                  className="border border-gray-300 rounded-md py-2 text-sm hover:border-[#F27F2A] hover:text-[#F27F2A] transition"
                >
                  {hour}
                </button>
              ))}
            </div>

            {/* Botones */}
            <div className="flex flex-col sm:flex-row gap-3">
              <button className="flex-1 bg-[#F27F2A] text-white text-sm sm:text-base py-2 rounded-md hover:bg-[#d66d1f] transition">
                Reservar ahora
              </button>
              <button className="flex-1 border border-gray-300 text-gray-700 text-sm sm:text-base py-2 rounded-md hover:border-[#F27F2A] hover:text-[#F27F2A] transition">
                Más información
              </button>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
