"use client";

import { useState } from "react";
import AuthFooter from "@/components/features/AuthFooter";
import { typography } from "@/styles/styles";
import AuthCard from "@/components/features/AuthCard";
import Logo from "@/components/features/Logo";
import PasswordInput from "@/components/ui/PasswordInput";
import { passwordSchema } from "@/lib/validation/passwordSchema";
import { Notification } from "@/components/ui/Notification"; // La importación ya está aquí
import { Button } from "@/components/ui/button";
import { useRouter } from "@/i18n/routing";

export default function PasswordReset() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [showAlert, setShowAlert] = useState(false);
  const [showConnectionError, setShowConnectionError] = useState(false);
  const [showServerError, setShowServerError] = useState<{
    visible: boolean;
    message: string;
  }>({ visible: false, message: "" });

  const [formData, setFormData] = useState({
    password: "",
    confirmPassword: "",
  });

  const [errors, setErrors] = useState<{
    password?: string;
    confirmPassword?: string;
  }>({});

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setShowServerError({ visible: false, message: "" });

    const result = passwordSchema.safeParse({
      password: formData.password,
      confirmPassword: formData.confirmPassword,
    });

    if (!result.success) {
      const fieldErrors: {
        password?: string;
        confirmPassword?: string;
      } = {};

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
      const apiUrl = process.env.NEXT_PUBLIC_API_URL;
      const tokenCode = localStorage.getItem("code");

      if (!tokenCode) {
        // 1. Reemplazamos el primer alert (Error en obtener token)
        setShowServerError({
          visible: true,
          message:
            "Error en obtener el código de confirmación. Por favor, solicita nuevamente el restablecimiento de contraseña.",
        });
        return;
      }

      const response = await fetch(`${apiUrl}/auth/password/reset`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          confirm_password: formData.confirmPassword,
          password: formData.password,
          token: tokenCode,
        }),
      });

      if (!response.ok) {
        const errorText = await response.text();
        // Intentamos parsear el JSON si es posible para un mensaje más limpio
        let errorMessage = "Error al cambiar contraseña";
        try {
          const errorData = JSON.parse(errorText);
          errorMessage = errorData.message || errorMessage;
        } catch {
          errorMessage = errorText || errorMessage;
        }

        // 2. Reemplazamos el segundo alert (Error al cambiar contraseña)
        setShowServerError({
          visible: true,
          message: errorMessage,
        });
        setIsLoading(false);
        return;
      }

      setErrors({});
      setFormData({
        password: "",
        confirmPassword: "",
      });
      setShowAlert(true);
    } catch (error) {
      console.error("Error al conectar con la API:", error);
      setShowConnectionError(true);
    } finally {
      // Use finally to ensure setIsLoading(false) runs
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center px-5 py-4">
      {showAlert && (
        <Notification
          variant="success"
          description="¡Contraseña restablecida exitosamente!"
          onClose={() => {
            setShowAlert(false);
            router.push("/login");
          }}
        />
      )}
      {showConnectionError && (
        <Notification
          variant="destructive"
          title="Error de Conexión"
          description="No se pudo conectar con el servidor. Por favor, inténtalo de nuevo más tarde."
          onClose={() => setShowConnectionError(false)}
        />
      )}
      {/* Nueva Notificación de Error del Servidor/Token */}
      {showServerError.visible && (
        <Notification
          variant="destructive"
          title="Error al Restablecer Contraseña"
          description={showServerError.message}
          onClose={() => setShowServerError({ visible: false, message: "" })}
        />
      )}
      <div className="flex justify-center w-full">
        <div className="max-w-sm w-full">
          <AuthCard>
            <Logo slogan={false} width={80} />
            <h2 className={typography.h3}>CAMBIA TU CONTRASEÑA</h2>
            <div className="text-left mb-4">
              <span>Ingrese su nueva contraseña.</span>
            </div>

            <form className="w-full" onSubmit={handleSubmit} noValidate>
              <div className="space-y-3 w-full">
                {/* ... Campos de Contraseña ... */}
                <div className="flex flex-col">
                  <label
                    htmlFor="password"
                    className="text-left font-medium mb-1"
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
                    <span className="text-red-500 text-sm mt-1">
                      {errors.password}
                    </span>
                  )}
                </div>

                <div className="flex flex-col">
                  <label
                    htmlFor="confirmPassword"
                    className="text-left font-medium mb-1"
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
                    <span className="text-red-500 text-sm mt-1">
                      {errors.confirmPassword}
                    </span>
                  )}
                </div>
              </div>

              <div className="mt-4 w-full">
                <Button fullWidth type="submit" disabled={isLoading}>
                  {isLoading ? "Procesando..." : "Continuar"}
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
    </div>
  );
}
