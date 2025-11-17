"use client";

import { useTranslations } from "next-intl";
import Header from "@/components/layout/dashboard/Header";
import Footer from "@/components/layout/Footer";
import { PageHeader } from "@/components/ui/PageHeader";
import ProfileForm from "./ProfileForm";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/context/AuthContext";
import { useRouter } from "@/i18n/routing";

export default function Profile() {
  const { token } = useAuth();
  const router = useRouter();
  const t = useTranslations("Profile");

  if (!token) {
    return;
  }

  return (
    <main className="min-h-screen bg-white">
      <Header />
      <div className="flex-1 space-y-6 p-16 pt-6 bg-white rounded shadow">
        <PageHeader title={t("ptitle")}>
          <Button
            onClick={() => {
              router.push("/profile/edit");
            }}
          >
            {t("pbutton")}
          </Button>
        </PageHeader>
        <ProfileForm />
      </div>
      <Footer />
    </main>
  );
}
