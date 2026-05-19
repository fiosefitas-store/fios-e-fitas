'use client';

import Link from 'next/link';
import { Heart } from 'lucide-react';
import { useState, useEffect } from 'react';

interface ProductCardProps {
  produto: {
    id: string;
    nome: string;
    preco: number;
    imagem: string;
    personalizado?: boolean;
    categoria: string;
  };
}

export default function ProductCard({ produto }: ProductCardProps) {
  const [isFavorite, setIsFavorite] = useState(false);

  useEffect(() => {
    const favorites = JSON.parse(localStorage.getItem('fiosefitas_favorites') || '[]');
    setIsFavorite(favorites.includes(produto.id));
  }, [produto.id]);

  const toggleFavorite = (e: React.MouseEvent) => {
    e.preventDefault();
    const favorites = JSON.parse(localStorage.getItem('fiosefitas_favorites') || '[]');
    let newFavorites;
    if (favorites.includes(produto.id)) {
      newFavorites = favorites.filter((id: string) => id !== produto.id);
    } else {
      newFavorites = [...favorites, produto.id];
    }
    localStorage.setItem('fiosefitas_favorites', JSON.stringify(newFavorites));
    setIsFavorite(!isFavorite);
  };

  return (
    <Link href={`/produto/${produto.id}`} className="group block bg-white rounded-2xl shadow-[var(--shadow-card)] hover:shadow-[var(--shadow-card-hover)] transition-all duration-300 hover:-translate-y-1 overflow-hidden">
      <div className="relative aspect-square overflow-hidden bg-[#F9F3EF]">
        <img 
          src={produto.imagem} 
          alt={produto.nome} 
          loading="lazy" 
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
        />
        {produto.personalizado && (
          <span className="absolute top-3 left-3 bg-[#F4845F] text-white text-[10px] font-bold px-2 py-1 rounded-full uppercase tracking-wider shadow-sm z-10">
            Personalizado
          </span>
        )}
        <button 
          onClick={toggleFavorite}
          className="absolute top-3 right-3 w-8 h-8 bg-white/80 backdrop-blur-sm rounded-full flex items-center justify-center text-[#F4845F] hover:bg-white transition-colors z-10"
        >
          <Heart size={16} className={isFavorite ? "fill-[#F4845F]" : ""} />
        </button>
      </div>
      <div className="p-5 flex flex-col gap-2">
        <span className="text-xs font-medium text-[#A67C6D] uppercase tracking-wide">{produto.categoria}</span>
        <h3 className="font-body font-medium text-[#3D261D] leading-tight line-clamp-2">{produto.nome}</h3>
        <p className="font-body font-semibold text-[#F4845F] mt-auto">A partir de R$ {produto.preco.toFixed(2)}</p>
        <div className="mt-4 pt-4 border-t border-gray-100 flex items-center justify-center text-[#F4845F] border border-[#F4845F] rounded-full py-2 hover:bg-[#F4845F] hover:text-white transition-colors text-sm font-medium">
          Ver Detalhes
        </div>
      </div>
    </Link>
  );
}
