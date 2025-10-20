"use client";

import { useState, useRef, useEffect } from "react";
import { typography } from "@/styles/styles";
import AuthCard from "@/components/AuthCard";
import { AlertCard } from "@/components/AlertCard";
import Logo from "@/components/Logo";
import PrimaryButton from "@/components/PrimaryButton";
import { useRouter, useSearchParams } from "next/navigation";

type ActivateResponse = {
  message?: string;
};

export default function ConfirmEmail() {
  const [code, setCode] = useState<string[]>(["", "", "", "", "", ""]);
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);
  const [showAlert, setShowAlert] = useState(false);
  const [showAlertConfirmation, setShowAlertConfirmation] = useState(false);
  const [incorrectCode, setIncorrectCode] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const searchParams = useSearchParams();
  const flow = searchParams.get("flow");
  const router = useRouter();

  useEffect(() => {
    inputRefs.current[0]?.focus();
  }, []);

  const isValidChar = (char: string) => /^[a-zA-Z0-9]$/.test(char);

  const handleInputChange = (index: number, value: string) => {
    const char = value.slice(-1).toUpperCase();
    if (!isValidChar(char) && char !== "") {
      return;
    }

    const newCode = [...code];
    newCode[index] = char;
    setCode(newCode);

    // clear previous error state when the user changes input
    if (incorrectCode) {
      setIncorrectCode(false);
      setErrorMessage(null);
    }

    if (index < code.length - 1 && char !== "") {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (
    index: number,
    e: React.KeyboardEvent<HTMLInputElement>,
  ) => {
    if (e.key === "Backspace") {
      const newCode = [...code];
      if (newCode[index] !== "") {
        newCode[index] = "";
        setCode(newCode);
      } else if (index > 0) {
        inputRefs.current[index - 1]?.focus();
        newCode[index - 1] = "";
        setCode(newCode);
      }
    }
  };

  const handlePaste = (e: React.ClipboardEvent) => {
    e.preventDefault();
    const pastedData = e.clipboardData.getData("text");
    const chars = pastedData.replace(/[^a-zA-Z0-9]/g, "").slice(0, 6);
    if (chars.length > 0) {
      const newCode = [...code];
      chars.split("").forEach((char, index) => {
        newCode[index] = char.toUpperCase();
      });
      setCode(newCode);
      inputRefs.current[Math.min(chars.length, 5)]?.focus();
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const verificationCode = code.join("").trim();
    if (verificationCode.length !== 6) {
      setIncorrectCode(true);
      setErrorMessage("Por favor, ingresa el código completo de 6 caracteres");
      setLoading(false);
      return;
    }

    setLoading(true);

    if (flow !== "recover") {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL;
      if (!apiUrl) {
        setIncorrectCode(true);
        setErrorMessage("La URL de la API no está configurada.");
        setLoading(false);
        return;
      }

      try {
        const response = await fetch(`${apiUrl}/auth/activate`, {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
          },
          body: JSON.stringify({ code: verificationCode }),
        });

        let data: ActivateResponse = { message: undefined };
        try {
          data = await response.json();
        } catch {
          data = { message: undefined };
        }

        if (!response.ok) {
          setIncorrectCode(true);
          setErrorMessage(data.message || "Código incorrecto");
          setLoading(false);
          return;
        }

        if (flow === "recover") {
          localStorage.setItem("code", verificationCode);
        }

        // clear any previous errors and show success
        setIncorrectCode(false);
        setErrorMessage(null);
        setShowAlert(true);
      } catch (error) {
        console.error("Error al conectar con la API:", error);
        setIncorrectCode(true);
        setErrorMessage(
          "No se pudo conectar con el servidor. Intenta más tarde.",
        );
      } finally {
        setLoading(false);
      }
    } else {
      const emailCode = localStorage.getItem("code");
      if (emailCode !== verificationCode) {
        setIncorrectCode(true);
        setErrorMessage("Código incorrecto");
        setLoading(false);
        return;
      }
    }

    setLoading(false);
    setIncorrectCode(false);
    setErrorMessage(null);
    setShowAlert(true);
  };

  const isCodeComplete = code.every((char) => char !== "");

  const resendCode = async () => {
    const email = localStorage.getItem("email");
    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL;
      const response = await fetch(`${apiUrl}/auth/password/forgot`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: email,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        setIncorrectCode(true);
        setErrorMessage(data.message || "Error al reenviar codigo");
        return;
      }

      if (flow === "recover") {
        localStorage.setItem("code", data.code);
      }

      setShowAlertConfirmation(true);
    } catch (error) {
      console.error("Error al conectar con la API:", error);
      setIncorrectCode(true);
      setErrorMessage("No se pudo conectar con el servidor");
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen px-5 py-4">
      <AlertCard
        visible={showAlert}
        message={
          flow === "recover"
            ? "Email Confirmado"
            : "¡Te has registrado exitosamente!"
        }
        description=""
        buttonLabel="Continuar"
        success={true}
        onClose={() => {
          setShowAlert(false);
          router.push(flow === "recover" ? "/changePassword" : "/login");
        }}
      />
      <AlertCard
        visible={showAlertConfirmation}
        message={"Codigo de Confirmación Reenviado"}
        description=""
        buttonLabel="OK"
        onClose={() => {
          setShowAlertConfirmation(false);
        }}
      />
      <div className="flex justify-center w-full">
        <div className="max-w-sm w-full">
          <AuthCard>
            <Logo slogan={false} width={80} />
            <h2 className={typography.h3}>CONFIRMA TU CORREO ELECTRÓNICO</h2>
            <p className="text-left mb-4">
              Introduce el código enviado a tu correo para confirmarlo
            </p>

            <form className="w-full" onSubmit={handleSubmit} noValidate>
              <div className="flex justify-between gap-2 mb-6">
                {code.map((char, index) => (
                  <input
                    key={index}
                    ref={(el) => {
                      inputRefs.current[index] = el;
                    }}
                    type="text"
                    maxLength={1}
                    value={char}
                    autoComplete="one-time-code"
                    onChange={(e) => handleInputChange(index, e.target.value)}
                    onKeyDown={(e) => handleKeyDown(index, e)}
                    onPaste={handlePaste}
                    className="w-8 h-8 text-center border border-gray-300 rounded-lg focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20 text-lg font-semibold uppercase"
                    placeholder="-"
                  />
                ))}
              </div>
              {incorrectCode && (
                <div className="text-left font-medium my-5">
                  <span className="text-red-500">
                    {errorMessage ?? "Codigo Incorrecto"}
                  </span>
                </div>
              )}
              <PrimaryButton
                type="submit"
                disabled={!isCodeComplete || loading}
              >
                {loading ? "Verificando..." : "Verificar Correo"}
              </PrimaryButton>

              <div className="mt-4 w-full text-right">
                <a
                  onClick={() => {
                    resendCode();
                  }}
                  className="text-green-500 hover:underline"
                  href="#"
                >
                  <h2>Reenviar Código</h2>
                </a>
              </div>
            </form>
          </AuthCard>
        </div>
      </div>
    </div>
  );
}
