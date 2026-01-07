"use client";

import Image from "next/image";
import { FaStar, FaClock } from "react-icons/fa";
import logoVitalFit from "../../../public/images/gym-training-chile.png";
import { Button } from "../ui/button";
import { useTranslations } from "next-intl";
import { cn } from "@/lib/utils";
import { useEffect, useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { api } from "@/lib/sdk-config";
import { toast } from "sonner";

interface CardContentProps {
  title: string;
  rating: number;
  category: string;
  desc: string;
  duration: number;
  priceMember: string;
  priceNonMember: string;
  t: any;
  isFavorite?: boolean;
  onLearnMore?: () => void;
  onWishList?: (e: React.MouseEvent) => void;
}

const ServiceCardContent = ({
  title,
  rating,
  category,
  desc,
  duration,
  priceMember,
  priceNonMember,
  t,
  isFavorite,
  onLearnMore,
  onWishList,
}: CardContentProps) => (
  <div className="p-5 flex flex-col justify-between ">
    <div className="mb-4">
      <div className="flex items-center justify-between mb-2">
        <h3 className="text-[#F27F2A] font-bold text-lg line-clamp-2 leading-normal flex-1 mr-2 py-0.5">
          {title}
        </h3>

        <div
          className="flex items-center text-sm text-gray-700 gap-1 cursor-pointer hover:scale-110 transition-transform active:scale-95 px-2 py-1 rounded-full hover:bg-yellow-50"
          onClick={onWishList}
          title={isFavorite ? t("wishlistRemove") : t("wishListSuccess")}
        >
          <FaStar
            className={isFavorite ? "text-yellow-400" : "text-gray-300"}
          />
          {rating}
        </div>
      </div>

      <p className="text-gray-500 text-sm mb-1 line-clamp-1">{category}</p>

      <p className="text-gray-600 text-sm leading-relaxed line-clamp-3">
        {desc}
      </p>
    </div>

    <div className="flex flex-col sm:flex-row sm:items-center justify-between mt-4 gap-3">
      <div className="flex items-center gap-1 text-gray-700 text-sm">
        <FaClock /> {duration} {t("minutes")}
      </div>

      <div className="flex flex-col sm:flex-row sm:items-center gap-2">
        <span className="text-lg font-bold text-black">
          {t("member")}: {priceMember}
        </span>

        <span className="text-lg font-semibold text-gray-500 line-through">
          {t("nonMember")}: {priceNonMember}
        </span>
      </div>

      <Button onClick={onLearnMore}>{t("learnMore")}</Button>
    </div>
  </div>
);

interface Service {
  service_id: string;
  name: string;
  description: string;
  duration_minutes: number;
  priority_score: number;
  service_category?: {
    category_id: string;
    name: string;
  };
  images?: {
    image_id: string;
    image_url: string;
    alt_text: string;
    display_order: number;
    is_primary: boolean;
  }[];
  banners?: {
    banner_id: string;
    name: string;
    image_url: string;
    link_url: string;
    is_active: boolean;
  }[];
  lowest_price_member: number;
  lowest_price_no_member: number;
  base_currency: string;
}

interface ServiceCardProps {
  service: Service;
  view?: "grid" | "list";
  isFavorite?: boolean;
  wishlistId?: string;
  onToggleFavorite?: (
    serviceId: string,
    isFavorite: boolean,
    wishlistId?: string,
  ) => Promise<void>;
  onLearnMore?: () => void;
  className?: string;
}

export default function ServiceCard({
  service,
  view = "grid",
  isFavorite = false,
  wishlistId,
  onToggleFavorite,
  onLearnMore,
  className,
}: ServiceCardProps) {
  const t = useTranslations("ServiceCard");
  const { token } = useAuth();
  const [localRating, setLocalRating] = useState<number>(
    service?.priority_score ?? 0,
  );
  const [isProcessing, setIsProcessing] = useState(false);
  const [optimisticFavorite, setOptimisticFavorite] = useState(isFavorite);

  // Sync with prop changes
  useEffect(() => {
    setOptimisticFavorite(isFavorite);
  }, [isFavorite]);

  const {
    name,
    description,
    duration_minutes,
    service_category,
    images,
    banners,
    lowest_price_member,
    lowest_price_no_member,
    base_currency,
  } = service;

  const title = name ?? t("noTitle");
  const category = service_category?.name ?? t("categoryDefault");
  const desc = description ?? t("noDescription");
  const duration = duration_minutes ?? 0;
  const activeBanner = banners?.find((b) => b.is_active);
  const imgSrc =
    activeBanner?.image_url || images?.[0]?.image_url || logoVitalFit;

  const formatPrice = (price: number) =>
    `${base_currency ?? "USD"} ${price ?? 0}`;

  const priceMemberFormatted = formatPrice(lowest_price_member);
  const priceNonMemberFormatted = formatPrice(lowest_price_no_member);

  const handleWishList = async (e: React.MouseEvent) => {
    e.stopPropagation();

    if (!token) {
      toast.error(t("loginRequired"));
      return;
    }

    if (isProcessing) {
      return;
    }

    // If no external handler, we don't do anything (or we could keep old logic, but refactoring here)
    if (!onToggleFavorite) {
      return;
    }

    setIsProcessing(true);
    const wasFavorite = optimisticFavorite;

    // Optimistic update
    setOptimisticFavorite(!wasFavorite);
    setLocalRating((prev) => (wasFavorite ? prev - 1 : prev + 1));

    try {
      await onToggleFavorite(service.service_id, wasFavorite, wishlistId);
    } catch (error) {
      console.error("Error toggling wishlist:", error);
      // Rollback
      setOptimisticFavorite(wasFavorite);
      setLocalRating((prev) => (wasFavorite ? prev + 1 : prev - 1));
    } finally {
      setIsProcessing(false);
    }
  };

  if (view === "grid") {
    return (
      <div
        className={cn(
          "bg-white rounded-xl shadow-md overflow-hidden flex flex-col hover:shadow-lg transition-shadow",
          "border border-gray-200",
          className,
        )}
      >
        <Image
          src={imgSrc}
          alt={title}
          width={400}
          height={250}
          className="w-full h-56 object-cover"
        />
        <ServiceCardContent
          title={title}
          rating={localRating}
          category={category}
          desc={desc}
          duration={duration}
          priceMember={priceMemberFormatted}
          priceNonMember={priceNonMemberFormatted}
          t={t}
          isFavorite={optimisticFavorite}
          onLearnMore={onLearnMore}
          onWishList={handleWishList}
        />
      </div>
    );
  }

  return (
    <div
      className={cn(
        "bg-white rounded-xl shadow-md flex flex-col sm:flex-row overflow-hidden hover:shadow-lg transition-shadow w-full",
        "border border-gray-200",
        className,
      )}
    >
      <Image
        src={imgSrc}
        alt={title}
        width={250}
        height={200}
        className="w-full sm:w-64 h-56 object-cover"
      />
      <ServiceCardContent
        title={title}
        rating={localRating}
        category={category}
        desc={desc}
        duration={duration}
        priceMember={priceMemberFormatted}
        priceNonMember={priceNonMemberFormatted}
        t={t}
        isFavorite={optimisticFavorite}
        onLearnMore={onLearnMore}
        onWishList={handleWishList}
      />
    </div>
  );
}
