"use client";

import {
  MapPinIcon,
  PhoneIcon,
  CalendarIcon,
} from "@heroicons/react/24/outline";
import Image from "next/image";

interface BranchCardProps {
  title: string;
  image: string;
  location: string;
  phone: string;
  hours: string;
  services: string[];
  featured?: boolean;
}

export function BranchCard({
  title,
  image,
  location,
  phone,
  hours,
  services,
  featured = false,
}: BranchCardProps) {
  return (
    <div
      className={`rounded-2xl overflow-hidden border-2 transition-transform hover:scale-105 ${
        featured ? "border-primary bg-primary" : "border-gray-300 bg-white"
      }`}
    >
      <div className="hidden md:block">
        {/* Image */}
        <div className="relative w-full h-48 overflow-hidden">
          <Image
            src={image || "/placeholder.svg"}
            alt={title}
            fill
            className="object-cover"
          />
        </div>

        {/* Content */}
        <div className={`p-6 ${featured ? "text-white" : "text-gray-900"}`}>
          {/* Title */}
          <h3
            className={`text-2xl text-center mb-4 ${featured ? "text-white" : "text-primary"}`}
          >
            {title}
          </h3>

          {/* Location */}
          <div className="flex items-start gap-3 mb-3">
            <MapPinIcon className="w-5 h-5 flex-shrink-0 mt-0.5" />
            <p
              className={`text-sm ${featured ? "text-white" : "text-gray-700"}`}
            >
              {location}
            </p>
          </div>

          {/* Phone */}
          <div className="flex items-start gap-3 mb-3">
            <PhoneIcon className="w-5 h-5 flex-shrink-0 mt-0.5" />
            <p
              className={`text-sm ${featured ? "text-white" : "text-gray-700"}`}
            >
              {phone}
            </p>
          </div>

          {/* Hours */}
          <div className="flex items-start gap-3 mb-4">
            <CalendarIcon className="w-5 h-5 flex-shrink-0 mt-0.5" />
            <p
              className={`text-sm ${featured ? "text-white" : "text-gray-700"}`}
            >
              {hours}
            </p>
          </div>

          {/* Services */}
          <div className="border-t border-opacity-30 pt-4">
            <p
              className={`text-xs font-semibold mb-2 ${featured ? "text-white" : "text-gray-600"}`}
            >
              Servicios incluidos
            </p>
            <ul className="space-y-1">
              {services.map((service, index) => (
                <li
                  key={index}
                  className={`text-xs ${featured ? "text-white" : "text-gray-600"}`}
                >
                  • {service}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      <div className="md:hidden flex">
        {/* Image */}
        <div className="relative w-32 h-32 flex-shrink-0 overflow-hidden">
          <Image
            src={image || "/placeholder.svg"}
            alt={title}
            fill
            className="object-cover"
          />
        </div>

        {/* Content */}
        <div
          className={`flex-1 p-4 ${featured ? "text-white" : "text-gray-900"}`}
        >
          {/* Title */}
          <h3
            className={`text-sm font-bold mb-2 ${featured ? "text-white" : "text-primary"}`}
          >
            {title}
          </h3>

          {/* Location */}
          <div className="flex items-start gap-2 mb-2">
            <MapPinIcon className="w-4 h-4 flex-shrink-0 mt-0.5" />
            <p
              className={`text-xs ${featured ? "text-white" : "text-gray-700"}`}
            >
              {location}
            </p>
          </div>

          {/* Phone */}
          <div className="flex items-start gap-2 mb-2">
            <PhoneIcon className="w-4 h-4 flex-shrink-0 mt-0.5" />
            <p
              className={`text-xs ${featured ? "text-white" : "text-gray-700"}`}
            >
              {phone}
            </p>
          </div>

          {/* Hours */}
          <div className="flex items-start gap-2">
            <CalendarIcon className="w-4 h-4 flex-shrink-0 mt-0.5" />
            <p
              className={`text-xs ${featured ? "text-white" : "text-gray-700"}`}
            >
              {hours}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
