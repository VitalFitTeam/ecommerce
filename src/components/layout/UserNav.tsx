"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import { Button } from "@/components/ui/button";
import {
  HomeIcon,
  UserIcon,
  ArrowRightStartOnRectangleIcon,
} from "@heroicons/react/24/outline";
import { useTranslations } from "next-intl";
import { User } from "@vitalfit/sdk";

interface UserNavProps {
  user: User;
  onSignOut?: () => void;
  onProfileClick?: () => void;
  onHomeClick?: () => void;
}

export function UserNav({
  user,
  onSignOut,
  onProfileClick,
  onHomeClick,
}: UserNavProps) {
  const t = useTranslations("UserNav");

  const initials =
    (user.first_name?.charAt(0) || "") + (user.last_name?.charAt(0) || "");

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          className="
            relative 
            h-10 w-10 
            rounded-full 
            p-0 
            focus-visible:ring-2 
            focus-visible:ring-primary/50 
            hover:bg-white/10 
            transition
          "
        >
          <Avatar className="h-10 w-10 border border-white/20 shadow-sm">
            <AvatarImage
              src={user.profile_picture_url || ""}
              alt={`${user.first_name} ${user.last_name}`}
              className="object-cover"
            />

            <AvatarFallback
              className="
                bg-gradient-to-br 
                from-primary 
                to-orange-400 
                text-white 
                font-semibold
              "
            >
              {initials}
            </AvatarFallback>
          </Avatar>
        </Button>
      </DropdownMenuTrigger>

      <DropdownMenuContent
        className="
          w-60 
          p-2 
          rounded-xl 
          shadow-xl 
          border border-slate-200/50 
          backdrop-blur-sm 
          bg-white/95 
          animate-in 
          fade-in-0 zoom-in-95
        "
        align="end"
        forceMount
      >
        <DropdownMenuLabel className="font-normal px-2 pb-2">
          <div className="flex items-center gap-3">
            <div className="flex flex-col space-y-0.5">
              <p className="text-sm font-semibold leading-none">
                {user.first_name} {user.last_name}
              </p>
              <p className="text-xs text-muted-foreground">{user.email}</p>
            </div>
          </div>
        </DropdownMenuLabel>

        <DropdownMenuSeparator className="my-2" />

        <DropdownMenuGroup>
          <DropdownMenuItem
            onClick={onHomeClick}
            className="
              cursor-pointer 
              rounded-md 
              px-3 py-2 
              hover:bg-primary/10 
              hover:text-primary 
              transition
            "
          >
            <HomeIcon className="mr-2 h-4 w-4" />
            <span>{t("home")}</span>
          </DropdownMenuItem>

          <DropdownMenuItem
            onClick={onProfileClick}
            className="
              cursor-pointer 
              rounded-md 
              px-3 py-2 
              hover:bg-primary/10 
              hover:text-primary 
              transition
            "
          >
            <UserIcon className="mr-2 h-4 w-4" />
            <span>{t("profile")}</span>
          </DropdownMenuItem>
        </DropdownMenuGroup>

        <DropdownMenuSeparator className="my-2" />

        <DropdownMenuItem
          onClick={onSignOut}
          className="
            cursor-pointer 
            text-red-600 
            rounded-md 
            px-3 py-2 
            hover:bg-red-100 
            transition
          "
        >
          <ArrowRightStartOnRectangleIcon className="mr-2 h-4 w-4" />
          <span>{t("logout")}</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
