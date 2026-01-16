"use client";

import { useAuth } from "@/context/AuthContext";
import { useRouter } from "@/i18n/routing";
import { useEffect, useState } from "react";
import { Card, CardContent } from "@/components/ui/Card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/Input";
import { Textarea } from "@/components/ui/Textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { AlertTriangle, Activity, Save, X } from "lucide-react";
import { toast } from "sonner";
import useMedicalProfile from "@/hooks/useMedicalProfile";
import type { MedicalProfile } from "@vitalfit/sdk";

export default function EditMedicalInfoPage() {
  const { token } = useAuth();
  const router = useRouter();

  // Form state
  const [formData, setFormData] = useState({
    allergies: "",
    warnings: "",
    medical_risks: "",
    bloodType: "NO_ESPECIFICADO", // Cambiar valor por defecto
    emergencyContactName: "",
    emergencyContactRelation: "",
    emergencyContactPhone: "",
    medicalConditions: "",
    currentMedication: "",
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isInitialized, setIsInitialized] = useState(false);

  const {
    medicalProfile: loadedProfile,
    isLoading: profileLoading,
    save,
  } = useMedicalProfile();

  useEffect(() => {
    if (!token) {
      router.replace("/login");
      return;
    }
  }, [token, router]);

  useEffect(() => {
    // Cuando la carga del perfil termina, inicializamos el formulario
    if (!profileLoading) {
      if (loadedProfile) {
        // Si hay perfil existente, cargamos los datos
        const parseEmergencyContact = (contact: string) => {
          const match = contact.match(/^(.+?)\s*\((.+?)\)\s*-\s*(.+)$/);
          if (match) {
            return {
              name: match[1].trim(),
              relation: match[2].trim(),
              phone: match[3].trim(),
            };
          }
          return { name: contact, relation: "", phone: "" };
        };

        const emergencyContact = parseEmergencyContact(
          loadedProfile.emergency_contact || "",
        );

        setFormData({
          allergies: loadedProfile.allergies || "",
          warnings: loadedProfile.warnings || "",
          medical_risks: loadedProfile.medical_risks || "",
          bloodType: loadedProfile.blood_type || "NO_ESPECIFICADO", // Usar valor por defecto
          emergencyContactName: emergencyContact.name,
          emergencyContactRelation: emergencyContact.relation,
          emergencyContactPhone: emergencyContact.phone,
          medicalConditions: loadedProfile.medical_conditions || "",
          currentMedication: loadedProfile.medications || "",
        });
      }
      // Marcamos como inicializado tanto si hay perfil como si no
      setIsInitialized(true);
    }
  }, [loadedProfile, profileLoading]);

  if (!token) {
    return null;
  }

  // Muestra spinner solo mientras se está cargando el perfil
  if (profileLoading && !isInitialized) {
    return (
      <div className="container mx-auto p-6">
        <div className="flex justify-center items-center min-h-[400px]">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500"></div>
        </div>
      </div>
    );
  }

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSelectChange = (value: string) => {
    setFormData((prev) => ({
      ...prev,
      bloodType: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      // Format emergency contact as "Name (Relation) - Phone"
      const emergencyContact = `${formData.emergencyContactName}${
        formData.emergencyContactRelation
          ? ` (${formData.emergencyContactRelation})`
          : ""
      }${formData.emergencyContactPhone ? ` - ${formData.emergencyContactPhone}` : ""}`;

      // Prepare data for API - convertir "NO_ESPECIFICADO" a string vacío
      const updateData: MedicalProfile = {
        allergies: formData.allergies,
        blood_type:
          formData.bloodType === "NO_ESPECIFICADO" ? "" : formData.bloodType,
        emergency_contact: emergencyContact,
        medical_conditions: formData.medicalConditions,
        medical_risks: formData.medical_risks,
        medications: formData.currentMedication,
        warnings: formData.warnings,
      };

      await save(updateData);
      router.push("/infomedical");
    } catch (error) {
      toast.error("Error al actualizar la información médica");
      console.error(error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCancel = () => {
    router.push("/infomedical");
  };

  const bloodTypes = ["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"];

  return (
    <div className="container mx-auto p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">
          {loadedProfile
            ? "Editar Información Médica"
            : "Agregar Información Médica"}
        </h1>
      </div>

      <form onSubmit={handleSubmit}>
        <Card className="shadow-lg">
          <CardContent className="p-8">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Sección de Alertas Críticas */}
              <div className="space-y-6">
                <div className="flex items-center gap-2 mb-6">
                  <AlertTriangle className="h-5 w-5 text-red-600" />
                  <h4 className="text-xl font-bold text-red-600 uppercase">
                    Alertas Críticas
                  </h4>
                </div>

                <div className="space-y-3">
                  <label
                    htmlFor="allergies"
                    className="text-sm font-semibold text-slate-500 uppercase tracking-wide block"
                  >
                    Alergias
                  </label>
                  <Textarea
                    id="allergies"
                    name="allergies"
                    value={formData.allergies}
                    onChange={handleInputChange}
                    placeholder="Describe las alergias conocidas..."
                    className="min-h-[100px] border-red-200 focus:border-red-500"
                    required
                  />
                  <p className="text-xs text-slate-500">
                    Incluye alergias a medicamentos, alimentos u otras
                    sustancias
                  </p>
                </div>

                <div className="space-y-3">
                  <label
                    htmlFor="warnings"
                    className="text-sm font-semibold text-slate-500 uppercase tracking-wide block"
                  >
                    Advertencias de Entrenamiento
                  </label>
                  <Textarea
                    id="warnings"
                    name="warnings"
                    value={formData.warnings}
                    onChange={handleInputChange}
                    placeholder="Describe las precauciones durante el entrenamiento..."
                    className="min-h-[100px] border-amber-200 focus:border-amber-500"
                    required
                  />
                  <p className="text-xs text-slate-500">
                    Lesiones previas, limitaciones físicas o precauciones
                    especiales
                  </p>
                </div>

                <div className="space-y-3">
                  <label
                    htmlFor="medical_risks"
                    className="text-sm font-semibold text-slate-500 uppercase tracking-wide block"
                  >
                    Riesgos Médicos
                  </label>
                  <Textarea
                    id="medical_risks"
                    name="medical_risks"
                    value={formData.medical_risks}
                    onChange={handleInputChange}
                    placeholder="Describe riesgos médicos relevantes..."
                    className="min-h-[100px] border-orange-200 focus:border-orange-500"
                  />
                  <p className="text-xs text-slate-500">
                    Factores de riesgo médico importantes para el entrenamiento
                  </p>
                </div>
              </div>

              {/* Sección de Perfil Clínico */}
              <div className="space-y-6">
                <div className="flex items-center gap-2 mb-6">
                  <Activity className="h-5 w-5 text-slate-600" />
                  <h4 className="text-xl font-bold text-slate-600 uppercase">
                    Perfil Clínico del Atleta
                  </h4>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <div className="space-y-3">
                    <label
                      htmlFor="bloodType"
                      className="text-sm font-semibold text-slate-500 uppercase tracking-wide block"
                    >
                      Grupo Sanguíneo
                    </label>
                    <Select
                      value={formData.bloodType}
                      onValueChange={handleSelectChange}
                    >
                      <SelectTrigger className="border-orange-200 focus:border-orange-500">
                        <SelectValue placeholder="Selecciona tipo de sangre" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="NO_ESPECIFICADO">
                          No especificado
                        </SelectItem>
                        {bloodTypes.map((type) => (
                          <SelectItem key={type} value={type}>
                            {type}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="space-y-3">
                  <label className="text-sm font-semibold text-slate-500 uppercase tracking-wide block">
                    Contacto de Emergencia
                  </label>
                  <div className="space-y-3">
                    <Input
                      id="emergencyContactName"
                      name="emergencyContactName"
                      value={formData.emergencyContactName}
                      onChange={handleInputChange}
                      placeholder="Nombre completo"
                      className="border-orange-200 focus:border-orange-500"
                      required
                    />
                    <Input
                      id="emergencyContactRelation"
                      name="emergencyContactRelation"
                      value={formData.emergencyContactRelation}
                      onChange={handleInputChange}
                      placeholder="Relación (ej: Madre, Padre, Esposo/a)"
                      className="border-orange-200 focus:border-orange-500"
                      required
                    />
                    <Input
                      id="emergencyContactPhone"
                      name="emergencyContactPhone"
                      type="tel"
                      value={formData.emergencyContactPhone}
                      onChange={handleInputChange}
                      placeholder="+58 412-555-6789"
                      className="border-orange-200 focus:border-orange-500"
                      required
                    />
                  </div>
                </div>

                <div className="space-y-3">
                  <label
                    htmlFor="medicalConditions"
                    className="text-sm font-semibold text-slate-500 uppercase tracking-wide block"
                  >
                    Condiciones Médicas
                  </label>
                  <Textarea
                    id="medicalConditions"
                    name="medicalConditions"
                    value={formData.medicalConditions}
                    onChange={handleInputChange}
                    placeholder="Describe condiciones médicas crónicas o relevantes..."
                    className="min-h-[100px] border-blue-200 focus:border-blue-500"
                  />
                  <p className="text-xs text-slate-500">
                    Enfermedades crónicas, condiciones preexistentes, etc.
                  </p>
                </div>

                <div className="space-y-3">
                  <label
                    htmlFor="currentMedication"
                    className="text-sm font-semibold text-slate-500 uppercase tracking-wide block"
                  >
                    Medicamentación Actual
                  </label>
                  <Textarea
                    id="currentMedication"
                    name="currentMedication"
                    value={formData.currentMedication}
                    onChange={handleInputChange}
                    placeholder="Lista de medicamentos actuales con dosis y frecuencia..."
                    className="min-h-[100px] border-green-200 focus:border-green-500"
                  />
                  <p className="text-xs text-slate-500">
                    Incluye nombre, dosis y frecuencia de cada medicamento
                  </p>
                </div>
              </div>
            </div>

            {/* Botones de acción */}
            <div className="flex justify-end gap-4 mt-8 pt-6 border-t">
              <Button
                type="button"
                variant="outline"
                onClick={handleCancel}
                disabled={isSubmitting}
                className="px-6"
              >
                <X className="h-4 w-4 mr-2" />
                Cancelar
              </Button>
              <Button
                type="submit"
                disabled={isSubmitting}
                className="bg-orange-500 hover:bg-orange-600 text-white px-6"
              >
                <Save className="h-4 w-4 mr-2" />
                {isSubmitting ? "Guardando..." : "Guardar Cambios"}
              </Button>
            </div>
          </CardContent>
        </Card>
      </form>
    </div>
  );
}
