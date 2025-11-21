"use client";

import type React from "react";
import { useState, useRef } from "react";
import { AlertCircle, CheckCircle2, HelpCircle, Upload, X } from "lucide-react";
import { DumbbellIcon, TrophyIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/Card";
import { useTranslations } from "next-intl";

interface PurchaseConfirmationProps {
  onConfirm?: () => void;
  onCancel?: () => void;
  onHome?: () => void;
}

export default function PurchaseConfirmation({
  onConfirm,
  onCancel,
  onHome,
}: PurchaseConfirmationProps) {
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Obtener traducciones directamente
  const t = useTranslations("MembershipPurchase.step3.purchaseConfirmation");

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
    const files = e.dataTransfer.files;
    if (files.length > 0) {
      setUploadedFile(files[0]);
    }
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      setUploadedFile(files[0]);
    }
  };

  const handleRemoveFile = () => {
    setUploadedFile(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const formatFileSize = (bytes: number) => {
    if (bytes < 1024) {
      return `${bytes} B`;
    }
    if (bytes < 1024 * 1024) {
      return `${(bytes / 1024).toFixed(2)} KB`;
    }
    return `${(bytes / (1024 * 1024)).toFixed(2)} MB`;
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <Card className="w-full max-w-2xl bg-white shadow-lg">
        <div className="p-8">
          <div className="text-center mb-8">
            <div className="flex justify-center mb-4">
              <div className="w-24 h-24 bg-orange-500 rounded-full flex items-center justify-center">
                <CheckCircle2
                  className="w-14 h-14 text-white"
                  strokeWidth={1.5}
                />
              </div>
            </div>
            <p className="text-2xl font-bold text-gray-900 mb-2">
              {t("purchaseRegistered")}
            </p>
            <p className="text-orange-500 text-sm">
              {t("purchaseInVerification")}
            </p>
          </div>

          {/* Subscription Section */}
          <div className="mb-8">
            <div className="flex justify-between items-start mb-4">
              <div>
                <h2 className="text-lg font-bold text-orange-500 uppercase">
                  {t("advancedSubscription")}
                </h2>
                <p className="text-sm text-gray-600 mt-1">
                  {t("moreBenefits")}
                </p>
              </div>
              <div className="text-right">
                <p className="text-3xl font-bold text-gray-900">$75</p>
                <p className="text-sm text-gray-600">{t("perMonth")}</p>
              </div>
            </div>

            {/* Benefits Grid */}
            <div className="grid grid-cols-3 gap-4">
              {[
                {
                  icon: <TrophyIcon className="text-orange-400 mx-auto mb-2" />,
                  label: t("valid"),
                  description: `30 ${t("days")}`,
                },
                {
                  icon: (
                    <DumbbellIcon className="text-orange-400 mx-auto mb-2" />
                  ),
                  label: t("access"),
                  description: t("unlimited"),
                },
                {
                  icon: <TrophyIcon className="text-orange-400 mx-auto mb-2" />,
                  label: t("benefits"),
                  description: "5",
                },
              ].map((benefit, index) => (
                <Card
                  key={index}
                  className="p-4 border-2 border-gray-200 hover:border-orange-500 transition"
                >
                  <div className="text-center">
                    <div className="text-2xl mb-2">{benefit.icon}</div>
                    <p className="font-semibold text-gray-900 text-sm">
                      {benefit.label}
                    </p>
                    <p className="text-gray-600 text-xs mt-1">
                      {benefit.description}
                    </p>
                  </div>
                </Card>
              ))}
            </div>
          </div>

          {/* File Upload Section */}
          <div className="mb-8">
            <div className="flex justify-between items-center mb-4">
              <h3 className="font-semibold text-gray-900">
                {t("attachReceipt")}
              </h3>
              <button className="text-gray-400 hover:text-gray-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
              className={`border-2 border-dashed rounded-lg p-8 text-center transition ${
                isDragging
                  ? "border-orange-500 bg-orange-50"
                  : "border-gray-300 bg-gray-50 hover:border-orange-500"
              }`}
            >
              <Upload className="w-10 h-10 text-gray-400 mx-auto mb-3" />
              <p className="text-sm font-semibold text-gray-900">
                {t("dragDrop")}{" "}
                <button
                  onClick={() => fileInputRef.current?.click()}
                  className="text-orange-500 hover:text-orange-600 font-semibold"
                >
                  {t("chooseFile")}
                </button>{" "}
                {t("toUpload")}
              </p>
              <p className="text-xs text-gray-500 mt-1">{t("fileTypes")}</p>
              <input
                ref={fileInputRef}
                type="file"
                onChange={handleFileSelect}
                className="hidden"
                accept=".jpg,.jpeg,.png,.pdf,.img"
              />
            </div>

            {/* Uploaded File Display */}
            {uploadedFile && (
              <div className="mt-4">
                <Card className="p-4 bg-blue-50 border-2 border-blue-200">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3 flex-1">
                      <div className="w-10 h-10 bg-blue-200 rounded flex items-center justify-center">
                        <span className="text-xs font-bold text-blue-600">
                          {uploadedFile.name.split(".").pop()?.toUpperCase()}
                        </span>
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-semibold text-gray-900 truncate">
                          {uploadedFile.name}
                        </p>
                        <p className="text-xs text-gray-600">
                          {formatFileSize(uploadedFile.size)} • 100%{" "}
                          {t("uploaded")}
                        </p>
                      </div>
                    </div>
                    <button
                      onClick={handleRemoveFile}
                      className="ml-2 text-gray-400 hover:text-red-500"
                    >
                      <X className="w-5 h-5" />
                    </button>
                  </div>
                  <div className="mt-2 w-full h-1.5 bg-blue-200 rounded-full overflow-hidden">
                    <div className="h-full w-full bg-blue-500"></div>
                  </div>
                </Card>
              </div>
            )}
          </div>

          {/* Action Buttons */}
          <div className="flex items-center justify-between mb-8 pt-4 border-t border-gray-200">
            <button className="flex items-center gap-2 text-gray-600 hover:text-gray-900 text-sm">
              <HelpCircle className="w-4 h-4" />
              {t("helpCenter")}
            </button>
            <div className="flex gap-3">
              <Button
                variant="outline"
                onClick={onCancel}
                className="px-6 bg-transparent"
              >
                {t("cancel")}
              </Button>
              <Button
                onClick={onConfirm}
                className="px-6 bg-orange-500 hover:bg-orange-600 text-white"
              >
                {t("confirm")}
              </Button>
            </div>
          </div>

          {/* Payment Verification Section */}
          <Card className="p-4 bg-orange-50 border-2 border-orange-200 mb-6">
            <div className="flex gap-3">
              <AlertCircle className="w-5 h-5 text-orange-500 flex-shrink-0 mt-0.5" />
              <div>
                <p className="font-semibold text-gray-900 text-sm">
                  {t("paymentVerification")}
                </p>
                <p className="text-xs text-gray-700 mt-1">
                  {t("verificationText")}
                </p>
              </div>
            </div>
          </Card>

          {/* Support Section */}
          <div className="text-center mb-6">
            <p className="text-xs text-gray-600">{t("supportText")}</p>
          </div>

          {/* Home Button */}
          <Button
            onClick={onHome}
            className="w-full bg-orange-500 hover:bg-orange-600 text-white py-2"
          >
            {t("goHome")}
          </Button>
        </div>
      </Card>
    </div>
  );
}
