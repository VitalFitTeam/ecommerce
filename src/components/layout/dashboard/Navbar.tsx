import Image from "next/image";
import { useTranslations } from "next-intl";

const Navbar = () => {
  const t = useTranslations("dashboard.navbar");
  return (
    <nav className="w-full shadow-md">
      <div className="max-w-7xl mx-auto  flex items-center">
        <div className="flex-shrink-0">
          <Image
            src="/logo/logo-vitalfit.svg"
            alt={t("logoAlt")}
            width={120}
            height={40}
          />
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
