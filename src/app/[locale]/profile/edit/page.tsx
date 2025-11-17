"use client";

import { useTranslations } from "next-intl";
import Header from "@/components/layout/dashboard/Header";
import { Navbar } from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { PageHeader } from "@/components/ui/PageHeader";
import ProfileForm from "../ProfileForm";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/context/AuthContext";
import { useRouter } from "@/i18n/routing";

export default function EditProfile() {
  const { token } = useAuth();
  const router = useRouter();
  const t = useTranslations("Profile");

  if (!token) {
    return;
  }

  const handleEdit = () => {
    console.warn("Modificar Perfil");
  };

  return (
    <main className="min-h-screen bg-white">
      <Header />
      <form action="">
        <div className="flex-1 space-y-6 p-16 pt-6 bg-white rounded shadow">
          <PageHeader title={t("ptitle")} />
          <ProfileForm />
          <div className="flex w-full justify-center items-center gap-2">
            <Button
              className="w-75"
              variant="outline"
              onClick={() => {
                router.push("/profile");
              }}
            >
              {t("canceleditbutton")}
            </Button>
            <Button
              className="w-75"
              onClick={() => {
                handleEdit();
              }}
            >
              {t("editbutton")}
            </Button>
          </div>
        </div>
      </form>
      <Footer />
    </main>
  );
}
