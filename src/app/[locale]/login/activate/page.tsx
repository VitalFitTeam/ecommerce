"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import AuthFooter from "@/components/features/AuthFooter";
import AuthCard from "@/components/features/AuthCard";
import Logo from "@/components/features/Logo";
import TextInput from "@/components/ui/TextInput";
import { getActivateSchema } from "@/lib/validation/activateSchema";
import { Button } from "@/components/ui/button";
import { useRouter } from "@/i18n/routing";
import { toast } from "sonner";

export default function ActivateAccount() {
  const t = useTranslations("ActivateAccount");
  const [formData, setFormData] = useState({ email: "" });
  const [error, setError] = useState<{ email?: string[] }>({});
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    toast.dismiss();

    const activateSchema = getActivateSchema(t);
    const result = activateSchema.safeParse(formData);

    if (!result.success) {
      const flattened = result.error.flatten();
      setError(flattened.fieldErrors);
      setIsLoading(false);
      return;
    }

    try {
      sessionStorage.setItem("temp_email", formData.email);

      toast.success(t("notifications.success"));

      router.replace("/confirmEmail?flow=activate");
    } catch (error) {
      console.error("Error activation:", error);
      toast.error(t("notifications.error"));
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div
      className="min-h-screen bg-cover bg-center flex items-center justify-center lg:justify-end px-4 sm:px-5 py-4"
      style={{ backgroundImage: `url("/images/login-bg.png")` }}
    >
      <div className="w-full max-w-sm sm:max-w-md lg:max-w-lg">
        <AuthCard>
          <Logo slogan={false} width={80} />
          <h2 className="text-3xl font-bebas">{t("title")}</h2>
          <div className="text-center mb-4">
            <span>{t("description")}</span>
          </div>

          <form className="w-full" onSubmit={handleSubmit} noValidate>
            <div className="space-y-3 w-full">
              <div className="flex flex-col">
                <label htmlFor="email" className="text-left font-medium mb-1">
                  {t("email.label")}*
                </label>
                <TextInput
                  id="email"
                  name="email"
                  ariaLabel="email"
                  placeholder={t("email.placeholder")}
                  value={formData.email}
                  onChange={(e) => {
                    setFormData({ ...formData, email: e.target.value });
                    setError((prev) => ({ ...prev, email: undefined }));
                  }}
                  className="bg-white"
                />
                {error.email?.map((msg, i) => (
                  <p key={i} className="text-red-500 text-sm mt-1">
                    {msg}
                  </p>
                ))}
              </div>
            </div>

            <div className="mt-4 w-full">
              <Button type="submit" disabled={isLoading}>
                {isLoading
                  ? t("submitButton.loading")
                  : t("submitButton.default")}
              </Button>
            </div>
          </form>

          <AuthFooter
            text={t("footer.text")}
            linkText={t("footer.link")}
            href="/login"
            replace={true}
          />
        </AuthCard>
      </div>
    </div>
  );
}
