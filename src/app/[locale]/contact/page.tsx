"use client";

import { useState } from "react";
// Importamos useTranslations para i18n
import { useTranslations } from "next-intl";
import { Navbar } from "@/components/layout/Navbar";
import { Button } from "@/components/ui/button";
import Logo from "@/components/features/Logo";
import { Input } from "@/components/ui/Input";
import { Textarea } from "@/components/ui/Textarea";
import Footer from "@/components/layout/Footer";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export default function Contact() {
  // Inicializamos la función de traducción para la clave "ContactPage"
  const t = useTranslations("ContactPage");

  const [motivoContacto, setMotivoContacto] = useState("");
  const [preferenciaContacto, setPreferenciaContacto] = useState("");

  return (
    <main className="min-h-screen bg-white">
      <Navbar transparent={false} />

      <section className="bg-gray-50 py-12 px-6">
        <div className="max-w-4xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-6">
            <div>
              <h1 className="text-4xl md:text-5xl text-left font-bold mb-4">
                {t("hero.title")}
              </h1>
              <p className="text-gray-600">{t("hero.subtitle")}</p>
            </div>
            <div>
              <Logo slogan={true} />
            </div>
          </div>

          <form className="p-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              {/* Campo Nombre */}
              <div>
                <label
                  htmlFor="nombre"
                  className="block text-sm font-medium text-gray-700 mb-2"
                >
                  {t("form.nameLabel")}*
                </label>
                <Input
                  id="nombre"
                  name="nombre"
                  type="text"
                  placeholder={t("form.namePlaceholder")}
                  required
                  className="w-full"
                />
              </div>

              {/* Campo Apellido */}
              <div>
                <label
                  htmlFor="apellido"
                  className="block text-sm font-medium text-gray-700 mb-2"
                >
                  {t("form.lastNameLabel")}*
                </label>
                <Input
                  id="apellido"
                  name="apellido"
                  type="text"
                  placeholder={t("form.lastNamePlaceholder")}
                  required
                  className="w-full"
                />
              </div>
            </div>

            {/* Campo Correo electrónico */}
            <div className="mb-6">
              <label
                htmlFor="correo"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                {t("form.emailLabel")}*
              </label>
              <Input
                id="correo"
                name="correo"
                type="email"
                placeholder={t("form.emailPlaceholder")}
                required
                className="w-full"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              {/* Select Motivo de contacto */}
              <div>
                <Select
                  value={motivoContacto}
                  onValueChange={setMotivoContacto}
                >
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder={t("form.reasonPlaceholder")} />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="consulta">
                      {t("form.reasons.general")}
                    </SelectItem>
                    <SelectItem value="membresia">
                      {t("form.reasons.memberships")}
                    </SelectItem>
                    <SelectItem value="servicios">
                      {t("form.reasons.services")}
                    </SelectItem>
                    <SelectItem value="reclamo">
                      {t("form.reasons.complaint")}
                    </SelectItem>
                    <SelectItem value="sugerencia">
                      {t("form.reasons.suggestion")}
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Select Preferencia de contacto */}
              <div>
                <Select
                  value={preferenciaContacto}
                  onValueChange={setPreferenciaContacto}
                >
                  <SelectTrigger className="w-full">
                    <SelectValue
                      placeholder={t("form.preferencePlaceholder")}
                    />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="email">
                      {t("form.preferences.email")}
                    </SelectItem>
                    <SelectItem value="telefono">
                      {t("form.preferences.phone")}
                    </SelectItem>
                    <SelectItem value="whatsapp">
                      {t("form.preferences.whatsapp")}
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Área de Mensaje */}
            <div className="mb-5">
              <Textarea
                id="mensaje"
                name="mensaje"
                placeholder={t("form.messagePlaceholder")}
                rows={5}
                className="w-full resize-none text-center border-0 shadow-sm text-lg font-medium"
              />
            </div>

            <Button
              type="submit"
              className="w-full bg-primary text-white font-semibold py-5 rounded-md"
            >
              {t("form.submitButton")}
            </Button>
          </form>
        </div>
      </section>

      <Footer />
    </main>
  );
}
