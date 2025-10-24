import React, { ReactNode } from "react";

interface CardProps {
  children: ReactNode;
  className?: string; // className es ahora una prop opcional
}

const Card: React.FC<CardProps> = ({ children, className = "" }) => {
  const baseClasses = "rounded-lg shadow bg-white p-5 shadow-sm";

  const finalClasses = `${baseClasses} ${className}`.trim();

  return <div className={finalClasses}>{children}</div>;
};

export default Card;
