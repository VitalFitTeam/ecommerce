import React from "react";
import { useTranslations } from "next-intl";

interface StepIndicatorProps {
  currentStep: number;
}

export default function StepIndicator({ currentStep }: StepIndicatorProps) {
  const t = useTranslations("StepIndicator");

  const steps = [
    { number: 1, label: t("step1") },
    { number: 2, label: t("step2") },
    { number: 3, label: t("step3") },
  ];

  return (
    <div className="flex items-center justify-between">
      {steps.map((step, index) => (
        <React.Fragment key={step.number}>
          <div className="flex flex-col items-center gap-2">
            <div
              className={`flex h-10 w-10 items-center justify-center rounded-full transition-all ${
                currentStep >= step.number
                  ? "bg-orange-500 text-white"
                  : "bg-muted text-muted-foreground"
              }`}
            >
              {step.number}
            </div>
            <span
              className={`text-center text-xs font-medium leading-tight transition-colors ${
                currentStep >= step.number
                  ? "text-orange-500"
                  : "text-muted-foreground"
              }`}
            >
              {step.label}
            </span>
          </div>
          {index < steps.length - 1 && (
            <div
              className={`h-1 flex-1 mx-4 transition-colors ${
                currentStep > step.number ? "bg-orange-500" : "bg-muted"
              }`}
            />
          )}
        </React.Fragment>
      ))}
    </div>
  );
}
