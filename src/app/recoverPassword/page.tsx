"use client";

import { useState } from "react";
import AuthFooter from "@/components/AuthFooter";
import { typography } from "@/styles/styles";
import AuthCard from "@/components/AuthCard";
import Logo from "@/components/Logo";
import TextInput from "@/components/TextInput";
import PrimaryButton from "@/components/PrimaryButton";
import { AlertCard } from "@/components/AlertCard";
import { recoverSchema } from "@/lib/validation/recoverSchema";
import { useRouter } from "next/navigation";

export default function RecoverPassword() {
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
      const apiUrl = process.env.NEXT_PUBLIC_API_URL;
      const response = await fetch(`${apiUrl}/auth/password/forgot`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: formData.usuario,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        alert(data.message || "Error al verificar email");
        setIsLoading(false);
        return;
      }

      localStorage.setItem("email", formData.usuario);
      localStorage.setItem("code", data.code);
      setShowAlert(true);
      setError({});
      setFormData({ usuario: "" });
    } catch (error) {
      console.error("Error al conectar con la API:", error);
      alert("No se pudo conectar con el servidor");
    }

    setIsLoading(false);
  };

  return (
    <div className="flex items-center justify-center min-h-screen px-5 py-4">
      <AlertCard
        visible={showAlert}
        message="Revisa tu correo"
        description="Hemos enviado instrucciones para restablecer tu contraseña a tu correo electrónico. Por favor revisa tu bandeja de entrada y sigue el enlace para restablecer tu contraseña."
        buttonLabel="Cerrar"
        onClose={() => {
          setShowAlert(false);
          router.push("/confirmEmail?flow=recover");
        }}
      />

      <div className="flex justify-center w-full">
        <div className="max-w-sm w-full">
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
                <PrimaryButton type="submit" disabled={isLoading}>
                  {isLoading ? "Procesando..." : "Continuar"}
                </PrimaryButton>
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
