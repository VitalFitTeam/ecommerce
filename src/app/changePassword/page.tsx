"use client";

import { useState } from "react";
import AuthFooter from "@/components/AuthFooter";
import { typography } from "@/styles/styles";
import AuthCard from "@/components/AuthCard";
import Logo from "@/components/Logo";
import PasswordInput from "@/components/PasswordInput";
import PrimaryButton from "@/components/PrimaryButton";

export default function Login() {
  const [formData, setFormData] = useState({
    usuario: "",
    password: "",
    confirmPassword: "",
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("continuar contraseña");
  };

  return (
    <div className="flex flex-col items-center justify-center px-5 py-4">
      {/* Card centrado siempre */}
      <div className="flex justify-center w-full">
        <div className="max-w-sm w-full">
          <AuthCard>
            <Logo slogan={false} width={80} />
            <h2 className={typography.h3}>CAMBIA TU CONTRASEÑA</h2>
            <div className="text-left mb-4">
              <span>
                Ingrese el correo electrónico asociado a la cuenta para
                recuperar la contraseña
              </span>
            </div>

            <form className="w-full" onSubmit={handleSubmit} noValidate>
              <div className="space-y-3 w-full">
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
                    onChange={(e) => {
                      setFormData({ ...formData, password: e.target.value });
                    }}
                    className="bg-white"
                  />
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
                    onChange={(e) => {
                      setFormData({
                        ...formData,
                        confirmPassword: e.target.value,
                      });
                    }}
                    className="bg-white"
                  />
                </div>
              </div>

              <div className="mt-4 w-full">
                <PrimaryButton type="submit">Continuar</PrimaryButton>
              </div>
            </form>

            <AuthFooter
              text="¿Recuerdas tu Contraseña?"
              linkText="Iniciar Sesión"
              href="#"
            />
          </AuthCard>
        </div>
      </div>
    </div>
  );
}
