'use client';

import { useEffect, useState } from 'react';
import { cn } from '@/lib/utils';
import { PencilRuler , Gem, ShieldCheck } from "lucide-react";

const banners = [
  '/banner/bcopa.png',
  '/banner/bkit.png',
];

const bannersMobile = [
  '/banner/banner3.png',
  '/banner/bannercopa2.png',
];

export default function HeroBanner() {
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrent((prev) => (prev + 1) % banners.length);
    }, 5000);

    return () => clearInterval(timer);
  }, []);

  return (
    <>
      {/* Banner */}
      <section className="relative mt-15 md:mt-8 overflow-hidden">
        <div className="relative h-100 md:h-170">
        {/* Desktop */}
        {banners.map((banner, index) => (
          <img
            key={`desktop-${index}`}
            src={banner}
            alt={`Banner ${index + 1}`}
            className={cn(
              "hidden md:block absolute inset-0 w-full h-full object-cover transition-opacity duration-700",
              current === index
                ? "opacity-100"
                : "opacity-0 pointer-events-none"
            )}
          />
        ))}

        {/* Mobile */}
        {bannersMobile.map((banner, index) => (
          <img
            key={`mobile-${index}`}
            src={banner}
            alt={`Banner Mobile ${index + 1}`}
            className={cn(
              "block md:hidden absolute inset-0 w-full h-full object-cover transition-opacity duration-700",
              current === index
                ? "opacity-100"
                : "opacity-0 pointer-events-none"
            )}
          />
        ))}

        {/* Bolinhas */}
        <div className="absolute bottom-5 left-1/2 -translate-x-1/2 flex gap-2">
          {banners.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrent(index)}
              className={cn(
                "h-2.5 rounded-full transition-all",
                current === index
                  ? "bg-white w-8"
                  : "bg-white/50 w-2.5"
              )}
            />
          ))}
        </div>
      </div>

        {/* Barra de benefícios */}
        <div className=" mt-4 hidden md:flex ">
          <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3">

            <div className="flex items-center justify-center gap-4 py-6 border-b md:border-b-0 md:border-r border-gray-100">
              <div className="flex h-12 w-12 items-center justify-center rounded-ful">
                <PencilRuler className="h-10 w-10 text-primary" strokeWidth={1.25} />
              </div>

              <div>
                <p className="font-semibold text-[#3D261D]">
                  PERSONALIZADO
                </p>
                <span className="text-sm text-[#5C3D31]">
                  Feito especialmente para você.
                </span>
              </div>
            </div>

            <div className="flex items-center justify-center gap-4 py-6 border-b md:border-b-0 md:border-r border-gray-100">
              <div className="flex h-12 w-12 items-center justify-center rounded-full">
                <Gem className="h-10 w-10 text-primary" strokeWidth={1.25} />
              </div>

              <div>
                <p className="font-semibold text-[#3D261D]">
                  ALTA QUALIDADE
                </p>
                <span className="text-sm text-[#5C3D31]">
                  Materiais premium e acabamento impecável.
                </span>
              </div>
            </div>

            <div className="flex items-center justify-center gap-4 py-6">
              <div className="flex h-12 w-12 items-center justify-center rounded-full">
                <ShieldCheck className="h-10 w-10 text-primary" strokeWidth={1.25} />
              </div>

              <div>
                <p className="font-semibold text-[#3D261D]">
                  COMPRA SEGURA
                </p>
                <span className="text-sm text-[#5C3D31]">
                  Atendimento confiável e pagamento protegido.
                </span>
              </div>
            </div>

          </div>
        </div>
      </section>
    </>
  );
}