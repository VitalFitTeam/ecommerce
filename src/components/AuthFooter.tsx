import { colors, montserrat, typography } from "@/styles/styles";
import Link from "next/link";
import React from "react";

interface AuthFooterProps {
  text: string;
  linkText: string;
  href: string;
}

const AuthFooter: React.FC<AuthFooterProps> = ({ text, linkText, href }) => {
  return (
    <span
      className={typography.h1}
      style={{ color: colors.complementary.darkGray }}
    >
      {text}{" "}
      <Link
        href={href}
        style={{ color: colors.primary}}
        className="font-medium hover:text-red-600 transition-colors"
      >
        {linkText}
      </Link>
    </span>
  );
};

export default AuthFooter;
