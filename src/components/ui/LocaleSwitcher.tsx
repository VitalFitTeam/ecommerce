"use client";

import * as React from "react";
import { useLocale, useTranslations } from "next-intl";
import { usePathname, useRouter } from "@/i18n/routing";
import { locales } from "@/config";
// Borré el import de Lucide porque ya no se usa

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
} from "@/components/ui/select";
import { LanguageIcon } from "@heroicons/react/24/solid";

export default function LocaleSwitcher() {
  const t = useTranslations("LocaleSwitcher");
  const locale = useLocale();
  const router = useRouter();
  const pathname = usePathname();
  const [isPending, startTransition] = React.useTransition();

  function onSelectChange(nextLocale: string) {
    startTransition(() => {
      router.replace(pathname, { locale: nextLocale });
    });
  }

  return (
    <Select
      defaultValue={locale}
      onValueChange={onSelectChange}
      disabled={isPending}
    >
      <SelectTrigger className="w-auto border-none bg-transparent focus:ring-0 focus:ring-offset-0 text-gray-400 hover:text-white hover:bg-white/10 transition-colors h-9 px-2 rounded-lg data-[state=open]:bg-white/10 data-[state=open]:text-white ">
        <LanguageIcon className="h-5 w-5 " />
        <span className="sr-only">Cambiar idioma</span>
      </SelectTrigger>

      <SelectContent
        align="end"
        className="bg-[#1c212e] border-gray-700 text-gray-300 min-w-[140px]"
      >
        {locales.map((cur) => (
          <SelectItem
            key={cur}
            value={cur}
            className="focus:bg-white/5 focus:text-white cursor-pointer data-[state=checked]:text-orange-500 data-[state=checked]:bg-orange-500/10 py-3"
          >
            <div className="flex items-center gap-3">
              <span className="uppercase font-bold text-xs border border-gray-600 rounded px-1  text-center">
                {cur}
              </span>
              <span className="text-sm capitalize">
                {t("locale", { locale: cur })}
              </span>
            </div>
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}
