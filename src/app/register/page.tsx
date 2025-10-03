import theme from "@/styles/theme";

export default function RegisterPage() {
  return (
    <div
      style={{
        backgroundColor: theme.Colors.background,
        color: theme.Colors.primary,
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        height: "100vh",
      }}
    >
      <h1
        style={{
          fontSize: theme.FontSizes.h1.size,
          lineHeight: `${theme.FontSizes.h1.lineHeight}px`,
          fontFamily: "var(--font-display)",
        }}
      >
        Register
      </h1>
    </div>
  );
}
