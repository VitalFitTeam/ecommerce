"use client";

import SectionAboutUs from "@/components/home/AboutUs";
import Banner from "@/components/home/Banner";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";

export default function Home() {
  const aboutUs = [
    {
      id: 1,
      title: "Misión",
      content: `
            <p>Ser la principal red de fitness que empodera a las personas para alcanzar sus objetivos de bienestar, a través de un servicio de calidad
            y con tecnológia avanzada, garantizando una experiencia fluida y accesible en cada una de nuestras franquicias.</p>
          `,
      imageUrl: "/images/aboutUs/mision.png",
      imageAlt: "Mision",
      bgColor: "bg-[#F27F2A]",
      textColor: "text-white",
    },
    {
      id: 2,
      title: "Visión",
      content: `
            <p>Consolidarnos como el ecosistema de fitness más inteligente y mejor integrado del mercado, reconocido por su excelencia operativa, 
            su gestión estratégica basada en datos y su capacidad para ofrecer un crecimiento escalable y sostenible a todos nuestros franquiciados.</p>
          `,
      imageUrl: "/images/aboutUs/vision.jpeg",
      imageAlt: "Vision",
      bgColor: "bg-white",
      textColor: "text-gray-900",
    },
    {
      id: 3,
      title: "Valores",
      content: `
            <p>Nuestra operación se sustenta en cuatro valores fundamentales: Coherencia Operativa que garantiza 
            estandarización en cada interacción, Integridad del Dato como base de decisiones estratégicas, 
            Orientación al Cliente centrada en relaciones duraderas, y Agilidad Tecnológica para adaptarnos 
            continuamente a las demandas del mercado.</p>
          `,
      imageUrl: "/images/aboutUs/valores.jpeg",
      imageAlt: "Valores",
      bgColor: "bg-[#F27F2A]",
      textColor: "text-white",
    },
    {
      id: 4,
      title: "Objetivos",
      content: `
              <p>Transformar vidas a través del fitness, creando una comunidad donde cada persona 
                encuentre la motivación, el equipo y el ambiente perfecto para alcanzar sus metas 
                físicas y mentales. Nos comprometemos a ser tu aliado en este viaje de superación personal.</p>
            `,
      imageUrl: "/images/aboutUs/objetivos.jpeg",
      imageAlt: "Valores",
      bgColor: "bg-white",
      textColor: "text-gray-900",
    },
  ];

  return (
    <div>
      <Navbar></Navbar>
      <Banner
        imageUrl="/images/banner-home.png"
        title="ACTIVA TU <span class='text-[#F27F2A]'>VIDA</span>, SUPERA TUS LÍMITES"
        subtitle="Encuentra tu gimnasio ideal entre nuestras 100+ sucursales en todo el país. Equipamiento de última generación y entrenadores
                certificados te esperan"
        height="h-screen"
      />

      {/* Sección Sobre Nosotros */}
      <section id="aboutUs" className="pt-5">
        <SectionAboutUs sections={aboutUs} />
      </section>
      <Footer></Footer>
    </div>
  );
}
