//centraliza colores, tipografías y tamaños en objetos JS/TS para usarlos dinámicamente en componentes.

export const Colors = {
  primary: "var(--color-primary)",
  accentRed: "var(--color-accent-red)",
  accentGreen: "var(--color-accent-green)",
  background: "var(--background)",
  foreground: "var(--foreground)",
  black: "var(--color-black)",
  white: "var(--color-white)",
  darkGray: "var(--color-dark-gray)",
};

export const FontSizes = {
  h1: { size: 48, lineHeight: 58 },
  h2: { size: 40, lineHeight: 48 },
  h3: { size: 32, lineHeight: 38 },
  body: { size: 16, lineHeight: 24 },
};

const theme = { Colors, FontSizes };
export default theme;
