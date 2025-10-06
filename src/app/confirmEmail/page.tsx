"use client";

import { useState, useRef, useEffect } from "react";
import { typography } from "@/styles/styles";
import AuthCard from "@/components/AuthCard";
import Logo from "@/components/Logo";
import PrimaryButton from "@/components/PrimaryButton";
import { useRouter, useSearchParams } from "next/navigation"; // Modificado

export default function ConfirmEmail() {
  const [code, setCode] = useState<string[]>(["", "", "", "", "", ""]);
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);
  const router = useRouter();
  const searchParams = useSearchParams(); // Agregado
  const flow = searchParams.get("flow"); // Agregado

  useEffect(() => {
    if (inputRefs.current[0]) {
      inputRefs.current[0].focus();
    }
  }, []);

  const handleInputChange = (index: number, value: string) => {
    // Solo permitir números
    if (value && !/^\d+$/.test(value)) {
      return;
    }

    const newCode = [...code];
    newCode[index] = value;
    setCode(newCode);

    // Auto-focus al siguiente input si se ingresó un dígito
    if (value && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (
    index: number,
    e: React.KeyboardEvent<HTMLInputElement>,
  ) => {
    if (e.key === "Backspace" && !code[index] && index > 0) {
      // Si el input está vacío y se presiona backspace, ir al input anterior
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handlePaste = (e: React.ClipboardEvent) => {
    e.preventDefault();
    const pastedData = e.clipboardData.getData("text");
    const numbers = pastedData.replace(/\D/g, "").split("").slice(0, 6);

    if (numbers.length === 6) {
      const newCode = [...code];
      numbers.forEach((num, index) => {
        newCode[index] = num;
      });
      setCode(newCode);

      inputRefs.current[5]?.focus();
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const verificationCode = code.join("");

    if (verificationCode.length === 6) {
      if (flow === "recover") {
        router.push("/changePassword");
      } else {
        // Puedes cambiar "/login" por la ruta que desees después del registro
        router.push("/login");
      }
    } else {
      alert("Por favor, ingresa el código completo de 6 dígitos");
    }
  };

  const isCodeComplete = code.every((digit) => digit !== "");

  return (
    <div className="flex flex-col items-center justify-center px-5 py-4">
      <div className="flex justify-center w-full">
        <div className="max-w-sm w-full">
          <AuthCard>
            <Logo slogan={false} width={80} />
            <h2 className={typography.h3}>CONFIRMA TU CORREO ELECTRÓNICO</h2>
            <div className="text-left mb-4">
              <span>
                Introduce el código enviado a tu correo para confirmarlo
              </span>
            </div>

            <form className="w-full" onSubmit={handleSubmit} noValidate>
              <div className="space-y-3 w-full">
                <div className="flex justify-between gap-2 mb-6">
                  {code.map((digit, index) => (
                    <input
                      key={index}
                      ref={(el) => (inputRefs.current[index] = el)}
                      type="text"
                      inputMode="numeric"
                      maxLength={1}
                      value={digit}
                      onChange={(e) => handleInputChange(index, e.target.value)}
                      onKeyDown={(e) => handleKeyDown(index, e)}
                      onPaste={handlePaste}
                      className="w-10 h-10 text-center border border-gray-300 rounded-lg focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20 text-lg font-semibold"
                      placeholder="-"
                    />
                  ))}
                </div>
              </div>

              <div className="mt-4 w-full">
                <PrimaryButton type="submit" disabled={!isCodeComplete}>
                  Verificar Correo
                </PrimaryButton>
              </div>
              <div className="mt-4 w-full text-right">
                <a className="font-medium" href="#">
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
