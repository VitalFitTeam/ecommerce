"use client";

import Image from "next/image";
import {
  XMarkIcon,
  StarIcon,
  ClockIcon,
  MapPinIcon,
} from "@heroicons/react/24/solid";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { useTranslations } from "next-intl";

interface ServiceModalProps {
  service: {
    service_id: string;
    name: string;
    description: string;
    duration_minutes: number;
    priority_score: number;
    is_featured: boolean;
    created_at: string;
    updated_at: string;
    service_category: {
      category_id: string;
      name: string;
    };
    images: string[];
    lowest_price_member: number;
    lowest_price_no_member: number;
    base_currency: string;
  } | null;
  isOpen: boolean;
  onClose: () => void;
}

export default function ServiceModal({
  service,
  isOpen,
  onClose,
}: ServiceModalProps) {
  const t = useTranslations("ServiceModal");

  if (!isOpen || !service) {
    return null;
  }

  const schedule = [
    "6:00 AM",
    "10:00 AM",
    "12:00 PM",
    "3:00 PM",
    "5:00 PM",
    "8:00 PM",
  ];
  const imgSrc = service.images?.[0] ?? "/images/gym-training-chile.png";

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
          <div className="relative">
            <Image
              src={imgSrc}
              alt={service.name}
              width={600}
              height={300}
              className="w-full h-48 sm:h-56 md:h-64 object-cover"
            />
            <Button
              variant="ghost"
              size="icon"
              className="absolute top-3 right-3 bg-white/80 hover:bg-white rounded-full p-1"
              onClick={onClose}
            >
              <XMarkIcon className="w-5 h-5 sm:w-6 sm:h-6" />
            </Button>
          </div>

          <div className="p-5 sm:p-6 md:p-8 flex flex-col justify-between flex-grow">
            <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center mb-3">
              <h2 className="text-[#F27F2A] font-semibold text-2xl sm:text-3xl uppercase mb-2 sm:mb-0">
                {service.name}
              </h2>
              <div className="flex items-center text-gray-700 text-sm sm:text-base">
                <StarIcon className="w-4 h-4 text-yellow-400 mr-1" />
                {service.priority_score}
              </div>
            </div>

            <div className="flex gap-4 mb-5 text-xl sm:text-2xl font-bold">
              <span className="text-black">
                {t("nonMember")}: ${service.lowest_price_no_member}{" "}
                {service.base_currency}
              </span>
              <span className="text-green-600">
                {t("member")}: ${service.lowest_price_member}{" "}
                {service.base_currency}
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-6 text-sm sm:text-base text-gray-700">
              <div className="flex items-center gap-2">
                <ClockIcon className="w-5 h-5 text-[#F27F2A]" />
                <span>
                  {service.duration_minutes} {t("minutes")}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <MapPinIcon className="w-5 h-5 text-[#F27F2A]" />
                <span>{service.service_category?.name}</span>
              </div>
            </div>

            <h3 className="font-medium text-lg sm:text-xl text-gray-800 mb-2">
              {t("description")}
            </h3>
            <p className="text-gray-600 text-sm sm:text-base leading-relaxed mb-6">
              {service.description}
            </p>

            <h3 className="font-medium text-lg sm:text-xl text-gray-800 mb-2">
              {t("availableSchedules")}
            </h3>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 mb-6">
              {schedule.map((hour) => (
                <Button
                  key={hour}
                  variant="outline"
                  size="sm"
                  className="border-gray-300 hover:border-[#F27F2A] hover:text-[#F27F2A]"
                >
                  {hour}
                </Button>
              ))}
            </div>

            <div className="flex flex-col sm:flex-row gap-3">
              <Button>{t("bookNow")}</Button>
              <Button variant="outline">{t("moreInfo")}</Button>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
