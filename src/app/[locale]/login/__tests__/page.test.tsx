import { render, screen } from "@testing-library/react";
import LoginPage from "../page";

// Mock de next/router
jest.mock("next/navigation", () => ({
  useRouter() {
    return {
      prefetch: () => null,
    };
  },
}));

describe("Login Page", () => {
  it("should render the login form", () => {
    render(<LoginPage />);

    // Check for the heading
    const heading = screen.getByRole("heading", { name: /iniciar sesión/i });
    expect(heading).toBeInTheDocument();

    // Check for input fields
    const emailInput = screen.getByPlaceholderText(/email/i);
    expect(emailInput).toBeInTheDocument();

    const passwordInput = screen.getByPlaceholderText(/ingresa tu contraseña/i);
    expect(passwordInput).toBeInTheDocument();

    // Check for the submit button
    const submitButton = screen.getByRole("button", {
      name: /^iniciar sesión$/i,
    });
    expect(submitButton).toBeInTheDocument();
  });
});
