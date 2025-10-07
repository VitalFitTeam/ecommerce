"use client";

import { useState } from "react";
import AuthFooter from "@/components/AuthFooter";
import { typography } from "@/styles/styles";
import AuthCard from "@/components/AuthCard";
import Logo from "@/components/Logo";
import PasswordInput from "@/components/PasswordInput";
import TextInput from "@/components/TextInput";
import Checkbox from "@/components/Checkbox";
import PrimaryButton from "@/components/PrimaryButton";
import { AlertCard } from "@/components/AlertCard";
import { registerSchema } from "@/lib/validation/registerSchema";
import { RegisterFormData } from "@/lib/validation/registerSchema";
import GoogleLoginButton from "@/components/GoogleLoginButton";
import { colors } from "@/styles/styles";
import { useRouter } from "next/navigation";

export default function RegisterPage() {
  const [formData, setFormData] = useState<RegisterFormData>({
    nombre: "",
    apellido: "",
    email: "",
    telefono: "",
    documento: "",
    nacimiento: "",
    password: "",
    cpassword: "",
  });

  const [error, setError] = useState<
    Partial<Record<keyof RegisterFormData, string[]>>
  >({});
  const [showAlert, setShowAlert] = useState(false);
  const [terms, setTerms] = useState(false);
  const router = useRouter();

  const handleCheckboxChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setTerms(event.target.checked);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // Validar términos y condiciones primero
    if (!terms) {
      setError((prev) => ({
        ...prev,
        terms: ["Debes aceptar los términos y condiciones"],
      }));
      return;
    } else {
      setError((prev) => ({ ...prev, terms: undefined }));
    }

    const result = registerSchema.safeParse(formData);

    if (!result.success) {
      const fieldErrors: Partial<Record<keyof RegisterFormData, string[]>> = {};
      const flattened = result.error.flatten();

      Object.entries(flattened.fieldErrors).forEach(([key, value]) => {
        if (value) {
          fieldErrors[key as keyof RegisterFormData] = value;
        }
      });

      setError(fieldErrors);
      return;
    } else {
      setShowAlert(true);
      setError({});
      setFormData({
        nombre: "",
        apellido: "",
        email: "",
        telefono: "",
        documento: "",
        nacimiento: "",
        password: "",
        cpassword: "",
      });
      setTerms(false);

      // Redirigir a la pantalla de confirmación de correo con el flujo de registro
      router.push("/confirmEmail?flow=register");
    }
  };

  const handleInputChange = (field: keyof RegisterFormData, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (error[field]) {
      setError((prev) => ({ ...prev, [field]: undefined }));
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen px-4 py-6 sm:px-6 lg:px-8">
      <AlertCard
        visible={showAlert}
        message="Registro exitoso"
        description="Tu cuenta ha sido creada exitosamente. Por favor revisa tu correo electrónico para verificar tu cuenta."
        buttonLabel="Cerrar"
        onClose={() => setShowAlert(false)}
      />

      <div className="flex justify-center w-full max-w-6xl">
        <div className="w-full max-w-2xl lg:max-w-4xl">
          <AuthCard>
            <div className="flex flex-col mb-6 space-y-4 sm:flex-row sm:justify-between sm:items-center sm:space-y-0">
              <div className="text-center sm:text-left">
                <h3 className={`${typography.h3} text-xl sm:text-2xl`}>
                  CREA UNA CUENTA
                </h3>
              </div>
              <div className="flex justify-center sm:justify-end">
                <Logo slogan={true} />
              </div>
            </div>

            <form className="w-full" onSubmit={handleSubmit} noValidate>
              <div className="flex flex-col mb-4 space-y-4 sm:flex-row sm:space-y-0 sm:space-x-4">
                <div className="flex-1">
                  <label
                    htmlFor="nombre"
                    className="block text-sm font-medium text-gray-700 mb-1 sm:text-base text-left"
                  >
                    Nombre*
                  </label>
                  <TextInput
                    id="nombre"
                    name="nombre"
                    ariaLabel="nombre"
                    placeholder="Nombre"
                    value={formData.nombre}
                    onChange={(e) =>
                      handleInputChange("nombre", e.target.value)
                    }
                    className="bg-white w-full"
                  />
                  {error.nombre?.map((msg, i) => (
                    <p key={i} className="text-red-500 text-xs sm:text-sm mt-1">
                      {msg}
                    </p>
                  ))}
                </div>
                <div className="flex-1">
                  <label
                    htmlFor="apellido"
                    className="block text-sm font-medium text-gray-700 mb-1 sm:text-base text-left"
                  >
                    Apellido*
                  </label>
                  <TextInput
                    id="apellido"
                    name="apellido"
                    ariaLabel="apellido"
                    placeholder="Apellido"
                    value={formData.apellido}
                    onChange={(e) =>
                      handleInputChange("apellido", e.target.value)
                    }
                    className="bg-white w-full"
                  />
                  {error.apellido?.map((msg, i) => (
                    <p key={i} className="text-red-500 text-xs sm:text-sm mt-1">
                      {msg}
                    </p>
                  ))}
                </div>
              </div>

              <div className="mb-4">
                <label
                  htmlFor="email"
                  className="block text-sm font-medium text-gray-700 mb-1 sm:text-base text-left"
                >
                  Correo Electrónico*
                </label>
                <TextInput
                  id="email"
                  name="email"
                  type="email"
                  ariaLabel="email"
                  placeholder="correo@ejemplo.com"
                  value={formData.email}
                  onChange={(e) => handleInputChange("email", e.target.value)}
                  className="bg-white w-full"
                />
                {error.email?.map((msg, i) => (
                  <p key={i} className="text-red-500 text-xs sm:text-sm mt-1">
                    {msg}
                  </p>
                ))}
              </div>

              <div className="flex flex-col mb-4 space-y-4 sm:flex-row sm:space-y-0 sm:space-x-4">
                <div className="flex-1">
                  <label
                    htmlFor="telefono"
                    className="block text-sm font-medium text-gray-700 mb-1 sm:text-base text-left"
                  >
                    Número de teléfono*
                  </label>
                  <TextInput
                    type="tel"
                    id="telefono"
                    name="telefono"
                    ariaLabel="telefono"
                    placeholder="Teléfono"
                    value={formData.telefono}
                    onChange={(e) =>
                      handleInputChange("telefono", e.target.value)
                    }
                    className="bg-white w-full"
                  />
                  {error.telefono?.map((msg, i) => (
                    <p key={i} className="text-red-500 text-xs sm:text-sm mt-1">
                      {msg}
                    </p>
                  ))}
                </div>
                <div className="flex-1">
                  <label
                    htmlFor="documento"
                    className="block text-sm font-medium text-gray-700 mb-1 sm:text-base text-left"
                  >
                    Documento de identidad*
                  </label>
                  <TextInput
                    id="documento"
                    name="documento"
                    ariaLabel="documento"
                    placeholder="Documento"
                    value={formData.documento}
                    onChange={(e) =>
                      handleInputChange("documento", e.target.value)
                    }
                    className="bg-white w-full"
                  />
                  {error.documento?.map((msg, i) => (
                    <p key={i} className="text-red-500 text-xs sm:text-sm mt-1">
                      {msg}
                    </p>
                  ))}
                </div>
              </div>

              <div className="mb-4">
                <label
                  htmlFor="nacimiento"
                  className="block text-sm font-medium text-gray-700 mb-1 sm:text-base text-left"
                >
                  Fecha de Nacimiento*
                </label>
                <TextInput
                  id="nacimiento"
                  type="date"
                  name="nacimiento"
                  ariaLabel="nacimiento"
                  value={formData.nacimiento}
                  onChange={(e) =>
                    handleInputChange("nacimiento", e.target.value)
                  }
                  className="bg-white w-full"
                />
                {error.nacimiento?.map((msg, i) => (
                  <p key={i} className="text-red-500 text-xs sm:text-sm mt-1">
                    {msg}
                  </p>
                ))}
              </div>

              <div className="flex flex-col mb-4 space-y-4 sm:flex-row sm:space-y-0 sm:space-x-4">
                <div className="flex-1">
                  <label
                    htmlFor="password"
                    className="block text-sm font-medium text-gray-700 mb-1 sm:text-base text-left"
                  >
                    Contraseña*
                  </label>
                  <PasswordInput
                    id="password"
                    name="password"
                    ariaLabel="Campo de contraseña"
                    placeholder="Ingresa tu contraseña"
                    value={formData.password}
                    onChange={(e) =>
                      handleInputChange("password", e.target.value)
                    }
                    className="bg-white w-full"
                  />
                  {error.password?.map((msg, i) => (
                    <p key={i} className="text-red-500 text-xs sm:text-sm mt-1">
                      {msg}
                    </p>
                  ))}
                </div>
                <div className="flex-1">
                  <label
                    htmlFor="cpassword"
                    className="block text-sm font-medium text-gray-700 mb-1 sm:text-base text-left"
                  >
                    Confirmar Contraseña*
                  </label>
                  <PasswordInput
                    id="cpassword"
                    name="cpassword"
                    ariaLabel="Confirmar Contraseña"
                    placeholder="Confirmar contraseña"
                    value={formData.cpassword}
                    onChange={(e) =>
                      handleInputChange("cpassword", e.target.value)
                    }
                    className="bg-white w-full"
                  />
                  {error.cpassword?.map((msg, i) => (
                    <p key={i} className="text-red-500 text-xs sm:text-sm mt-1">
                      {msg}
                    </p>
                  ))}
                </div>
              </div>

              <div className="flex items-start mb-6 space-x-3">
                <div className="flex-shrink-0 mt-1">
                  <Checkbox
                    labelText=""
                    isChecked={terms}
                    onChange={handleCheckboxChange}
                  />
                </div>
                <div className="flex-1">
                  <a
                    href="#"
                    style={{ color: colors.primary }}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-xs sm:text-sm hover:underline"
                  >
                    Acepto los términos, condiciones del servicio y las
                    políticas de seguridad
                  </a>
                  {error.terms?.map((msg, i) => (
                    <p key={i} className="text-red-500 text-xs sm:text-sm mt-1">
                      {msg}
                    </p>
                  ))}
                </div>
              </div>

              <div className="mt-6 w-full">
                <PrimaryButton
                  type="submit"
                  className="w-full py-3 text-base sm:py-2"
                >
                  Crear Cuenta
                </PrimaryButton>
              </div>
              <div className="mt-6 w-full">
                <GoogleLoginButton text="Sign in with google" />
              </div>
            </form>

            <AuthFooter
              text="¿Ya tienes una Cuenta?"
              linkText="Iniciar Sesión"
              href="/login"
            />
          </AuthCard>
        </div>
      </div>
    </div>
  );
}
