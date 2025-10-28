import React from "react";
import Image from "next/image";

interface LogoProps {
  slogan: boolean;
  theme?: "light" | "dark";
  width?: number;
}

const Logo: React.FC<LogoProps> = ({ slogan, width, theme }) => {
  let imgPATH = slogan ? "/images/logo-vitalfit.png" : "/images/isotipo.png";
  imgPATH = theme === "dark" ? "/images/logo-vitalfit-white.png" : imgPATH;
  return (
    <div className="flex justify-center">
      <Image alt="Logo" src={imgPATH} width={width || 200} height={200} />
    </div>
  );
};

export default Logo;
