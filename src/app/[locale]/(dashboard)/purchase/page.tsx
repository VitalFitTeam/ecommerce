"use client";

import { useEffect, useState } from "react";
import { useTranslations } from "next-intl";
import Header from "@/components/layout/dashboard/Header";
import Footer from "@/components/layout/Footer";
import { ChevronLeft, ChevronRight, Trash2 } from "lucide-react";
import {
  CheckIcon,
  DevicePhoneMobileIcon,
  CurrencyDollarIcon,
} from "@heroicons/react/24/outline";
import {
  ClipboardDocumentListIcon,
  InformationCircleIcon,
} from "@heroicons/react/24/outline";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/Label";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/Card";
import StepIndicator from "./step-indicator";
import AddOnCard from "./add-on-card";
import OrderSummary from "./order-summary";
import { useAuth } from "@/context/AuthContext";
import { useRouter } from "@/i18n/routing";
import PurchaseConfirmation from "./purchaseConfirmation";

export default function MembershipPurchase() {
  const t = useTranslations("MembershipPurchase");
  const { token, loading, isAuthenticated } = useAuth(); // Cambié a loading e isAuthenticated
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState(1);
  const [selectedAddOns, setSelectedAddOns] = useState<string[]>([]);
  const [carouselIndex, setCarouselIndex] = useState(0);
  const [paymentMethod, setPaymentMethod] = useState<"mobile" | "transfer">(
    "transfer",
  );
  const [authChecked, setAuthChecked] = useState(false);

  const addOns = [
    {
      id: "personal-4",
      title: t("addOns.personal-4.title"),
      subtitle: t("addOns.personal-4.subtitle"),
      description: t("addOns.personal-4.description"),
      price: 25.0,
    },
    {
      id: "personal-8",
      title: t("addOns.personal-8.title"),
      subtitle: t("addOns.personal-8.subtitle"),
      description: t("addOns.personal-8.description"),
      price: 96.0,
    },
    {
      id: "yoga-10",
      title: t("addOns.yoga-10.title"),
      subtitle: t("addOns.yoga-10.subtitle"),
      description: t("addOns.yoga-10.description"),
      price: 64,
    },
  ];

  const toggleAddOn = (id: string) => {
    setSelectedAddOns((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id],
    );
  };

  const removeAddOn = (id: string) => {
    setSelectedAddOns((prev) => prev.filter((item) => item !== id));
  };

  const handlePrevCarousel = () => {
    setCarouselIndex((prev) => Math.max(0, prev - 1));
  };

  const handleNextCarousel = () => {
    setCarouselIndex((prev) => Math.min(addOns.length - 1, prev + 1));
  };

  const calculateSubtotal = () => {
    const basePrice = 0;
    const addOnsTotal = addOns
      .filter((addon) => selectedAddOns.includes(addon.id))
      .reduce((sum, addon) => sum + addon.price, 0);
    return basePrice + addOnsTotal;
  };

  const handleNextStep = () => {
    if (currentStep < 3) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handlePrevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  useEffect(() => {
    if (!loading) {
      if (!isAuthenticated) {
        router.replace("/login");
      } else {
        setAuthChecked(true);
      }
    }
  }, [loading, isAuthenticated, router]);

  if (loading || !authChecked) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500 mx-auto"></div>
          <p className="mt-4 text-gray-600">Cargando...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return null;
  }

  return (
    <main className="min-h-screen bg-white">
      <Header />
      <div className="min-h-screen bg-background py-8">
        <div className="mx-auto max-w-7xl px-4">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-foreground">{t("title")}</h1>
          </div>

          <StepIndicator currentStep={currentStep} />

          <div className="mt-12 grid grid-cols-1 gap-8 lg:grid-cols-3">
            <div className="lg:col-span-2">
              {currentStep === 1 && (
                <div>
                  <div className="mb-8 space-y-3">
                    {/* Planes de entrenamiento seleccionados */}
                    {selectedAddOns.length > 0 &&
                      addOns
                        .filter((addon) => selectedAddOns.includes(addon.id))
                        .map((addon) => (
                          <div key={addon.id}>
                            <h2 className="mb-6 text-xl font-bold">
                              {addon.title.toUpperCase()} -{" "}
                              {addon.subtitle.toUpperCase()}
                            </h2>
                            <div className="grid grid-cols-1 gap-6">
                              <Card className="border-l-4 border-l-orange-500">
                                <CardContent className="pt-6">
                                  <div className="space-y-4">
                                    <div>
                                      <p className="text-sm text-muted-foreground">
                                        {t("step1.price")}
                                      </p>
                                      <p className="text-2xl font-bold text-foreground">
                                        ${addon.price.toFixed(2)}
                                      </p>
                                    </div>

                                    {/* Contenedor para datepicker y botón en la misma línea */}
                                    <div className="flex items-end gap-4">
                                      <div className="flex-1">
                                        <label
                                          htmlFor="start-date"
                                          className="mb-2 block text-sm font-medium"
                                        >
                                          {t("step1.startDate")}
                                        </label>
                                        <input
                                          id="start-date"
                                          type="date"
                                          defaultValue=""
                                          className="w-3/4 rounded-md border border-input bg-background px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground"
                                        />
                                      </div>
                                      <button
                                        onClick={() => removeAddOn(addon.id)}
                                        className="rounded-md bg-gray-100 hover:bg-destructive/10 p-2 transition-colors mb-1"
                                        title={t("step1.removePlan")}
                                      >
                                        <Trash2 className="h-5 w-5" />
                                      </button>
                                    </div>

                                    <div>
                                      <p className="mb-2 text-sm font-medium text-foreground">
                                        {t("step1.fee", {
                                          startDate: "2025-11-30",
                                          endDate: "2025-12-30",
                                        })}
                                      </p>
                                    </div>
                                  </div>
                                </CardContent>
                              </Card>
                            </div>
                          </div>
                        ))}
                  </div>

                  {/* Add-ons Section */}
                  <div className="mt-12">
                    <h2 className="mb-6 text-xl font-bold">
                      {t("step1.complementPlan")}
                    </h2>
                    <div className="relative flex items-center gap-4">
                      {/* Flecha izquierda */}
                      <button
                        onClick={handlePrevCarousel}
                        disabled={carouselIndex === 0}
                        className="flex-shrink-0 rounded-full bg-muted p-2 text-muted-foreground hover:bg-accent disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        <ChevronLeft className="h-5 w-5" />
                      </button>

                      {/* Cards del carrusel */}
                      <div className="flex-1 overflow-hidden">
                        <div className="flex gap-8">
                          {addOns.map((addon, index) => (
                            <div
                              key={addon.id}
                              className="transition-all duration-300"
                              style={{
                                transform: `translateX(-${carouselIndex * 320}px)`,
                                minWidth: "300px",
                              }}
                            >
                              <AddOnCard
                                addon={addon}
                                isSelected={selectedAddOns.includes(addon.id)}
                                onToggle={() => toggleAddOn(addon.id)}
                              />
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* Flecha derecha */}
                      <button
                        onClick={handleNextCarousel}
                        disabled={carouselIndex === addOns.length - 1}
                        className="flex-shrink-0 rounded-full bg-muted p-2 text-muted-foreground hover:bg-accent disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        <ChevronRight className="h-5 w-5" />
                      </button>
                    </div>

                    {/* Navigation Buttons - Uno al lado del otro */}
                    <div className="mt-8 flex gap-4">
                      <Button
                        variant="outline"
                        className="flex-1 bg-transparent border border-gray-300 hover:bg-gray-50"
                      >
                        {t("navigation.cancel")}
                      </Button>
                      <Button
                        onClick={handleNextStep}
                        className="flex-1 bg-orange-500 hover:bg-orange-600"
                      >
                        {t("navigation.continue")}
                      </Button>
                    </div>
                  </div>
                </div>
              )}

              {currentStep === 2 && (
                <div className="space-y-8">
                  <div>
                    <Card>
                      <CardContent className="pt-6">
                        <p className="mb-6 text-xl font-bold">
                          {t("step2.title")}
                        </p>
                        <div className="space-y-6">
                          <p className="text-muted-foreground">
                            {t("step2.description")}
                          </p>

                          {/* Seleccionar sucursal */}
                          <div className="space-y-3">
                            <Label htmlFor="branch">
                              {t("step2.selectBranch")}
                            </Label>
                            <Select>
                              <SelectTrigger className="w-auto">
                                <SelectValue
                                  placeholder={t(
                                    "step2.selectBranchPlaceholder",
                                  )}
                                />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="vitalfit">
                                  <div className="flex items-center gap-2">
                                    <CheckIcon className="h-4 w-4 text-green-500" />
                                    <span>VitalFit</span>
                                  </div>
                                </SelectItem>
                              </SelectContent>
                            </Select>
                          </div>

                          {/* Opciones de compra */}
                          <div className="space-y-4">
                            <p className="font-semibold">
                              {t("step2.paymentOptions")}
                            </p>

                            {/* Pago Móvil */}
                            <div
                              className="flex items-center space-x-3 p-3 border rounded-lg hover:bg-muted/50 cursor-pointer"
                              onClick={() => setPaymentMethod("mobile")}
                            >
                              <div className="flex items-center justify-center h-5 w-5">
                                <input
                                  type="radio"
                                  name="paymentMethod"
                                  value="mobile"
                                  checked={paymentMethod === "mobile"}
                                  onChange={() => setPaymentMethod("mobile")}
                                  className="h-4 w-4 text-orange-500 border-gray-300 focus:ring-orange-500"
                                />
                              </div>
                              <span className="flex-1">
                                {t("step2.mobilePayment")}
                              </span>
                              <DevicePhoneMobileIcon className="h-5 w-5 text-muted-foreground" />
                            </div>

                            {/* Transferencia Bancaria */}
                            <div
                              className="flex items-center space-x-3 p-3 border rounded-lg hover:bg-muted/50 cursor-pointer"
                              onClick={() => setPaymentMethod("transfer")}
                            >
                              <div className="flex items-center justify-center h-5 w-5">
                                <input
                                  type="radio"
                                  name="paymentMethod"
                                  value="transfer"
                                  checked={paymentMethod === "transfer"}
                                  onChange={() => setPaymentMethod("transfer")}
                                  className="h-4 w-4 text-orange-500 border-gray-300 focus:ring-orange-500"
                                />
                              </div>
                              <span className="flex-1">
                                {t("step2.bankTransfer")}
                              </span>
                              <CurrencyDollarIcon className="h-5 w-5 text-muted-foreground" />
                            </div>
                          </div>

                          {/* Información de pago - Se muestra dinámicamente */}
                          <div className="space-y-6 mt-6">
                            {/* Información del titular */}
                            <div className="space-y-4">
                              <div className="grid grid-cols-2 gap-4">
                                <div className="flex items-center">
                                  <div>
                                    <p className="font-semibold">
                                      {t("step2.holder")}
                                    </p>
                                    <div className="flex p-3 bg-gray-200 border rounded-lg justify-between">
                                      <p className="text-sm text-muted-foreground">
                                        VitalFit Cabudare C.A
                                      </p>
                                      <ClipboardDocumentListIcon className="h-5 w-5 text-orange-300 cursor-pointer" />
                                    </div>
                                  </div>
                                </div>

                                <div className="flex items-center">
                                  <div>
                                    <p className="font-semibold">
                                      {t("step2.fiscalDocument")}
                                    </p>
                                    <div className="flex p-3 bg-gray-200 border rounded-lg justify-between">
                                      <p className="text-sm text-muted-foreground">
                                        J-123456789
                                      </p>
                                      <ClipboardDocumentListIcon className="h-5 w-5 text-orange-300 cursor-pointer" />
                                    </div>
                                  </div>
                                </div>
                              </div>
                            </div>

                            {/* Información bancaria */}
                            <div className="space-y-4">
                              <div className="grid grid-cols-2 gap-4">
                                <div className="flex items-center">
                                  <div>
                                    <p className="font-semibold">
                                      {t("step2.associatedBank")}
                                    </p>
                                    <div className="flex p-3 bg-gray-200 border rounded-lg justify-between">
                                      <p className="text-sm text-muted-foreground">
                                        Banco de Venezuela
                                      </p>
                                      <ClipboardDocumentListIcon className="h-5 w-5 text-orange-300 cursor-pointer" />
                                    </div>
                                  </div>
                                </div>

                                {/* Campo dinámico según método de pago */}
                                <div className="flex items-center">
                                  <div>
                                    <p className="font-semibold">
                                      {paymentMethod === "mobile"
                                        ? t("step2.phoneNumber")
                                        : t("step2.accountNumber")}
                                    </p>
                                    <div className="flex p-3 bg-gray-200 border rounded-lg justify-between">
                                      <p className="text-sm text-muted-foreground">
                                        {paymentMethod === "mobile"
                                          ? "0412-1234567"
                                          : "0105-0000-0000000000"}
                                      </p>
                                      <ClipboardDocumentListIcon className="h-5 w-5 text-orange-300 cursor-pointer" />
                                    </div>
                                  </div>
                                </div>
                              </div>
                            </div>

                            {/* Información importante */}
                            <div className="p-4 rounded-md bg-blue-50 border border-blue-200">
                              <div className="flex items-start gap-3">
                                <InformationCircleIcon className="h-5 w-5 text-blue-600 mt-0.5" />
                                <div className="space-y-2">
                                  <p className="font-semibold">
                                    {t("step2.important")}
                                  </p>
                                  <ul className="text-sm space-y-1">
                                    <li>• {t("step2.includeExactAmount")}</li>
                                    <li>• {t("step2.saveReceipt")}</li>
                                  </ul>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </div>

                  {/* Navigation Buttons */}
                  <div className="flex gap-4">
                    <Button
                      onClick={handlePrevStep}
                      variant="outline"
                      className="flex-1 bg-transparent"
                    >
                      {t("navigation.back")}
                    </Button>
                    <Button
                      onClick={handleNextStep}
                      className="flex-1 bg-orange-500 hover:bg-orange-600"
                    >
                      {t("navigation.continue")}
                    </Button>
                  </div>
                </div>
              )}

              {currentStep === 3 && (
                <PurchaseConfirmation
                  onConfirm={() => console.log("Confirmed")}
                  onCancel={() => console.log("Cancelled")}
                  onHome={() => router.replace("/dashboard")}
                />
              )}
            </div>

            <OrderSummary
              selectedAddOns={addOns.filter((addon) =>
                selectedAddOns.includes(addon.id),
              )}
              subtotal={calculateSubtotal()}
            />
          </div>
        </div>
      </div>
      <Footer />
    </main>
  );
}
