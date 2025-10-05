import React from "react";
import Image from "next/image";
import imgLogo from "../assets/images/logo-vitalfit.png";
import imgIsotipo from "../assets/images/isotipo.png";

interface LogoProps {
  slogan: boolean;
  width?: number;
}

const Logo: React.FC<LogoProps> = ({ slogan, width }) => {
  const imgPATH = slogan ? imgLogo : imgIsotipo;
  return (
    <div className="flex justify-center">
      <Image alt="Logo" src={imgPATH} width={width || 200} />
    </div>
  );
};

export default Logo;
