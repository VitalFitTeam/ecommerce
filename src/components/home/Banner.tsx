// components/Banner.tsx
import React from "react";

interface BannerProps {
  imageUrl: string;
  title: string;
  subtitle?: string;
  height?: string;
  overlay?: boolean;
  className?: string;
}

const Banner: React.FC<BannerProps> = ({
  imageUrl,
  title,
  subtitle,
  height = "h-96",
  overlay = true,
  className = "",
}) => {
  return (
    <div
      className={`relative w-full ${height} bg-cover bg-center ${className}`}
      style={{ backgroundImage: `url(${imageUrl})` }}
    >
      {/* Overlay opcional para mejor legibilidad */}
      {overlay && <div className="absolute inset-0 bg-black/30"></div>}

      {/* Contenedor del texto alineado a la izquierda y centrado verticalmente */}
      <div className="relative h-full flex items-center">
        <div className="w-full z-50 px-2 sm:px-3 lg:px-4">
          <div className="text-left max-w-[50%]">
            {/* Título con HTML permitido */}
            <h1
              className="text-6xl tracking-wider md:text-6xl font-medium text-white mb-4"
              dangerouslySetInnerHTML={{ __html: title }}
            />

            {/* Subtítulo con HTML permitido */}
            {subtitle && (
              <p
                className="text-xl md:text-1.5xl text-white/90"
                dangerouslySetInnerHTML={{ __html: subtitle }}
              />
            )}
          </div>
        </div>
      </div>
      <ul className="absolute top-0 left-0 w-full h-full z-0 overflow-hidden">
        {/* Burbuja 1 */}
        <li className="absolute list-none block w-10 h-10 bg-white/15 bottom-[-160px] left-[10%] animate-square" />

        {/* Burbuja 2 */}
        <li
          className="absolute list-none block w-20 h-20 bg-white/15 bottom-[-160px] left-[20%] animate-square"
          style={{
            animationDelay: "2s",
            animationDuration: "17s",
          }}
        />

        {/* Burbuja 3 */}
        <li
          className="absolute list-none block w-10 h-10 bg-white/15 bottom-[-160px] left-[25%] animate-square"
          style={{ animationDelay: "4s" }}
        />

        {/* Burbuja 4 */}
        <li
          className="absolute list-none block w-16 h-16 bg-white/25 bottom-[-160px] left-[40%] animate-square"
          style={{ animationDuration: "22s" }}
        />

        {/* Burbuja 5 */}
        <li className="absolute list-none block w-10 h-10 bg-white/15 bottom-[-160px] left-[70%] animate-square" />

        {/* Burbuja 6 */}
        <li
          className="absolute list-none block w-32 h-32 bg-white/20 bottom-[-160px] left-[80%] animate-square"
          style={{ animationDelay: "3s" }}
        />

        {/* Burbuja 7 */}
        <li
          className="absolute list-none block w-40 h-40 bg-white/15 bottom-[-160px] left-[32%] animate-square"
          style={{ animationDelay: "7s" }}
        />

        {/* Burbuja 8 */}
        <li
          className="absolute list-none block w-5 h-5 bg-white/15 bottom-[-160px] left-[55%] animate-square"
          style={{
            animationDelay: "15s",
            animationDuration: "40s",
          }}
        />

        {/* Burbuja 9 */}
        <li
          className="absolute list-none block w-2.5 h-2.5 bg-white/30 bottom-[-160px] left-[25%] animate-square"
          style={{
            animationDelay: "2s",
            animationDuration: "40s",
          }}
        />

        {/* Burbuja 10 */}
        <li
          className="absolute list-none block w-40 h-40 bg-white/15 bottom-[-160px] left-[85%] animate-square"
          style={{ animationDelay: "11s" }}
        />
      </ul>
    </div>
  );
};

export default Banner;
