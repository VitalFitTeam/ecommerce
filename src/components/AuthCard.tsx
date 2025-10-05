import React from "react";

interface AuthCardProps {
  children: React.ReactNode;
}

const AuthCard = ({ children }: AuthCardProps) => {
  return (
    <div className="w-full max-w-xl mx-auto bg-white rounded-lg shadow p-4 sm:p-6">
      <div className="flex flex-col items-center justify-center gap-6 w-full text-center">
        {children}
      </div>
    </div>
  );
};

export default AuthCard;
