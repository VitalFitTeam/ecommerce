"use client";

import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import ServiceCard from "@/components/services/ServicesCard";

export function RecentServicesCarousel({
  services,
  onOpen,
}: {
  services: any[];
  onOpen: (service: any) => void;
}) {
  if (!services || services.length === 0) {
    return null;
  }

  return (
    <div className="relative w-full">
      <Carousel opts={{ align: "start", loop: false }} className="w-full">
        <CarouselContent className="flex gap-2 -ml-2">
          {services.map((service) => (
            <CarouselItem
              key={service.service_id}
              className="flex-shrink-0 w-[80%] sm:w-[45%] md:w-[30%] lg:w-[22%]"
            >
              <ServiceCard
                service={service}
                view="grid"
                onLearnMore={() => onOpen(service)}
                className="w-full h-auto"
              />
            </CarouselItem>
          ))}
        </CarouselContent>

        <CarouselPrevious className="hidden md:flex absolute left-0 top-1/2 -translate-y-1/2 z-10" />
        <CarouselNext className="hidden md:flex absolute right-0 top-1/2 -translate-y-1/2 z-10" />
      </Carousel>
    </div>
  );
}
