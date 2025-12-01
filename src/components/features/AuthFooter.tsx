import { Link } from "@/i18n/routing";
import { colors } from "@/styles/styles";
import React from "react";

interface AuthFooterProps {
  text: string;
  linkText: string;
  href: string;
  replace?: boolean;
}

const AuthFooter: React.FC<AuthFooterProps> = ({
  text,
  linkText,
  href,
  replace,
}) => {
  return (
    <span className="text-xs font-medium flex-inline">
      {text}{" "}
      <Link
        href={href}
        replace={replace}
        style={{ color: colors.primary }}
        className="hover:text-primary transition-colors"
      >
        {linkText}
      </Link>
    </span>
  );
};

export default AuthFooter;
