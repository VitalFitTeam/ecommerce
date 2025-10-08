"use client";

import { useState, useRef, useEffect } from "react";
import { typography } from "@/styles/styles";
import AuthCard from "@/components/AuthCard";
import Logo from "@/components/Logo";
import PrimaryButton from "@/components/PrimaryButton";
import { useRouter, useSearchParams } from "next/navigation";

export default function ConfirmEmail() {
  const [code, setCode] = useState<string[]>(["", "", "", "", "", ""]);
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);
  const router = useRouter();
  const searchParams = useSearchParams();
  const flow = searchParams.get("flow");

  useEffect(() => {
    inputRefs.current[0]?.focus();
  }, []);

  const isValidChar = (char: string) => /^[a-zA-Z0-9]$/.test(char);

  const handleInputChange = (index: number, value: string) => {
    const char = value.slice(-1); // Solo tomar el último carácter ingresado

    const newCode = [...code];

    if (char === "") {
      newCode[index] = "";
      setCode(newCode);
      return;
    }

    if (!isValidChar(char)) {return;}

    newCode[index] = char;
    setCode(newCode);

    if (index < code.length - 1) {
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
        const updatedCode = [...code];
        updatedCode[index - 1] = "";
        setCode(updatedCode);
      }
    }
  };

  const handlePaste = (e: React.ClipboardEvent) => {
    e.preventDefault();
    const pastedData = e.clipboardData.getData("text");
    const chars = pastedData
      .replace(/[^a-zA-Z0-9]/g, "")
      .split("")
      .slice(0, 6);

    if (chars.length > 0) {
      const newCode = [...code];
      chars.forEach((char, index) => {
        newCode[index] = char;
      });
      setCode(newCode);
      inputRefs.current[Math.min(chars.length, 5)]?.focus();
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const verificationCode = code.join("");

    if (verificationCode.length === 6) {
      router.push(flow === "recover" ? "/changePassword" : "/login");
    } else {
      alert("Por favor, ingresa el código completo de 6 caracteres");
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
            <div className="text-left mb-4">
              <span>
                Introduce el código enviado a tu correo para confirmarlo
              </span>
            </div>

            <form className="w-full" onSubmit={handleSubmit} noValidate>
              <div className="space-y-3 w-full">
                <div className="flex justify-between gap-2 mb-6">
                  {code.map((char, index) => (
                    <input
                      key={index}
                      ref={(el) => (inputRefs.current[index] = el)}
                      type="text"
                      maxLength={1}
                      value={char}
                      onChange={(e) => handleInputChange(index, e.target.value)}
                      onKeyDown={(e) => handleKeyDown(index, e)}
                      onPaste={handlePaste}
                      className="w-10 h-10 text-center border border-gray-300 rounded-lg focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20 text-lg font-semibold uppercase"
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
