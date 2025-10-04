import { colors, typography } from "@/styles/styles";
import Image from "next/image";
import React from "react";

const AuthHeader: React.FC = () => {
  return (
    <div style={{ textAlign: "center", padding: "1rem" }}>
      <div style={{ marginBottom: "0.5rem" }}>
        <Image
          src="/logo/isotipo 1.svg"
          alt="isotipo"
          width={170}
          height={170}
        />
      </div>
      <h1
        className={`${typography.heading} text-black`}
        style={{ color: colors.complementary.gray }}
      >
        Iniciar sesión
      </h1>
    </div>
  );
};

export default AuthHeader;
