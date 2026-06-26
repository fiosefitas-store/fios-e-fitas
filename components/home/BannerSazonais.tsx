'use client';

import Link from 'next/link';
import { ArrowRight } from 'lucide-react';

const categorias = [
  {
    id: 'festas',
    title: 'Festa Junina',
    image: '/images/produtos/laco-junino.png',
    link: '/categoria/lacos',
  },
  {
    id: 'eventos',
    title: 'Eventos Especiais',
    image: '/images/produtos/kit-presente.png',
    link: '/categoria/kits-presente',
  },
  {
    id: 'recem-nascido',
    title: 'Recém-Nascido',
    image: '/images/produtos/kit-bebe-rosa.png',
    link: '/categoria/linha-bebe',
  },
  {
    id: 'festa',
    title: 'Personagens',
    image: '/images/produtos/amiguru-coelho.png',
    link: '/categoria/amigurimi',
  },
];

export default function CategoriasDestaque() {
  return (
    <section className="mt-15 mb-10">

      <div className=" max-w-11/12 mx-auto grid grid-cols-1 md:grid-cols-4 gap-6">
        {categorias.map((cat) => (
          <Link
            key={cat.id}
            href={cat.link}
            className="relative aspect-square group overflow-hidden"
          >
            <img
              src={cat.image}
              alt={cat.title}
              loading="lazy"
              className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
            />

            <div className="absolute inset-0 bg-[#3D261D]/50 group-hover:bg-[#3D261D]/70 transition-colors duration-300" />

            <div className="absolute inset-0 flex flex-col justify-end items-center text-center uppercase tracking-wider p-6">
              <h3 className="font-medium text-3xl text-white mb-4">
                {cat.title}
              </h3>

              <div className="flex items-center gap-2 text-white opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                <span className="font-medium text-sm uppercase tracking-wider">
                  Ver Produtos
                </span>

                <ArrowRight size={16} />
              </div>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}