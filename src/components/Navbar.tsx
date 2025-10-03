import theme from "@/styles/theme";
import Image from "next/image";
import Link from "next/link";

const Navbar = () => {
  return (
    <header className="w-full bg-white shadow-sm border-b border-gray-100 ">
      <Link
        href="/"
        className="flex items-center"
        aria-label="Ir a la página de inicio de VITALFIT"
      >
        <div className="relative w-32 h-8 md:w-64 md:h-16">
          <Image
            src="/logo/logo-vitalfit.svg"
            width={254}
            height={70}
            className="hidden md:block"
            alt="logo principal de vitalfit"
          />
        </div>
      </Link>
    </header>
  );
};

export default Navbar;
