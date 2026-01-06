"use client";

import Banner from "@/components/features/home/Banner";
import { Navbar } from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { useTranslations } from "next-intl";
import SectionAboutUs from "@/components/features/home/AboutUs";

const aboutUsConfig = [
  {
    id: 1,
    key: "mission",
    imageUrl: "/images/aboutUs/mision.png",
    bgColor: "bg-primary",
    textColor: "text-white",
  },
  {
    id: 2,
    key: "vision",
    imageUrl: "/images/aboutUs/vision.jpeg",
    bgColor: "bg-white",
    textColor: "text-slate-900",
  },
  {
    id: 3,
    key: "values",
    imageUrl: "/images/aboutUs/valores.jpeg",
    bgColor: "bg-primary",
    textColor: "text-white",
  },
  {
    id: 4,
    key: "objectives",
    imageUrl: "/images/aboutUs/objetivos.jpeg",
    bgColor: "bg-white",
    textColor: "text-slate-900",
  },
];

export default function Home() {
  const t = useTranslations("HomePage");
  const tAbout = useTranslations("HomePage.aboutUs");

  const aboutUs = aboutUsConfig.map((item) => ({
    ...item,
    title: tAbout(`${item.key}.title`),
    imageAlt: tAbout(`${item.key}.imageAlt`),
    content: tAbout.rich(`${item.key}.content`, {
      p: (chunks) => <p className="leading-relaxed opacity-90">{chunks}</p>,
    }),
  }));

  return (
    <div className="bg-white">
      <Navbar />

      <main>
        <Banner
          imageUrl="/images/banner-home.png"
          title={t.rich("banner.title", {
            highlight: (chunks: React.ReactNode) => (
              <span className="text-gradient-orange italic">{chunks}</span>
            ),
          })}
          subtitle={t("banner.subtitle")}
          height="h-screen"
        />

        {/* CONTENEDOR CON OVERLAP Y SOMBRA PROYECTADA */}
        <section
          id="aboutUs"
          className="relative z-20 -mt-20 md:-mt-32 rounded-t-[4rem] bg-white pt-24 shadow-[0_-25px_50px_rgba(0,0,0,0.15)]"
        >
          {/* HEADER DE SECCIÓN MEJORADO */}
          <div className="max-w-7xl mx-auto px-6 mb-20 flex flex-col items-center text-center">
            <h2 className="text-5xl md:text-7xl font-heading italic uppercase tracking-tighter text-slate-900 mb-6">
              {tAbout("mainTitle") || "ADN VitalFit"}
            </h2>
            <div className="h-2 w-28 bg-primary rounded-full" />
          </div>

          <SectionAboutUs sections={aboutUs} />
        </section>
      </main>

      <Footer />
    </div>
  );
}
