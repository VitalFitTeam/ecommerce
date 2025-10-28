import Link from "next/link";
import { FaInstagram, FaTwitter, FaFacebook } from "react-icons/fa";
import { PhoneIcon, EnvelopeIcon, MapPinIcon } from "@heroicons/react/24/solid";
import Logo from "@/components/features/Logo";

export function Footer() {
  return (
    <footer className="bg-gray-100 py-10 px-6">
      <div className="max-w-6xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          <div>
            <div className="grid grid-cols-2 gap-4 md:flex md:flex-col md:gap-4">
              <div className="flex items-center gap-2 md:flex-row md:items-center">
                <Logo slogan={false} width={60} />
                <span className="text-lg font-bold text-primary">Vitalfit</span>
              </div>

              <div className="flex gap-3 justify-end md:justify-start mt-1">
                <Link
                  href="#"
                  className="text-black hover:text-primary transition-colors"
                >
                  <FaInstagram className="w-5 h-5" />
                </Link>
                <Link
                  href="#"
                  className="text-black hover:text-primary transition-colors"
                >
                  <FaTwitter className="w-5 h-5" />
                </Link>
                <Link
                  href="#"
                  className="text-black hover:text-primary transition-colors"
                >
                  <FaFacebook className="w-5 h-5" />
                </Link>
              </div>
            </div>

            <p className="text-gray-700 text-sm font-bold leading-relaxed mt-4">
              Transforma tu vida. Alcanza tu máximo potencial.
            </p>
          </div>

          {/* Enlaces Rápidos */}
          <div>
            <span className="font-bold text-gray-900 mb-3 block text-sm">
              Enlaces Rápidos
            </span>
            <div className="grid grid-cols-2 gap-x-4 gap-y-2 md:block">
              {["Servicios", "Membresía", "Sucursales", "Contacto"].map(
                (item, i) => (
                  <Link
                    key={i}
                    href="#"
                    className="text-gray-700 hover:text-primary transition-colors text-sm block mb-2"
                  >
                    {item}
                  </Link>
                ),
              )}
            </div>
          </div>

          {/* Nuestros Servicios */}
          <div>
            <span className="font-bold text-gray-900 mb-3 block text-sm">
              Nuestros Servicios
            </span>
            <div className="grid grid-cols-2 gap-x-4 gap-y-2 md:block">
              {["Yoga", "CrossFit", "Spinning", "Pilates"].map((item, i) => (
                <Link
                  key={i}
                  href="#"
                  className="text-gray-700 hover:text-primary transition-colors text-sm block mb-2"
                >
                  {item}
                </Link>
              ))}
            </div>
          </div>

          <div>
            <span className="font-bold text-gray-900 mb-3 block text-sm">
              Contacto
            </span>
            <div className="grid grid-cols-2 gap-x-4 gap-y-3 md:block">
              <div className="flex items-center gap-2 mb-2">
                <PhoneIcon className="w-4 h-4 text-black flex-shrink-0" />
                <a
                  href="tel:+584245912150"
                  className="text-gray-700 hover:text-primary transition-colors text-sm"
                >
                  +58 4245912150
                </a>
              </div>
              <div className="flex items-center gap-2 mb-2">
                <EnvelopeIcon className="w-4 h-4 text-black flex-shrink-0" />
                <a
                  href="mailto:info@vitalfit.com"
                  className="text-gray-700 hover:text-primary transition-colors text-sm"
                >
                  info@vitalfit.com
                </a>
              </div>
              <div className="flex items-start gap-2 col-span-2">
                <MapPinIcon className="w-4 h-4 text-black flex-shrink-0 mt-0.5" />
                <span className="text-gray-700 text-sm">
                  Av. Principal 123, Centro
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
