import React, { ReactNode, MouseEvent, ButtonHTMLAttributes } from "react";

interface QuickButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  children: ReactNode;
  className?: string;
  onClick?: (_event: MouseEvent<HTMLButtonElement>) => void;
}

const QuickButton: React.FC<QuickButtonProps> = ({
  children,
  className = "",
  onClick,
  ...rest
}) => {
  const baseClasses =
    "flex items-center gap-2 rounded-md border border-orange-200 bg-transparent px-4 py-2 text-orange-600 transition-colors hover:bg-orange-50 hover:text-orange-700 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed";

  const finalClasses = `${baseClasses} ${className}`.trim();

  return (
    <button className={finalClasses} onClick={onClick} {...rest}>
      {children}
    </button>
  );
};

export default QuickButton;
