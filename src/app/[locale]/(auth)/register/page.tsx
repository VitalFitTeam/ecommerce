"use client";

import { useState } from "react";
import AuthFooter from "@/components/features/AuthFooter";
import { typography } from "@/styles/styles";
import AuthCard from "@/components/features/AuthCard";
import Logo from "@/components/features/Logo";
import PasswordInput from "@/components/ui/PasswordInput";
import TextInput from "@/components/ui/TextInput";
import { PhoneInput } from "@/components/ui/phone-input";
import { Notification } from "@/components/ui/Notification";
import { registerSchema } from "@/lib/validation/registerSchema";
import { RegisterFormData } from "@/lib/validation/registerSchema";
import GoogleLoginButton from "@/components/ui/GoogleLoginButton";
import { colors } from "@/styles/styles";
import { Button } from "@/components/ui/button";
import { useRouter } from "@/i18n/routing";
import { api } from "@/lib/sdk-config";
import { UserGender } from "@vitalfit/sdk";
import { useTranslations } from "next-intl"; // Importado para traducción
import { Checkbox } from "@/components/ui/Checkbox";

export default function RegisterPage() {
  // Inicializamos la función de traducción
  const t = useTranslations("RegisterPage");

  const [formData, setFormData] = useState<RegisterFormData>({
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

  const [error, setError] = useState<
    Partial<Record<keyof RegisterFormData | "terms", string[]>>
  >({});
  const [showAlert, setShowAlert] = useState(false);
  const [showAlertError, setShowAlertError] = useState(false);
  const [showConnectionError, setShowConnectionError] = useState(false);
  const [submitError, setSubmitError] = useState("");
  const [terms, setTerms] = useState(false);
  const router = useRouter();

  const handleCheckboxChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setTerms(event.target.checked);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const result = registerSchema.safeParse(formData);

    const fieldErrors: Partial<
      Record<keyof RegisterFormData | "terms", string[]>
    > = {};

    if (!result.success) {
      const flattened = result.error.flatten();

      Object.entries(flattened.fieldErrors).forEach(([key, value]) => {
        if (value) {
          fieldErrors[key as keyof RegisterFormData] = value;
        }
      });
    }

    if (!terms) {
      fieldErrors.terms = [t("validation.termsRequired")];
    }

    if (Object.keys(fieldErrors).length > 0) {
      setError(
        fieldErrors as Partial<Record<keyof RegisterFormData, string[]>>,
      );
      return;
    } else {
      const birthDateISO = formData.nacimiento
        ? new Date(formData.nacimiento).toISOString().split("T")[0]
        : "";

      // Mapeo de género usando claves de traducción
      const genderMapping = {
        [t("form.gender.maleValue")]: "male",
        [t("form.gender.femaleValue")]: "female",
        [t("form.gender.preferNotToSayValue")]: "prefer-not-to-say",
      };

      const apiGender = (genderMapping[
        formData.genero as keyof typeof genderMapping
      ] || formData.genero) as UserGender;

      try {
        const response = await api.auth.signUp({
          first_name: formData.nombre,
          last_name: formData.apellido,
          email: formData.email,
          password: formData.password,
          identity_document: formData.documento,
          phone: formData.telefono,
          birth_date: birthDateISO,
          gender: apiGender,
        });
        console.warn(response);

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
        setShowConnectionError(true);
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
      {showAlert && (
        <Notification
          variant="success"
          title={t("notifications.success.title")}
          description={t("notifications.success.description")}
          onClose={() => {
            setShowAlert(false);
            router.replace("/confirmEmail?flow=register");
          }}
        />
      )}
      {showAlertError && (
        <Notification
          variant="destructive"
          title={t("notifications.error.title")}
          description={submitError}
          onClose={() => setShowAlertError(false)}
        />
      )}
      {showConnectionError && (
        <Notification
          variant="destructive"
          title={t("notifications.connectionError.title")}
          description={t("notifications.connectionError.description")}
          onClose={() => setShowConnectionError(false)}
        />
      )}

      <div className="flex justify-center w-full max-w-6xl">
        <div className="w-full max-w-2xl lg:max-w-4xl">
          <AuthCard>
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6 space-y-4 sm:space-y-0 w-full">
              <div className="text-center lg:text-left">
                <h3 className={`${typography.h3} text-xl sm:text-2xl`}>
                  {t("title")}
                </h3>
              </div>
              <div className="flex justify-center sm:justify-end text-right">
                <Logo slogan={true} />
              </div>
            </div>

            <form className="w-full" onSubmit={handleSubmit} noValidate>
              {/* Nombre y Apellido */}
              <div className="flex flex-col mb-4 space-y-4 sm:flex-row sm:space-y-0 sm:space-x-4">
                <div className="flex-1">
                  <label
                    htmlFor="nombre"
                    className="block text-sm font-medium text-gray-700 mb-1 sm:text-base text-left"
                  >
                    {t("form.firstNameLabel")}*
                  </label>
                  <TextInput
                    id="nombre"
                    name="nombre"
                    ariaLabel={t("form.firstNameLabel")}
                    placeholder={t("form.firstNamePlaceholder")}
                    value={formData.nombre}
                    onChange={(e) =>
                      handleInputChange("nombre", e.target.value)
                    }
                    className="bg-white w-full"
                  />
                  {error.nombre?.[0] && (
                    <p className="text-red-500 text-xs sm:text-sm mt-1">
                      {error.nombre[0]}
                    </p>
                  )}
                </div>
                <div className="flex-1">
                  <label
                    htmlFor="apellido"
                    className="block text-sm font-medium text-gray-700 mb-1 sm:text-base text-left"
                  >
                    {t("form.lastNameLabel")}*
                  </label>
                  <TextInput
                    id="apellido"
                    name="apellido"
                    ariaLabel={t("form.lastNameLabel")}
                    placeholder={t("form.lastNamePlaceholder")}
                    value={formData.apellido}
                    onChange={(e) =>
                      handleInputChange("apellido", e.target.value)
                    }
                    className="bg-white w-full"
                  />
                  {error.apellido?.[0] && (
                    <p className="text-red-500 text-xs sm:text-sm mt-1">
                      {error.apellido[0]}
                    </p>
                  )}
                </div>
              </div>

              <div className="mb-4">
                <label
                  htmlFor="email"
                  className="block text-sm font-medium text-gray-700 mb-1 sm:text-base text-left"
                >
                  {t("form.emailLabel")}*
                </label>
                <TextInput
                  id="email"
                  name="email"
                  type="email"
                  ariaLabel={t("form.emailLabel")}
                  placeholder={t("form.emailPlaceholder")}
                  value={formData.email}
                  onChange={(e) => handleInputChange("email", e.target.value)}
                  className="bg-white w-full"
                />
                {error.email?.[0] && (
                  <p className="text-red-500 text-xs sm:text-sm mt-1">
                    {error.email[0]}
                  </p>
                )}
              </div>

              <div className="flex flex-col mb-4 space-y-4 sm:flex-row sm:space-y-0 sm:space-x-4">
                <div className="flex-1">
                  <label
                    htmlFor="telefono"
                    className="block text-sm font-medium text-gray-700 mb-1 sm:text-base text-left"
                  >
                    {t("form.phoneLabel")}*
                  </label>
                  <PhoneInput
                    id="telefono"
                    value={formData.telefono}
                    onChange={(value) => handleInputChange("telefono", value)}
                    defaultCountry="VE"
                  />
                  {error.telefono?.[0] && (
                    <p className="text-red-500 text-xs sm:text-sm mt-1">
                      {error.telefono[0]}
                    </p>
                  )}
                </div>
                <div className="flex-1">
                  <label
                    htmlFor="documento"
                    className="block text-sm font-medium text-gray-700 mb-1 sm:text-base text-left"
                  >
                    {t("form.documentLabel")}*
                  </label>
                  <TextInput
                    id="documento"
                    name="documento"
                    ariaLabel={t("form.documentLabel")}
                    placeholder={t("form.documentPlaceholder")}
                    value={formData.documento}
                    onChange={(e) =>
                      handleInputChange("documento", e.target.value)
                    }
                    className="bg-white w-full"
                  />
                  {error.documento?.[0] && (
                    <p className="text-red-500 text-xs sm:text-sm mt-1">
                      {error.documento[0]}
                    </p>
                  )}
                </div>
              </div>

              <div className="mb-4">
                <label
                  htmlFor="nacimiento"
                  className="block text-sm font-medium text-gray-700 mb-1 sm:text-base text-left"
                >
                  {t("form.birthDateLabel")}*
                </label>
                <TextInput
                  id="nacimiento"
                  type="date"
                  name="nacimiento"
                  ariaLabel={t("form.birthDateLabel")}
                  value={formData.nacimiento}
                  onChange={(e) =>
                    handleInputChange("nacimiento", e.target.value)
                  }
                  className="bg-white w-full"
                />
                {error.nacimiento?.[0] && (
                  <p className="text-red-500 text-xs sm:text-sm mt-1">
                    {error.nacimiento[0]}
                  </p>
                )}
              </div>

              <div className="flex flex-col mb-4 space-y-4 sm:flex-row sm:space-y-0 sm:space-x-4">
                <div className="flex-1">
                  <label className="block text-sm font-medium text-gray-700 mb-1 sm:text-base text-left">
                    {t("form.gender.label")}*
                  </label>
                  <div className="p-2 rounded-md flex flex-wrap items-center gap-4">
                    <label className="flex items-center">
                      <input
                        type="radio"
                        name="genero"
                        value={t("form.gender.maleValue")}
                        checked={formData.genero === t("form.gender.maleValue")}
                        onChange={() =>
                          handleInputChange(
                            "genero",
                            t("form.gender.maleValue"),
                          )
                        }
                        className="form-radio h-4 w-4 text-primary"
                      />
                      <span className="ml-2">{t("form.gender.male")}</span>
                    </label>

                    <label className="flex items-center">
                      <input
                        type="radio"
                        name="genero"
                        value={t("form.gender.femaleValue")}
                        checked={
                          formData.genero === t("form.gender.femaleValue")
                        }
                        onChange={() =>
                          handleInputChange(
                            "genero",
                            t("form.gender.femaleValue"),
                          )
                        }
                        className="form-radio h-4 w-4 text-primary"
                      />
                      <span className="ml-2">{t("form.gender.female")}</span>
                    </label>

                    <label className="flex items-center">
                      <input
                        type="radio"
                        name="genero"
                        value={t("form.gender.preferNotToSayValue")}
                        checked={
                          formData.genero ===
                          t("form.gender.preferNotToSayValue")
                        }
                        onChange={() =>
                          handleInputChange(
                            "genero",
                            t("form.gender.preferNotToSayValue"),
                          )
                        }
                        className="form-radio h-4 w-4 text-primary"
                      />
                      <span className="ml-2">
                        {t("form.gender.preferNotToSay")}
                      </span>
                    </label>
                  </div>
                  {error.genero?.[0] && (
                    <p className="text-red-500 text-xs sm:text-sm mt-1">
                      {error.genero[0]}
                    </p>
                  )}
                </div>
              </div>

              <div className="flex flex-col mb-4 space-y-4 sm:flex-row sm:space-y-0 sm:space-x-4">
                <div className="flex-1">
                  <label
                    htmlFor="password"
                    className="block text-sm font-medium text-gray-700 mb-1 sm:text-base text-left"
                  >
                    {t("form.passwordLabel")}*
                  </label>
                  <PasswordInput
                    id="password"
                    name="password"
                    ariaLabel={t("form.passwordLabel")}
                    placeholder={t("form.passwordPlaceholder")}
                    value={formData.password}
                    onChange={(e) =>
                      handleInputChange("password", e.target.value)
                    }
                    className="bg-white w-full"
                  />
                  {error.password?.[0] && (
                    <p className="text-red-500 text-xs sm:text-sm mt-1">
                      {error.password[0]}
                    </p>
                  )}
                </div>
                <div className="flex-1">
                  <label
                    htmlFor="cpassword"
                    className="block text-sm font-medium text-gray-700 mb-1 sm:text-base text-left"
                  >
                    {t("form.confirmPasswordLabel")}*
                  </label>
                  <PasswordInput
                    id="cpassword"
                    name="cpassword"
                    ariaLabel={t("form.confirmPasswordLabel")}
                    placeholder={t("form.confirmPasswordPlaceholder")}
                    value={formData.cpassword}
                    onChange={(e) =>
                      handleInputChange("cpassword", e.target.value)
                    }
                    className="bg-white w-full"
                  />
                  {error.cpassword?.[0] && (
                    <p className="text-red-500 text-xs sm:text-sm mt-1">
                      {error.cpassword[0]}
                    </p>
                  )}
                </div>
              </div>

              <div className="flex items-start mb-6 space-x-3">
                <div className="flex-shrink-0 mt-1">
                  <Checkbox
                    labelText=""
                    checked={terms}
                    onCheckedChange={(checked) => setTerms(!!checked)}
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
                    {t("form.termsText")}
                  </a>
                  {error.terms?.map((msg, i) => (
                    <p key={i} className="text-red-500 text-xs sm:text-sm mt-1">
                      {msg}
                    </p>
                  ))}
                </div>
              </div>

              <div className="mt-6 w-full">
                <Button type="submit" className="w-full py-3 text-base sm:py-2">
                  {t("form.submitButton")}
                </Button>
              </div>
              <div className="mt-6 w-full">
                <GoogleLoginButton text={t("form.googleLoginText")} />
              </div>
            </form>

            <AuthFooter
              text={t("footer.loginPrompt")}
              linkText={t("footer.loginLink")}
              href="/login"
              replace={true}
            />
          </AuthCard>
        </div>
      </div>
    </div>
  );
}
