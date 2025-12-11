"use client";

import { useTranslations } from "next-intl";
import { ChevronRight } from "lucide-react";

export default function UpcomingClasses() {
  const t = useTranslations("classes");

  const classes = [
    {
      id: 1,
      name: "Nombre",
      time: "Today, 07:00 AM",
      image: "/images/class1.png",
      availability: t("availability.available"),
      category: t("category.pilates"),
    },
    {
      id: 2,
      name: "Nombre",
      time: "Today, 8:30 AM",
      image: "/images/class2.png",
      availability: t("availability.limited"),
      category: t("category.yoga"),
    },
    {
      id: 3,
      name: "Nombre",
      time: "Today, 7:00 PM",
      image: "/images/class3.png",
      availability: t("availability.full"),
      category: t("category.cardio"),
    },
  ];

  return (
    <div className="bg-white rounded-lg p-6 border border-gray-200">
      <h3 className="text-lg font-bold mb-6">{t("title")}</h3>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 mb-4">
        {classes.map((cls) => (
          <div
            key={cls.id}
            className="relative rounded-lg overflow-hidden h-40"
          >
            <img
              src={cls.image}
              alt={cls.name}
              className="absolute inset-0 w-full h-full object-cover z-0"
            />

            <div className="absolute inset-0 bg-black/40 z-10"></div>

            <div className="absolute inset-0 z-20 flex flex-col justify-end p-4">
              <p className="text-white font-semibold text-sm">{cls.name}</p>
              <p className="text-gray-200 text-xs">{cls.time}</p>
              <div className="flex justify-between items-center mt-1">
                <p className="text-xs text-white">{cls.availability}</p>
                <span className="bg-black text-white text-xs px-3 py-1 rounded-full font-medium">
                  {cls.category}
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>

      <button className="hover:text-orange-600 font-semibold text-sm items-center gap-1 w-full">
        <div className="flex justify-center items-center">
          {t("viewAll")}
          <ChevronRight size={16} />
        </div>
      </button>
    </div>
  );
}
