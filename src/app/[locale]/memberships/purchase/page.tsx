"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { Navbar } from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { ChevronLeft, ChevronRight, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/Card";
import StepIndicator from "./step-indicator";
import AddOnCard from "./add-on-card";
import OrderSummary from "./order-summary";

export default function MembershipPurchase() {
  const t = useTranslations("MembershipPurchase");
  const [currentStep, setCurrentStep] = useState(1);
  const [selectedAddOns, setSelectedAddOns] = useState<string[]>([]);
  const [carouselIndex, setCarouselIndex] = useState(0);

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

  return (
    <main className="min-h-screen bg-white">
      <Navbar transparent={false} />
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
                    <h2 className="mb-6 text-xl font-bold">
                      {t("step2.title")}
                    </h2>
                    <Card>
                      <CardContent className="pt-6">
                        <div className="space-y-4">
                          <p className="text-muted-foreground">
                            {t("step2.description")}
                          </p>
                          <div className="mt-6 p-4 rounded-md bg-muted">
                            <p className="text-sm font-semibold text-foreground">
                              {t("step2.genericContent")}
                            </p>
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
                <div className="space-y-8">
                  <div>
                    <h2 className="mb-6 text-xl font-bold">
                      {t("step3.title")}
                    </h2>
                    <Card>
                      <CardContent className="pt-6">
                        <div className="space-y-4">
                          <p className="text-muted-foreground">
                            {t("step3.description")}
                          </p>
                          <div className="mt-6 p-4 rounded-md bg-muted">
                            <p className="text-sm font-semibold text-foreground">
                              {t("step3.genericContent")}
                            </p>
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
                    <Button className="flex-1 bg-orange-500 hover:bg-orange-600">
                      {t("step3.purchaseButton")}
                    </Button>
                  </div>
                </div>
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
