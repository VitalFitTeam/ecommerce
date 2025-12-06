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
    bgColor: "bg-[#F27F2A]",
    textColor: "text-white",
  },
  {
    id: 2,
    key: "vision",
    imageUrl: "/images/aboutUs/vision.jpeg",
    bgColor: "bg-white",
    textColor: "text-gray-900",
  },
  {
    id: 3,
    key: "values",
    imageUrl: "/images/aboutUs/valores.jpeg",
    bgColor: "bg-[#F27F2A]",
    textColor: "text-white",
  },
  {
    id: 4,
    key: "objectives",
    imageUrl: "/images/aboutUs/objetivos.jpeg",
    bgColor: "bg-white",
    textColor: "text-gray-900",
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
      p: (chunks) => <p>{chunks}</p>,
    }),
  }));

  return (
    <div>
      <Navbar />
      <Banner
        imageUrl="/images/banner-home.png"
        title={t.rich("banner.title", {
          highlight: (chunks: React.ReactNode) => (
            <span className="text-[#F27F2A]">{chunks}</span>
          ),
        })}
        subtitle={t("banner.subtitle")}
        height="h-screen"
      />

      <section id="aboutUs" className="pt-5">
        <SectionAboutUs sections={aboutUs} />
      </section>
      <Footer></Footer>
    </div>
  );
}
