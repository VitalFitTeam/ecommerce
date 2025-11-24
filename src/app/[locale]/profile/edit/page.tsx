"use client";

import { useTranslations } from "next-intl";
import Header from "@/components/layout/dashboard/Header";
import Footer from "@/components/layout/Footer";
import { PageHeader } from "@/components/ui/PageHeader";
import ProfileForm from "../ProfileForm";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/context/AuthContext";
import { useRouter } from "@/i18n/routing";
import { useState, useRef } from "react";
import { Trash2, Plus } from "lucide-react";

export default function EditProfile() {
  const { token } = useAuth();
  const router = useRouter();
  const t = useTranslations("Profile");
  const [profileImage, setProfileImage] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  if (!token) {
    return;
  }

  const handleEdit = () => {
    console.warn("Modificar Perfil");
  };

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      // Validar que sea una imagen
      if (!file.type.startsWith("image/")) {
        alert("Por favor, selecciona un archivo de imagen válido");
        return;
      }

      // Validar tamaño del archivo (ejemplo: máximo 5MB)
      if (file.size > 5 * 1024 * 1024) {
        alert("La imagen no debe superar los 5MB");
        return;
      }

      const reader = new FileReader();
      reader.onload = (e) => {
        setProfileImage(e.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleRemoveImage = () => {
    setProfileImage(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const triggerFileInput = () => {
    fileInputRef.current?.click();
  };

  return (
    <main className="min-h-screen bg-white">
      <Header />
      <form action="">
        <div className="flex-1 space-y-6 p-16 pt-6 bg-white rounded shadow">
          <PageHeader title={t("ptitle")} />

          <div className="flex flex-col items-center justify-center mb-6">
            <div className="relative group">
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

              <div className="absolute inset-0 rounded-full bg-black bg-opacity-40 opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex items-center justify-center">
                {profileImage ? (
                  <button
                    type="button"
                    onClick={handleRemoveImage}
                    className="text-white p-2 rounded-full hover:bg-orange-400 transition-colors shadow-lg"
                    title="Eliminar foto"
                  >
                    <Trash2 size={20} />
                  </button>
                ) : (
                  <button
                    type="button"
                    onClick={triggerFileInput}
                    className="text-white p-2 rounded-full hover:bg-green-500 transition-colors shadow-lg"
                    title="Agregar foto"
                  >
                    <Plus size={24} />
                  </button>
                )}
              </div>
            </div>

            <input
              type="file"
              ref={fileInputRef}
              onChange={handleImageUpload}
              accept="image/*"
              className="hidden"
            />
          </div>

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
