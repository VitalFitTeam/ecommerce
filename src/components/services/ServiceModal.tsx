"use client";

import Image from "next/image";
import { XMarkIcon, ClockIcon, MapPinIcon } from "@heroicons/react/24/solid";
import { HeartIcon as HeartIconSolid } from "@heroicons/react/24/solid";
import { HeartIcon as HeartIconOutline } from "@heroicons/react/24/outline";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { useTranslations } from "next-intl";
import { useState, useEffect } from "react";
import { toast } from "sonner";
import { useAuth } from "@/context/AuthContext";

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
      image_main?: string;
    };
    images: {
      image_id: string;
      image_url: string;
      alt_text: string;
      display_order: number;
      is_primary: boolean;
    }[];
    banners: {
      banner_id: string;
      name: string;
      image_url: string;
      link_url: string;
      is_active: boolean;
    }[];
    lowest_price_member: number;
    lowest_price_no_member: number;
    base_currency: string;
    ref_lowest_price_member?: string | number;
    ref_lowest_price_no_member?: string | number;
    ref_base_currency?: string;
  } | null;
  isOpen: boolean;
  onClose: () => void;
  showReferencePrice?: boolean;
  isFavorite?: boolean;
  wishlistId?: string;
  onToggleFavorite?: (
    serviceId: string,
    isFavorite: boolean,
    wishlistId?: string,
  ) => Promise<void>;
}

import Logo from "@/components/features/Logo";

const ServiceImage = ({ url, alt }: { url: string; alt: string }) => {
  const [hasError, setHasError] = useState(false);

  if (hasError) {
    return (
      <div className="w-full h-full flex items-center justify-center bg-gray-100">
        <Logo slogan={true} theme="dark" width={200} />
      </div>
    );
  }

  return (
    <Image
      src={url}
      alt={alt}
      fill
      className="object-cover"
      onError={() => setHasError(true)}
    />
  );
};

export default function ServiceModal({
  service,
  isOpen,
  onClose,
  showReferencePrice,
  isFavorite = false,
  wishlistId,
  onToggleFavorite,
}: ServiceModalProps) {
  const t = useTranslations("ServiceModal");
  const { token } = useAuth();
  const [isProcessing, setIsProcessing] = useState(false);
  const [optimisticFavorite, setOptimisticFavorite] = useState(isFavorite);
  const [localRating, setLocalRating] = useState(0);

  useEffect(() => {
    setOptimisticFavorite(isFavorite);
    if (service) {
      setLocalRating(service.priority_score);
    }
  }, [isFavorite, service]);

  if (!isOpen || !service) {
    return null;
  }

  const handleWishList = async (e: React.MouseEvent) => {
    e.stopPropagation();

    if (!token) {
      toast.error(t("loginRequired"));
      return;
    }

    if (isProcessing || !onToggleFavorite) {
      return;
    }

    setIsProcessing(true);
    const wasFavorite = optimisticFavorite;

    setOptimisticFavorite(!wasFavorite);
    setLocalRating((prev) => (wasFavorite ? prev - 1 : prev + 1));

    try {
      await onToggleFavorite(service.service_id, wasFavorite, wishlistId);
    } catch (error) {
      console.error("Error toggling wishlist:", error);
      setOptimisticFavorite(wasFavorite);
      setLocalRating((prev) => (wasFavorite ? prev + 1 : prev - 1));
    } finally {
      setIsProcessing(false);
    }
  };

  const schedule = [
    "6:00 AM",
    "10:00 AM",
    "12:00 PM",
    "3:00 PM",
    "5:00 PM",
    "8:00 PM",
  ];

  const activeBanner = service.banners?.find((b) => b.is_active);
  const displayImages = [];

  if (activeBanner) {
    displayImages.push({
      id: activeBanner.banner_id,
      url: activeBanner.image_url,
      alt: activeBanner.name,
    });
  }

  if (service.images && service.images.length > 0) {
    const sortedImages = [...service.images].sort(
      (a, b) => a.display_order - b.display_order,
    );
    sortedImages.forEach((img) => {
      displayImages.push({
        id: img.image_id,
        url: img.image_url,
        alt: img.alt_text,
      });
    });
  }

  if (displayImages.length === 0) {
    displayImages.push({
      id: "default",
      url: "/images/gym-training-chile.png",
      alt: service.name,
    });
  }

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black/50 mt-20 flex justify-center items-center z-50 p-4 sm:p-6"
        onClick={onClose}
      >
        <motion.div
          initial={{ scale: 0.95, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.95, opacity: 0 }}
          onClick={(e) => e.stopPropagation()}
          className="bg-white rounded-2xl shadow-lg w-full max-w-md sm:max-w-lg md:max-w-xl overflow-y-auto max-h-[90vh] flex flex-col"
        >
          <div className="relative group">
            {displayImages.length > 1 ? (
              <Carousel className="w-full">
                <CarouselContent>
                  {displayImages.map((img) => (
                    <CarouselItem key={img.id}>
                      <div className="relative w-full h-48 sm:h-56 md:h-64">
                        <ServiceImage url={img.url} alt={img.alt} />
                      </div>
                    </CarouselItem>
                  ))}
                </CarouselContent>
                <CarouselPrevious className="left-2 bg-primary hover:bg-primary/80 text-primary border-none" />
                <CarouselNext className="right-2 bg-primary hover:bg-primary/80 text-primary border-none" />
              </Carousel>
            ) : (
              <div className="relative w-full h-48 sm:h-56 md:h-64">
                <ServiceImage
                  url={displayImages[0].url}
                  alt={displayImages[0].alt}
                />
              </div>
            )}

            <Button
              variant="ghost"
              size="icon"
              className="absolute top-3 right-3 bg-white/80 hover:bg-white rounded-full p-1 z-10"
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
              <div
                className="flex items-center text-sm gap-1 cursor-pointer hover:scale-110 transition-transform active:scale-95 px-2 py-1 rounded-full hover:bg-red-50"
                onClick={handleWishList}
                title={
                  optimisticFavorite
                    ? t("wishlistRemove")
                    : t("wishListSuccess")
                }
              >
                {optimisticFavorite ? (
                  <HeartIconSolid className="w-5 h-5 text-red-500" />
                ) : (
                  <HeartIconOutline className="w-5 h-5 text-gray-300" />
                )}
                {localRating}
              </div>
            </div>

            <div className="flex flex-col gap-2 mb-5">
              <div className="flex gap-4 text-xl sm:text-2xl font-bold">
                <div className="flex flex-col">
                  <span className="text-black">
                    {t("nonMember")}: ${service.lowest_price_no_member}{" "}
                    {service.base_currency}
                  </span>
                  {showReferencePrice && service.ref_lowest_price_no_member && (
                    <span className="text-xs text-gray-400 font-bold uppercase tracking-tight">
                      {t("refPrice")}:{" "}
                      {service.ref_base_currency === "VES"
                        ? "Bs."
                        : service.ref_base_currency}{" "}
                      {typeof service.ref_lowest_price_no_member === "number"
                        ? service.ref_lowest_price_no_member.toLocaleString(
                            undefined,
                            {
                              minimumFractionDigits: 2,
                              maximumFractionDigits: 2,
                            },
                          )
                        : service.ref_lowest_price_no_member}
                    </span>
                  )}
                </div>
                <div className="flex flex-col">
                  <span className="text-green-600">
                    {t("member")}: ${service.lowest_price_member}{" "}
                    {service.base_currency}
                  </span>
                  {showReferencePrice && service.ref_lowest_price_member && (
                    <span className="text-xs text-gray-400 font-bold uppercase tracking-tight">
                      {t("refPrice")}:{" "}
                      {service.ref_base_currency === "VES"
                        ? "Bs."
                        : service.ref_base_currency}{" "}
                      {typeof service.ref_lowest_price_member === "number"
                        ? service.ref_lowest_price_member.toLocaleString(
                            undefined,
                            {
                              minimumFractionDigits: 2,
                              maximumFractionDigits: 2,
                            },
                          )
                        : service.ref_lowest_price_member}
                    </span>
                  )}
                </div>
              </div>
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
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
