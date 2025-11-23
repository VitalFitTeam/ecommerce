import {
  MapPinIcon,
  PhoneIcon,
  ClockIcon,
  BuildingStorefrontIcon,
} from "@heroicons/react/24/outline";

export type BranchCardInfoProps = {
  title: string;
  location: string;
  phone: string;
};

export function BranchCardInfo({
  title,
  location,
  phone,
}: BranchCardInfoProps) {
  return (
    <div className="bg-white p-4 rounded-lg shadow-md border border-gray-200 hover:shadow-lg transition-shadow duration-200 cursor-pointer">
      <div className="flex items-center mb-2">
        <BuildingStorefrontIcon className="h-6 w-6 text-orange-500 mr-3" />
        <h3 className="text-lg font-semibold text-gray-800">{title}</h3>
      </div>
      <div className="ml-9 space-y-1 text-gray-600 text-sm">
        {" "}
        <div className="flex items-center">
          <MapPinIcon className="h-4 w-4 text-gray-400 mr-2" />
          <span>{location}</span>
        </div>
        <div className="flex items-center">
          <PhoneIcon className="h-4 w-4 text-gray-400 mr-2" />
          <span>{phone}</span>
        </div>
      </div>
    </div>
  );
}
