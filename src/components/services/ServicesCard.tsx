"use client";

import Image from "next/image";
import { FaStar } from "react-icons/fa";

interface ServiceCardProps {
  id: number;
  title: string;
  description: string;
  price: number;
  rating: number;
  image: string;
  view?: "grid" | "list";
}

export default function ServiceCard({
  title,
  description,
  price,
  rating,
  image,
  view = "grid",
}: ServiceCardProps) {
  // Vista cuadrícula
  if (view === "grid") {
    return (
      <div className="bg-white rounded-xl shadow-md overflow-hidden flex flex-col hover:shadow-lg transition-shadow">
        <Image
          src={image}
          alt={title}
          width={400}
          height={250}
          className="w-full h-80 object-cover"
        />
        <div className="p-5 flex flex-col justify-between flex-grow">
          <div>
            <div className="flex items-center justify-between mb-2">
              <h2 className="text-[#F27F2A] font-medium text-3xl uppercase">
                {title}
              </h2>
              <div className="flex items-center text-sm text-gray-700">
                <FaStar className="text-yellow-400 mr-1" />
                {rating}
              </div>
            </div>
            <p className="text-gray-600 text-sm leading-relaxed mb-4">
              {description}
            </p>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-xl font-bold text-black">${price}</span>
            <button className="bg-[#F27F2A] text-white px-5 py-2 rounded-md text-sm font-semibold hover:bg-[#d66d1f] transition">
              Saber más
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Vista lista
  return (
    <div className="bg-white max-w-7xl mx-auto rounded-xl shadow-md flex flex-col sm:flex-row overflow-hidden hover:shadow-lg transition-shadow w-full">
      <Image
        src={image}
        alt={title}
        width={250}
        height={200}
        className="w-full sm:w-64 h-56 object-cover"
      />
      <div className="p-6 flex flex-col justify-between flex-grow">
        <div>
          <div className="flex items-center justify-between mb-2">
            <h2 className="text-[#F27F2A] font-medium text-3xl uppercase">
              {title}
            </h2>
            <div className="flex items-center text-sm text-gray-700">
              <FaStar className="text-yellow-400 mr-1" />
              {rating}
            </div>
          </div>
          <p className="text-gray-600 text-sm leading-relaxed mb-4">
            {description}
          </p>
        </div>
        <div className="flex justify-between items-center">
          <span className="text-xl font-bold text-black">${price}</span>
          <button className="bg-[#F27F2A] text-white px-5 py-2 rounded-md text-sm font-semibold hover:bg-[#d66d1f] transition">
            Saber más
          </button>
        </div>
      </div>
    </div>
  );
}
