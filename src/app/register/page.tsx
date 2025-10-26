"use client";

import { useState } from "react";
import AuthFooter from "@/components/features/AuthFooter";
import { typography } from "@/styles/styles";
import AuthCard from "@/components/features/AuthCard";
import Logo from "@/components/features/Logo";
import PasswordInput from "@/components/ui/PasswordInput";
import TextInput from "@/components/ui/TextInput";
import { PhoneInput } from "@/components/ui/phone-input";
import Checkbox from "@/components/ui/Checkbox";
import { AlertCard } from "@/components/features/AlertCard";
import { registerSchema } from "@/lib/validation/registerSchema";
import { RegisterFormData } from "@/lib/validation/registerSchema";
import GoogleLoginButton from "@/components/ui/GoogleLoginButton";
import { colors } from "@/styles/styles";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
export default function RegisterPage() {
  const [formData, setFormData] = useState<RegisterFormData>({
    nombre: "",
    apellido: "",
    email: "",
    telefono: "",
    documento: "",
    genero: "", // ✅ valor válido según el esquema
    nacimiento: "",
    password: "",
    cpassword: "",
  });

  const [error, setError] = useState<
    Partial<Record<keyof RegisterFormData, string[]>>
  >({});
  const [showAlert, setShowAlert] = useState(false);
  const [showAlertError, setShowAlertError] = useState(false);
  const [submitError, setSubmitError] = useState("");
  const [terms, setTerms] = useState(false);
  const router = useRouter();

  const handleCheckboxChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setTerms(event.target.checked);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

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
      //si paso las validaciones mandar los datos a la api
      const birthDateISO = formData.nacimiento
        ? new Date(formData.nacimiento + "T00:00:00.000Z").toISOString()
        : "";

      const genderMapping = {
        masculino: "male",
        femenino: "female",
      };

      const apiGender =
        genderMapping[formData.genero as keyof typeof genderMapping] ||
        formData.genero;

      try {
        const apiUrl = process.env.NEXT_PUBLIC_API_URL;
        const response = await fetch(`${apiUrl}/auth/register`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            first_name: formData.nombre,
            last_name: formData.apellido,
            email: formData.email,
            phone: formData.telefono,
            identity_document: formData.documento,
            gender: apiGender,
            birth_Date: birthDateISO,
            password: formData.password,
          }),
        });

        const data = await response.json();

        if (!response.ok) {
          setSubmitError(data.message || "Error al registrar");
          if (data.error === "conflict") {
            setSubmitError("Usuario Ya Registrado");
          }
          setShowAlertError(true);
          return;
        }

        setShowAlertError(false);
        setError({});
        setFormData({
          nombre: "",
          apellido: "",
          email: "",
          telefono: "",
          documento: "",
          genero: "",
          nacimiento: "",
          password: "",
          cpassword: "",
        });
        setTerms(false);
        setShowAlert(true);
      } catch (error) {
        console.error("Error al conectar con la API:", error);
        alert("No se pudo conectar con el servidor");
      }
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
        message="Revisa tu correo"
        description="¡Gracias por registrarte en VITALFIT! Para completar tu registro, por favor, verifica tu dirección de correo electrónico."
        buttonLabel="Cerrar"
        onClose={() => {
          setShowAlert(false);
          router.push("/confirmEmail?flow=register");
        }}
      />
      <AlertCard
        visible={showAlertError}
        message="Error"
        description={submitError}
        buttonLabel="Cerrar"
        error={true}
        onClose={() => setShowAlertError(false)}
      />
      <div className="flex justify-center w-full max-w-6xl">
        <div className="w-full max-w-2xl lg:max-w-4xl">
          <AuthCard>
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6 space-y-4 sm:space-y-0 w-full">
              <div className="text-center lg:text-left">
                <h3 className={`${typography.h3} text-xl sm:text-2xl`}>
                  CREA TU CUENTA
                </h3>
              </div>
              <div className="flex justify-center sm:justify-end text-right">
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
                  <PhoneInput
                    id="telefono"
                    value={formData.telefono}
                    onChange={(value) => handleInputChange("telefono", value)}
                    defaultCountry="VE"
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

              <div className="flex flex-col mb-4 space-y-4 sm:flex-row sm:space-y-0 sm:space-x-4">
                {/* Fecha de Nacimiento a la izquierda */}
                <div className="flex-1">
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
                {/* Género a la derecha */}
                <div className="flex flex-col mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-1 sm:text-base text-left">
                    Género*
                  </label>
                  <div className="p-4 rounded-md">
                    <label className="flex items-center">
                      <input
                        type="radio"
                        name="genero"
                        value="masculino"
                        checked={formData.genero === "masculino"}
                        onChange={() =>
                          handleInputChange("genero", "masculino")
                        }
                        className="form-radio h-4 w-4 text-primary"
                      />
                      <span className="ml-2">Masculino</span>
                    </label>
                    <label className="flex items-center mt-2">
                      <input
                        type="radio"
                        name="genero"
                        value="femenino"
                        checked={formData.genero === "femenino"}
                        onChange={() => handleInputChange("genero", "femenino")}
                        className="form-radio h-4 w-4 text-primary"
                      />
                      <span className="ml-2">Femenino</span>
                    </label>
                    <label className="flex items-center mt-2">
                      <input
                        type="radio"
                        name="genero"
                        value="prefiero no especificarlo"
                        checked={
                          formData.genero === "prefiero no especificarlo"
                        }
                        onChange={() =>
                          handleInputChange(
                            "genero",
                            "prefiero no especificarlo",
                          )
                        }
                        className="form-radio h-4 w-4 text-primary"
                      />
                      <span className="ml-2">Prefiero no especificarlo</span>
                    </label>
                  </div>
                  {error.genero?.map((msg, i) => (
                    <p key={i} className="text-red-500 text-xs sm:text-sm mt-1">
                      {msg}
                    </p>
                  ))}
                </div>
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
                <Button
                  fullWidth
                  type="submit"
                  className="w-full py-3 text-base sm:py-2"
                >
                  Crear Cuenta
                </Button>
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
