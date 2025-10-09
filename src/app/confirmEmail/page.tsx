"use client";

import { useState, useRef, useEffect } from "react";
import { typography } from "@/styles/styles";
import AuthCard from "@/components/AuthCard";
import Logo from "@/components/Logo";
import PrimaryButton from "@/components/PrimaryButton";
import { useRouter, useSearchParams } from "next/navigation";

type ActivateResponse = {
  message?: string;
};

export default function ConfirmEmail() {
  const [code, setCode] = useState<string[]>(["", "", "", "", "", ""]);
  const [loading, setLoading] = useState(false);
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);
  const router = useRouter();
  const searchParams = useSearchParams();
  const flow = searchParams.get("flow");

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
      alert("Por favor, ingresa el código completo de 6 caracteres");
      return;
    }

    const apiUrl = process.env.NEXT_PUBLIC_API_URL;
    if (!apiUrl) {
      alert("La URL de la API no está configurada.");
      return;
    }

    setLoading(true);

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
        // Si el backend devuelve vacío, usamos mensaje genérico
        data = { message: undefined };
      }

      if (!response.ok) {
        alert(
          data.message || "No se pudo verificar el código. Intenta nuevamente.",
        );
        return;
      }

      alert("Correo verificado correctamente ✅");
      router.push(flow === "recover" ? "/changePassword" : "/login");
    } catch (error) {
      console.error("Error al conectar con la API:", error);
      alert("No se pudo conectar con el servidor. Intenta más tarde.");
    } finally {
      setLoading(false);
    }
  };

  const isCodeComplete = code.every((char) => char !== "");

  return (
    <div className="flex flex-col items-center justify-center px-5 py-4">
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
                    ref={(el) => (inputRefs.current[index] = el)}
                    type="text"
                    maxLength={1}
                    value={char}
                    autoComplete="one-time-code"
                    onChange={(e) => handleInputChange(index, e.target.value)}
                    onKeyDown={(e) => handleKeyDown(index, e)}
                    onPaste={handlePaste}
                    className="w-10 h-10 text-center border border-gray-300 rounded-lg focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20 text-lg font-semibold uppercase"
                    placeholder="-"
                  />
                ))}
              </div>

              <PrimaryButton
                type="submit"
                disabled={!isCodeComplete || loading}
              >
                {loading ? "Verificando..." : "Verificar Correo"}
              </PrimaryButton>

              <div className="mt-4 w-full text-right">
                <a
                  className="font-medium text-primary hover:underline"
                  href="#"
                >
                  Reenviar Código
                </a>
              </div>
            </form>
          </AuthCard>
        </div>
      </div>
    </div>
  );
}
