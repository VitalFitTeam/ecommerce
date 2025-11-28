"use client";

import React from "react";

interface MembershipCardProps {
  membership: any;
}

export default function MembershipCard({ membership }: MembershipCardProps) {
  // Calcula la fecha de finalización según la duración de la membresía
  const getEndDate = (start: Date, months: number) => {
    const end = new Date(start);
    end.setMonth(end.getMonth() + months);
    return end.toISOString().split("T")[0];
  };

  // Por defecto, la fecha de inicio es hoy
  const startDate = new Date();
  const durationMonths = membership.duration_months || 1; // si la membresía tiene duración en meses

  return (
    <div className="bg-white shadow-sm rounded-lg p-6 border-l-[6px] border-l-orange-500 mb-8">
      {/* Nombre y descripción */}
      <div className="mb-4">
        <h1 className="text-2xl font-bold text-orange-500 uppercase tracking-tight">
          {membership.name}
        </h1>
        <p className="text-gray-500 text-sm mt-1">
          {membership.description || "Más beneficios para tu vida fitness"}
        </p>
      </div>

      {/* Precio */}
      <div className="mb-6">
        <span className="text-xl font-bold text-black">
          Precio: ${membership.price.toFixed(2)}
        </span>
      </div>

      {/* Información de duración */}
      <div>
        <p className="font-bold text-lg text-black">
          Duración: {startDate.toISOString().split("T")[0]} -{" "}
          {getEndDate(startDate, durationMonths)}
        </p>
      </div>
    </div>
  );
}
