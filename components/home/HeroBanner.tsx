'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { cn } from '@/lib/utils';

const slides = [
  {
    badge: 'Feito com Amor',
    title: 'Laços Artesanais para Momentos Especiais',
    subtitle: 'Confeccionados à mão com materiais premium.',
    image: '/images/produtos/laco-cetim-rosa.png',
    link: '/categoria/lacos'
  },
  {
    badge: 'Novidade',
    title: 'Bolsas de Crochê Feitas à Mão',
    subtitle: 'Charme e elegância em cada ponto.',
    image: '/images/produtos/bolsa-croche-natural.png',
    link: '/categoria/bolsas'
  },
  {
    badge: 'Presente Ideal',
    title: 'Kits Personalizados para Bebês',
    subtitle: 'O presente perfeito para celebrar a vida.',
    image: '/images/produtos/kit-bebe-rosa.png',
    link: '/categoria/kits-presente'
  }
];

export default function HeroBanner() {
  const [currentSlide, setCurrentSlide] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="relative h-[70vh] md:h-[85vh] mt-26 overflow-hidden bg-[#FDF0E9] ">
      {slides.map((slide, index) => (
        <div
          key={index}
          className={cn(
            "absolute inset-0 flex flex-col-reverse md:flex-row items-center justify-between px-4 md:px-16 transition-opacity duration-1000",
            index === currentSlide ? "opacity-100 z-10" : "opacity-0 z-0 pointer-events-none"
          )}
        >
          <div className="md:w-1/2 flex flex-col items-start gap-4 pb-12 md:pb-0 z-20">
            <span className="bg-[#FAC9A8] text-[#D95F35] text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider">
              {slide.badge}
            </span>
            <h1 className="font-display text-4xl md:text-6xl text-[#3D261D] leading-tight">
              {slide.title}
            </h1>
            <p className="text-[#5C3D31] text-lg mb-4">
              {slide.subtitle}
            </p>
            <div className="flex flex-wrap gap-4">
              <Link href={slide.link} className="bg-primary text-white px-8 py-3 rounded-full font-medium hover:bg-[#D95F35] transition-colors shadow-lg hover:shadow-xl">
                Ver Coleção
              </Link>
              <a href="https://wa.me/5583998660454" target="_blank" rel="noopener noreferrer" className="border-2 border-primary text-primary px-8 py-3 rounded-full font-medium hover:bg-primary hover:text-white transition-colors">
                Fale Conosco
              </a>
            </div>
          </div>
          <div className="md:w-1/2 h-[40vh] md:h-full relative flex items-center justify-center p-8">
            <div className="absolute w-[80%] h-[80%] bg-[#F7C5D0]/30 rounded-full blur-3xl z-0"></div>
            <img src={slide.image} alt={slide.title} loading="lazy" className="relative z-10 max-h-full object-contain drop-shadow-2xl animate-in fade-in zoom-in duration-700" />
          </div>
        </div>
      ))}
      
      {/* Navigation Dots */}
      <div className="absolute bottom-6 left-1/2 transform -translate-x-1/2 flex gap-2 z-30">
        {slides.map((_, index) => (
          <button
            key={index}
            className={cn(
              "w-2.5 h-2.5 rounded-full transition-all duration-300",
              index === currentSlide ? "bg-primary w-8" : "bg-primary/30 hover:bg-primary/50"
            )}
            onClick={() => setCurrentSlide(index)}
            aria-label={`Go to slide ${index + 1}`}
          />
        ))}
      </div>
    </div>
  );
}
