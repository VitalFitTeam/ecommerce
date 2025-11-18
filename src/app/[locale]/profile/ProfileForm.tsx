import React from "react";
import { useTranslations } from "next-intl";
import { PhoneInput } from "@/components/ui/phone-input";
import { Input } from "@/components/ui/Input";
import { Label } from "@/components/ui/Label";
import { Card, CardTitle, CardContent } from "@/components/ui/Card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export default function ProfileForm() {
  const t = useTranslations("Profile");

  return (
    <div className="max-w-2xl mx-auto p-6 space-y-8">
      <CardTitle>
        <p className="text-xl font-semibold text-gray-900">
          {t("personalInfo")}
        </p>
      </CardTitle>
      <Card>
        <CardContent className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 my-6">
            <div className="space-y-2">
              <Label
                htmlFor="nombre"
                className="text-sm font-medium text-gray-700"
              >
                {t("name")} *
              </Label>
              <Input
                id="nombre"
                type="text"
                className="w-full border-[#A4A4A4] focus:border-[#F27F2A] focus:ring-[#F27F2A]"
                placeholder={t("namePlaceholder")}
              />
            </div>

            <div className="space-y-2">
              <Label
                htmlFor="apellido"
                className="text-sm font-medium text-gray-700"
              >
                {t("lastName")} *
              </Label>
              <Input
                id="apellido"
                type="text"
                className="w-full border-[#A4A4A4] focus:border-[#F27F2A] focus:ring-[#F27F2A]"
                placeholder={t("lastNamePlaceholder")}
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 my-6">
            <div className="space-y-2">
              <Label
                htmlFor="fechaNacimiento"
                className="text-sm font-medium text-gray-700"
              >
                {t("birthDate")} *
              </Label>
              <Input
                id="fechaNacimiento"
                type="date"
                className="w-full border-[#A4A4A4] focus:border-[#F27F2A] focus:ring-[#F27F2A]"
              />
            </div>

            <div className="space-y-2">
              <Label className="text-sm font-medium text-gray-700">
                {t("gender")} *
              </Label>
              <div className="flex gap-4 mt-1">
                <label className="flex items-center space-x-2">
                  <input
                    type="radio"
                    name="genero"
                    value="male"
                    className="accent-[#F27F2A]"
                  />
                  <span className="text-sm text-gray-700">
                    {t("genders.male")}
                  </span>
                </label>
                <label className="flex items-center space-x-2">
                  <input
                    type="radio"
                    name="genero"
                    value="female"
                    className="accent-[#F27F2A]"
                  />
                  <span className="text-sm text-gray-700">
                    {t("genders.female")}
                  </span>
                </label>
                <label className="flex items-center space-x-2">
                  <input
                    type="radio"
                    name="genero"
                    value="other"
                    className="accent-[#F27F2A]"
                  />
                  <span className="text-sm text-gray-700">
                    {t("genders.other")}
                  </span>
                </label>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <CardTitle>
        <p className="text-xl font-semibold text-gray-900">
          {t("contactInfo")}
        </p>
      </CardTitle>

      <Card>
        <CardContent className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 my-4">
            <div className="space-y-2">
              <Label
                htmlFor="email"
                className="text-sm font-medium text-gray-700"
              >
                {t("email")} *
              </Label>
              <Input
                id="email"
                type="email"
                className="w-full border-[#A4A4A4] focus:border-[#F27F2A] focus:ring-[#F27F2A]"
                placeholder={t("emailPlaceholder")}
              />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2 my-5">
                <Select>
                  <SelectTrigger className="w-full border-[#A4A4A4] focus:border-[#F27F2A] focus:ring-[#F27F2A]">
                    <SelectValue placeholder={t("documentTypePlaceholder")} />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="dni">
                      {t("documentTypes.dni")}
                    </SelectItem>
                    <SelectItem value="passport">
                      {t("documentTypes.passport")}
                    </SelectItem>
                    <SelectItem value="idCard">
                      {t("documentTypes.idCard")}
                    </SelectItem>
                    <SelectItem value="driversLicense">
                      {t("documentTypes.driversLicense")}
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label
                  htmlFor="numeroDocumento"
                  className="text-xs font-medium text-gray-700"
                >
                  {t("documentNumber")}
                </Label>
                <Input
                  id="numeroDocumento"
                  type="text"
                  className="w-full border-[#A4A4A4] focus:border-[#F27F2A] focus:ring-[#F27F2A]"
                />
              </div>
            </div>
          </div>

          <div className="space-y-2">
            <Label
              htmlFor="telefono"
              className="text-sm font-medium text-gray-700"
            >
              {t("phone")}
            </Label>
            <PhoneInput
              id="telefono"
              className="w-full"
              placeholder={t("phonePlaceholder")}
            />
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
