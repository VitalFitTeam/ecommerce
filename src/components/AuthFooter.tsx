import theme from "@/styles/theme";
import Link from "next/link";
import React from "react";

interface AuthFooterProps {
  text: string;
  linkText: string;
  href: string;
}

const AuthFooter: React.FC<AuthFooterProps> = ({ text, linkText, href }) => {
  return (
    <span className="text-body text-dark-gray">
      {text}{" "}
      <Link
        href={href}
        style={{ color: theme.Colors.primary }}
        className="text-primary hover:text-accent-red transition-colors font-medium"
      >
        {linkText}
      </Link>
    </span>
  );
};

export default AuthFooter;
