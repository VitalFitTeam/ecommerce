import React from "react";
import { colors, typography } from "@/styles/styles";

interface InputFieldProps {
  value: string;
  placeholder?: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

const InputField: React.FC<InputFieldProps> = ({
  value,
  placeholder,
  onChange,
}) => {
  const componentStyles: { [key: string]: React.CSSProperties } = {
    container: {
      display: "flex",
      alignItems: "center",
      borderColor: colors.complementary.ligthGray,
      borderWidth: "1px",
      borderStyle: "solid",
      borderRadius: "8px",
      padding: "0.75rem",
      backgroundColor: colors.complementary.white,
      transition: "border-color 0.15s ease-in-out",
    },

    input: {
      flexGrow: 1,
      fontFamily: "var(--font-montserrat)",
      outline: "none",
      boxShadow: "none",
      backgroundColor: "transparent",
      border: "none",
      padding: 0,
    },
  };

  const inputTailwindClass = `text-gray-800 placeholder-gray-500 ${typography.body}`;

  return (
    <div style={componentStyles.container}>
      <input
        type="text"
        value={value}
        placeholder={placeholder}
        onChange={onChange}
        style={componentStyles.input}
        className={inputTailwindClass}
      />
    </div>
  );
};

export default InputField;
