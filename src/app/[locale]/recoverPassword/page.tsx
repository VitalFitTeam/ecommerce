"use client";

import { useState } from "react";
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
  const [formData, setFormData] = useState({ usuario: "" });
  const [error, setError] = useState<{ usuario?: string[] }>({});
  const [showAlert, setShowAlert] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [showConnectionError, setShowConnectionError] = useState(false);
  // 1. Nuevo estado para la notificación de error del servidor/email no verificado
  const [showServerError, setShowServerError] = useState<{
    visible: boolean;
    message: string;
  }>({ visible: false, message: "" });
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setShowServerError({ visible: false, message: "" });

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
      console.error("Error al conectar con la API:", error);
      setShowConnectionError(true);
    }

    setIsLoading(false);
  };

  return (
    <div className="flex items-center justify-center min-h-screen px-5 py-4">
      {/* Notificación de Éxito */}
      {showAlert && (
        <Notification
          variant="success"
          title="Revisa tu correo"
          description="Hemos enviado instrucciones para restablecer tu contraseña a tu correo electrónico. Por favor revisa tu bandeja de entrada y sigue el enlace para restablecer tu contraseña."
          onClose={() => {
            setShowAlert(false);
            router.push("/confirmEmail?flow=recover");
          }}
        />
      )}
      {/* Notificación de Error de Conexión */}
      {showConnectionError && (
        <Notification
          variant="destructive"
          title="Error de Conexión"
          description="No se pudo conectar con el servidor. Por favor, inténtalo de nuevo más tarde."
          onClose={() => setShowConnectionError(false)}
        />
      )}
      {/* 3. Nueva Notificación de Error del Servidor/Email */}
      {showServerError.visible && (
        <Notification
          variant="destructive" // O el variant que uses para errores
          title="Error de Verificación"
          description={showServerError.message}
          onClose={() => setShowServerError({ visible: false, message: "" })}
        />
      )}

      <div className="flex justify-center w-full">
        <div className="max-w-sm w-full">
          {/* ... El resto del componente permanece igual ... */}
          <AuthCard>
            <Logo slogan={false} width={80} />
            <h2 className={typography.h3}>RECUPERA TU CONTRASEÑA</h2>
            <div className="text-center mb-4">
              <span>
                Ingrese el correo electrónico asociado a la cuenta para
                recuperar la contraseña
              </span>
            </div>

            <form className="w-full" onSubmit={handleSubmit} noValidate>
              <div className="space-y-3 w-full">
                <div className="flex flex-col">
                  <label
                    htmlFor="usuario"
                    className="text-left font-medium mb-1"
                  >
                    Correo Electrónico*
                  </label>
                  <TextInput
                    id="usuario"
                    name="usuario"
                    ariaLabel="usuario"
                    placeholder="usuario@ejemplo.com"
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
