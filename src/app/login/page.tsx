"use client";

import { useState, useEffect } from "react";
import AuthFooter from "@/components/features/AuthFooter";
import AuthCard from "@/components/features/AuthCard";
import Logo from "@/components/features/Logo";
import GoogleLoginButton from "@/components/ui/GoogleLoginButton";
import PasswordInput from "@/components/ui/PasswordInput";
import TextInput from "@/components/ui/TextInput";
import Checkbox from "@/components/ui/Checkbox";
import { Notification } from "@/components/ui/Notification";
import { loginSchema } from "@/lib/validation/loginSchema";
import { Button } from "@/components/ui/button";

export default function Login() {
  const [rememberMe, setRememberMe] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [authError, setAuthError] = useState<string | null>(null);
  const [showApiError, setShowApiError] = useState(false);
  const [showConnectionError, setShowConnectionError] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

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
      const apiUrl = process.env.NEXT_PUBLIC_API_URL;
      const response = await fetch(`${apiUrl}/auth/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (!response.ok) {
        if (response.status === 401) {
          setAuthError("Credenciales Incorrectas");
          // No llamamos a setShowApiError aquí porque authError se maneja por separado
        } else {
          setErrorMessage(data.message || "Error al iniciar sesión");
          setShowApiError(true);
        }
        setIsSubmitting(false);
        return;
      }

      // console.log("Token recibido:", data.token);
      sessionStorage.setItem("token", data.token);
      window.location.replace("/dashboard");
    } catch (error) {
      console.error("Error al conectar con la API:", error);
      setErrorMessage("No se pudo conectar con el servidor");
      setShowConnectionError(true);
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
            title=""
            description="Credenciales incorrectas"
            onClose={() => {
              setAuthError(null);
              setShowApiError(false);
            }}
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
          <h2 className="text-3xl font-bebas">INICIAR SESIÓN</h2>
          <GoogleLoginButton text="Iniciar sesión con Google" />
          <div className="text-sm text-center mb-4">
            <span>Ingresa tus credenciales para iniciar sesión</span>
          </div>

          <form onSubmit={handleSubmit} noValidate>
            <div className="space-y-3 w-full">
              <div className="flex flex-col">
                <label htmlFor="usuario" className="text-left font-medium mb-1">
                  Correo Electrónico*
                </label>
                <TextInput
                  id="email"
                  name="email"
                  ariaLabel="email"
                  placeholder="Email"
                  value={formData.email}
                  onChange={(e) => {
                    setFormData({ ...formData, email: e.target.value });
                    setErrors((prev) => ({ ...prev, usuario: undefined }));
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
                  Contraseña*
                </label>
                <PasswordInput
                  id="password"
                  name="password"
                  ariaLabel="Campo de contraseña"
                  placeholder="Ingresa tu contraseña"
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
                  labelText="Mantener Sesión"
                  isChecked={rememberMe}
                  onChange={handleCheckboxChange}
                />
              </div>
              <div className="flex-1 text-xs">
                <AuthFooter
                  text="¿Olvidaste tu Contraseña?"
                  linkText="Recuperar"
                  href="/recoverPassword"
                />
              </div>
            </div>

            <div className="mt-4 w-full">
              <Button
                type="submit"
                fullWidth
                variant={"primary"}
                disabled={isSubmitting}
                className={isSubmitting ? "opacity-50 cursor-not-allowed" : ""}
              >
                {isSubmitting ? "Cargando..." : "Iniciar sesión"}
              </Button>
            </div>
          </form>

          <AuthFooter
            text="¿No tienes Cuenta?"
            linkText="Registrarse"
            href="/register"
          />
        </AuthCard>
      </div>
    </div>
  );
}
