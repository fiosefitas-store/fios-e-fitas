'use client';

import Link from 'next/link';

interface ProductCardProps {
  produto: {
    id: string;
    nome: string;
    preco: number;
    imagem: string;
    personalizado?: boolean;
    categoria: string;
    subcategoria?: string;
  };
}

export default function ProductCard({ produto }: ProductCardProps) {

  return (
    <Link href={`/produto/${produto.id}`} className="group block bg-white rounded-2xl shadow(--shadow-card) hover:shadow(--shadow-card-hover) transition-all duration-300 hover:-translate-y-1 overflow-hidden">
      <div className="relative aspect-square overflow-hidden bg-section">
        <img 
          src={produto.imagem} 
          alt={produto.nome} 
          loading="lazy" 
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
        />
        {produto.personalizado && (
          <span className="absolute top-3 left-3 bg-primary text-white text-[10px] font-bold px-2 py-1 rounded-xl uppercase tracking-wider shadow-sm z-10">
            Personalizado
          </span>
        )}
      </div>
      <div className="p-5 flex flex-col gap-2">
        <span className="text-xs font-medium text-[#A67C6D] uppercase tracking-wide">{produto.categoria}</span>
        <h3 className="font-body font-medium text-[#3D261D] leading-tight line-clamp-1">{produto.nome}</h3>
        <p className="font-body font-semibold text-primary mt-auto">R$ {produto.preco.toFixed(2)}</p>
        <div className="mt-4 pt-3 md:pt-4">
          <div className="flex items-center justify-center text-[#ffffff] border border-primary bg-primary rounded-xl py-2 hover:bg-[#a25e47] hover:text-white transition-colors text-sm font-medium">
            Comprar
          </div>
        </div>
      </div>
    </Link>
  );
}
