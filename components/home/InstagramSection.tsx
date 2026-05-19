'use client';

import { Instagram } from 'lucide-react';

const images = [
  '/images/produtos/laco-cetim-rosa.png',
  '/images/produtos/bolsa-croche-natural.png',
  '/images/produtos/kit-bebe-rosa.png',
  '/images/produtos/amiguru-urso.png',
];

export default function InstagramSection() {
  return (
    <section className="py-20">
      <div className="text-center mb-12 px-4">
        <h2 className="font-display text-3xl md:text-4xl text-[#3D261D] mb-4">
          Nos acompanhe no Instagram
        </h2>
        <a 
          href="https://instagram.com/fiosefitas.artesanato" 
          target="_blank" 
          rel="noopener noreferrer"
          className="text-[#F4845F] font-medium hover:text-[#D95F35] transition-colors flex items-center justify-center gap-2"
        >
          @fiosefitas.artesanato
        </a>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-0">
        {images.map((src, idx) => (
          <a 
            key={idx}
            href="https://instagram.com/fiosefitas.artesanato"
            target="_blank"
            rel="noopener noreferrer"
            className="relative aspect-square group overflow-hidden bg-[#F9F3EF]"
          >
            <img 
              src={src} 
              alt={`Instagram photo ${idx + 1}`} 
              loading="lazy" 
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-[#F4845F]/80 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
              <Instagram size={48} className="text-white" />
            </div>
          </a>
        ))}
      </div>
    </section>
  );
}
