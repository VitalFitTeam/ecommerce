"use client";

import { useTranslations } from "next-intl";
import { Navbar } from "@/components/layout/Navbar";
import { MembershipCard } from "./MembershipCard";
import Footer from "@/components/layout/Footer";
import { Button } from "@/components/ui/button";
import {
  BuildingStorefrontIcon,
  DevicePhoneMobileIcon,
  UserGroupIcon,
  UserIcon,
} from "@heroicons/react/24/outline";
import { Card, CardContent, CardTitle } from "@/components/ui/Card";

export default function Memberships() {
  const t = useTranslations("MembershipsPage");

  const membershipPlans = [
    {
      id: 1,
      title: t("plans.advanced.title"),
      price: 75,
      billingPeriod: t("plans.advanced.billingPeriod"),
      description: t("plans.advanced.description"),
      services: [
        t("plans.advanced.services.s1"),
        t("plans.advanced.services.s2"),
        t("plans.advanced.services.s3"),
        t("plans.advanced.services.s4"),
        t("plans.advanced.services.s5"),
        t("plans.advanced.services.s6"),
      ],
      featured: false,
    },
    {
      id: 2,
      title: t("plans.standard.title"),
      price: 500,
      billingPeriod: t("plans.standard.billingPeriod"),
      description: t("plans.standard.description"),
      services: [
        t("plans.standard.services.s1"),
        t("plans.standard.services.s2"),
        t("plans.standard.services.s3"),
        t("plans.standard.services.s4"),
        t("plans.standard.services.s5"),
        t("plans.standard.services.s6"),
      ],
      featured: true,
      accentColor: "#FF8C42",
    },
    {
      id: 3,
      title: t("plans.athlete.title"),
      price: 105,
      billingPeriod: t("plans.athlete.billingPeriod"),
      description: t("plans.athlete.description"),
      services: [
        t("plans.athlete.services.s1"),
        t("plans.athlete.services.s2"),
        t("plans.athlete.services.s3"),
        t("plans.athlete.services.s4"),
        t("plans.athlete.services.s5"),
      ],
      featured: false,
    },
    {
      id: 4,
      title: t("plans.basic.title"),
      price: 25,
      billingPeriod: t("plans.basic.billingPeriod"),
      description: t("plans.basic.description"),
      services: [
        t("plans.basic.services.s1"),
        t("plans.basic.services.s2"),
        t("plans.basic.services.s3"),
        t("plans.basic.services.s4"),
        t("plans.basic.services.s5"),
      ],
      featured: false,
    },
  ];

  return (
    <main className="min-h-screen bg-white">
      <Navbar transparent={false} />

      <>
        <section className="bg-gray-50 py-12 px-6">
          <div className="max-w-6xl mx-auto">
            <h1 className="text-4xl md:text-5xl font-bold text-center mb-4">
              <span className="text-orange-500">{t("hero.titlePart1")}</span>{" "}
              <span className="text-gray-900">{t("hero.titlePart2")}</span>
            </h1>
            <p className="text-center text-gray-600 w-full mx-auto">
              {t("hero.subtitle")}
            </p>
          </div>
        </section>

        <section className="py-16 px-6">
          <div className="max-w-6xl mx-auto">
            <div className="flex items-center justify-between mb-8">
              <div className="grid grid-cols-1 md:grid-cols-4 gap-6 flex-1 mx-4">
                {membershipPlans.map((membership, index) => (
                  <MembershipCard key={index} {...membership} />
                ))}
              </div>
            </div>
          </div>
        </section>

        <section className="py-16 px-6 bg-gray-100">
          <div className="max-w-6xl mx-auto">
            <h1 className="text-4xl md:text-5xl font-bold text-center mb-4">
              {t("includes.title")}
            </h1>
            <div className="flex items-center justify-between my-8">
              <div className="grid grid-cols-1 md:grid-cols-4 gap-6 flex-1 mx-4">
                <Card className="text-center p-5">
                  <BuildingStorefrontIcon className="w-6 text-gray-800 h-6 inline-block mr-2" />
                  <CardTitle className="my-4">
                    {t("includes.item1.title")}
                  </CardTitle>
                  <CardContent>
                    <p className="text-sm">{t("includes.item1.content")}</p>
                  </CardContent>
                </Card>
                <Card className="text-center p-5">
                  <UserIcon className="w-6 text-gray-800 h-6 inline-block mr-2" />
                  <CardTitle className="my-4">
                    {t("includes.item2.title")}
                  </CardTitle>
                  <CardContent>
                    <p className="text-sm">{t("includes.item2.content")}</p>
                  </CardContent>
                </Card>
                <Card className="text-center p-5">
                  <UserGroupIcon className="w-6 text-gray-800 h-6 inline-block mr-2" />
                  <CardTitle className="my-4">
                    {t("includes.item3.title")}
                  </CardTitle>
                  <CardContent>
                    <p className="text-sm">{t("includes.item3.content")}</p>
                  </CardContent>
                </Card>
                <Card className="text-center p-5">
                  <DevicePhoneMobileIcon className="w-6 text-gray-800 h-6 inline-block mr-2" />
                  <CardTitle className="my-4">
                    {t("includes.item4.title")}
                  </CardTitle>
                  <CardContent>
                    <p className="text-sm">{t("includes.item4.content")}</p>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
          <div className="max-w-4xl mx-auto bg-primary rounded-2xl md:rounded-3xl p-4 md:p-8 text-center mt-12">
            <span className="text-3xl md:text-4xl font-bold text-center text-white mb-4">
              {t("cta.heading")}
            </span>
            <p className="text-white mt-2">{t("cta.subheading")}</p>
            <div className="flex items-center justify-center gap-4 my-4">
              <Button className="bg-black text-white px-4 py-2 text-sm rounded-md w-50">
                {t("cta.advisorButton")}
              </Button>
              <Button className="bg-white text-black px-4 py-2 text-sm rounded-md w-70">
                {t("cta.faqButton")}
              </Button>
            </div>
          </div>
        </section>
      </>

      <Footer />
    </main>
  );
}
