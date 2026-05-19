'use client';

import Link from 'next/link';
import { ArrowRight } from 'lucide-react';

const categorias = [
  { id: 'festas', title: 'Festa Junina', image: '/images/produtos/laco-junino.png', link: '/categoria/lacos' },
  { id: 'eventos', title: 'Eventos Especiais', image: '/images/produtos/kit-presente.png', link: '/categoria/kits-presente' },
  { id: 'recem-nascido', title: 'Recém-Nascido', image: '/images/produtos/kit-bebe-rosa.png', link: '/categoria/linha-bebe' },
];

export default function CategoriasDestaque() {
  return (
    <section className="py-20 px-4 md:px-8 max-w-7xl mx-auto">
      <div className="flex justify-between items-end mb-12">
        <div>
          <h2 className="font-display text-4xl text-[#3D261D] mb-4">Coleções Especiais</h2>
          <p className="text-[#A67C6D] text-lg">Descubra nossas peças selecionadas para cada momento.</p>
        </div>
      </div>
      
      <div className="flex gap-6 overflow-x-auto pb-8 snap-x snap-mandatory hide-scrollbar">
        {categorias.map(cat => (
          <Link 
            key={cat.id} 
            href={cat.link}
            className="group relative flex-none w-[280px] md:w-[calc(33.333%-16px)] aspect-[4/3] rounded-2xl overflow-hidden snap-start"
          >
            <img 
              src={cat.image} 
              alt={cat.title} 
              loading="lazy" 
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#3D261D]/80 via-[#3D261D]/20 to-transparent"></div>
            <div className="absolute inset-0 p-6 flex flex-col justify-end">
              <h3 className="font-display text-2xl text-white mb-2">{cat.title}</h3>
              <div className="flex items-center gap-2 text-white opacity-0 group-hover:opacity-100 transform translate-y-4 group-hover:translate-y-0 transition-all duration-300">
                <span className="font-medium text-sm uppercase tracking-wider">Ver Produtos</span>
                <ArrowRight size={16} />
              </div>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}
