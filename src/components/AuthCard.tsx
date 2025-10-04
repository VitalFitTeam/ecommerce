import React from "react";

interface AuthCardProps {
  children: React.ReactNode;
}

const AuthCard: React.FC<AuthCardProps> = ({ children }) => {
  return (
    <div className="w-full max-w-xl min-w-[400px] mx-auto bg-white rounded-lg shadow-lg p-8">
      <div className="flex flex-col items-stretch justify-center space-y-6 w-full text-center">
        {children}
      </div>
    </div>
  );
};

export default AuthCard;
