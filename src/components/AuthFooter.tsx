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
    <span>
      {text}{" "}
      <Link
        href={href}
        style={{ color: colors.primary }}
        className="hover:text-primary transition-colors"
      >
        {linkText}
      </Link>
    </span>
  );
};

export default AuthFooter;
