"use client";

import { useState, useEffect } from "react";
import { useTranslations, useLocale } from "next-intl";
import AuthFooter from "@/components/features/AuthFooter";
import AuthCard from "@/components/features/AuthCard";
import Logo from "@/components/features/Logo";
import GoogleLoginButton from "@/components/ui/GoogleLoginButton";
import PasswordInput from "@/components/ui/PasswordInput";
import TextInput from "@/components/ui/TextInput";
import { getLoginSchema } from "@/lib/validation/loginSchema";
import { Button } from "@/components/ui/button";
import { useRouter } from "@/i18n/routing";
import { useAuth } from "@/context/AuthContext";
import { api } from "@/lib/sdk-config";
import { Checkbox } from "@/components/ui/Checkbox";
import { toast } from "sonner";
import { useSignIn, useAuth as useClerkAuth } from "@clerk/nextjs";
import { useSearchParams } from "next/navigation";

export default function Login() {
  const t = useTranslations("LoginPage");
  const locale = useLocale();
  const router = useRouter();
  const searchParams = useSearchParams();
  const { login } = useAuth();

  const [rememberMe, setRememberMe] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [errors, setErrors] = useState<{
    email?: string[];
    password?: string[];
  }>({});

  const [isValidating, setIsValidating] = useState(false);

  const { signIn, isLoaded } = useSignIn();
  const { getToken, isSignedIn, signOut } = useClerkAuth();

  const handleGoogleLogin = async () => {
    if (!isLoaded) {
      return;
    }
    try {
      await signOut();
      await signIn.authenticateWithRedirect({
        strategy: "oauth_google",
        redirectUrl: `/${locale}/sso-callback`,
        redirectUrlComplete: `/${locale}/login?check_google=true`,
      });
    } catch (err) {
      console.error("Error Google:", err);
      toast.error("No se pudo conectar con Google");
    }
  };

  useEffect(() => {
    const checkSession = async () => {
      if (isSignedIn) {
        const isGoogleRedirect = searchParams.get("check_google") === "true";

        if (!isGoogleRedirect) {
          await signOut();
          return;
        }

        setIsValidating(true);

        try {
          const clerkToken = await getToken({ template: "vitalfit-backend" });

          if (!clerkToken) {
            setIsValidating(false);
            return;
          }

          const response = await api.auth.oAuthLogin({
            session_token: clerkToken,
          });

          if (response && response.token) {
            login(response.token);
            toast.success(t("title") || "Bienvenido");
            router.replace("/dashboard");
          }
        } catch (error: any) {
          let errorMsg = "";
          if (typeof error === "string") {
            errorMsg = error;
          } else if (error && typeof error === "object") {
            if (Array.isArray(error.messages)) {
              errorMsg = error.messages.join(" ");
            } else if (error.message) {
              errorMsg = error.message;
            } else {
              errorMsg = JSON.stringify(error);
            }
          }
          errorMsg = errorMsg.toLowerCase();

          if (
            errorMsg.includes("not found") ||
            errorMsg.includes("404") ||
            errorMsg.includes("no registrado")
          ) {
            toast.info("Cuenta nueva detectada", {
              description: "Redirigiendo al registro...",
            });

            router.replace("/register");
          } else {
            console.error("Error Backend:", error);
            await signOut();
            setIsValidating(false);
            toast.error("Error de conexión", {
              description: "No se pudo validar tu cuenta. Intenta de nuevo.",
            });
          }
        }
      }
    };

    checkSession();
  }, [isSignedIn, getToken, login, router, t, signOut, searchParams]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    toast.dismiss();

    const loginSchema = getLoginSchema(t);
    const result = loginSchema.safeParse(formData);
    if (!result.success) {
      const flattened = result.error.flatten();
      setErrors(flattened.fieldErrors);
      setIsSubmitting(false);
      return;
    }

    try {
      const response = await api.auth.login({
        email: formData.email,
        password: formData.password,
      });

      if (response.token) {
        login(response.token);
        toast.success(t("title") || "Bienvenido");
        router.replace("/dashboard");
      }
    } catch (error) {
      console.error("Error Login:", error);
      toast.error(t("errors.incorrectCredentials"));
      setIsSubmitting(false);
    }
  };

  return (
    <div
      className="min-h-screen bg-cover bg-center flex items-center justify-center lg:justify-end px-4 sm:px-5 py-4"
      style={{ backgroundImage: `url("/images/login-bg.png")` }}
    >
      <div className="w-full max-w-sm sm:max-w-md lg:max-w-lg">
        <AuthCard>
          <Logo slogan={false} width={50} />
          <h3 className="text-xl font-bebas leading-tight text-center w-full">
            <span className="prevent-clip">{t("title")}</span>
          </h3>

          {isValidating ? (
            <div className="py-12 flex flex-col items-center justify-center text-gray-500">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-orange-500 mb-4"></div>
              <p>Verificando cuenta...</p>
            </div>
          ) : (
            <>
              <div
                onClick={handleGoogleLogin}
                className="w-full cursor-pointer"
              >
                <GoogleLoginButton text={t("googleLogin")} />
              </div>

              <div className="text-sm text-center mb-4 mt-4">
                <span>{t("credentialsPrompt")}</span>
              </div>

              <form onSubmit={handleSubmit} noValidate>
                <div className="space-y-3 w-full">
                  <div className="flex flex-col">
                    <label
                      htmlFor="email"
                      className="text-left font-medium mb-1"
                    >
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
                      {t("password.label")}*
                    </label>
                    <PasswordInput
                      id="password"
                      name="password"
                      ariaLabel="pass"
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
                      onCheckedChange={(c) => setRememberMe(!!c)}
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
                    disabled={isSubmitting}
                    className={isSubmitting ? "opacity-50" : ""}
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
              <AuthFooter
                text={t("activateAccount.text")}
                linkText={t("activateAccount.link")}
                href="/login/activate"
              />
            </>
          )}
        </AuthCard>
      </div>
    </div>
  );
}
