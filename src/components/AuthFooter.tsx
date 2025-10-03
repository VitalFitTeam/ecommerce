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
      <a className="text-blue-500" href={href}>
        {linkText}
      </a>
    </span>
  );
};

export default AuthFooter;
