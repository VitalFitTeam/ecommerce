"use client";

import {
  MapPinIcon,
  PhoneIcon,
  CalendarIcon,
} from "@heroicons/react/24/outline";
import { BuildingStorefrontIcon } from "@heroicons/react/24/outline";
import Card from "@/components/ui/Card";

interface BranchCardInfoProps {
  title: string;
  location: string;
  phone: string;
  hours: string;
}

export function BranchCardInfo({
  title,
  location,
  phone,
  hours,
}: BranchCardInfoProps) {
  return (
    <Card className="gap-4 p-2 mb-6 shadow-xl border border-gray-300">
      <div className="hidden md:block">
        {/* Content */}
        <div className={`text-gray-900`}>
          {/* Title */}
          <h3 className={`text-2xl text-left mb-4 text-primary`}>
            <BuildingStorefrontIcon className="w-6 text-gray-800 h-6 inline-block mr-2" />
            {title}
          </h3>

          {/* Location */}
          <div className="flex items-start gap-3 mb-3">
            <MapPinIcon className="w-5 h-5 flex-shrink-0 mt-0.5" />
            <p className={`text-sm text-gray-700`}>{location}</p>
          </div>

          {/* Phone */}
          <div className="flex items-start gap-3 mb-3">
            <PhoneIcon className="w-5 h-5 flex-shrink-0 mt-0.5" />
            <p className={`text-sm text-gray-700`}>{phone}</p>
          </div>

          {/* Hours */}
          <div className="flex items-start gap-3 mb-4">
            <CalendarIcon className="w-5 h-5 flex-shrink-0 mt-0.5" />
            <p className={`text-sm text-gray-700`}>{hours}</p>
          </div>
        </div>
      </div>

      <div className="md:hidden flex">
        {/* Content */}
        <div className={`flex-1 p-4 text-gray-900`}>
          {/* Title */}
          <h3 className={`text-sm font-bold mb-2 text-primary`}>{title}</h3>

          {/* Location */}
          <div className="flex items-start gap-2 mb-2">
            <MapPinIcon className="w-4 h-4 flex-shrink-0 mt-0.5" />
            <p className={`text-xs text-gray-700`}>{location}</p>
          </div>

          {/* Phone */}
          <div className="flex items-start gap-2 mb-2">
            <PhoneIcon className="w-4 h-4 flex-shrink-0 mt-0.5" />
            <p className={`text-xs text-gray-700`}>{phone}</p>
          </div>

          {/* Hours */}
          <div className="flex items-start gap-2">
            <CalendarIcon className="w-4 h-4 flex-shrink-0 mt-0.5" />
            <p className={`text-xs text-gray-700`}>{hours}</p>
          </div>
        </div>
      </div>
    </Card>
  );
}
