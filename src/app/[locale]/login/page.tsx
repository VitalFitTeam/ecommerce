"use client";

import { useState, useEffect } from "react";
import { useTranslations } from "next-intl";
import AuthFooter from "@/components/features/AuthFooter";
import AuthCard from "@/components/features/AuthCard";
import Logo from "@/components/features/Logo";
import GoogleLoginButton from "@/components/ui/GoogleLoginButton";
import PasswordInput from "@/components/ui/PasswordInput";
import TextInput from "@/components/ui/TextInput";
import { Notification } from "@/components/ui/Notification";
import { loginSchema } from "@/lib/validation/loginSchema";
import { Button } from "@/components/ui/button";
import { useRouter } from "@/i18n/routing";
import { useAuth } from "@/context/AuthContext";
import { api } from "@/lib/sdk-config";
import { Checkbox } from "@/components/ui/Checkbox";

export default function Login() {
  const t = useTranslations("LoginPage");
  const router = useRouter();

  const [rememberMe, setRememberMe] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [authError, setAuthError] = useState<string | null>(null);

  const { login } = useAuth();

  useEffect(() => {
    localStorage.clear();
  }, []);

  const [errors, setErrors] = useState<{
    email?: string[];
    password?: string[];
  }>({});

  const handleCheckboxChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setRememberMe(event.target.checked);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    const result = loginSchema.safeParse(formData);

    if (!result.success) {
      const fieldErrors: Record<string, string[]> = {};
      const flattened = result.error.flatten();

      if (flattened.fieldErrors.email) {
        fieldErrors.email = flattened.fieldErrors.email;
      }
      if (flattened.fieldErrors.password) {
        fieldErrors.password = flattened.fieldErrors.password;
      }

      setErrors(fieldErrors);
      setIsSubmitting(false);
      return;
    }

    setErrors({});

    try {
      const response = await api.auth.login({
        email: formData.email,
        password: formData.password,
      });

      const token = response.token;

      if (!token) {
        throw new Error("Token no recibido");
      }

      login(token);
      setAuthError(null);
      router.replace("/dashboard");
    } catch (error) {
      console.error("Error al conectar con la API:", error);
      setAuthError(t("errors.connectionError"));
      setIsSubmitting(false);
    }
  };

  return (
    <div
      className="min-h-screen bg-cover bg-center flex items-center justify-center lg:justify-end px-4 sm:px-5 py-4"
      style={{
        backgroundImage: "url('/images/login-bg.png')",
      }}
    >
      <div className="w-full max-w-sm sm:max-w-md lg:max-w-lg">
        {authError && (
          <Notification
            variant="destructive"
            title={t("errors.incorrectCredentials")}
            description={authError}
            onClose={() => setAuthError(null)}
          />
        )}

        <AuthCard>
          <Logo slogan={false} width={80} />
          <h2 className="text-3xl font-bebas">{t("title")}</h2>
          <GoogleLoginButton text={t("googleLogin")} />
          <div className="text-sm text-center mb-4">
            <span>{t("credentialsPrompt")}</span>
          </div>

          <form onSubmit={handleSubmit} noValidate>
            <div className="space-y-3 w-full">
              <div className="flex flex-col">
                <label htmlFor="email" className="text-left font-medium mb-1">
                  {/* CORRECCIÓN: Agregado el asterisco para mostrar obligatoriedad */}
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
                    setErrors((prev) => ({ ...prev, email: undefined }));
                  }}
                  className="bg-white"
                />
                {errors.email?.map((msg, i) => (
                  <p key={i} className="text-red-500 text-sm mt-1">
                    {msg}
                  </p>
                ))}
              </div>

              <div className="flex flex-col">
                <label
                  htmlFor="password"
                  className="text-left font-medium mb-1"
                >
                  {/* CORRECCIÓN: Agregado el asterisco para mostrar obligatoriedad */}
                  {t("password.label")}*
                </label>
                <PasswordInput
                  id="password"
                  name="password"
                  ariaLabel="Campo de contraseña"
                  placeholder={t("password.placeholder")}
                  value={formData.password}
                  onChange={(e) => {
                    setFormData({ ...formData, password: e.target.value });
                    setErrors((prev) => ({ ...prev, password: undefined }));
                  }}
                  className="bg-white"
                />
                {errors.password?.map((msg, i) => (
                  <p key={i} className="text-red-500 text-sm mt-1">
                    {msg}
                  </p>
                ))}
              </div>
            </div>

            <div className="flex flex-col sm:flex-row w-full mt-3 gap-2 sm:gap-0">
              <div className="flex-1 text-sm">
                <Checkbox
                  checked={rememberMe}
                  onCheckedChange={(checked) => setRememberMe(!!checked)}
                  aria-label={t("rememberMe")}
                />
                <span>{t("rememberMe")}</span>
              </div>
              <div className="flex-1 text-xs">
                <AuthFooter
                  text={t("forgotPassword.text")}
                  linkText={t("forgotPassword.link")}
                  href="/recoverPassword"
                />
              </div>
            </div>

            <div className="mt-4 w-full">
              <Button
                type="submit"
                variant="default"
                disabled={isSubmitting}
                className={isSubmitting ? "opacity-50 cursor-not-allowed" : ""}
              >
                {isSubmitting
                  ? t("submitButton.loading")
                  : t("submitButton.default")}
              </Button>
            </div>
          </form>

          <AuthFooter
            text={t("noAccount.text")}
            linkText={t("noAccount.link")}
            href="/register"
            replace={true}
          />
        </AuthCard>
      </div>
    </div>
  );
}
