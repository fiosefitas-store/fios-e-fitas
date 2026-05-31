'use client';

import { useMemo } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import ProductCard from '@/components/produto/ProductCard';
import produtosData from '@/data/produtos.json';
import { CATEGORIES } from '@/data/categories';

const SLUG_TO_CATEGORIA: Record<string, string> = CATEGORIES.reduce((acc, c) => {
  acc[c.slug] = c.label;
  return acc;
}, {} as Record<string, string>);

export default function SubcategoriaPage() {
  const params = useParams();
  const slug = params?.slug as string;
  const sub = params?.sub as string;
  const categoria = SLUG_TO_CATEGORIA[slug] || slug;
  const subLabel = sub ? sub.replace(/-/g, ' ') : sub;

  const produtos = useMemo(() => {
    const filtered = produtosData.filter((p) => p.ativo && p.categoria === categoria);
    const bySub = filtered.filter((p) => {
      if ((p as any).subcategoria) {
        return (p as any).subcategoria.toLowerCase() === subLabel.toLowerCase();
      }
      return p.nome.toLowerCase().includes(subLabel.toLowerCase());
    });
    return bySub;
  }, [categoria, subLabel]);

  return (
    <div className="min-h-screen pt-[104px]">
      <div className="bg-linear-to-br from-[#FDF6F0] to-[#F9EDE5] py-12 px-4">
        <div className="max-w-6xl mx-auto">
          <nav className="flex items-center gap-2 text-sm text-[#A67C6D] mb-4">
            <Link href="/" className="hover:text-[#F4845F] transition-colors">Home</Link>
            <span className="mx-2">/</span>
            <Link href={`/categoria/${slug}`} className="hover:text-[#F4845F] transition-colors">{categoria}</Link>
            <span className="mx-2">/</span>
            <span className="text-[#3D261D] font-medium">{subLabel}</span>
          </nav>
          <h1 className="text-4xl font-bold text-[#3D261D] mb-2" style={{ fontFamily: 'var(--font-display)' }}>{subLabel}</h1>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 py-10">
        {produtos.length === 0 ? (
          <div className="text-center py-20">
            <div className="text-6xl mb-4">🎀</div>
            <h3 className="text-2xl font-bold text-[#3D261D] mb-2">Nenhum produto encontrado</h3>
            <p className="text-[#A67C6D] mb-6">Ainda não temos produtos nessa subcategoria.</p>
            <Link href={`/categoria/${slug}`} className="inline-flex items-center px-6 py-3 rounded-full bg-[#F4845F] text-white font-semibold hover:bg-[#D95F35] transition-colors">Ver todos em {categoria}</Link>
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
