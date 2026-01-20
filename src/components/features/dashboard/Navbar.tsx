"use client";

import { useTranslations } from "next-intl";
import { UserNav } from "@/components/layout/UserNav";
import { useRouter } from "@/i18n/routing";
import { useAuth } from "@/context/AuthContext";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Bars3Icon, BellIcon } from "@heroicons/react/24/outline";
import Logo from "../Logo";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useNotifications } from "@/hooks/useNotifications";
import { formatDistanceToNow } from "date-fns";
import { es } from "date-fns/locale";
import { NotificationResponse } from "@vitalfit/sdk";

interface NavbarProps {
  onSignOut?: () => void;
  transparent?: boolean;
  onToggleSidebar?: () => void;
}

const NavbarDashboard = ({
  onSignOut,
  transparent,
  onToggleSidebar,
}: NavbarProps) => {
  const t = useTranslations("Navbar");
  const router = useRouter();
  const { user, logout, token } = useAuth();
  const { notifications, unreadCount, markAsRead, markAllAsRead, isLoading } =
    useNotifications(token || "");

  const currentLocale = user?.birth_date ? "es" : "es";
  const locale =
    (window?.location?.pathname?.split("/")[1] as "es" | "en") || "es";
  const dateLocale = locale === "es" ? es : undefined; // date-fns usa enUS por defecto si es undefined

  const handleLogoClick = () => router.push("/");
  const handleProfileClick = () => router.push("/profile");
  const handleHomeClick = () => router.push("/dashboard");

  return (
    <nav
      className={cn(
        "fixed top-0 left-0 right-0 z-[999] w-full px-6 lg:px-10 py-4 flex items-center justify-between transition-all duration-300",
        transparent
          ? "bg-transparent border-transparent"
          : "bg-slate-950/80 backdrop-blur-xl border-b border-white/5 shadow-2xl",
      )}
    >
      <div className="w-full max-w-screen-2xl mx-auto flex items-center justify-between">
        <div className="flex items-center gap-4">
          {onToggleSidebar && (
            <button
              className="md:hidden p-2 rounded-xl bg-white/5 border border-white/10 text-white active:scale-90 transition-transform"
              onClick={onToggleSidebar}
              aria-label="Open sidebar"
            >
              <Bars3Icon className="h-6 w-6" />
            </button>
          )}

          <button
            onClick={handleLogoClick}
            className="relative flex items-center group select-none transition-transform hover:scale-105"
          >
            <Logo slogan={true} theme="light" />
          </button>
        </div>

        <div className="flex items-center gap-6">
          {user ? (
            <div className="flex items-center gap-4">
              <div className="hidden sm:flex flex-col items-end bg-white/5 px-4 py-1.5 rounded-2xl border border-white/5">
                <span className="text-emerald-400 font-black text-xs uppercase italic tracking-tighter leading-none">
                  {user.ClientProfile.scoring}{" "}
                  <span className="text-[10px]">pts</span>
                </span>
                <span className="text-white/40 text-[9px] font-bold uppercase tracking-[0.1em] mt-1">
                  {user.ClientProfile.category || "Standard"}
                </span>
              </div>

              <div className="h-8 w-px bg-white/10 hidden sm:block"></div>

              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <button className="relative p-2 rounded-xl bg-white/5 border border-white/10 text-white/70 hover:text-white hover:bg-white/10 transition-all active:scale-95">
                    <BellIcon className="h-6 w-6" />
                    {unreadCount > 0 && (
                      <span className="absolute top-2 right-2 flex h-2.5 w-2.5">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                        <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500"></span>
                      </span>
                    )}
                  </button>
                </DropdownMenuTrigger>
                <DropdownMenuContent
                  align="end"
                  className="w-80 bg-slate-900/95 backdrop-blur-xl border-white/10 p-0 overflow-hidden shadow-2xl rounded-2xl"
                >
                  <div className="p-4 mt-2 border-b border-white/5 flex items-center justify-between bg-white/5">
                    <DropdownMenuLabel className="p-0 text-white font-bold">
                      {t("notifications.title")}
                    </DropdownMenuLabel>
                    <div className="flex items-center gap-2">
                      {unreadCount > 0 && (
                        <button
                          onClick={() => markAllAsRead()}
                          className="text-[10px] text-emerald-400 hover:text-emerald-300 font-bold uppercase tracking-wider transition-colors"
                        >
                          {t("notifications.markAllAsRead")}
                        </button>
                      )}
                      {unreadCount > 0 && (
                        <Badge className="bg-emerald-500/20 text-emerald-400 border-emerald-500/20 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider">
                          {t("notifications.new", { count: unreadCount })}
                        </Badge>
                      )}
                    </div>
                  </div>
                  <ScrollArea className="h-[300px]">
                    <div className="flex flex-col">
                      {isLoading ? (
                        <div className="p-8 text-center">
                          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-emerald-500 mx-auto mb-2"></div>
                          <p className="text-sm text-white/40">
                            {t("notifications.loading")}
                          </p>
                        </div>
                      ) : notifications.length > 0 ? (
                        notifications.map(
                          (notification: NotificationResponse) => (
                            <DropdownMenuItem
                              key={notification.id}
                              onClick={() =>
                                notification.is_read
                                  ? null
                                  : markAsRead(notification.id)
                              }
                              className="p-4 focus:bg-white/5 cursor-pointer border-b border-white/5 last:border-0 items-start flex-col gap-1 transition-colors"
                            >
                              <div className="flex items-center justify-between w-full gap-2">
                                <span
                                  className={cn(
                                    "font-bold text-sm",
                                    !notification.is_read
                                      ? "text-white"
                                      : "text-white/60",
                                  )}
                                >
                                  {notification.title}
                                </span>
                                {!notification.is_read && (
                                  <div className="h-1.5 w-1.5 rounded-full bg-emerald-500 shrink-0"></div>
                                )}
                              </div>
                              <p className="text-xs text-white/50 leading-relaxed font-medium">
                                {notification.message}
                              </p>
                              <span className="text-[10px] text-white/30 font-bold uppercase mt-1">
                                {formatDistanceToNow(
                                  new Date(notification.created_at),
                                  {
                                    addSuffix: true,
                                    locale: dateLocale,
                                  },
                                )}
                              </span>
                            </DropdownMenuItem>
                          ),
                        )
                      ) : (
                        <div className="p-8 text-center">
                          <p className="text-sm text-white/40">
                            {t("notifications.empty")}
                          </p>
                        </div>
                      )}
                    </div>
                  </ScrollArea>
                </DropdownMenuContent>
              </DropdownMenu>

              <div className="h-8 w-px bg-white/10 hidden sm:block"></div>

              <UserNav
                user={user}
                onSignOut={onSignOut || logout}
                onProfileClick={handleProfileClick}
                onHomeClick={handleHomeClick}
              />
            </div>
          ) : (
            <Button
              onClick={() => router.push("/login")}
              className="bg-primary hover:bg-orange-600 text-white font-black uppercase italic tracking-wider rounded-xl px-6"
            >
              {t("login")}
            </Button>
          )}
        </div>
      </div>
    </nav>
  );
};

export default NavbarDashboard;
