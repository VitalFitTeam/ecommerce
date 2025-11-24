"use client";

import { useTranslations } from "next-intl";
import { Button } from "@/components/ui/button";
import PasswordInput from "@/components/ui/PasswordInput"; // Importación de tu componente
import { useAuth } from "@/context/AuthContext";
import { useRouter } from "@/i18n/routing";

export default function Profile() {
  const { token } = useAuth();
  const router = useRouter();
  const t = useTranslations("security.changePassword");

  if (!token) {
    return null;
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
  };

  return (
    <main className="min-h-screen bg-white">
      <div className="p-4 md:p-16 pt-6">
        <div className="max-w-xl mx-auto mb-8 text-center">
          <p className="text-2xl font-semibold text-gray-900">{t("ptitle")}</p>
          <p className="mt-2 text-sm text-gray-500">{t("pdescription")}</p>
        </div>

        <form
          onSubmit={handleSubmit}
          className="max-w-xl mx-auto p-6 md:p-8 space-y-6"
        >
          <div className="space-y-2">
            <label
              htmlFor="current-password"
              className="block text-sm font-medium text-gray-700"
            >
              {t("currentPasswordLabel")}
            </label>
            <PasswordInput
              id="current-password"
              placeholder={t("currentPasswordPlaceholder")}
              ariaLabel={t("currentPasswordPlaceholder")}
              className="py-2"
            />
          </div>

          <div className="space-y-2">
            <label
              htmlFor="new-password"
              className="block text-sm font-medium text-gray-700"
            >
              {t("newPasswordLabel")}
            </label>
            <PasswordInput
              id="new-password"
              placeholder={t("newPasswordPlaceholder")}
              ariaLabel={t("newPasswordPlaceholder")}
              className="py-2"
            />
          </div>

          <div className="space-y-2">
            <label
              htmlFor="confirm-password"
              className="block text-sm font-medium text-gray-700"
            >
              {t("confirmPasswordLabel")}
            </label>
            <PasswordInput
              id="confirm-password"
              placeholder={t("confirmPasswordPlaceholder")}
              ariaLabel={t("confirmPasswordPlaceholder")}
              className="py-2"
            />
          </div>

          <div className="text-left text-sm pt-2">
            {t("forgotPasswordLabel")}{" "}
            <a
              onClick={() => {
                router.push("/security/forgotPassword");
              }}
              className="text-orange-400 hover:text-blue-800"
            >
              {t("forgotPasswordLink")}
            </a>
          </div>

          <Button type="submit" className="w-full" variant="default">
            {t("saveNewPasswordButton")}
          </Button>
        </form>
      </div>
    </main>
  );
}
