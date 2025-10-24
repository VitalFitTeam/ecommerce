import React from "react";
import Image from "next/image";

interface LogoProps {
  slogan: boolean;
  width?: number;
}

const Logo: React.FC<LogoProps> = ({ slogan, width }) => {
  const imgPATH = slogan ? "/images/logo-vitalfit.png" : "/images/isotipo.png";
  return (
    <div className="flex justify-center">
      <Image alt="Logo" src={imgPATH} width={width || 200} height={200} />
    </div>
  );
};

export default Logo;
