"use client";

import Image from "next/image";
import { FaStar, FaClock } from "react-icons/fa";
import logoVitalFit from "../../../public/images/gym-training-chile.png"; 
import { Button } from "../ui/button";
import { useTranslations } from "next-intl";

interface ServiceCardProps {
  service: any;
  view?: "grid" | "list";
  onLearnMore?: () => void;
}

export default function ServiceCard({
  service,
  view = "grid",
  onLearnMore,
}: ServiceCardProps) {
  const t = useTranslations("ServiceCard"); 

  const {
    name,
    description,
    duration_minutes,
    priority_score,
    service_category,
    images,
    lowest_price_member,
    lowest_price_no_member,
    base_currency,
  } = service;

  const title = name;
  const category = service_category?.name ?? t("categoryDefault");
  const desc = description ?? t("categoryDefault");
  const duration = duration_minutes ?? 0;
  const rating = priority_score ?? 0;
  const imgSrc = images?.length > 0 ? images[0] : logoVitalFit;

  const formatPrice = (price: number) => `${base_currency ?? "USD"} ${price}`;

  const CardContent = () => (
    <div className="p-5 flex flex-col justify-between flex-grow">
      <div className="mb-4">
        <div className="flex items-center justify-between mb-2">
          <h2 className="text-[#F27F2A] font-bold text-2xl">{title}</h2>
          <div className="flex items-center text-sm text-gray-700 gap-1">
            <FaStar className="text-yellow-400" />
            {rating}
          </div>
        </div>
        <p className="text-gray-500 text-sm mb-1">{category}</p>

        <p className="text-gray-600 text-sm leading-relaxed">{desc}</p>
      </div>

      <div className="flex flex-col sm:flex-row sm:items-center justify-between mt-4 gap-2">
        <div className="flex items-center gap-1 text-gray-700 text-sm">
          <FaClock /> {duration} {t("minutes")}
        </div>

        <div className="flex flex-col sm:flex-row sm:items-center gap-2">
          <span className="text-lg font-bold text-black">
            {t("member")}: {formatPrice(lowest_price_member)}
          </span>
          <span className="text-lg font-bold text-gray-600 line-through">
            {t("nonMember")}: {formatPrice(lowest_price_no_member)}
          </span>
        </div>

        <Button onClick={onLearnMore}>{t("learnMore")}</Button>
      </div>
    </div>
  );

  if (view === "grid") {
    return (
      <div className="bg-white rounded-xl shadow-md overflow-hidden flex flex-col hover:shadow-lg transition-shadow">
        <Image
          src={imgSrc}
          alt={title}
          width={400}
          height={250}
          className="w-full h-64 object-cover"
        />
        <CardContent />
      </div>
    );
  }

  return (
    <div className="bg-white max-w-7xl mx-auto rounded-xl shadow-md flex flex-col sm:flex-row overflow-hidden hover:shadow-lg transition-shadow w-full">
      <Image
        src={imgSrc}
        alt={title}
        width={250}
        height={200}
        className="w-full sm:w-64 h-56 object-cover"
      />
      <CardContent />
    </div>
  );
}
