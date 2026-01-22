"use client";
export const dynamic = "force-dynamic";
import { useState, useEffect, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import AuthFooter from "@/components/features/AuthFooter";
import { typography } from "@/styles/styles";
import AuthCard from "@/components/features/AuthCard";
import Logo from "@/components/features/Logo";
import PasswordInput from "@/components/ui/PasswordInput";
import { Notification } from "@/components/ui/Notification";
import { passwordSchema } from "@/lib/validation/passwordSchema";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";
import { useRouter } from "@/i18n/routing";

function PasswordResetContent() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const tokenFromUrl = searchParams.get("token") || searchParams.get("code");

  const [isLoading, setIsLoading] = useState(false);
  const [showAlert, setShowAlert] = useState(false);
  const [showApiError, setShowApiError] = useState(false);
  const [showConnectionError, setShowConnectionError] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const [formData, setFormData] = useState({
    password: "",
    confirmPassword: "",
  });

  const [errors, setErrors] = useState<{
    password?: string;
    confirmPassword?: string;
  }>({});

  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (showAlert) {
      timer = setTimeout(() => {
        setShowAlert(false);
        router.push("/dashboard");
      }, 3000);
    }
    return () => clearTimeout(timer);
  }, [showAlert, router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setErrorMessage("");

    const result = passwordSchema.safeParse({
      password: formData.password,
      confirmPassword: formData.confirmPassword,
    });

    if (!result.success) {
      const fieldErrors: { password?: string; confirmPassword?: string } = {};
      result.error.issues.forEach((err) => {
        if (err.path[0] === "password") {
          fieldErrors.password = err.message;
        }
        if (err.path[0] === "confirmPassword") {
          fieldErrors.confirmPassword = err.message;
        }
      });
      setIsLoading(false);
      setErrors(fieldErrors);
      return;
    }

    try {
      const finalToken = tokenFromUrl || localStorage.getItem("code");

      if (!finalToken) {
        setErrorMessage(
          "No se encontró el token de autorización. Por favor solicita el cambio nuevamente.",
        );
        setShowApiError(true);
        setIsLoading(false);
        return;
      }

      const apiUrl = process.env.NEXT_PUBLIC_API_URL;
      const response = await fetch(`${apiUrl}/auth/password/reset`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          password: formData.password,
          confirm_password: formData.confirmPassword,
          token: finalToken,
        }),
      });

      if (!response.ok) {
        const errorText = await response.text();

        try {
          const errorJson = JSON.parse(errorText);
          setErrorMessage(errorJson.message || "Error al cambiar contraseña");
        } catch {
          setErrorMessage(errorText || "Error al cambiar contraseña");
        }
        setShowApiError(true);
        setIsLoading(false);
        return;
      }

      localStorage.removeItem("code");
      setErrors({});
      setFormData({ password: "", confirmPassword: "" });
      setShowAlert(true);
    } catch (error) {
      console.error("Error al conectar con la API:", error);
      setShowConnectionError(true);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex justify-center w-full">
      <div className="max-w-sm w-full">
        {showAlert && (
          <Notification
            variant="success"
            description="¡Contraseña restablecida exitosamente! Redirigiendo..."
          />
        )}
        {showApiError && (
          <Notification
            variant="destructive"
            title="Error"
            description={errorMessage}
            onClose={() => setShowApiError(false)}
          />
        )}
        {showConnectionError && (
          <Notification
            variant="destructive"
            title="Error de Conexión"
            description="No se pudo conectar con el servidor."
            onClose={() => setShowConnectionError(false)}
          />
        )}

        <AuthCard>
          <Logo slogan={false} width={80} />
          <h2 className={typography.h3}>CAMBIA TU CONTRASEÑA</h2>
          <div className="text-left mb-4">
            <span className="text-sm text-gray-600">
              Ingresa tu nueva contraseña para recuperar el acceso a tu cuenta.
            </span>
          </div>

          <form className="w-full space-y-4" onSubmit={handleSubmit} noValidate>
            <div className="space-y-3 w-full">
              <div className="flex flex-col">
                <label
                  htmlFor="password"
                  className="text-left font-medium mb-1 text-sm"
                >
                  Nueva Contraseña
                </label>
                <PasswordInput
                  id="password"
                  name="password"
                  ariaLabel="Campo de contraseña"
                  placeholder="Nueva contraseña"
                  value={formData.password}
                  onChange={(e) =>
                    setFormData({ ...formData, password: e.target.value })
                  }
                  className="bg-white"
                />
                {errors.password && (
                  <span className="text-red-500 text-xs mt-1 font-medium">
                    {errors.password}
                  </span>
                )}
              </div>

              <div className="flex flex-col">
                <label
                  htmlFor="confirmPassword"
                  className="text-left font-medium mb-1 text-sm"
                >
                  Confirmar Contraseña
                </label>
                <PasswordInput
                  id="confirmPassword"
                  name="confirmPassword"
                  ariaLabel="Confirmar contraseña"
                  placeholder="Confirmar contraseña"
                  value={formData.confirmPassword}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      confirmPassword: e.target.value,
                    })
                  }
                  className="bg-white"
                />
                {errors.confirmPassword && (
                  <span className="text-red-500 text-xs mt-1 font-medium">
                    {errors.confirmPassword}
                  </span>
                )}
              </div>
            </div>

            <div className="pt-2 w-full">
              <Button type="submit" disabled={isLoading} className="w-full">
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />{" "}
                    Procesando...
                  </>
                ) : (
                  "Cambiar Contraseña"
                )}
              </Button>
            </div>
          </form>

          <AuthFooter
            text="¿Recuerdas tu Contraseña?"
            linkText="Iniciar Sesión"
            href="/login"
          />
        </AuthCard>
      </div>
    </div>
  );
}

export default function PasswordResetPage() {
  return (
    <div className="flex flex-col items-center justify-center px-5 py-4 min-h-screen bg-slate-50/30">
      <Suspense
        fallback={
          <div className="flex flex-col items-center">
            <Loader2 className="h-8 w-8 animate-spin text-orange-500" />
            <span className="mt-2 text-sm text-slate-500">
              Cargando formulario...
            </span>
          </div>
        }
      >
        <PasswordResetContent />
      </Suspense>
    </div>
  );
}
