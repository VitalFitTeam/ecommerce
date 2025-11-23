"use client";

import Header from "@/components/layout/dashboard/Header";
import Sidebar from "@/components/layout/dashboard/Sidebar";
import MainContent from "./MainContent";
import { useAuth } from "@/context/AuthContext";
import { useRouter } from "@/i18n/routing";
import { useEffect } from "react";

export default function DashboardPage() {
  const { token } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!token) {
      router.push("/login");
    }
  }, [token, router]);

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <div className="flex">
        <Sidebar />
        <MainContent />
      </div>
    </div>
  );
}
