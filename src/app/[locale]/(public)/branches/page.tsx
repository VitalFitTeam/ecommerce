"use client";

import { Navbar } from "@/components/layout/Navbar";
import { Button } from "@/components/ui/button";
import { ChevronLeftIcon, ChevronRightIcon } from "@heroicons/react/24/outline";
import Footer from "@/components/layout/Footer";
import { MapPinIcon } from "lucide-react";
import { useEffect, useState } from "react";
import FindBranch from "./FindBranch";
import { useTranslations } from "next-intl";
import { api } from "@/lib/sdk-config";
import { BranchInfo } from "@vitalfit/sdk";
import { BranchCard } from "@/components/features/branch/BranchCard";

export default function Branches() {
  const t = useTranslations("BranchesPage");

  const [showSucursales, setShowSucursales] = useState(false);
  const [branches, setBranches] = useState<BranchInfo[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [itemsPerPage, setItemsPerPage] = useState(3);
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 768) {
        setItemsPerPage(1);
      } else if (window.innerWidth < 1024) {
        setItemsPerPage(2);
      } else {
        setItemsPerPage(3);
      }
    };

    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    setCurrentIndex(0);
  }, [itemsPerPage]);

  const PLACEHOLDER_IMAGES = [
    "/images/gym-training-spain.png",
    "/images/gym-training-venezuela.png",
    "/images/gym-training-chile.png",
  ];

  const fetchBranches = async () => {
    setIsLoading(true);
    try {
      const response = await api.public.getBranchMap("");
      const branchesWithImages = response.data.map((branch) => {
        const randomIndex = Math.floor(
          Math.random() * PLACEHOLDER_IMAGES.length,
        );
        return { ...branch, imageUrl: PLACEHOLDER_IMAGES[randomIndex] };
      });

      setBranches(branchesWithImages);
    } catch (error) {
      console.error("Error fetching branches:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchBranches();
  }, []);

  const viewBranches = () => setShowSucursales(true);

  const handleNext = () => {
    setCurrentIndex((prev) =>
      Math.min(prev + itemsPerPage, branches.length - itemsPerPage),
    );
  };

  const handlePrev = () => {
    setCurrentIndex((prev) => Math.max(prev - itemsPerPage, 0));
  };

  return (
    <>
      <Navbar transparent={false} />
      <main className="pt-28 pb-20 px-4 md:px-8 bg-gray-50 min-h-screen font-sans">
        {showSucursales && <FindBranch initialBranches={branches} />}

        {!showSucursales && (
          <>
            <section className="bg-gray-50 py-12 px-6">
              <div className="max-w-6xl mx-auto">
                <h1 className="text-4xl md:text-5xl font-bold text-center mb-4">
                  {t.rich("title", {
                    highlight: (chunks) => (
                      <span className="text-orange-400 prevent-clip">
                        {chunks}
                      </span>
                    ),
                    "highlight-dark": (chunks) => (
                      <span className="text-gray-900 prevent-clip">
                        {chunks}
                      </span>
                    ),
                  })}
                </h1>
                <p className="text-center text-gray-600 w-full mx-auto">
                  {t("subtitle")}
                </p>
              </div>
            </section>

            <section className="py-16 px-6">
              <div className="max-w-6xl mx-auto">
                {isLoading ? (
                  <div className="text-center py-10">
                    Cargando sucursales...
                  </div>
                ) : (
                  <div className="flex flex-col md:flex-row items-center gap-4 mb-8">
                    <button
                      onClick={handlePrev}
                      disabled={currentIndex === 0}
                      className="hidden md:flex p-2 hover:bg-gray-100 rounded-full transition-colors disabled:opacity-50"
                      aria-label="Previous"
                    >
                      <ChevronLeftIcon className="w-6 h-6 text-gray-600" />
                    </button>

                    <div className="flex-1 w-full overflow-hidden">
                      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 w-full transition-all duration-500">
                        {branches.length > 0 ? (
                          branches
                            .slice(currentIndex, currentIndex + itemsPerPage)
                            .map((branch, index) => (
                              <BranchCard
                                key={branch.branch_id}
                                branch={branch}
                                index={currentIndex + index}
                              />
                            ))
                        ) : (
                          <div className="text-center text-gray-500 col-span-full py-20">
                            No hay sucursales disponibles
                          </div>
                        )}
                      </div>
                    </div>

                    <button
                      onClick={handleNext}
                      disabled={currentIndex + itemsPerPage >= branches.length}
                      className="hidden md:flex p-2 hover:bg-gray-100 rounded-full transition-colors disabled:opacity-50"
                      aria-label="Next"
                    >
                      <ChevronRightIcon className="w-6 h-6 text-gray-600" />
                    </button>

                    {/* Mobile Navigation Buttons */}
                    <div className="flex md:hidden items-center justify-between w-full mt-6">
                      <button
                        onClick={handlePrev}
                        disabled={currentIndex === 0}
                        className="p-3 bg-white shadow-md rounded-full transition-all disabled:opacity-40"
                        aria-label="Previous"
                      >
                        <ChevronLeftIcon className="w-6 h-6 text-gray-600" />
                      </button>

                      <button
                        onClick={handleNext}
                        disabled={
                          currentIndex + itemsPerPage >= branches.length
                        }
                        className="p-3 bg-white shadow-md rounded-full transition-all disabled:opacity-40"
                        aria-label="Next"
                      >
                        <ChevronRightIcon className="w-6 h-6 text-gray-600" />
                      </button>
                    </div>
                  </div>
                )}

                <div className="flex justify-center mt-6">
                  <Button
                    onClick={viewBranches}
                    className="bg-primary hover:bg-orange-500 text-white px-8 py-2 rounded-full flex items-center gap-2"
                  >
                    <MapPinIcon className="w-5 h-5 text-white  mt-0.5" />
                    {t("viewButton")}
                  </Button>
                </div>
              </div>
            </section>

            <section className="bg-gray-50 py-12 px-6">
              <div className="max-w-4xl mx-auto text-center">
                <p className="text-gray-700 leading-relaxed">
                  {t("footerQuote")}
                </p>
              </div>
            </section>
          </>
        )}

        <Footer />
      </main>
    </>
  );
}
