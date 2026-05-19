'use client';

import { useState, useMemo } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { ChevronRight, SlidersHorizontal } from 'lucide-react';
import ProductCard from '@/components/produto/ProductCard';
import produtosData from '@/data/produtos.json';

const SLUG_TO_CATEGORIA: Record<string, string> = {
  'lacos': 'Laços',
  'bolsas': 'Bolsas',
  'linha-bebe': 'Linha Bebê',
  'amigurumi': 'Amigurumi',
  'kits-presente': 'Kits Presente',
};

const SORT_OPTIONS = [
  { value: 'recentes', label: 'Mais Recentes' },
  { value: 'preco-asc', label: 'Preço: Menor → Maior' },
  { value: 'preco-desc', label: 'Preço: Maior → Menor' },
  { value: 'popularidade', label: 'Popularidade' },
];

export default function CategoriaPage() {
  const params = useParams();
  const slug = params?.slug as string;
  const categoria = SLUG_TO_CATEGORIA[slug] || slug;

  const [sortBy, setSortBy] = useState('recentes');

  const produtos = useMemo(() => {
    const filtered = produtosData.filter(
      (p) => p.ativo && p.categoria === categoria
    );
    switch (sortBy) {
      case 'preco-asc':
        return [...filtered].sort((a, b) => a.preco - b.preco);
      case 'preco-desc':
        return [...filtered].sort((a, b) => b.preco - a.preco);
      case 'popularidade':
        return [...filtered].sort((a, b) => b.vendas - a.vendas);
      default:
        return filtered;
    }
  }, [categoria, sortBy]);

  return (
    <div className="min-h-screen pt-[104px]">
      {/* Hero Header */}
      <div className="bg-gradient-to-br from-[#FDF6F0] to-[#F9EDE5] py-12 px-4">
        <div className="max-w-6xl mx-auto">
          <nav className="flex items-center gap-2 text-sm text-[#A67C6D] mb-4">
            <Link href="/" className="hover:text-[#F4845F] transition-colors">Home</Link>
            <ChevronRight size={14} />
            <span className="text-[#3D261D] font-medium">{categoria}</span>
          </nav>
          <h1
            className="text-4xl font-bold text-[#3D261D] mb-2"
            style={{ fontFamily: 'var(--font-display)' }}
          >
            {categoria}
          </h1>
          <p className="text-[#7D5547]">
            {produtos.length} produto{produtos.length !== 1 ? 's' : ''} encontrado{produtos.length !== 1 ? 's' : ''}
          </p>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-6xl mx-auto px-4 py-10">
        {/* Filters Bar */}
        <div className="flex items-center justify-between mb-8 flex-wrap gap-4">
          <div className="flex items-center gap-2 text-[#5C3D31]">
            <SlidersHorizontal size={16} className="text-[#F4845F]" />
            <span className="text-sm font-medium">Ordenar por</span>
          </div>
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="px-4 py-2 border border-[#E4D0C5] rounded-full text-sm text-[#5C3D31] bg-white focus:outline-none focus:border-[#F4845F] focus:shadow-[0_0_0_3px_rgba(244,132,95,0.15)] cursor-pointer"
          >
            {SORT_OPTIONS.map((opt) => (
              <option key={opt.value} value={opt.value}>{opt.label}</option>
            ))}
          </select>
        </div>

        {/* Grid */}
        {produtos.length === 0 ? (
          <div className="text-center py-20">
            <div className="text-6xl mb-4">🎀</div>
            <h3
              className="text-2xl font-bold text-[#3D261D] mb-2"
              style={{ fontFamily: 'var(--font-display)' }}
            >
              Nenhum produto encontrado
            </h3>
            <p className="text-[#A67C6D] mb-6">
              Ainda não temos produtos nesta categoria. Volte em breve!
            </p>
            <Link
              href="/"
              className="inline-flex items-center px-6 py-3 rounded-full bg-[#F4845F] text-white font-semibold hover:bg-[#D95F35] transition-colors"
            >
              Ver todos os produtos
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {produtos.map((produto) => (
              <ProductCard key={produto.id} produto={produto} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
