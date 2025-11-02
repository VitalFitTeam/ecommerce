import { render, screen } from "@testing-library/react";
import LoginPage from "../page";
import React from "react";

jest.mock("next-intl", () => ({
  useTranslations: () => (key: string) => key, // Devuelve la clave (ej. "LoginPage.title")
  useLocale: () => "es",
}));

jest.mock("@/i18n/routing", () => {
  // Creamos el componente 'Link' simulado por separado
  const MockedLink = React.forwardRef(({ href, ...props }: any, ref) => (
    <a ref={ref} href={href} {...props} />
  ));
  MockedLink.displayName = "MockedLink";

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
    const heading = screen.getByRole("heading", { name: "LoginPage.title" });
    expect(heading).toBeInTheDocument();
    const emailInput = screen.getByPlaceholderText(
      "LoginPage.form.emailPlaceholder",
    );
    expect(emailInput).toBeInTheDocument();

    const passwordInput = screen.getByPlaceholderText(
      "LoginPage.form.passwordPlaceholder",
    );
    expect(passwordInput).toBeInTheDocument();

    const submitButton = screen.getByRole("button", {
      name: "LoginPage.form.submitButton",
    });
    expect(submitButton).toBeInTheDocument();
  });
});
