import { z } from "zod";

export const loginSchema = z.object({
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