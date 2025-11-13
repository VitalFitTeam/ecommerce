import { render, screen } from "@testing-library/react";
import LoginPage from "../page";
import React from "react";

// MOCKS: La función useTranslations devuelve la clave tal cual (ej: "LoginPage.title")
jest.mock("next-intl", () => ({
  // La clave de traducción devuelta será "clave.anidada"
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
  it("should render the login form with simulated translation keys", () => {
    render(<LoginPage />);

    const heading = screen.getByRole("heading", { name: /title/i });
    expect(heading).toBeInTheDocument();

    const emailInput = screen.getByPlaceholderText(/email.placeholder/i);
    expect(emailInput).toBeInTheDocument();

    const passwordInput = screen.getByPlaceholderText(/password.placeholder/i);
    expect(passwordInput).toBeInTheDocument();

    const submitButton = screen.getByRole("button", {
      name: /submitButton.default/i,
    });
    expect(submitButton).toBeInTheDocument();

    const googleButton = screen.getByRole("button", { name: /googleLogin/i });
    expect(googleButton).toBeInTheDocument();

    const rememberMeLabelText = screen.getByText(/rememberMe/i);
    expect(rememberMeLabelText).toBeInTheDocument();

    const recoverLink = screen.getByRole("link", {
      name: /forgotPassword.link/i,
    });
    expect(recoverLink).toBeInTheDocument();

    const registerLink = screen.getByRole("link", { name: /noAccount.link/i });
    expect(registerLink).toBeInTheDocument();

    const allCheckboxes = screen.getAllByRole("checkbox");
    expect(allCheckboxes.length).toBeGreaterThan(0);

    const rememberMeCheckbox = screen.getByLabelText(/rememberMe/i);
    expect(rememberMeCheckbox).toBeInTheDocument();
  });
});
