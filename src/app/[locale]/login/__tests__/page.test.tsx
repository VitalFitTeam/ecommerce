import { render, screen } from "@testing-library/react";
import LoginPage from "../page";
import React from "react";

jest.mock("next-intl", () => ({
  useTranslations: () => (key: string) => key,
  useLocale: () => "es",
}));

jest.mock("@/i18n/routing", () => {
  const MockedLink = ({ href, ...props }: any) => <a href={href} {...props} />;

  return {
    useRouter: jest.fn(() => ({
      replace: jest.fn(),
      push: jest.fn(),
    })),
    usePathname: jest.fn(() => "/login"),
    Link: MockedLink,
  };
});

describe("Login Page", () => {
  it("should render the login form", () => {
    render(<LoginPage />);

    // 3. ACTUALIZAMOS las búsquedas para que coincidan con el HTML renderizado
    //    que vimos en el log de error.

    // El log dice: Name "INICIAR SESIÓN"
    const heading = screen.getByRole("heading", { name: /iniciar sesión/i });
    expect(heading).toBeInTheDocument();

    // El log dice: placeholder="Email"
    const emailInput = screen.getByPlaceholderText(/email/i);
    expect(emailInput).toBeInTheDocument();

    // El log dice: placeholder="Ingresa tu contraseña"
    const passwordInput = screen.getByPlaceholderText(/ingresa tu contraseña/i);
    expect(passwordInput).toBeInTheDocument();

    // El log dice: Name "Iniciar sesión"
    const submitButton = screen.getByRole("button", {
      name: /^iniciar sesión$/i, // Usamos /^...$/ para un match exacto
    });
    expect(submitButton).toBeInTheDocument();
  });
});
