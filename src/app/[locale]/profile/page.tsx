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

  const profileImage = null; // Reemplaza con la imagen real del usuario

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

        <div className="flex flex-col items-center justify-center mb-6">
          <div className="relative">
            <div className="w-32 h-32 rounded-full border-2 border-gray-300 overflow-hidden bg-gray-100 flex items-center justify-center">
              {profileImage ? (
                <img
                  src={profileImage}
                  alt="Profile"
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="text-gray-400 text-4xl">
                  {t("name")?.charAt(0) || "U"}
                </div>
              )}
            </div>
          </div>
        </div>

        <ProfileForm />
      </div>
      <Footer />
    </main>
  );
}
