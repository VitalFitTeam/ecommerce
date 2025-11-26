import {
  MapPinIcon,
  PhoneIcon,
  BuildingStorefrontIcon,
  ChevronRightIcon,
} from "@heroicons/react/24/outline";

export interface BranchCardInfoProps {
  title: string;
  location: string;
  phone: string;
  onClick?: () => void;
}

export function BranchCardInfo({
  title,
  location,
  phone,
  onClick,
}: BranchCardInfoProps) {
  return (
    <div
      onClick={onClick}
      className="group flex items-center justify-between bg-white p-5 rounded-2xl border border-gray-100 shadow-sm hover:shadow-md hover:border-orange-200 transition-all duration-200 cursor-pointer w-full"
    >
      <div className="shrink-0 mr-4">
        <div className="h-12 w-12 rounded-xl bg-orange-50 text-orange-400 flex items-center justify-center group-hover:bg-orange-400 group-hover:text-white transition-colors duration-200">
          <BuildingStorefrontIcon className="h-6 w-6" />
        </div>
      </div>

      <div className="flex-1 min-w-0">
        <h3 className="text-2xl md:text-xl font-extrabold uppercase text-gray-950 leading-tight mb-2 group-hover:text-orange-500 transition-colors tracking-tight">
          {title}
        </h3>

        <div className="space-y-1.5">
          <div className="flex items-start gap-2 text-gray-500">
            <MapPinIcon className="h-4 w-4 shrink-0 mt-0.5 text-gray-400 group-hover:text-orange-400 transition-colors" />
            <p className="text-sm leading-snug line-clamp-2">{location}</p>
          </div>

          <div className="flex items-center gap-2 text-gray-500">
            <PhoneIcon className="h-4 w-4 shrink-0 text-gray-400 group-hover:text-orange-400 transition-colors" />
            <p className="text-sm font-medium">{phone}</p>
          </div>
        </div>
      </div>

      <div className="shrink-0 pl-4">
        <ChevronRightIcon className="h-6 w-6 text-gray-300 group-hover:text-orange-400 transform group-hover:translate-x-1 transition-all duration-200" />
      </div>
    </div>
  );
}
