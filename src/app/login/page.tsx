"use client";

import { useState } from "react";
import * as z from "zod";
import AuthFooter from "@/components/AuthFooter";
import { typography } from "@/styles/styles";
import AuthCard from "@/components/AuthCard";
import Logo from "@/components/Logo";
import GoogleLoginButton from "@/components/GoogleLoginButton";
import PasswordInput from "@/components/PasswordInput";
import TextInput from "@/components/TextInput";
import PrimaryButton from "@/components/PrimaryButton";
import Checkbox from "@/components/Checkbox";

// ✅ Esquema Zod
const loginSchema = z.object({
  usuario: z.string().email("Correo inválido"),
  password: z
    .string()
    .min(8, "Debe tener al menos 8 caracteres")
    .max(20, "No puede exceder 20 caracteres")
    .refine((val) => /[A-Z]/.test(val), {
      message: "Debe contener al menos una mayúscula",
    })
    .refine((val) => /[a-z]/.test(val), {
      message: "Debe contener al menos una minúscula",
    })
    .refine((val) => /[0-9]/.test(val), {
      message: "Debe contener al menos un número",
    })
    .refine((val) => /[^A-Za-z0-9]/.test(val), {
      message: "Debe contener al menos un carácter especial",
    }),
});

export default function Login() {
  const [rememberMe, setRememberMe] = useState(false);
  const [formData, setFormData] = useState({ usuario: "", password: "" });
  const [errors, setErrors] = useState<{
    usuario?: string[];
    password?: string[];
  }>({});

  const handleCheckboxChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setRememberMe(event.target.checked);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const result = loginSchema.safeParse(formData);

    if (!result.success) {
      const fieldErrors: Record<string, string[]> = {};
      const flattened = result.error.flatten();

      if (flattened.fieldErrors.usuario) {
        fieldErrors.usuario = flattened.fieldErrors.usuario;
      }
      if (flattened.fieldErrors.password) {
        fieldErrors.password = flattened.fieldErrors.password;
      }

      setErrors(fieldErrors);
      return;
    }

    setErrors({});
    console.log("Login exitoso:", result.data);
  };

  return (
    <div
      className="min-h-screen bg-cover bg-center flex items-center justify-center lg:justify-end px-4 sm:px-5 py-4"
      style={{
        backgroundImage: "url('/images/login-bg.png')",
      }}
    >
      <div className="w-full max-w-sm sm:max-w-md lg:max-w-lg">
        <AuthCard>
          <Logo slogan={false} width={80} />
          <h2 className={typography.h3}>INICIAR SESIÓN</h2>
          <GoogleLoginButton text="Sign in with Google" />
          <div className="text-center md:text-left mb-4">
            <span>Ingresa tus credenciales para iniciar sesión</span>
          </div>

          <form onSubmit={handleSubmit} noValidate>
            <div className="space-y-3 w-full">
              <div className="flex flex-col">
                <label htmlFor="usuario" className="text-left font-medium mb-1">
                  Correo Electrónico*
                </label>
                <TextInput
                  id="usuario"
                  name="usuario"
                  ariaLabel="Usuario"
                  placeholder="Usuario"
                  value={formData.usuario}
                  onChange={(e) => {
                    setFormData({ ...formData, usuario: e.target.value });
                    setErrors((prev) => ({ ...prev, usuario: undefined }));
                  }}
                  className="bg-white"
                />
                {errors.usuario?.map((msg, i) => (
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
              <div className="flex-1">
                <Checkbox
                  labelText="Mantener Sesión"
                  isChecked={rememberMe}
                  onChange={handleCheckboxChange}
                />
              </div>
              <div className="flex-1">
                <AuthFooter
                  text="¿Olvidaste tu Contraseña?"
                  linkText="Recuperar"
                  href="/Recuperar"
                />
              </div>
            </div>

            <div className="mt-4 w-full">
              <PrimaryButton type="submit">Iniciar sesión</PrimaryButton>
            </div>
          </form>

          <AuthFooter
            text="¿No tienes Cuenta?"
            linkText="Registrarse"
            href="#"
          />
        </AuthCard>
      </div>
    </div>
  );
}
