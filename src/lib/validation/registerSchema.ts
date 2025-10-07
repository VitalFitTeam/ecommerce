import { z } from "zod";

export const registerSchema = z
  .object({
    nombre: z
      .string()
      .min(1, { message: "El nombre es obligatorio" })
      .min(2, { message: "El nombre debe tener al menos 2 caracteres" })
      .max(50, { message: "El nombre no puede exceder los 50 caracteres" }),

    apellido: z
      .string()
      .min(1, { message: "El apellido es obligatorio" })
      .min(2, { message: "El apellido debe tener al menos 2 caracteres" })
      .max(50, { message: "El apellido no puede exceder los 50 caracteres" }),

    email: z
      .string()
      .min(1, { message: "El correo electrónico es obligatorio" })
      .email({ message: "Debe ser un correo electrónico válido" }),

    telefono: z
      .string()
      .min(1, { message: "El teléfono es obligatorio" })
      .regex(/^[0-9+\-\s()]+$/, {
        message: "El teléfono debe contener solo números y caracteres válidos",
      }),

    documento: z
      .string()
      .min(1, { message: "El documento de identidad es obligatorio" })
      .min(3, { message: "El documento debe tener al menos 3 caracteres" }),

    genero: z
      .union([z.literal("masculino"), z.literal("femenino"), z.literal("")])
      .refine((val) => val !== "", {
        message: "Selecciona un género válido",
      }),

    nacimiento: z
      .string()
      .min(1, { message: "La fecha de nacimiento es obligatoria" })
      .refine(
        (date) => {
          const birthDate = new Date(date);
          const today = new Date();
          const age = today.getFullYear() - birthDate.getFullYear();
          const monthDiff = today.getMonth() - birthDate.getMonth();

          if (
            monthDiff < 0 ||
            (monthDiff === 0 && today.getDate() < birthDate.getDate())
          ) {
            return age - 1 >= 18;
          }
          return age >= 18;
        },
        { message: "Debes ser mayor de 18 años" },
      ),

    password: z
      .string()
      .min(1, { message: "La contraseña es obligatoria" })
      .min(8, { message: "La contraseña debe tener al menos 8 caracteres" })
      .regex(/[A-Z]/, {
        message: "La contraseña debe contener al menos una mayúscula",
      })
      .regex(/[a-z]/, {
        message: "La contraseña debe contener al menos una minúscula",
      })
      .regex(/[0-9]/, {
        message: "La contraseña debe contener al menos un número",
      }),

    cpassword: z
      .string()
      .min(1, { message: "Confirmar contraseña es obligatorio" }),
  })
  .refine((data) => data.password === data.cpassword, {
    message: "Las contraseñas no coinciden",
    path: ["cpassword"],
  });

export type RegisterFormData = z.infer<typeof registerSchema> & {
  terms?: boolean;
};
