import Image from "next/image";

const Navbar = () => {
  return (
    <nav className="w-full shadow-md">
      <div className="max-w-7xl mx-auto  flex items-center">
        {/* Logo */}
        <div className="flex-shrink-0">
          <Image
            src="/logo/logo-vitalfit.svg"
            alt="Logo"
            width={120}
            height={40}
          />
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
