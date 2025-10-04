import React from "react";

interface LogoSectionProps {
  children: React.ReactNode;
}

const LogoSection: React.FC<LogoSectionProps> = ({ children }) => {
  return (
    <div className="w-full max-w-xl min-w-[350px] mx-auto p-8">{children}</div>
  );
};

export default LogoSection;
