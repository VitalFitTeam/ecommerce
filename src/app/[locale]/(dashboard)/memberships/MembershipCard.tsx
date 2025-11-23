"use client";

import { Check, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";

interface MembershipCardProps {
  title: string;
  price: number;
  billingPeriod: string;
  description?: string;
  services: string[];
  featured?: boolean;
  featuredLabel?: string;
  buttonText?: string;
  onButtonClick?: () => void;
  accentColor?: string;
}

export function MembershipCard({
  title,
  price,
  billingPeriod,
  description,
  services,
  featured = false,
  featuredLabel = "Oferta Destacada",
  buttonText = "Únete Ahora",
  onButtonClick,
  accentColor = "#FF8C42",
}: MembershipCardProps) {
  const buttonBg = featured ? "#000000" : accentColor;

  return (
    <div className="relative">
      <div
        className={`rounded-2xl md:rounded-3xl overflow-hidden shadow-lg transition-transform hover:scale-105 ${
          featured
            ? " bg-primary border-2 border-orange-400"
            : "bg-gray-100 border border-gray-200"
        }`}
      >
        {featured && (
          <div className="hidden md:block absolute top-3 right-0 bg-white text-xs font-bold py-2 px-2 rotate-45 origin-top-right transform translate-x-6 translate-y-2 my-10">
            {featuredLabel}
          </div>
        )}

        <div className="block md:hidden">
          <button
            onClick={onButtonClick}
            className="w-full p-4 flex items-center justify-between cursor-pointer hover:opacity-90 transition-opacity"
          >
            <div className="flex-1 text-left">
              <p
                className={`text-xs font-medium mb-1 ${
                  featured ? "text-white/90" : "text-gray-600"
                }`}
              >
                {title}
              </p>
              <div className="flex items-baseline gap-1">
                <span
                  className={`text-3xl font-bold ${
                    featured ? "text-white" : "text-gray-900"
                  }`}
                >
                  ${price}
                </span>
                <span
                  className={`text-sm ${
                    featured ? "text-white/80" : "text-gray-600"
                  }`}
                >
                  /{billingPeriod}
                </span>
              </div>
              {description && (
                <p
                  className={`text-xs mt-1 ${
                    featured ? "text-white/80" : "text-gray-500"
                  }`}
                >
                  {description}
                </p>
              )}
            </div>
            <ChevronRight
              className={`w-6 h-6 flex-shrink-0 ${
                featured ? "text-white" : "text-gray-400"
              }`}
            />
          </button>
        </div>

        <div className="hidden md:block p-6 md:p-8">
          <div className="text-left mb-6">
            <p
              className={`text-sm font-medium mb-2 ${
                featured ? "text-white" : "text-orange-500"
              }`}
            >
              {title}
            </p>
            <div className="flex items-baseline gap-1">
              <span
                className={`text-5xl font-bold ${
                  featured ? "text-white" : "text-gray-900"
                }`}
              >
                ${price}
              </span>
              <span
                className={`text-lg ${
                  featured ? "text-white/80" : "text-gray-600"
                }`}
              >
                /{billingPeriod}
              </span>
            </div>
            {description && (
              <p
                className={`text-sm mt-2 ${
                  featured ? "text-white/90" : "text-gray-600"
                }`}
              >
                {description}
              </p>
            )}
          </div>

          <ul className="space-y-3 mb-8">
            {services.map((service, index) => (
              <li key={index} className="flex items-start gap-3">
                <div
                  className={`rounded-full p-1 flex-shrink-0 mt-0.5 ${
                    featured ? "bg-white/20" : "bg-gray-800"
                  }`}
                >
                  <Check
                    className={`w-3 h-3 ${
                      featured ? "text-white" : "text-white"
                    }`}
                    strokeWidth={3}
                  />
                </div>
                <span
                  className={`text-sm ${
                    featured ? "text-white" : "text-gray-700"
                  }`}
                >
                  {service}
                </span>
              </li>
            ))}
          </ul>

          <Button
            onClick={onButtonClick}
            className="w-full font-semibold py-6 rounded-xl transition-all hover:opacity-90"
            style={{
              backgroundColor: buttonBg,
              color: "#FFFFFF",
            }}
          >
            {buttonText}
          </Button>
        </div>
      </div>
    </div>
  );
}
