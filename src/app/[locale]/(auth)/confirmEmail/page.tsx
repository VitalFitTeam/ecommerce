"use client";

import { useState, useRef, useEffect, Suspense } from "react";
import { typography } from "@/styles/styles";
import AuthCard from "@/components/features/AuthCard";
import Logo from "@/components/features/Logo";
import { useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { useRouter } from "@/i18n/routing";
import { api } from "@/lib/sdk-config";
import { useAuth } from "@/context/AuthContext";
import { toast } from "sonner";

function ConfirmEmailContent() {
  const [code, setCode] = useState<string[]>(["", "", "", "", "", ""]);
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  const [loading, setLoading] = useState(false);
  const searchParams = useSearchParams();
  const flow = searchParams.get("flow");
  const router = useRouter();

  const { login } = useAuth();

  useEffect(() => {
    inputRefs.current[0]?.focus();
  }, []);

  const isValidChar = (char: string) => /^[a-zA-Z0-9]$/.test(char);

  const handleInputChange = (index: number, value: string) => {
    const char = value.slice(-1).toUpperCase();
    if (!isValidChar(char) && char !== "") {return;}

    const newCode = [...code];
    newCode[index] = char;
    setCode(newCode);

    if (char !== "") {toast.dismiss();}

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
    toast.dismiss();

    const verificationCode = code.join("").trim();
    if (verificationCode.length !== 6) {
      toast.error("Por favor, ingresa el código completo de 6 caracteres");
      setLoading(false);
      return;
    }

    setLoading(true);

    try {
      if (flow === "register") {
        await api.auth.verifyEmail(verificationCode);
      } else {
        await api.auth.validateResetToken(verificationCode);
      }

      localStorage.setItem("code", verificationCode);

      if (flow === "register") {
        const tempEmail = sessionStorage.getItem("temp_email");
        const tempPassword = sessionStorage.getItem("temp_password");

        if (tempEmail && tempPassword) {
          try {
            const loginResponse = await api.auth.login({
              email: tempEmail,
              password: tempPassword,
            });

            if (loginResponse.token) {
              toast.success("Registro exitoso");

              setTimeout(() => {
                login(loginResponse.token);
                sessionStorage.removeItem("temp_email");
                sessionStorage.removeItem("temp_password");
                router.replace("/dashboard");
              }, 2000);
              return;
            }
          } catch (error) {
            console.error("Falló el auto-login:", error);
          }
        }
      }

      const mensajeExito =
        flow === "recover"
          ? "Código verificado correctamente"
          : "¡Registro exitoso!";

      toast.success(mensajeExito);

      setTimeout(() => {
        router.replace(flow === "recover" ? "/changePassword" : "/dashboard");
      }, 2000);
    } catch (error) {
      console.error("Error validación:", error);
      toast.error("Código incorrecto o expirado");
      // ✅ CORRECCIÓN: Si hay error, quitamos el loading SIEMPRE
      setLoading(false);
    }
    // Quitamos el finally complicado. Si es éxito, el loading se queda true (bien). Si es error, el catch lo quita (bien).
  };

  const isCodeComplete = code.every((char) => char !== "");

  const resendCode = async () => {
    const email =
      localStorage.getItem("email") || sessionStorage.getItem("temp_email");

    if (!email) {
      toast.error("No se encontró el email para reenviar");
      return;
    }

    try {
      const response = await api.auth.forgotPassword(String(email));
      console.warn(response);
      toast.success("Código de Confirmación Reenviado");
    } catch (error) {
      console.error("Error al conectar con la API:", error);
      toast.error("No se pudo reenviar el código");
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen px-5 py-4">
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

              <Button type="submit" disabled={!isCodeComplete || loading}>
                {loading ? "Verificando..." : "Verificar Correo"}
              </Button>

              <div className="mt-4 w-full text-right">
                <a
                  onClick={() => {
                    resendCode();
                  }}
                  className="text-green-500 hover:underline cursor-pointer"
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

export default function ConfirmEmail() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <ConfirmEmailContent />
    </Suspense>
  );
}
