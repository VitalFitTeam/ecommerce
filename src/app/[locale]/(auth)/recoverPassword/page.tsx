"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import AuthFooter from "@/components/features/AuthFooter";
import { typography } from "@/styles/styles";
import AuthCard from "@/components/features/AuthCard";
import Logo from "@/components/features/Logo";
import TextInput from "@/components/ui/TextInput";
import { Notification } from "@/components/ui/Notification";
import { recoverSchema } from "@/lib/validation/recoverSchema";
import { Button } from "@/components/ui/button";
import { api } from "@/lib/sdk-config";
import { useRouter } from "@/i18n/routing";

export default function RecoverPassword() {
  const t = useTranslations("RecoverPassword");
  const [formData, setFormData] = useState({ usuario: "" });
  const [error, setError] = useState<{ usuario?: string[] }>({});
  const [showAlert, setShowAlert] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    const result = recoverSchema.safeParse(formData);

    if (!result.success) {
      const fieldErrors: Record<string, string[]> = {};
      const flattened = result.error.flatten();

      if (flattened.fieldErrors.usuario) {
        fieldErrors.usuario = flattened.fieldErrors.usuario;
      }

      setError(fieldErrors);
      setIsLoading(false);
      return;
    }

    try {
      const response = await api.auth.forgotPassword(formData.usuario);
      localStorage.setItem("email", formData.usuario);
      setShowAlert(true);
      setError({});
      setFormData({ usuario: "" });
    } catch (error) {
      setShowAlert(true);
    }

    setIsLoading(false);
  };

  return (
    <div className="flex items-center justify-center min-h-screen px-5 py-4">
      {/* Notificación de Éxito */}
      {showAlert && (
        <Notification
          variant="success"
          title={t("successNotification.title")}
          description={t("successNotification.description")}
          onClose={() => {
            setShowAlert(false);
            router.replace("/confirmEmail?flow=recover");
          }}
        />
      )}

      <div className="flex justify-center w-full">
        <div className="max-w-sm w-full">
          <AuthCard>
            <Logo slogan={false} width={80} />
            <h2 className={typography.h3}>{t("title")}</h2>
            <div className="text-center mb-4">
              <span>{t("subtitle")}</span>
            </div>

            <form className="w-full" onSubmit={handleSubmit} noValidate>
              <div className="space-y-3 w-full">
                <div className="flex flex-col">
                  <label
                    htmlFor="usuario"
                    className="text-left font-medium mb-1"
                  >
                    {t("form.emailLabel")}
                  </label>
                  <TextInput
                    id="usuario"
                    name="usuario"
                    ariaLabel="usuario"
                    placeholder={t("form.emailPlaceholder")}
                    value={formData.usuario}
                    onChange={(e) => {
                      setFormData({ ...formData, usuario: e.target.value });
                    }}
                    className="bg-white"
                  />
                  {error.usuario?.map((msg, i) => (
                    <p key={i} className="text-red-500 text-sm mt-1">
                      {msg}
                    </p>
                  ))}
                </div>
              </div>

              <div className="mt-4 w-full">
                <Button type="submit" disabled={isLoading}>
                  {isLoading ? t("form.processing") : t("form.submitButton")}
                </Button>
              </div>
            </form>

            <AuthFooter
              text={t("footer.text")}
              linkText={t("footer.linkText")}
              href="/login"
              replace={true}
            />
          </AuthCard>
        </div>
      </div>
    </div>
  );
}
