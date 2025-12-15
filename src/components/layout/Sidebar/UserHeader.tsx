import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { QrCodeIcon } from "@heroicons/react/24/outline";

export default function UserHeader({ user, onQrClick }: any) {
  const fullName = `${user.first_name} ${user.last_name}`;
  const initials =
    `${user.first_name?.[0] ?? ""}${user.last_name?.[0] ?? ""}`.toUpperCase();

  const category = user.ClientProfile?.category || "Sin categoría";
  const scoring = user.ClientProfile?.scoring ?? 0;

  return (
    <div className="flex flex-col items-center text-center px-6 pt-10 pb-6 border-b bg-white">
      {/* Avatar */}
      <div className="relative mb-4">
        <Avatar className="h-40 w-40 shadow-md border-2 border-gray-200 rounded-full">
          <AvatarImage src={user.profile_picture_url} alt={fullName} />
          <AvatarFallback className="bg-gray-300 text-white text-2xl rounded-full">
            {initials}
          </AvatarFallback>
        </Avatar>

        {/* Categoría visual */}
        <Badge
          className="
            absolute -bottom-2 left-1/2 -translate-x-1/2
            bg-amber-400 text-amber-900 
            rounded-full px-3 py-0.5 text-[10px] font-semibold shadow-sm
          "
        >
          {category}
        </Badge>
      </div>

      {/* Nombre */}
      <h2 className="text-xl font-semibold text-gray-900 leading-tight">
        {fullName}
      </h2>

      {/* Email */}
      <p className="text-xs text-gray-500">{user.email}</p>

      <p className="mt-2 text-sm font-medium text-gray-700">
        ⭐ {scoring} puntos
      </p>

      {/* Botón QR */}
      <Button
        variant="outline"
        onClick={onQrClick}
        className="
          w-full mt-5 mb-2 py-5
          rounded-xl border-gray-300 
          text-gray-700 font-medium 
          hover:bg-gray-100
          flex items-center justify-center gap-2
        "
      >
        <QrCodeIcon className="h-4 w-4" />
        Ver código QR
      </Button>
    </div>
  );
}
