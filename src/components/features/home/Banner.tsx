import React from "react";

interface BannerProps {
  imageUrl: string;
  title: string | React.ReactNode;
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
      {overlay && <div className="absolute inset-0 bg-black/30"></div>}
      <div className="relative h-full flex items-center">
        <div className="w-full z-10 px-2 sm:px-3 lg:px-4">
          <div className="text-left max-w-[50%]">
            <h1 className="text-6xl tracking-wider md:text-6xl font-medium text-white mb-4">
              {title}
            </h1>

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
        <li className="absolute list-none block w-10 h-10 bg-white/15  left-[10%] animate-square" />
        <li
          className="absolute list-none block w-20 h-20 bg-white/15  left-[20%] animate-square"
          style={{
            animationDelay: "2s",
            animationDuration: "17s",
          }}
        />

        <li
          className="absolute list-none block w-10 h-10 bg-white/15  left-[25%] animate-square"
          style={{ animationDelay: "4s" }}
        />

        <li
          className="absolute list-none block w-16 h-16 bg-white/25  left-[40%] animate-square"
          style={{ animationDuration: "22s" }}
        />

        <li className="absolute list-none block w-10 h-10 bg-white/15 left-[70%] animate-square" />
        <li
          className="absolute list-none block w-32 h-32 bg-white/20  left-[80%] animate-square"
          style={{ animationDelay: "3s" }}
        />
        <li
          className="absolute list-none block w-40 h-40 bg-white/15  left-[32%] animate-square"
          style={{ animationDelay: "7s" }}
        />
        <li
          className="absolute list-none block w-5 h-5 bg-white/15 left-[55%] animate-square"
          style={{
            animationDelay: "15s",
            animationDuration: "40s",
          }}
        />
        <li
          className="absolute list-none block w-2.5 h-2.5 bg-white/30  left-[25%] animate-square"
          style={{
            animationDelay: "2s",
            animationDuration: "40s",
          }}
        />

        <li
          className="absolute list-none block w-40 h-40 bg-white/15  left-[85%] animate-square"
          style={{ animationDelay: "11s" }}
        />
      </ul>
    </div>
  );
};

export default Banner;
