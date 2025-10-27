"use client";

import { useState } from "react";
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
                CONTÁCTANOS
              </h1>
              <p className="text-gray-600">Rellena los datos del formulario</p>
            </div>
            <div>
              <Logo slogan={true} />
            </div>
          </div>

          <form className="p-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              <div>
                <label
                  htmlFor="nombre"
                  className="block text-sm font-medium text-gray-700 mb-2"
                >
                  Nombre*
                </label>
                <Input
                  id="nombre"
                  name="nombre"
                  type="text"
                  placeholder="Nombre"
                  required
                  className="w-full"
                />
              </div>

              <div>
                <label
                  htmlFor="apellido"
                  className="block text-sm font-medium text-gray-700 mb-2"
                >
                  Apellido*
                </label>
                <Input
                  id="apellido"
                  name="apellido"
                  type="text"
                  placeholder="Apellido"
                  required
                  className="w-full"
                />
              </div>
            </div>

            <div className="mb-6">
              <label
                htmlFor="correo"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                Correo electrónico*
              </label>
              <Input
                id="correo"
                name="correo"
                type="email"
                placeholder="correo@ejemplo.com"
                required
                className="w-full"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              <div>
                <Select
                  value={motivoContacto}
                  onValueChange={setMotivoContacto}
                >
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Motivo de contacto" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="consulta">Consulta general</SelectItem>
                    <SelectItem value="membresia">
                      Información de membresías
                    </SelectItem>
                    <SelectItem value="servicios">
                      Información de servicios
                    </SelectItem>
                    <SelectItem value="reclamo">Reclamo</SelectItem>
                    <SelectItem value="sugerencia">Sugerencia</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Select
                  value={preferenciaContacto}
                  onValueChange={setPreferenciaContacto}
                >
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Preferencia de contacto" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="email">Correo electrónico</SelectItem>
                    <SelectItem value="telefono">Teléfono</SelectItem>
                    <SelectItem value="whatsapp">WhatsApp</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="mb-5">
              <Textarea
                id="mensaje"
                name="mensaje"
                placeholder="Mensaje"
                rows={5}
                className="w-full resize-none text-center border-0 shadow-sm text-lg font-medium"
              />
            </div>

            <Button
              type="submit"
              className="w-full bg-primary text-white font-semibold py-5 rounded-md"
            >
              Enviar
            </Button>
          </form>
        </div>
      </section>

      <Footer />
    </main>
  );
}
