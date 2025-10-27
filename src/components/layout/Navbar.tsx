"use client";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { Bars3Icon, XMarkIcon } from "@heroicons/react/24/outline";

const Navbar = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const pathname = usePathname(); // para detectar la ruta actual

  const navLinks = [
    { href: "/", label: "Inicio" },
    { href: "#services", label: "Servicios" },
    { href: "#branches", label: "Sucursales" },
    { href: "#membership", label: "Membresías" },
    { href: "#contact", label: "Contacto" },
  ];

  return (
    <nav className="bg-[rgba(0,0,0,0.7)] fixed top-0 left-0 w-full z-100 w-full pt-2 transition-all duration-300 backdrop-blur-md">
      <div className="mx-auto px-2 sm:px-3 lg:px-4">
        <div className="flex justify-between items-center h-16">
          <Link href="/" className="text-xl font-bold text-gray-900 ml-4">
            <Image
              src="/logo/logo-vitalfit-white.png"
              alt="Logo"
              width={200}
              height={40}
            />
          </Link>

          {/* Botón Hamburguesa (solo móvil) */}
          <div className="flex md:hidden">
            <button
              onClick={() => setMenuOpen(!menuOpen)}
              className="text-white hover:text-[#F27F2A] transition-colors"
              aria-label="Abrir menú"
            >
              {menuOpen ? (
                <XMarkIcon className="w-7 h-7" />
              ) : (
                <Bars3Icon className="w-7 h-7" />
              )}
            </button>
          </div>

          {/* Menú principal (desktop) */}
          <div className="hidden md:flex space-x-8 text-white">
            {navLinks.map(({ href, label }) => (
              <Link
                key={href}
                href={href}
                scroll={false}
                className={`px-3 py-1 rounded-md transition-colors ${
                  pathname === href
                    ? "bg-[#F27F2A] text-white font-semibold"
                    : "hover:text-[#F27F2A]"
                }`}
              >
                {label}
              </Link>
            ))}
          </div>

          {/* Botones de acción (desktop) */}
          <div className="hidden md:flex items-center space-x-4 mr-4">
            <Link
              href="/login"
              className="px-4 py-2 text-sm font-bold text-[#F27F2A] border border-[#F27F2A] rounded-md hover:border-white hover:text-white transition-colors"
            >
              Iniciar sesión
            </Link>
            <Link
              href="/register"
              className="px-4 py-2 text-sm font-medium text-white bg-[#F27F2A] rounded-md transition-colors"
            >
              Unirse
            </Link>
          </div>
        </div>
      </div>

      {/* Menú móvil desplegable */}
      {menuOpen && (
        <div className="md:hidden bg-[rgba(0,0,0,0.9)] text-white px-6 py-4 space-y-4">
          {navLinks.map(({ href, label }) => (
            <Link
              key={href}
              href={href}
              scroll={false}
              onClick={() => setMenuOpen(false)}
              className={`block py-2 px-2 rounded-md transition-colors ${
                pathname === href
                  ? "bg-[#F27F2A] text-white font-semibold"
                  : "hover:text-[#F27F2A]"
              }`}
            >
              {label}
            </Link>
          ))}

          <div className="flex flex-col space-y-3 pt-4 border-t border-gray-700">
            <Link
              href="/login"
              onClick={() => setMenuOpen(false)}
              className="text-center py-2 border border-[#F27F2A] rounded-md hover:text-white hover:border-white transition-colors"
            >
              Iniciar sesión
            </Link>
            <Link
              href="/register"
              onClick={() => setMenuOpen(false)}
              className="text-center py-2 bg-[#F27F2A] rounded-md hover:bg-white hover:text-[#F27F2A] transition-colors"
            >
              Unirse
            </Link>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
