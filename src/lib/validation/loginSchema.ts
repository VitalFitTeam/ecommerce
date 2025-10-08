import { z } from "zod";

export const loginSchema = z.object({
  email: z.string().email("Correo inválido"),
  password: z
    .string()
    .min(8, "Debe tener al menos 8 caracteres")
    .max(20, "No puede exceder 20 caracteres"),
});
